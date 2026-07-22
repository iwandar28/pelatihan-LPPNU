import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "LPPNU Magelang - Website Pelatihan & Geospasial Pertanian",
  description:
    "Website resmi Lembaga Pengembangan Pertanian Nahdlatul Ulama Kabupaten Magelang. Informasi Geospasial GIS, Pemetaan Lahan, Sebaran Peserta Tani, Donasi Hijau, dan Berita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex flex-col min-h-screen antialiased bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
