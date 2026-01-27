import Link from "next/link"

import { CatalogClient } from "@/components/catalog/catalog-client"
import { getCatalogItems } from "@/lib/api"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const items = await getCatalogItems()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16">
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/70 px-6 py-12 shadow-[0_30px_80px_rgba(20,20,35,0.18)] md:px-12 md:py-16">
        <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-[color:var(--brand-rose-soft)] blur-3xl" />
        <div className="absolute right-10 top-16 h-32 w-32 rounded-full bg-[color:var(--brand-mint)]/50 blur-2xl" />
        <div className="absolute bottom-8 right-16 h-40 w-40 rounded-[40px] border border-white/60 bg-white/60 shadow-[0_20px_50px_rgba(20,20,35,0.12)] animate-float-slow" />

        <div className="relative grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">
              Império da Beleza
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Sua vitrine digital de beleza, pronta para comprar via WhatsApp
            </h1>
            <p className="text-base text-[color:var(--brand-ink)]/70 md:text-lg">
              Produtos selecionados com carinho. Escolha, monte seu carrinho e
              finalize com atendimento humano e rápido.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#produtos"
                className="rounded-full bg-[color:var(--brand-ink)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_16px_30px_rgba(20,20,35,0.25)] transition hover:-translate-y-0.5"
              >
                Ver catálogo
              </Link>
              <Link
                href="/cart"
                className="rounded-full border border-white/80 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)] shadow-[0_12px_24px_rgba(20,20,35,0.1)] transition hover:-translate-y-0.5"
              >
                Carrinho
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 animate-fade-up-delayed">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_20px_40px_rgba(20,20,35,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-ink)]/60">
                Diferenciais
              </p>
              <ul className="mt-4 space-y-3 text-sm text-[color:var(--brand-ink)]/70">
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--brand-rose)]" />
                  Atendimento rápido via WhatsApp.
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--brand-rose)]" />
                  Catálogo sempre atualizado.
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--brand-rose)]" />
                  Confirmação por e-mail após finalizar.
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/70 bg-[color:var(--brand-sand)]/70 p-5 shadow-[0_20px_40px_rgba(20,20,35,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-ink)]/60">
                Destaque
              </p>
              <p className="mt-3 text-sm text-[color:var(--brand-ink)]/70">
                Selecione seus itens favoritos e compartilhe o pedido em um
                clique. Simples, rápido e elegante.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CatalogClient items={items} />

      <section
        id="sobre"
        className="grid gap-8 rounded-[32px] border border-white/70 bg-white/70 px-6 py-12 shadow-[0_30px_70px_rgba(20,20,35,0.12)] md:grid-cols-[1fr_1fr] md:px-12"
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">
            Sobre
          </p>
          <h2 className="text-3xl font-semibold">Beleza e cuidado em um só lugar</h2>
          <p className="text-sm text-[color:var(--brand-ink)]/70">
            Trabalhamos com itens selecionados para elevar sua rotina de beleza.
            Do básico ao sofisticado, tudo com atendimento próximo e confiável.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "Curadoria de produtos nacionais e importados.",
            "Atendimento individualizado e rápido.",
            "Pedidos finalizados via WhatsApp.",
            "Confirmação por e-mail para cliente e equipe.",
          ].map((text) => (
            <div
              key={text}
              className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-[color:var(--brand-ink)]/70 shadow-[0_16px_36px_rgba(20,20,35,0.08)]"
            >
              {text}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/70 bg-[color:var(--brand-rose)]/90 px-6 py-12 text-white shadow-[0_30px_70px_rgba(240,90,160,0.35)] md:px-12">
        <div className="grid gap-6 md:grid-cols-[1fr_0.5fr] md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">
              Precisa de ajuda para escolher?
            </h2>
            <p className="text-sm text-white/80">
              Fale com a equipe e receba recomendações personalizadas para o seu
              estilo.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)] shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5"
          >
            Montar pedido
          </Link>
        </div>
      </section>
    </div>
  )
}
