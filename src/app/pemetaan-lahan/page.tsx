import { prisma } from "@/lib/prisma";
import LandMapViewer from "@/components/gis/LandMapViewer";
import { Sprout, Layers, FileCode, Edit3, CheckCircle } from "lucide-react";

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
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl">
          Eksplorasi polygon lahan pertanian binaan LPPNU Kabupaten Magelang dengan dukungan 3 pilihan peta (*Streets, Satelit GPS, Topografi*) dan dukungan upload file KML/GeoJSON.
        </p>
      </div>

      {/* Feature Highlights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">3 Opsi Basemap Switcher</h4>
            <p className="text-xs text-slate-500 mt-0.5">Ubah mode peta ke Streets (OSM), Satelit GPS (Esri), atau Topografi di pojok kanan atas peta.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Upload File KML / GeoJSON</h4>
            <p className="text-xs text-slate-500 mt-0.5">Dapat langsung memuat dan memvisualisasikan berkas polygon buatan Google Earth atau QGIS di peta.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Gambar Polygon Manual</h4>
            <p className="text-xs text-slate-500 mt-0.5">Fasilitas bagi Admin untuk menentukan titik koordinat polygon area lahan secara interaktif di peta.</p>
          </div>
        </div>
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
              <tr className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Nama Lahan / Blok</th>
                <th className="py-3 px-4">Kelompok Tani Binaan</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">Luas (Hektar)</th>
                <th className="py-3 px-4">Komoditas Utama</th>
                <th className="py-3 px-4">Tipe Input</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {landsFromDb.map((land) => (
                <tr key={land.id} className="hover:bg-emerald-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{land.title}</td>
                  <td className="py-3 px-4">{land.farmerGroup}</td>
                  <td className="py-3 px-4">Desa {land.village}, Kec. {land.district}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{land.areaHectares} Ha</td>
                  <td className="py-3 px-4">{land.commodity}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 uppercase">{land.inputType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
