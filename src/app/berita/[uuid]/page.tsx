import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Calendar, User, ArrowLeft, Share2, Newspaper } from "lucide-react";

export const revalidate = 0;

export default async function NewsDetailPage({ params }: { params: { uuid: string } }) {
  const article = await prisma.news.findFirst({
    where: {
      OR: [{ uuid: params.uuid }, { id: params.uuid }],
      isPublished: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <Link
        href="/berita"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-lg border border-emerald-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Berita
      </Link>

      {/* Article Title & Metadata */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-xs font-semibold text-emerald-700">
          <span className="flex items-center gap-1.5 bg-emerald-100/70 px-2.5 py-1 rounded-md">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            {new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-500" />
            {article.author}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
          {article.title}
        </h1>
      </div>

      {/* Main Image */}
      {article.imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-16/9 bg-slate-100">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Article Content */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs text-slate-700 leading-relaxed text-base space-y-6">
        {article.content.split("\n\n").map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
