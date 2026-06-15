import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Salón del Bosque — Atelier Capilar",
  description: "Una experiencia capilar única, rodeada de la calidez del bosque.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
