"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LandMapViewerClient = dynamic(() => import("./LandMapViewerClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-2xl bg-emerald-950/5 border border-emerald-200 flex flex-col items-center justify-center gap-3 text-emerald-800 animate-pulse">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      <span className="text-sm font-semibold">Memuat Peta Pemetaan Lahan GIS Multi-Layer...</span>
    </div>
  ),
});

export default function LandMapViewer(props: any) {
  return <LandMapViewerClient {...props} />;
}
