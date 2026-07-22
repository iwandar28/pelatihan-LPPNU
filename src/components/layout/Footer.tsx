import Link from "next/link";
import { Sprout, MapPin, Phone, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg text-white">LPPNU Magelang</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lembaga Pengembangan Pertanian Nahdlatul Ulama Kabupaten Magelang. Membangun kedaulatan pangan dan pemberdayaan petani berbasis Geospasial.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Navigasi Utama</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Beranda & Profil</Link></li>
              <li><Link href="/mapping-peserta" className="hover:text-emerald-400 transition-colors">Mapping Peserta</Link></li>
              <li><Link href="/pemetaan-lahan" className="hover:text-emerald-400 transition-colors">Pemetaan Lahan GIS</Link></li>
              <li><Link href="/berita" className="hover:text-emerald-400 transition-colors">Berita Terkini</Link></li>
              <li><Link href="/donasi" className="hover:text-emerald-400 transition-colors">Donasi Hijau</Link></li>
            </ul>
          </div>

          {/* GIS Coverage */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Cakupan Geospasial</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Kawasan Lereng Merapi (Muntilan, Dukun)</li>
              <li>• Kawasan Lereng Merbabu (Sawangan, Pakis)</li>
              <li>• Kawasan Lereng Sumbing (Kaliangkrik, Windusari)</li>
              <li>• Kawasan Borobudur & Candimulyo</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Kontak Sekretariat</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Gedung PCNU Kab. Magelang, Jl. Magelang - Jogja Km 11, Muntilan.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>info@lppnumagelang.org</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PC LPPNU Kabupaten Magelang. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Dikelola dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> untuk Petani Magelang.
          </p>
        </div>
      </div>
    </footer>
  );
}
