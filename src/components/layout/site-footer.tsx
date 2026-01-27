import Link from "next/link"

export function SiteFooter() {
  const companyEmail =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "imperiodabelezavariedades@gmail.com"

  return (
    <footer
      id="contato"
      className="border-t border-white/70 bg-white/80 px-6 py-12 text-sm text-[color:var(--brand-ink)]/80 shadow-[0_-20px_60px_rgba(20,20,35,0.08)]"
    >
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">
            Império da Beleza
          </p>
          <p className="text-lg font-semibold text-[color:var(--brand-ink)]">
            Seu catálogo de beleza favorito
          </p>
          <p>
            Atendimento personalizado via WhatsApp e acompanhamento do seu
            pedido do início ao fim.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-[color:var(--brand-ink)]">
            Contato
          </p>
          <p>E-mail: {companyEmail}</p>
          <p>Atendimento: seg a sáb, 9h às 18h</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-[color:var(--brand-ink)]">
            Navegação
          </p>
          <div className="flex flex-col gap-2">
            <Link href="#produtos" className="hover:text-[color:var(--brand-ink)]">
              Produtos
            </Link>
            <Link href="/cart" className="hover:text-[color:var(--brand-ink)]">
              Carrinho
            </Link>
            <Link href="#sobre" className="hover:text-[color:var(--brand-ink)]">
              Sobre
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
