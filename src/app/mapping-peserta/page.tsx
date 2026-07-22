"use client";

import { useState, useEffect } from "react";
import ParticipantMap from "@/components/gis/ParticipantMap";
import { MapPin, Filter, Search, Users, RefreshCw, CheckCircle2, UserCheck, Award, Layers } from "lucide-react";

interface Participant {
  id: string;
  fullName: string;
  district: string;
  village: string;
  commodity: string;
  membershipStatus: "ACTIVE" | "ALUMNI" | "FIELD_COMPANION";
  latitude: number;
  longitude: number;
  address?: string | null;
  bioOrNotes?: string | null;
}

export default function MappingPesertaPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [commodityFilter, setCommodityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableCommodities, setAvailableCommodities] = useState<string[]>([]);

  useEffect(() => {
    fetchParticipants();
  }, [districtFilter, commodityFilter, statusFilter]);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (districtFilter !== "ALL") query.append("district", districtFilter);
      if (commodityFilter !== "ALL") query.append("commodity", commodityFilter);
      if (statusFilter !== "ALL") query.append("status", statusFilter);

      const res = await fetch(`/api/participants?${query.toString()}`);
      const json = await res.json();

      if (json.success) {
        setParticipants(json.data);
        if (json.filters) {
          setAvailableDistricts(json.filters.districts || []);
          setAvailableCommodities(json.filters.commodities || []);
        }
      }
    } catch (e) {
      console.error("Gagal mengambil data peserta", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.village.toLowerCase().includes(q) ||
      p.commodity.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-emerald-400" /> Geospasial Dampingan Tani
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Mapping & Peta Sebaran Peserta Pelatihan</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl">
          Visualisasi spasial titik lokasi para peserta pelatihan, alumni, dan pendamping lapangan LPPNU di seluruh wilayah Kabupaten Magelang.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            Filter Data Sebaran Peserta
          </h3>
          <button
            onClick={() => {
              setDistrictFilter("ALL");
              setCommodityFilter("ALL");
              setStatusFilter("ALL");
              setSearchQuery("");
            }}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Cari Nama / Desa</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Ketik nama atau desa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* District Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Filter Wilayah (Kecamatan)</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            >
              <option value="ALL">Semua Kecamatan Magelang</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  Kec. {d}
                </option>
              ))}
            </select>
          </div>

          {/* Commodity Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Filter Komoditas Tani</label>
            <select
              value={commodityFilter}
              onChange={(e) => setCommodityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            >
              <option value="ALL">Semua Komoditas</option>
              {availableCommodities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Membership Status Radio/Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Status Keanggotaan</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 font-semibold text-emerald-800"
            >
              <option value="ALL">Semua Status (Aktif, Alumni, Pendamping)</option>
              <option value="ACTIVE">Anggota Aktif (Hijau)</option>
              <option value="ALUMNI">Alumni Pelatihan (Biru)</option>
              <option value="FIELD_COMPANION">Pendamping Lapangan (Oranye)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive GIS Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Peta Lokasi Marker ({filteredParticipants.length} Titik Peserta Terfilter)
          </h3>
        </div>
        <ParticipantMap participants={filteredParticipants} selectedParticipantId={selectedId} />
      </div>

      {/* Participants Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Daftar Peserta & Lokasi Pendampingan
          </h3>
          <span className="text-xs font-medium text-slate-500">
            Menampilkan {filteredParticipants.length} dari {participants.length} data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Nama Peserta</th>
                <th className="py-3 px-4">Kecamatan & Desa</th>
                <th className="py-3 px-4">Komoditas Tani</th>
                <th className="py-3 px-4">Status Keanggotaan</th>
                <th className="py-3 px-4">Koordinat (Lat, Lng)</th>
                <th className="py-3 px-4 text-right">Aksi Peta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.fullName}</td>
                    <td className="py-3 px-4 font-medium">
                      Kec. {p.district}, Desa {p.village}
                    </td>
                    <td className="py-3 px-4">{p.commodity}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full text-white ${
                          p.membershipStatus === "ACTIVE"
                            ? "bg-emerald-600"
                            : p.membershipStatus === "ALUMNI"
                            ? "bg-blue-600"
                            : "bg-orange-600"
                        }`}
                      >
                        {p.membershipStatus === "ACTIVE"
                          ? "Aktif"
                          : p.membershipStatus === "ALUMNI"
                          ? "Alumni"
                          : "Pendamping"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedId(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" /> Focus Peta
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada data peserta yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
