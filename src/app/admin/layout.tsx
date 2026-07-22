"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, HeartHandshake, MapPin, Sprout, Newspaper, LogOut, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") return;

    const session = localStorage.getItem("lppnu_admin_user");
    if (!session) {
      router.push("/admin/login");
    } else {
      setAdminUser(JSON.parse(session));
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("lppnu_admin_user");
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Verifikasi Donasi", href: "/admin/donations", icon: HeartHandshake },
    { label: "Kelola Peserta Tani", href: "/admin/participants", icon: MapPin },
    { label: "Kelola Lahan GIS", href: "/admin/gis-lands", icon: Sprout },
    { label: "Kelola Berita", href: "/admin/news", icon: Newspaper },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Dashboard Admin</h3>
              <p className="text-[11px] text-slate-400">LPPNU Kab. Magelang</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & User Info */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {adminUser && (
            <div className="px-3 py-2 bg-slate-800/60 rounded-xl border border-slate-700 text-xs">
              <div className="font-bold text-white truncate">{adminUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-mono truncate">{adminUser.email}</div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-900/50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
