"use client"

import * as React from "react"

import { useCart } from "@/components/cart/cart-context"
import type { CatalogItem } from "@/lib/api"
import { formatCurrency } from "@/lib/format"

type CatalogClientProps = {
  items: CatalogItem[]
}

export function CatalogClient({ items }: CatalogClientProps) {
  const { addItem } = useCart()
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState("todos")
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})
  const [selectedItem, setSelectedItem] = React.useState<CatalogItem | null>(null)
  const [modalExpanded, setModalExpanded] = React.useState(false)
  const shouldShowToggle = (description?: string | null) =>
    Boolean(description && description.trim().length > 140)

  const categories = React.useMemo(() => {
    const mapped = items
      .map((item) => item.category?.trim())
      .filter((value): value is string => Boolean(value))
    const unique = Array.from(new Set(mapped))
    return ["todos", ...unique]
  }, [items])

  const filtered = React.useMemo(() => {
    const queryLower = query.toLowerCase()
    return items.filter((item) => {
      const brandMatch = item.brand
        ? item.brand.toLowerCase().includes(queryLower)
        : false
      const matchesQuery =
        item.name.toLowerCase().includes(queryLower) || brandMatch
      const matchesCategory =
        category === "todos" ||
        (item.category ?? "").toLowerCase() === category.toLowerCase()
      return matchesQuery && matchesCategory
    })
  }, [items, query, category])

  return (
    <section id="produtos" className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">
            Catálogo
          </p>
          <h2 className="text-3xl font-semibold md:text-4xl">
            Produtos em destaque
          </h2>
          <p className="mt-2 text-sm text-[color:var(--brand-ink)]/70">
            Seleção atualizada com itens de beleza e cosméticos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou marca"
            className="w-full rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm shadow-[0_10px_20px_rgba(20,20,35,0.06)] outline-none transition focus:ring-2 focus:ring-[color:var(--brand-rose)] md:w-72"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              category === item
                ? "border-[color:var(--brand-rose)] bg-[color:var(--brand-rose)] text-white shadow-[0_8px_16px_rgba(240,90,160,0.35)]"
                : "border-white/70 bg-white/70 text-[color:var(--brand-ink)]/70 hover:border-[color:var(--brand-rose)] hover:text-[color:var(--brand-ink)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/70 bg-white/80 p-10 text-center text-sm text-[color:var(--brand-ink)]/70 shadow-[0_20px_40px_rgba(20,20,35,0.08)]">
          Nenhum produto encontrado. Tente outra busca.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_40px_rgba(20,20,35,0.1)] transition hover:-translate-y-1"
              style={{ animationDelay: `${index * 70}ms` }}
              onClick={(event) => {
                const path = (event.nativeEvent as Event).composedPath?.() ?? []
                const shouldIgnore = path.some(
                  (node) =>
                    node instanceof HTMLElement &&
                    node.dataset.noModal === "true"
                )
                if (shouldIgnore) {
                  return
                }
                setSelectedItem(item)
                setModalExpanded(false)
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--brand-cream)]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-[color:var(--brand-ink)]/50">
                    Sem imagem
                  </div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)]/70">
                  {item.brand ?? "Império"}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 px-5 pb-6 pt-5">
                <div className="space-y-2" data-no-modal="true">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <div className="space-y-2">
                    <p
                      className={`text-sm text-[color:var(--brand-ink)]/70 ${
                        expanded[item.id] ? "" : "line-clamp-3"
                      }`}
                      data-no-modal="true"
                    >
                      {item.description ?? "Detalhes disponíveis no WhatsApp."}
                    </p>
                    {shouldShowToggle(item.description) ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        data-no-modal="true"
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)]/60 transition hover:text-[color:var(--brand-ink)]"
                      >
                        {expanded[item.id] ? "Ver menos" : "Ver mais"}
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-lg font-semibold text-[color:var(--brand-ink)]">
                    {item.price === null
                      ? "Sob consulta"
                      : formatCurrency(item.price)}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        sku: item.sku ?? null,
                        variantId: item.variantId ?? null,
                      })
                    }
                    data-no-modal="true"
                    className="rounded-full bg-[color:var(--brand-ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-[0_30px_80px_rgba(20,20,35,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[color:var(--brand-cream)]">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[color:var(--brand-ink)]/50">
                  Sem imagem
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)] shadow-[0_10px_20px_rgba(20,20,35,0.12)]"
              >
                Fechar
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">
                    {selectedItem.brand ?? "Império"}
                  </p>
                  <h3 className="text-2xl font-semibold">
                    {selectedItem.name}
                  </h3>
                </div>
                <div className="text-lg font-semibold text-[color:var(--brand-ink)]">
                  {selectedItem.price === null
                    ? "Sob consulta"
                    : formatCurrency(selectedItem.price)}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1 text-sm text-[color:var(--brand-ink)]/70">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)]/60">
                    Detalhes
                  </p>
                  <p
                    className={
                      modalExpanded ? "" : "line-clamp-4"
                    }
                  >
                    {selectedItem.description ??
                      "Descrição não informada. Consulte no WhatsApp."}
                  </p>
                  {selectedItem.description ? (
                    <div className="sticky bottom-0 mt-3 flex justify-start bg-white/90 py-2">
                      <button
                        type="button"
                        onClick={() => setModalExpanded((prev) => !prev)}
                        className="rounded-full bg-[color:var(--brand-ink)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_24px_rgba(15,20,35,0.2)] transition hover:-translate-y-0.5"
                      >
                        {modalExpanded ? "Ver menos" : "Ver mais detalhes"}
                      </button>
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2 text-sm text-[color:var(--brand-ink)]/70">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)]/60">
                    Informações
                  </p>
                  <p>SKU: {selectedItem.sku ?? "-"}</p>
                  <p>Categoria: {selectedItem.category ?? "Sem categoria"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: selectedItem.id,
                      name: selectedItem.name,
                      price: selectedItem.price,
                      image: selectedItem.image,
                      sku: selectedItem.sku ?? null,
                      variantId: selectedItem.variantId ?? null,
                    })
                  }
                  className="rounded-full bg-[color:var(--brand-ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5"
                >
                  Adicionar ao carrinho
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="rounded-full border border-white/80 bg-white/90 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)] transition hover:-translate-y-0.5"
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
