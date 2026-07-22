"use client";

import { useState, useEffect } from "react";
import { Sprout, Plus, Trash2, Save, X, Upload } from "lucide-react";
import { kml } from "@tmcw/togeojson";

interface LandMap {
  id: string;
  title: string;
  farmerGroup: string;
  district: string;
  village: string;
  areaHectares: number;
  commodity: string;
  inputType: string;
  geoJsonData: string;
  colorHex: string;
}

export default function AdminGisLandsPage() {
  const [lands, setLands] = useState<LandMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [farmerGroup, setFarmerGroup] = useState("");
  const [district, setDistrict] = useState("Muntilan");
  const [village, setVillage] = useState("");
  const [areaHectares, setAreaHectares] = useState("12.5");
  const [commodity, setCommodity] = useState("Padi Organik");
  const [colorHex, setColorHex] = useState("#22c55e");
  const [geoJsonString, setGeoJsonString] = useState("");

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gis-lands");
      const json = await res.json();
      if (json.success) {
        setLands(json.data);
      }
    } catch (e) {
      console.error("Gagal mengambil data GIS lahan", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let parsed: any = null;
        if (file.name.endsWith(".kml")) {
          const dom = new DOMParser().parseFromString(text, "text/xml");
          parsed = kml(dom);
        } else {
          parsed = JSON.parse(text);
        }
        setGeoJsonString(JSON.stringify(parsed, null, 2));
      } catch (err) {
        alert("Gagal membaca file GeoJSON/KML");
      }
    };
    reader.readAsText(file);
  };

  const handleOpenAdd = () => {
    setTitle("");
    setFarmerGroup("Poktan Subur Makmur");
    setDistrict("Muntilan");
    setVillage("Poboyo");
    setAreaHectares("12.5");
    setCommodity("Padi Organik");
    setColorHex("#22c55e");
    // Default polygon geometry around Muntilan
    setGeoJsonString(
      JSON.stringify(
        {
          type: "Feature",
          properties: { name: "Lahan Pertanian Baru" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [110.296, -7.58],
                [110.301, -7.58],
                [110.301, -7.583],
                [110.296, -7.583],
                [110.296, -7.58],
              ],
            ],
          },
        },
        null,
        2
      )
    );
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        farmerGroup,
        district,
        village,
        areaHectares: parseFloat(areaHectares),
        commodity,
        inputType: "MANUAL_POLYGON",
        geoJsonData: geoJsonString,
        colorHex,
      };

      const res = await fetch("/api/admin/gis-lands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        fetchLands();
        setShowModal(false);
      } else {
        alert(json.message || "Gagal menyimpan lahan GIS");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data polygon lahan ini?")) return;
    try {
      const res = await fetch(`/api/admin/gis-lands/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchLands();
      }
    } catch (e) {
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Pemetaan Lahan GIS</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola data polygon spasial area lahan binaan pertanian LPPNU Kab. Magelang</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Polygon Lahan
        </button>
      </div>

      {/* GIS Lands Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Nama Lahan</th>
                <th className="py-3 px-4">Kelompok Tani</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">Luas (Ha)</th>
                <th className="py-3 px-4">Warna Polygon</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lands.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{l.title}</td>
                  <td className="py-3 px-4 font-medium">{l.farmerGroup}</td>
                  <td className="py-3 px-4">Desa {l.village}, Kec. {l.district}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{l.areaHectares} Ha</td>
                  <td className="py-3 px-4">
                    <span className="w-4 h-4 rounded inline-block border shadow-xs" style={{ backgroundColor: l.colorHex }}></span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="Hapus Polygon Lahan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Tambah Polygon Lahan GIS Baru</h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Lahan / Blok *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lahan Percontohan Padi Organik"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kelompok Tani Binaan</label>
                  <input
                    type="text"
                    value={farmerGroup}
                    onChange={(e) => setFarmerGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Komoditas Utama</label>
                  <input
                    type="text"
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kecamatan *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Desa *</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Luas (Ha) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={areaHectares}
                    onChange={(e) => setAreaHectares(e.target.value)}
                    className="w-full p-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 font-bold text-emerald-800"
                  />
                </div>
              </div>

              {/* GeoJSON Input / KML File Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Struktur Data GeoJSON (Polygon Coordinates) *</label>
                  <label className="cursor-pointer text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Auto-fill via File KML / GeoJSON
                    <input type="file" accept=".kml,.json,.geojson" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <textarea
                  rows={5}
                  required
                  value={geoJsonString}
                  onChange={(e) => setGeoJsonString(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs font-mono border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-900 text-emerald-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Polygon Lahan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
