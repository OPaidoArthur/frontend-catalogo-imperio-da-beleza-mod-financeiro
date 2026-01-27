"use client"

import * as React from "react"
import Link from "next/link"

import { useCart } from "@/components/cart/cart-context"
import { formatCurrency } from "@/lib/format"

function buildWhatsAppMessage(params: {
  name: string
  email: string
  phone: string
  note?: string
  orderId?: string | null
  items: ReturnType<typeof useCart>["items"]
  total: number
}) {
  const lines = [
    "Novo pedido pelo catálogo",
    params.orderId ? `Pedido: ${params.orderId}` : null,
    `Cliente: ${params.name}`,
    `E-mail: ${params.email}`,
    `Telefone: ${params.phone}`,
    "",
    "Itens:",
    ...params.items.map((item) => {
      const price =
        item.price === null ? "Sob consulta" : formatCurrency(item.price)
      return `- ${item.quantity}x ${item.name} (${price})`
    }),
    "",
    `Total: ${formatCurrency(params.total)}`,
  ]
  if (params.note) {
    lines.push("", `Observação: ${params.note}`)
  }
  return lines.filter((line): line is string => line !== null).join("\n")
}

function buildWhatsappLink(number: string, message: string) {
  const clean = number.replace(/\D/g, "")
  if (!clean) {
    return ""
  }
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clear } = useCart()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [note, setNote] = React.useState("")
  const [orderSummary, setOrderSummary] = React.useState<{
    orderId: string | null
    items: ReturnType<typeof useCart>["items"]
    total: number
    customer: { name: string; email: string; phone: string }
    note?: string | null
  } | null>(null)
  const [status, setStatus] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""
  const hasWhatsApp = Boolean(whatsappNumber)

  const handleCheckout = async () => {
    setStatus(null)
    if (!items.length) {
      setStatus("Seu carrinho está vazio.")
      return
    }
    if (!name || !email || !phone) {
      setStatus("Preencha nome, e-mail e telefone.")
      return
    }
    setLoading(true)

    const snapshotItems = items.map((item) => ({ ...item }))
    const payload = {
      customer: { name, email, phone },
      note: note || null,
      items: snapshotItems.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
    }

    let orderId: string | null = null
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const detail = await response.text()
        setStatus(detail || "Não foi possível registrar o pedido.")
        setLoading(false)
        return
      }
      const data = (await response.json()) as {
        order_id?: string | null
        email_sent?: boolean
      }
      orderId = data.order_id ?? null
      if (data.email_sent === false) {
        setStatus(
          "Pedido registrado, mas não foi possível enviar o e-mail."
        )
      }
    } catch {
      setStatus("Não foi possível registrar o pedido.")
      setLoading(false)
      return
    }

    setOrderSummary({
      orderId,
      items: snapshotItems,
      total,
      customer: { name, email, phone },
      note: note || null,
    })
    clear()

    const message = buildWhatsAppMessage({
      name,
      email,
      phone,
      note,
      orderId,
      items: snapshotItems,
      total,
    })

    const link = buildWhatsappLink(whatsappNumber, message)
    if (!link) {
      setStatus("Número de WhatsApp não configurado.")
      setLoading(false)
      return
    }
    window.open(link, "_blank", "noopener,noreferrer")
    setLoading(false)
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">
          Carrinho
        </p>
        <h1 className="text-3xl font-semibold">Finalize seu pedido</h1>
        <p className="text-sm text-[color:var(--brand-ink)]/70">
          Revise os itens, preencha seus dados e envie para o WhatsApp.
        </p>
      </header>

      {orderSummary ? (
        <div className="space-y-6 rounded-3xl border border-white/70 bg-white/80 p-8 shadow-[0_20px_40px_rgba(20,20,35,0.08)]">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">
              Pedido registrado
            </p>
            <h2 className="text-2xl font-semibold">
              Resumo da sua compra
            </h2>
            <p className="text-sm text-[color:var(--brand-ink)]/70">
              {orderSummary.orderId
                ? `Pedido ${orderSummary.orderId}`
                : "Pedido criado com sucesso."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-sm text-[color:var(--brand-ink)]/70">
              <p className="font-semibold text-[color:var(--brand-ink)]">
                Cliente
              </p>
              <p>{orderSummary.customer.name}</p>
              <p>{orderSummary.customer.email}</p>
              <p>{orderSummary.customer.phone}</p>
            </div>
            <div className="space-y-2 text-sm text-[color:var(--brand-ink)]/70">
              <p className="font-semibold text-[color:var(--brand-ink)]">
                Observação
              </p>
              <p>{orderSummary.note || "Sem observações."}</p>
            </div>
          </div>

          <div className="space-y-3">
            {orderSummary.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-[color:var(--brand-ink)]/60">
                    {item.sku ?? "SKU: -"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {item.quantity}x
                  </p>
                  <p className="text-xs text-[color:var(--brand-ink)]/60">
                    {item.price === null
                      ? "Sob consulta"
                      : formatCurrency(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">
              {formatCurrency(orderSummary.total)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const message = buildWhatsAppMessage({
                  name: orderSummary.customer.name,
                  email: orderSummary.customer.email,
                  phone: orderSummary.customer.phone,
                  note: orderSummary.note ?? undefined,
                  orderId: orderSummary.orderId,
                  items: orderSummary.items,
                  total: orderSummary.total,
                })
                const link = buildWhatsappLink(whatsappNumber, message)
                if (link) {
                  window.open(link, "_blank", "noopener,noreferrer")
                }
              }}
              disabled={!hasWhatsApp}
              className="rounded-full bg-[color:var(--brand-ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Enviar pelo WhatsApp
            </button>
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)]/60 transition hover:text-[color:var(--brand-ink)]"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      ) : !items.length ? (
        <div className="rounded-3xl border border-white/70 bg-white/80 p-10 text-center text-sm text-[color:var(--brand-ink)]/70 shadow-[0_20px_40px_rgba(20,20,35,0.08)]">
          Seu carrinho está vazio.{" "}
          <Link href="/" className="font-semibold text-[color:var(--brand-ink)]">
            Voltar para o catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_16px_36px_rgba(20,20,35,0.08)] md:flex-row md:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--brand-cream)]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-[color:var(--brand-ink)]/50">
                        Sem imagem
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-semibold">{item.name}</p>
                    <p className="text-xs text-[color:var(--brand-ink)]/60">
                      {item.price === null
                        ? "Sob consulta"
                        : formatCurrency(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-sm"
                    >
                      -
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)]/60 transition hover:text-[color:var(--brand-ink)]"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={clear}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)]/60 transition hover:text-[color:var(--brand-ink)]"
            >
              Limpar carrinho
            </button>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_16px_36px_rgba(20,20,35,0.08)]">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">
                Dados do cliente
              </p>
              <p className="text-sm text-[color:var(--brand-ink)]/70">
                Usaremos para confirmar seu pedido.
              </p>
            </div>

            <div className="space-y-4">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nome completo"
                className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-rose)]"
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="E-mail"
                type="email"
                className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-rose)]"
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="WhatsApp"
                className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-rose)]"
              />
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Observação (opcional)"
                className="min-h-[96px] w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-rose)]"
              />
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm">
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {status ? (
              <p className="text-xs text-[color:var(--brand-ink)]/70">
                {status}
              </p>
            ) : null}

            <button
              onClick={handleCheckout}
              disabled={!hasWhatsApp || loading}
              className="w-full rounded-full bg-[color:var(--brand-ink)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Enviando..." : "Finalizar no WhatsApp"}
            </button>
            {!hasWhatsApp ? (
              <p className="text-xs text-[color:var(--brand-ink)]/60">
                Configure NEXT_PUBLIC_WHATSAPP_NUMBER para habilitar.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
