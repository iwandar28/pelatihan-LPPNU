import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Sprout, MapPin, Users, TreePine, UsersRound, Target, ArrowRight, Newspaper, CheckCircle2 } from "lucide-react";

export const revalidate = 0; // Dynamic server rendering

export default async function HomePage() {
  const stats = await prisma.profileStatistic.findFirst({ where: { id: 1 } });
  const boardMembers = await prisma.boardMember.findMany({ orderBy: { orderIndex: "asc" } });
  const latestNews = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-16 pb-24 border-b border-emerald-800/40">
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Geospasial Pertanian LPPNU Kab. Magelang</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Membangun Kedaulatan Pangan Berbasis <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Teknologi GIS</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                {stats?.shortInfoGis ||
                  "Lembaga Pengembangan Pertanian Nahdlatul Ulama Kabupaten Magelang mendampingi para petani lokal di kawasan lereng Merapi, Merbabu, dan Sumbing berbasis pemetaan geospasial presisi."}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/mapping-peserta"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <MapPin className="w-4 h-4" />
                  Lihat Peta Sebaran Peserta
                </Link>
                <Link
                  href="/pemetaan-lahan"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-800/80 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 transition-all"
                >
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  Pemetaan Lahan GIS
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl shadow-emerald-950/80 aspect-4/3 group">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
                  alt="Pertanian Magelang GIS"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Kawasan Dampingan</span>
                  <h3 className="text-white font-bold text-lg">Pertanian Organik Lereng Sumbing & Merapi</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Stat Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-900/5 hover:border-emerald-300 transition-all space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.totalLandAreaGis ? stats.totalLandAreaGis.toLocaleString("id-ID") : "1,245"} <span className="text-sm font-semibold text-slate-500">Ha</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Luas Lahan GIS</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-900/5 hover:border-emerald-300 transition-all space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.totalTrainees ? stats.totalTrainees.toLocaleString("id-ID") : "485"}+ <span className="text-sm font-semibold text-slate-500">Orang</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Peserta Latihan Binaan</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-900/5 hover:border-emerald-300 transition-all space-y-2">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <TreePine className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.totalTreesDonated ? stats.totalTreesDonated.toLocaleString("id-ID") : "15,400"} <span className="text-sm font-semibold text-slate-500">Pohon</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Jumlah Pohon Donasi</p>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-900/5 hover:border-emerald-300 transition-all space-y-2">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <UsersRound className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats?.totalFarmerGroups || "42"} <span className="text-sm font-semibold text-slate-500">Poktan</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Kelompok Tani Magelang</p>
          </div>
        </div>
      </section>

      {/* Vision and Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Target className="w-4 h-4 text-emerald-400" /> Visi Organisasi
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Visi PC LPPNU Kabupaten Magelang
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10 italic">
                &ldquo;{stats?.vision || "Tercapainya Kedaulatan Pangan, Kesejahteraan Petani Nahdliyin, dan Kelestarian Lingkungan Berbasis Inovasi Pertanian & Teknologi Geospasial di Kabupaten Magelang."}&rdquo;
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-teal-400" /> Misi Utama
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Misi Strategis Pemberdayaan
              </h2>
              <div className="space-y-3">
                {stats?.mission ? (
                  stats.mission.split("\n").map((m, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">{m.replace(/^[0-9]+\.\s*/, "")}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-300 text-sm">Misi sedang diatur.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Structure Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Kepengurusan PC LPPNU</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Struktur Kepengurusan Magelang</h2>
          <p className="text-slate-600 text-sm">
            Para pengurus dan tenaga ahli geospasial LPPNU yang berdedikasi mengabdi untuk petani Kabupaten Magelang.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boardMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-center space-y-3 group"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-emerald-500 p-0.5 shadow-md">
                <img
                  src={member.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{member.name}</h4>
                <p className="text-xs font-medium text-emerald-700 mt-0.5">{member.position}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest News Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Informasi Terkini</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Berita & Kegiatan Terbaru</h2>
          </div>
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Lihat Semua Berita <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((news) => (
            <Link
              key={news.id}
              href={`/berita/${news.uuid}`}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={news.imageUrl || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {new Date(news.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} • {news.author}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">{news.content}</p>
                </div>

                <div className="pt-2 flex items-center text-xs font-bold text-emerald-700 gap-1 group-hover:gap-2 transition-all">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
