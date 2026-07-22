# Website Pelatihan & Geospasial LPPNU Kabupaten Magelang

Platform web terintegrasi Lembaga Pengembangan Pertanian Nahdlatul Ulama (LPPNU) Kabupaten Magelang.

## Fitur Utama
- **Profil & Berita:** Informasi geospasial, statistik dampak pertanian, visi/misi, struktur pengurus, dan artikel berita.
- **Mapping Peserta:** Peta marker interaktif sebaran peserta tani dengan filter kecamatan, komoditas, dan status keanggotaan.
- **Pemetaan Lahan GIS:** Peta multi-layer (*Streets, Satelit GPS, Topografi*), parser KML/GeoJSON, dan simulator polygon manual.
- **Donasi Hijau:** Bar progres donasi, rekening transfer bank, dan form upload bukti transfer.
- **Dashboard Admin:** Area terproteksi untuk CRUD berita, peserta, polygon GIS, dan verifikasi bukti donasi.

## Tech Stack
- **Framework:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Database:** MySQL (XAMPP / Local) via Prisma ORM (UUID enabled)
- **GIS Engine:** Leaflet JS & `@tmcw/togeojson`

## Cara Jalankan Lokal
1. Pastikan **XAMPP Control Panel** running (Apache & MySQL).
2. Buat database `pelatihan_lppnu` di phpMyAdmin (`http://localhost/phpmyadmin`).
3. Setup `.env`: `DATABASE_URL="mysql://root:@localhost:3306/pelatihan_lppnu"`
4. Push database & seed:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
5. Jalankan server dev:
   ```bash
   npm run dev
   ```
