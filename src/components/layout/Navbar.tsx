"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MapPin, Sprout, Newspaper, HeartHandshake, ShieldCheck, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Beranda & Profil", href: "/", icon: Sprout },
    { label: "Mapping Kader Petani NU", href: "/mapping-peserta", icon: MapPin },
    { label: "Pemetaan Lahan GIS", href: "/pemetaan-lahan", icon: Sprout },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white p-0.5 border border-emerald-100 shadow-xs flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/logo.png" alt="Logo LPPNU" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-emerald-950 block leading-tight tracking-tight">
                LPPNU <span className="text-emerald-600">MAGELANG</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-700 block uppercase tracking-wider">
                Geospasial Pertanian
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60 shadow-xs"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Admin Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200 border border-emerald-300/50 transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Dashboard Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? "bg-emerald-100/80 text-emerald-800 font-semibold" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-600" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors"
            >
              <ShieldCheck className="w-5 h-5" />
              Dashboard Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
