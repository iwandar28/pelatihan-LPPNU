"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ParticipantMapClient = dynamic(() => import("./ParticipantMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-2xl bg-emerald-950/5 border border-emerald-200 flex flex-col items-center justify-center gap-3 text-emerald-800 animate-pulse">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      <span className="text-sm font-semibold">Memuat Peta Sebaran Peserta GIS Magelang...</span>
    </div>
  ),
});

export default function ParticipantMap(props: any) {
  return <ParticipantMapClient {...props} />;
}
