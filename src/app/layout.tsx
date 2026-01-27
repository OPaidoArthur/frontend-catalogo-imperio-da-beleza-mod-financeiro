import type { Metadata } from "next"
import { Fraunces, Manrope } from "next/font/google"

import { CartProvider } from "@/components/cart/cart-context"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Império da Beleza | Catálogo",
  description: "Catálogo de produtos Império da Beleza.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${fraunces.variable} ${manrope.variable}`}>
        <CartProvider>
          <div className="relative min-h-screen">
            <SiteHeader />
            <main className="px-6 pb-16 pt-10 lg:px-12">{children}</main>
            <SiteFooter />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
