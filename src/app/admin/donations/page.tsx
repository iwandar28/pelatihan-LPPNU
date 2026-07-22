"use client";

import { useState, useEffect } from "react";
import { HeartHandshake, Eye, CheckCircle2, XCircle, AlertCircle, RefreshCw, X } from "lucide-react";

interface DonationTransaction {
  id: string;
  donorName: string;
  donorEmail?: string | null;
  donorPhone?: string | null;
  amount: number;
  proofImageUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNotes?: string | null;
  createdAt: string;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<DonationTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<DonationTransaction | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/donations");
      const json = await res.json();
      if (json.success) {
        setDonations(json.data);
      }
    } catch (e) {
      console.error("Gagal mengambil daftar donasi admin", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/donations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminNotes: adminNotesInput || (status === "APPROVED" ? "Bukti transfer diverifikasi sah." : "Bukti transfer ditolak/tidak valid."),
        }),
      });

      const json = await res.json();
      if (json.success) {
        fetchDonations();
        setSelectedProof(null);
        setAdminNotesInput("");
      } else {
        alert(json.message || "Gagal mengubah status donasi");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Verifikasi Donasi Hijau</h1>
          <p className="text-xs text-slate-500 mt-1">Periksa foto bukti transfer bank dari pengunjung dan lakukan approval</p>
        </div>
        <button
          onClick={fetchDonations}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Nama Donatur</th>
                <th className="py-3 px-4">Kontak (Email/WA)</th>
                <th className="py-3 px-4">Nominal Transfer</th>
                <th className="py-3 px-4">Tanggal Kirim</th>
                <th className="py-3 px-4">Status Verifikasi</th>
                <th className="py-3 px-4 text-right">Bukti & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{tx.donorName}</td>
                  <td className="py-3 px-4 text-slate-600">
                    {tx.donorEmail || "-"}
                    {tx.donorPhone ? ` (${tx.donorPhone})` : ""}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-emerald-700">Rp {Number(tx.amount).toLocaleString("id-ID")}</td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white ${
                        tx.status === "APPROVED" ? "bg-emerald-600" : tx.status === "REJECTED" ? "bg-rose-600" : "bg-amber-500 animate-pulse"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedProof(tx);
                        setAdminNotesInput(tx.adminNotes || "");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Periksa Bukti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Viewer Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Verifikasi Bukti Transfer</span>
              <h3 className="text-lg font-bold text-slate-900">{selectedProof.donorName}</h3>
              <p className="text-xs text-slate-500">Nominal: <strong className="text-emerald-700">Rp {Number(selectedProof.amount).toLocaleString("id-ID")}</strong></p>
            </div>

            {/* Proof Image Display */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden max-h-72 flex items-center justify-center p-2 border">
              <img src={selectedProof.proofImageUrl} alt="Bukti Transfer" className="max-h-68 object-contain rounded-xl" />
            </div>

            {/* Admin Notes Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Catatan Admin (Opsional)</label>
              <textarea
                rows={2}
                placeholder="Masukkan catatan verifikasi..."
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                className="w-full p-3 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleUpdateStatus(selectedProof.id, "APPROVED")}
                disabled={processingId === selectedProof.id}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve (Setujui Donasi)
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedProof.id, "REJECTED")}
                disabled={processingId === selectedProof.id}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Reject (Tolak Donasi)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
