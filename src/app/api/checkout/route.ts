
type CheckoutPayload = {
  customer: {
    name: string
    email: string
    phone: string
  }
  note?: string | null
  items: Array<{
    id: string
    name: string
    sku?: string | null
    variantId?: string | null
    quantity: number
    price: number | null
  }>
  total: number
}

function buildText(payload: CheckoutPayload, orderId?: string) {
  const lines = [
    "Novo pedido pelo catálogo",
    orderId ? `Pedido: ${orderId}` : null,
    `Cliente: ${payload.customer.name}`,
    `E-mail: ${payload.customer.email}`,
    `Telefone: ${payload.customer.phone}`,
    "",
    "Itens:",
    ...payload.items.map((item) => {
      const price =
        typeof item.price === "number"
          ? `R$ ${item.price.toFixed(2)}`
          : "Sob consulta"
      const sku = item.sku ? `SKU: ${item.sku}` : "SKU: -"
      return `- ${item.quantity}x ${item.name} (${price}) ${sku}`
    }),
    "",
    `Total: ${
      typeof payload.total === "number"
        ? `R$ ${payload.total.toFixed(2)}`
        : "Sob consulta"
    }`,
  ]
  if (payload.note) {
    lines.push("", `Observação: ${payload.note}`)
  }
  return lines.filter((line): line is string => line !== null).join("\n")
}

async function readResponseDetail(response: Response) {
  const contentType = response.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as { detail?: unknown }
      if (payload?.detail) {
        return typeof payload.detail === "string"
          ? payload.detail
          : JSON.stringify(payload.detail)
      }
      return JSON.stringify(payload)
    } catch {
      return ""
    }
  }
  try {
    return await response.text()
  } catch {
    return ""
  }
}

async function sendResendEmail(params: {
  apiKey: string
  from: string
  to: string | string[]
  subject: string
  text: string
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      subject: params.subject,
      text: params.text,
    }),
  })

  if (!response.ok) {
    const detail = await readResponseDetail(response)
    throw new Error(detail || `Resend error: ${response.status}`)
  }
}

export async function POST(request: Request) {
  let payload: CheckoutPayload
  try {
    payload = (await request.json()) as CheckoutPayload
  } catch {
    return new Response("Invalid payload", { status: 400 })
  }

  if (
    !payload?.customer?.name ||
    !payload?.customer?.email ||
    !payload?.customer?.phone ||
    !payload?.items?.length
  ) {
    return new Response("Invalid payload", { status: 400 })
  }

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://127.0.0.1:8000"
  const catalogKey = process.env.CATALOG_API_KEY
  if (!catalogKey) {
    return new Response("Catalog key not configured", { status: 500 })
  }

  const orderPayload = {
    order_number: null,
    total_amount: payload.total,
    currency: "BRL",
    customer_name: payload.customer.name,
    customer_email: payload.customer.email,
    customer_phone: payload.customer.phone,
    note: payload.note ?? null,
    items: payload.items.map((item) => ({
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.price,
      name: item.name,
      sku: item.sku,
    })),
  }

  if (orderPayload.items.some((item) => !item.variant_id)) {
    return new Response("Invalid items", { status: 400 })
  }

  let orderResponse: Response
  try {
    orderResponse = await fetch(`${apiBase}/catalog/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Catalog-Key": catalogKey,
      },
      body: JSON.stringify(orderPayload),
    })
  } catch (error) {
    console.error("Catalog order request failed", error)
    return new Response("Order service unavailable", { status: 502 })
  }

  if (!orderResponse.ok) {
    const detail = await readResponseDetail(orderResponse)
    return new Response(detail || "Order not created", {
      status: orderResponse.status,
    })
  }

  const orderData = (await orderResponse.json()) as { id?: string }

  const from =
    process.env.SMTP_FROM || process.env.COMPANY_EMAIL || "no-reply@imperio.com"
  const companyEmail =
    process.env.COMPANY_EMAIL || "imperiodabelezavariedades@gmail.com"
  const resendApiKey = process.env.RESEND_API_KEY

  let emailSent = false
  if (!resendApiKey) {
    console.error("Resend API key not configured")
  } else {
    try {
      const text = buildText(payload, orderData.id)
      await sendResendEmail({
        apiKey: resendApiKey,
        from,
        to: companyEmail,
        subject: "Novo pedido - Catálogo Império da Beleza",
        text,
      })
      await sendResendEmail({
        apiKey: resendApiKey,
        from,
        to: payload.customer.email,
        subject: "Confirmação do seu pedido",
        text:
          "Recebemos seu pedido. Em breve entraremos em contato.\n\n" + text,
      })
      emailSent = true
    } catch (error) {
      console.error("Resend send failed", error)
    }
  }

  return Response.json({
    order_id: orderData.id ?? null,
    email_sent: emailSent,
  })
}
