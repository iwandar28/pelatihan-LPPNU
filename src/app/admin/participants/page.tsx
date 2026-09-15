"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, Edit, Save, X, RefreshCw, UploadCloud } from "lucide-react";
import DraggableMap from "@/components/gis/DraggableMap";

interface Participant {
  id: string;
  fullName: string;
  nikOrId?: string | null;
  institution?: string | null;
  district: string;
  village: string;
  commodity: string;
  membershipStatus: "ACTIVE" | "ALUMNI" | "FIELD_COMPANION";
  latitude: number;
  longitude: number;
  address?: string | null;
  phone?: string | null;
  idCardPhoto?: string | null;
  farmerGroup?: string | null;
  certificateScan?: string | null;
  trainingAttended?: string | null;
  trainingDate?: string | null;
  bioOrNotes?: string | null;
}

const DISTRICTS = [
  "Bandongan", "Borobudur", "Candimulyo", "Dukun", "Grabag", 
  "Kajoran", "Kaliangkrik", "Mertoyudan", "Mungkid", "Muntilan", 
  "Ngablak", "Ngluwar", "Pakis", "Salam", "Salaman", 
  "Sawangan", "Secang", "Srumbung", "Tegalrejo", "Tempuran", "Windusari"
];

const BANOM_LIST = [
  "ANSOR", "BANSER", "FATAYAT", "MUSLIMAT", "IPNU", "IPPNU", 
  "POKTAN NU", "LPP NU", "LKK NU", "LPBI NU", "LWP NU", "RMI", 
  "RMI NU", "LP MA'ARIF NU", "MWC NU", "KWT NU", "P4SK"
];

