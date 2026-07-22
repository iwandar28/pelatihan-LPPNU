import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { HeartHandshake, MapPin, Sprout, Newspaper, ArrowRight, ShieldCheck, Clock } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const pendingDonations = await prisma.donationTransaction.count({ where: { status: "PENDING" } });
  const totalParticipants = await prisma.participant.count();
  const totalGisLands = await prisma.gisLandMap.count();
  const totalNews = await prisma.news.count();

  const recentTransactions = await prisma.donationTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard Overview Admin</h1>
          <p className="text-xs text-slate-500 mt-1">Ringkasan sistem Geospasial, Data Peserta Tani, dan Donasi Hijau LPPNU Magelang</p>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link href="/admin/donations" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 transition-all space-y-2 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Donasi Pending</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{pendingDonations} <span className="text-xs text-amber-600 font-semibold">Perlu Verifikasi</span></div>
        </Link>

        <Link href="/admin/participants" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 transition-all space-y-2 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Peserta Tani</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalParticipants} <span className="text-xs text-slate-400 font-normal">Titik Marker</span></div>
        </Link>

        <Link href="/admin/gis-lands" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 transition-all space-y-2 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Polygon Lahan GIS</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalGisLands} <span className="text-xs text-slate-400 font-normal">Area Tersimpan</span></div>
        </Link>

        <Link href="/admin/news" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 transition-all space-y-2 group">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Berita & Artikel</span>
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalNews} <span className="text-xs text-slate-400 font-normal">Dipublikasi</span></div>
        </Link>
      </div>

      {/* Recent Donation Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            Transaksi Donasi Terbaru Masuk
          </h3>
          <Link href="/admin/donations" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            Lihat Semua Transaksi <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Donatur</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Tanggal Kirim</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{tx.donorName}</td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700">Rp {Number(tx.amount).toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white ${
                        tx.status === "APPROVED" ? "bg-emerald-600" : tx.status === "REJECTED" ? "bg-rose-600" : "bg-amber-500"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
