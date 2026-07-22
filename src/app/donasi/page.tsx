"use client";

import { useState, useEffect } from "react";
import { HeartHandshake, Building2, Copy, Check, Upload, Send, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function DonasiHijauPage() {
  const [campaign, setCampaign] = useState<any>(null);
  const [totalCollected, setTotalCollected] = useState(0);
  const [copied, setCopied] = useState(false);

  // Form State
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [proofImageUrl, setProofImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    try {
      const res = await fetch("/api/donations/campaign");
      const json = await res.json();
      if (json.success) {
        setCampaign(json.data.campaign);
        setTotalCollected(json.data.totalCollected);
      }
    } catch (e) {
      console.error("Gagal mengambil data kampanye donasi", e);
    }
  };

  const handleCopyAccount = () => {
    if (campaign?.bankAccount) {
      navigator.clipboard.writeText(campaign.bankAccount);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Convert uploaded image file to Base64 data URL for simplicity and zero third-party dependency
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ukuran file bukti transfer maksimal 5MB" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProofImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!donorName || !amount || !proofImageUrl) {
      setMessage({ type: "error", text: "Nama lengkap, nominal transfer, dan bukti transfer wajib diisi" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/donations/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName,
          donorEmail,
          donorPhone,
          amount: parseFloat(amount),
          proofImageUrl,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({
          type: "success",
          text: "Terima kasih! Bukti transfer donasi Anda berhasil dikirim dan sedang diverifikasi oleh admin.",
        });
        setDonorName("");
        setDonorEmail("");
        setDonorPhone("");
        setAmount("");
        setProofImageUrl("");
      } else {
        setMessage({ type: "error", text: json.message || "Gagal mengirim konfirmasi donasi." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi saat mengirim donasi." });
    } finally {
      setSubmitting(false);
    }
  };

  const target = campaign?.targetAmount ? Number(campaign.targetAmount) : 50000000;
  const percentage = Math.min(Math.round((totalCollected / target) * 100), 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4 text-emerald-400" /> Donasi Hijau & Pemberdayaan Tani
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
          Gerakan Donasi Hijau <span className="text-emerald-400">LPPNU Magelang</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          {campaign?.description ||
            "Dukungan Anda akan disalurkan langsung untuk pengadaan bibit pohon buah produktif, pupuk hayati organik, dan pendampingan teknologi geospasial bagi para petani di Kabupaten Magelang."}
        </p>
      </div>

      {/* Progress Bar & Collected Funds Meter */}
      <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Akumulasi Dana Hijau</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
              Rp {totalCollected.toLocaleString("id-ID")}{" "}
              <span className="text-sm font-semibold text-slate-500">Terkumpul</span>
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Target Kampanye:</span>
            <div className="text-lg font-bold text-slate-800">Rp {target.toLocaleString("id-ID")}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-sm"
              style={{ width: `${Math.max(percentage, 5)}%` }}
            >
              {percentage}%
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>0%</span>
            <span>{percentage}% dari target tercapai</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official Bank Account Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 p-7 rounded-3xl text-white space-y-6 shadow-md border border-emerald-800">
            <div className="flex items-center gap-3 border-b border-emerald-800/80 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Transfer Bank Resmi</h3>
                <p className="text-xs text-emerald-300">Donasi hanya melalui rekening ini</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">Nama Bank</span>
                <p className="text-base font-bold text-emerald-300">{campaign?.bankName || "Bank Syariah Indonesia (BSI)"}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Nomor Rekening</span>
                <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl border border-white/10 mt-1">
                  <span className="font-mono text-lg font-bold tracking-wider text-white">
                    {campaign?.bankAccount || "7123456789"}
                  </span>
                  <button
                    onClick={handleCopyAccount}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Atas Nama Rekening</span>
                <p className="text-sm font-bold text-white">{campaign?.accountHolder || "PC LPPNU KABUPATEN MAGELANG"}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-xs text-emerald-200 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Seluruh transaksi wajib menyertakan bukti transfer di form konfirmasi agar dapat diverifikasi oleh admin LPPNU.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Donation Confirmation Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              Form Konfirmasi Transfer Donasi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Setelah melakukan transfer bank, masukkan data Anda dan unggah foto bukti transfer di bawah ini.
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                message.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border border-rose-200 text-rose-900"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nama Lengkap Donatur *</label>
              <input
                type="text"
                required
                placeholder="Contoh: H. Ahmad Zaenal"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email (Opsional)</label>
                <input
                  type="email"
                  placeholder="donatur@gmail.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">No. WhatsApp / HP (Opsional)</label>
                <input
                  type="text"
                  placeholder="081234567890"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nominal Transfer Donasi (Rp) *</label>
              <input
                type="number"
                required
                placeholder="Contoh: 500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 font-semibold text-emerald-800"
              />
            </div>

            {/* Upload Proof of Transfer */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Upload Bukti Transfer (Foto/Struk) *</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-4 text-center bg-slate-50/50 transition-colors">
                <input type="file" accept="image/*" required={!proofImageUrl} onChange={handleFileChange} className="hidden" id="proof-upload" />
                <label htmlFor="proof-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-700">Klik di sini untuk upload foto struk/bukti transfer</span>
                  <span className="text-[10px] text-slate-400">Format: JPG, PNG (Maks 5MB)</span>
                </label>
              </div>

              {proofImageUrl && (
                <div className="mt-3 p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                  <img src={proofImageUrl} alt="Preview Bukti Transfer" className="w-12 h-12 object-cover rounded-lg border border-emerald-300" />
                  <span className="text-xs font-bold text-emerald-800">Foto bukti transfer siap dikirim!</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Mengirim Konfirmasi..." : "Kirim Konfirmasi Donasi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