export default function AdminParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [district, setDistrict] = useState("Muntilan");
  const [village, setVillage] = useState("");
  const [commodity, setCommodity] = useState("");
  const [membershipStatus, setMembershipStatus] = useState<"ACTIVE" | "ALUMNI" | "FIELD_COMPANION">("ACTIVE");
  const [latitude, setLatitude] = useState("-7.5815");
  const [longitude, setLongitude] = useState("110.2984");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  
  // File states
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardPhotoUrl, setIdCardPhotoUrl] = useState("");
  
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certificateScanUrl, setCertificateScanUrl] = useState("");

  const [farmerGroup, setFarmerGroup] = useState("");
  const [trainingAttended, setTrainingAttended] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [bioOrNotes, setBioOrNotes] = useState("");

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/participants");
      const json = await res.json();
      if (json.success) {
        setParticipants(json.data);
      }
    } catch (e) {
      console.error("Gagal mengambil data peserta", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFullName("");
    setInstitution("");
    setDistrict("Muntilan");
    setVillage("");
    setCommodity("Padi Organik");
    setMembershipStatus("ACTIVE");
    setLatitude("-7.5815");
    setLongitude("110.2984");
    setAddress("");
    setPhone("");
    setIdCardFile(null);
    setIdCardPhotoUrl("");
    setCertFile(null);
    setCertificateScanUrl("");
    setFarmerGroup("");
    setTrainingAttended("");
    setTrainingDate("");
    setBioOrNotes("");
    setShowModal(true);
  };

  const handleOpenEdit = (p: Participant) => {
    setEditingId(p.id);
    setFullName(p.fullName);
    setInstitution(p.institution || "");
    setDistrict(p.district);
    setVillage(p.village);
    setCommodity(p.commodity);
    setMembershipStatus(p.membershipStatus);
    setLatitude(p.latitude.toString());
    setLongitude(p.longitude.toString());
    setAddress(p.address || "");
    setPhone(p.phone || "");
    setIdCardFile(null);
    setIdCardPhotoUrl(p.idCardPhoto || "");
    setCertFile(null);
    setCertificateScanUrl(p.certificateScan || "");
    setFarmerGroup(p.farmerGroup || "");
    setTrainingAttended(p.trainingAttended || "");
    setTrainingDate(p.trainingDate ? new Date(p.trainingDate).toISOString().split('T')[0] : "");
    setBioOrNotes(p.bioOrNotes || "");
    setShowModal(true);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) return data.url;
    throw new Error(data.message || "Upload failed");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let finalIdCardUrl = idCardPhotoUrl;
      let finalCertUrl = certificateScanUrl;

      if (idCardFile) {
        finalIdCardUrl = await uploadFile(idCardFile);
      }
      
      if (certFile) {
        finalCertUrl = await uploadFile(certFile);
      }

      const payload = {
        fullName,
        institution,
        district,
        village,
        commodity,
        membershipStatus,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        phone,
        idCardPhoto: finalIdCardUrl,
        farmerGroup,
        certificateScan: finalCertUrl,
        trainingAttended,
        trainingDate: trainingDate || null,
        bioOrNotes,
      };

      const url = editingId ? `/api/admin/participants/${editingId}` : "/api/admin/participants";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        fetchParticipants();
        setShowModal(false);
      } else {
        alert(json.message || "Gagal menyimpan data");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data peserta ini?")) return;
    try {
      const res = await fetch(`/api/admin/participants/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchParticipants();
      }
    } catch (e) {
      alert("Gagal menghapus.");
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Peserta Tani & Lokasi Marker</h1>
          <p className="text-xs text-slate-500 mt-1">Tambah, edit, dan atur titik koordinat lokasi peserta pelatihan LPPNU Magelang</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Peserta Baru
        </button>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Nama Peserta</th>
                <th className="py-3 px-4">Asal Lembaga</th>
                <th className="py-3 px-4">Wilayah (Kec & Desa)</th>
                <th className="py-3 px-4">Komoditas Tani</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Edit / Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{p.fullName}</td>
                  <td className="py-3 px-4">{p.institution || "-"}</td>
                  <td className="py-3 px-4">Kec. {p.district}, Desa {p.village}</td>
                  <td className="py-3 px-4 font-medium">{p.commodity}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white ${
                        p.membershipStatus === "ACTIVE"
                          ? "bg-emerald-600"
                          : p.membershipStatus === "ALUMNI"
                          ? "bg-blue-600"
                          : "bg-orange-600"
                      }`}
                    >
                      {p.membershipStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Edit Peserta"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="Hapus Peserta"
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
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">{editingId ? "Edit Data Peserta" : "Tambah Peserta Baru"}</h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Asal Lembaga / Banom</label>
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  >
                    <option value="">Pilih Lembaga / Banom</option>
                    {BANOM_LIST.map((banom) => (
                      <option key={banom} value={banom}>{banom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nomor HP / WA</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Kelompok Tani</label>
                  <input
                    type="text"
                    value={farmerGroup}
                    onChange={(e) => setFarmerGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kecamatan *</label>
                  <select
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Desa / Kelurahan *</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Komoditas Tani *</label>
                  <input
                    type="text"
                    required
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Status Keanggotaan *</label>
                  <select
                    value={membershipStatus}
                    onChange={(e) => setMembershipStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 font-bold text-emerald-800"
                  >
                    <option value="ACTIVE">ACTIVE (Anggota Aktif)</option>
                    <option value="ALUMNI">ALUMNI (Alumni Training)</option>
                    <option value="FIELD_COMPANION">FIELD_COMPANION (Pendamping)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Data Pelatihan</label>
                  <input
                    type="text"
                    value={trainingAttended}
                    onChange={(e) => setTrainingAttended(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tanggal Pelatihan</label>
                  <input
                    type="date"
                    value={trainingDate}
                    onChange={(e) => setTrainingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Map Coordinate Picker */}
              <div className="space-y-2 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Peta Koordinat Lokasi (Geser Marker) *
                </label>
                <div className="w-full relative">
                  <DraggableMap 
                    latitude={parseFloat(latitude)} 
                    longitude={parseFloat(longitude)} 
                    onLocationChange={handleLocationChange} 
                  />
                  {/* Hidden inputs to capture values just in case */}
                  <input type="hidden" name="latitude" value={latitude} />
                  <input type="hidden" name="longitude" value={longitude} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Alamat Lengkap</label>
                <textarea
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  placeholder="Masukkan alamat lengkap..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Foto KTP (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
                    className="w-full p-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {idCardPhotoUrl && !idCardFile && (
                    <div className="text-[10px] text-emerald-600 font-medium truncate mt-1">File tersimpan: {idCardPhotoUrl}</div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Scan Piagam (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                    className="w-full p-2 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {certificateScanUrl && !certFile && (
                    <div className="text-[10px] text-emerald-600 font-medium truncate mt-1">File tersimpan: {certificateScanUrl}</div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Catatan / Bio (Opsional)</label>
                <textarea
                  rows={2}
                  value={bioOrNotes}
                  onChange={(e) => setBioOrNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" /> 
                  )}
                  {isSaving ? "Menyimpan Data..." : "Simpan Data Peserta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
