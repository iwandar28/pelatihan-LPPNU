import dynamic from "next/dynamic";

const DraggableMapClient = dynamic(() => import("./DraggableMapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 text-sm font-medium">
      Memuat Peta Interaktif...
    </div>
  ),
});

export default DraggableMapClient;
