"use client"

import * as React from "react"
import Link from "next/link"

import { formatCurrency } from "@/lib/format"

const announcementSeenKey = "imperio.catalogo.secao10.announcement_seen"

type SecaoDe10PreviewItem = {
  name: string
  image?: string | null
  price?: number | null
}

type SecaoDe10AnnouncementProps = {
  item?: SecaoDe10PreviewItem | null
}

export function SecaoDe10Announcement({ item }: SecaoDe10AnnouncementProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const seen = window.localStorage.getItem(announcementSeenKey) === "true"
      if (!seen) {
        setIsOpen(true)
        window.localStorage.setItem(announcementSeenKey, "true")
      }
    } catch {
      // fallback: if storage is blocked, still show announcement once in session
      setIsOpen(true)
    }
  }, [])

  if (!isOpen) {
    return null
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const previewName = item?.name ?? "Item destaque"
  const previewImage = item?.image ?? "/imperio_beleza_fundo_transparente.png"
  const previewPrice =
    item?.price === null || item?.price === undefined
      ? "Ate R$ 10"
      : formatCurrency(item.price)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Anúncio da Seção de 10"
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_30px_80px_rgba(20,20,35,0.24)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Fechar anúncio"
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full bg-white text-lg font-semibold text-[color:var(--brand-ink)] shadow-[0_10px_20px_rgba(20,20,35,0.12)] transition hover:-translate-y-0.5"
        >
          {"\u00D7"}
        </button>

        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[color:var(--brand-ink)]/60">
          Destaque
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Seção de 10</h2>
        <p className="mt-2 text-sm text-[color:var(--brand-ink)]/70">
          Confira o catálogo exclusivo com itens de até R$ 10.
        </p>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/70 bg-white/80">
          <div className="grid grid-cols-[88px_1fr] items-center gap-3 p-3">
            <div className="size-[88px] overflow-hidden rounded-xl bg-[color:var(--brand-cream)]">
              <img
                src={previewImage}
                alt={previewName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)]/60">
                Item da seção
              </p>
              <p className="truncate text-sm font-semibold text-[color:var(--brand-ink)]">
                {previewName}
              </p>
              <p className="mt-1 text-xs font-semibold text-[color:var(--brand-ink)]/75">
                {previewPrice}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/secao-de-10"
            onClick={handleClose}
            className="inline-flex rounded-full bg-[color:var(--brand-ink)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_rgba(20,20,35,0.2)] transition hover:-translate-y-0.5"
          >
            Ver seção
          </Link>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex rounded-full border border-white/80 bg-white/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-ink)] transition hover:-translate-y-0.5"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}
