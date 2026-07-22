"use client";

import { useState, useEffect } from "react";
import { Newspaper, Plus, Trash2, Save, X } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  uuid: string;
  content: string;
  imageUrl?: string | null;
  author: string;
  publishedAt: string;
}

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("Admin LPPNU");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const json = await res.json();
      if (json.success) {
        setNewsList(json.data);
      }
    } catch (e) {
      console.error("Gagal mengambil daftar berita admin", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setTitle("");
    setContent("");
    setImageUrl("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80");
    setAuthor("Admin LPPNU");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { title, content, imageUrl, author };
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        fetchNews();
        setShowModal(false);
      } else {
        alert(json.message || "Gagal menyimpan berita");
      }
    } catch (err: any) {
      alert("Terjadi kesalahan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchNews();
      }
    } catch (e) {
      alert("Gagal menghapus berita.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kelola Berita & Artikel</h1>
          <p className="text-xs text-slate-500 mt-1">Publikasikan berita, kegiatan pelatihan, dan artikel pertanian terbaru LPPNU Magelang</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Tulis Berita Baru
        </button>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Judul Berita</th>
                <th className="py-3 px-4">Penulis</th>
                <th className="py-3 px-4">Tanggal Publikasi</th>
                <th className="py-3 px-4">UUID Endpoint</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {newsList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{item.title}</td>
                  <td className="py-3 px-4">{item.author}</td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(item.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-emerald-700">{item.uuid}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="Hapus Berita"
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
              <h3 className="text-lg font-bold text-slate-900">Tulis Berita Baru</h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Judul Berita *</label>
                <input
                  type="text"
                  required
                  placeholder="Judul artikel..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Penulis / Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">URL Gambar Thumbnail</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Konten Artikel Berita *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Ketik isi berita..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Publikasikan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
