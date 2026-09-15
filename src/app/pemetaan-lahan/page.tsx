import { prisma } from "@/lib/prisma";
import LandMapViewer from "@/components/gis/LandMapViewer";
import { Sprout } from "lucide-react";

export const revalidate = 0;

export default async function PemetaanLahanPage() {
  const landsFromDb = await prisma.gisLandMap.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Sprout className="w-4 h-4 text-emerald-400" /> Sistem Informasi Geografis (GIS) Lahan
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Pemetaan Spasial Lahan Pertanian</h1>
      </div>

      {/* Main Multi-Layer Leaflet Viewer Component */}
      <LandMapViewer initialLands={landsFromDb} />

      {/* Land Database Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-600" />
          Daftar Lahan Pertanian Terdaftar di GIS Database
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-emerald-50 border-b border-emerald-100 text-slate-800">
                <th className="py-3 px-4 font-bold text-left">Nama Pemilik</th>
                <th className="py-3 px-4 font-bold text-left">Kelompok Tani</th>
                <th className="py-3 px-4 font-bold text-left">Alamat</th>
                <th className="py-3 px-4 font-bold text-left">Luas (Ha)</th>
                <th className="py-3 px-4 font-bold text-left">Komoditas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {landsFromDb.map((land) => (
                <tr key={land.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{land.ownerName}</td>
                  <td className="py-3 px-4">{land.farmerGroup}</td>
                  <td className="py-3 px-4">{land.address}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{land.areaHectares} Ha</td>
                  <td className="py-3 px-4">{land.commodity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
