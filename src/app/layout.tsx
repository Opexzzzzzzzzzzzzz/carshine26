import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carshine26.com"),
  title: {
    default: "CarShine — детейлинг-маркет автохимии в Ставрополе",
    template: "%s · CarShine",
  },
  description:
    "Автохимия, полироли, пасты Koch Chemie и Shine Systems, оборудование и аксессуары для детейлинга. Доставка по Ставрополю и России.",
  keywords: [
    "детейлинг",
    "автохимия",
    "полировка авто",
    "Koch Chemie",
    "Shine Systems",
    "Ставрополь",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "CarShine — детейлинг-маркет",
    description:
      "Всё для полировки, мойки, защиты и ухода за автомобилем. Профи-бренды в наличии.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${body.variable} ${display.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
