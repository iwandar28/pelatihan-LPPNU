import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Newspaper, Calendar, User, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function NewsIndexPage() {
  const newsList = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Newspaper className="w-4 h-4 text-emerald-400" /> Kabar Tani Magelang
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Berita & Artikel LPPNU</h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
          Kumpulan kabar terbaru mengenai pelatihan geospasial, panen raya, hingga gerakan donasi hijau di seluruh wilayah Kabupaten Magelang.
        </p>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {newsList.map((news) => (
          <Link
            key={news.id}
            href={`/berita/${news.uuid}`}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col group"
          >
            <div className="relative h-52 w-full overflow-hidden bg-slate-100">
              <img
                src={news.imageUrl || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"}
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    {new Date(news.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    {news.author}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">{news.content}</p>
              </div>

              <div className="pt-2 flex items-center text-xs font-bold text-emerald-700 gap-1 group-hover:gap-2 transition-all">
                <span>Baca Artikel Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
