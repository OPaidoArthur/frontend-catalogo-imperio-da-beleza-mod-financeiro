import type { Metadata } from "next"
import Link from "next/link"

import { CatalogClient } from "@/components/catalog/catalog-client"
import { getCatalogItems } from "@/lib/api"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Seção de 10 | Império da Beleza",
  description: "Catálogo exclusivo com itens de até R$ 10.",
}

export default async function SecaoDe10Page() {
  const items = await getCatalogItems()
  const affordableItems = items.filter(
    (item) => item.price !== null && item.price <= 10
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12">
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 px-6 py-10 shadow-[0_24px_60px_rgba(20,20,35,0.12)] md:px-10 md:py-12">
        <div className="absolute -right-16 -top-10 h-48 w-48 rounded-full bg-[color:var(--brand-rose-soft)] blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">
              Seção de 10
            </p>
            <h1 className="text-3xl font-semibold md:text-4xl">
              Produtos por até R$ 10
            </h1>
            <p className="max-w-2xl text-sm text-[color:var(--brand-ink)]/70 md:text-base">
              Esta página é um catálogo separado do principal, focado em itens
              econômicos para facilitar sua compra.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/80 bg-white/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)] shadow-[0_12px_24px_rgba(20,20,35,0.08)] transition hover:-translate-y-0.5"
            >
              Catálogo principal
            </Link>
            <Link
              href="/cart"
              className="rounded-full bg-[color:var(--brand-ink)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_rgba(20,20,35,0.2)] transition hover:-translate-y-0.5"
            >
              Carrinho
            </Link>
          </div>
        </div>
      </section>

      <CatalogClient
        items={affordableItems}
        sectionId="secao-de-10-produtos"
        sectionLabel="Seção de 10"
        title="Itens de até R$ 10"
        description="Catálogo separado com produtos econômicos para compra rápida."
        emptyMessage="No momento não há itens de até R$ 10 disponíveis."
      />
    </div>
  )
}
