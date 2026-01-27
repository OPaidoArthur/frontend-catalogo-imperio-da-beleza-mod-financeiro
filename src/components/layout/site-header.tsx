"use client"

import Link from "next/link"

import { useCart } from "@/components/cart/cart-context"

function buildWhatsappLink(number: string, text: string) {
  const clean = number.replace(/\D/g, "")
  if (!clean) {
    return "#"
  }
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`
}

export function SiteHeader() {
  const { count } = useCart()
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""
  const whatsappLink = buildWhatsappLink(
    whatsappNumber,
    "Olá! Gostaria de ajuda com o catálogo."
  )

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 px-6 py-4 shadow-[0_10px_30px_rgba(18,22,31,0.08)] backdrop-blur lg:px-12">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-[0_10px_30px_rgba(10,10,20,0.12)] ring-1 ring-white/70">
            <img
              src="/imperio_beleza_fundo_transparente.png"
              alt="Império da Beleza"
              className="size-10 object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/70">
              Catálogo
            </p>
            <p className="text-lg font-semibold leading-tight">
              Império da Beleza
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-[color:var(--brand-ink)]/80 md:flex">
          <a href="#produtos" className="transition hover:text-[color:var(--brand-ink)]">
            Produtos
          </a>
          <a href="#sobre" className="transition hover:text-[color:var(--brand-ink)]">
            Sobre
          </a>
          <a href="#contato" className="transition hover:text-[color:var(--brand-ink)]">
            Contato
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="group flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold shadow-[0_8px_20px_rgba(20,20,30,0.08)] transition hover:-translate-y-0.5"
          >
            <span>Carrinho</span>
            <span className="rounded-full bg-[color:var(--brand-rose)] px-2 py-0.5 text-xs text-white">
              {count}
            </span>
          </Link>
          {whatsappNumber ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-[color:var(--brand-ink)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,20,35,0.18)] transition hover:-translate-y-0.5 md:inline-flex"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </header>
  )
}
