import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding for LPPNU Magelang...");

  // 1. Seed Admin User
  const hashedPassword = await bcrypt.hash("admin", 10);
  const admin = await prisma.user.upsert({
    where: { email: "[EMAIL_ADDRESS]" },
    update: {
      password: hashedPassword,
      name: "admin",
    },
    create: {
      name: "admin",
      email: "[EMAIL_ADDRESS]",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // 2. Seed Profile Statistics & Info
  const profileStat = await prisma.profileStatistic.upsert({
    where: { id: 1 },
    update: {
      shortInfoGis:
        "Lembaga Pengembangan Pertanian Nahdlatul Ulama (LPPNU) Kabupaten Magelang memanfaatkan teknologi Geospasial (GIS) untuk memetakan potensi pertanian, lahan produktif, dan mendampingi para petani lokal di kawasan Merapi, Merbabu, dan Sumbing secara berkelanjutan.",
      totalLandAreaGis: 1245.8,
      totalTrainees: 485,
      totalTreesDonated: 15400,
      totalFarmerGroups: 42,
      vision:
        "Tercapainya Kedaulatan Pangan, Kesejahteraan Petani Nahdliyin, dan Kelestarian Lingkungan Berbasis Inovasi Pertanian & Teknologi Geospasial di Kabupaten Magelang.",
      mission:
        "1. Membangun basis data geospasial lahan dan sebaran petani binaan di Kabupaten Magelang.\n2. Melakukan pelatihan teknik budidaya pertanian organik dan ramah lingkungan.\n3. Menggerakkan program Donasi Hijau untuk konservasi tanah dan penanaman pohon produktif.\n4. Memperkuat jaringan pemasaran komoditas pertanian lokal unggulan.",
    },
    create: {
      id: 1,
      shortInfoGis:
        "Lembaga Pengembangan Pertanian Nahdlatul Ulama (LPPNU) Kabupaten Magelang memanfaatkan teknologi Geospasial (GIS) untuk memetakan potensi pertanian, lahan produktif, dan mendampingi para petani lokal di kawasan Merapi, Merbabu, dan Sumbing secara berkelanjutan.",
      totalLandAreaGis: 1245.8,
      totalTrainees: 485,
      totalTreesDonated: 15400,
      totalFarmerGroups: 42,
      vision:
        "Tercapainya Kedaulatan Pangan, Kesejahteraan Petani Nahdliyin, dan Kelestarian Lingkungan Berbasis Inovasi Pertanian & Teknologi Geospasial di Kabupaten Magelang.",
      mission:
        "1. Membangun basis data geospasial lahan dan sebaran petani binaan di Kabupaten Magelang.\n2. Melakukan pelatihan teknik budidaya pertanian organik dan ramah lingkungan.\n3. Menggerakkan program Donasi Hijau untuk konservasi tanah dan penanaman pohon produktif.\n4. Memperkuat jaringan pemasaran komoditas pertanian lokal unggulan.",
    },
  });
  console.log("✅ Profile statistic updated.");

  // 3. Seed Board Members
  await prisma.boardMember.deleteMany({});
  await prisma.boardMember.createMany({
    data: [
      {
        name: "H. Ahmad Zaenal Abidin, S.P.",
        position: "Ketua PC LPPNU Kab. Magelang",
        photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
        orderIndex: 1,
      },
      {
        name: "Drs. Kyai H. Mahfudz Ridhwan",
        position: "Dewan Penasehat LPPNU",
        photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
        orderIndex: 2,
      },
      {
        name: "Nurul Hidayat, M.Sc.",
        position: "Koordinator Divisi Pemetaan GIS & Data",
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
        orderIndex: 3,
      },
      {
        name: "Siti Rahmawati, S.TP.",
        position: "Divisi Pelatihan & Pendampingan Tani",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
        orderIndex: 4,
      },
    ],
  });
  console.log("✅ Board members seeded.");

  // 4. Seed News
  await prisma.news.deleteMany({});
  await prisma.news.createMany({
    data: [
      {
        title: "Pelatihan Pemetaan GIS Lahan Pertanian Organik di Muntilan",
        content:
          "LPPNU Kabupaten Magelang menggelar pelatihan pemetaan geospasial bagi para ketua kelompok tani di Kecamatan Muntilan. Pelatihan ini bertujuan untuk mencatat polygon lahan produktif dan meningkatkan efisiensi pendistribusian pupuk organik binaan.",
        imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
        author: "Tim Media LPPNU",
        isPublished: true,
      },
      {
        title: "Penanaman 5.000 Bibit Pohon Alpukat Aligator di Lereng Merbabu",
        content:
          "Melalui program Donasi Hijau, LPPNU Magelang berhasil menyalurkan 5.000 bibit pohon alpukat aligator kepada kelompok tani binaan di Kecamatan Sawangan dan Pakis. Penanaman ini bertujuan untuk mencegah erosi sekaligus meningkatkan pendapatan ekonomi warga.",
        imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1b7a5?w=800&auto=format&fit=crop&q=80",
        author: "Divisi Donasi Hijau",
        isPublished: true,
      },
      {
        title: "Panen Raya Padi Organik Varietas Unggul LPPNU di Borobudur",
        content:
          "Kelompok tani binaan LPPNU di sekitar kawasan Borobudur sukses menggelar panen raya padi organik. Hasil panen mengalami peningkatan produktivitas hingga 25% dibanding musim tanam sebelumnya berkat pendampingan teknologi hayati.",
        imageUrl: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=800&auto=format&fit=crop&q=80",
        author: "Divisi Pendampingan",
        isPublished: true,
      },
    ],
  });
  console.log("✅ News articles seeded.");

  // 5. Seed Participants (Farmers / Trainees across Magelang)
  await prisma.participant.deleteMany({});
  await prisma.participant.createMany({
    data: [
      {
        fullName: "Bambang Sugiyanto",
        district: "Muntilan",
        village: "Poboyo",
        commodity: "Padi Organik",
        membershipStatus: "ACTIVE",
        latitude: -7.5815,
        longitude: 110.2984,
        address: "Dusun Poboyo RT 02 RW 04, Muntilan",
        bioOrNotes: "Petani binaan aktif pembudidaya padi sawah organik.",
      },
      {
        fullName: "Slamet Riyadi",
        district: "Borobudur",
        village: "Wanurejo",
        commodity: "Hortikultura & Sayur",
        membershipStatus: "ACTIVE",
        latitude: -7.6082,
        longitude: 110.2185,
        address: "Dusun Wanurejo RT 01 RW 02, Borobudur",
        bioOrNotes: "Ketua Poktan Makmur Asri Wanurejo.",
      },
      {
        fullName: "Ir. H. Muhammad Sobri",
        district: "Sawangan",
        village: "Krogowanan",
        commodity: "Alpukat & Kopi",
        membershipStatus: "FIELD_COMPANION",
        latitude: -7.5342,
        longitude: 110.3541,
        address: "Desa Krogowanan, Sawangan",
        bioOrNotes: "Pendamping lapangan kawasan lereng Merbabu.",
      },
      {
        fullName: "Agus Prasetyo",
        district: "Kaliangkrik",
        village: "Mangli",
        commodity: "Sayuran Lereng Sumbing",
        membershipStatus: "ALUMNI",
        latitude: -7.4589,
        longitude: 110.1245,
        address: "Dusun Mangli, Kaliangkrik",
        bioOrNotes: "Alumni Pelatihan GIS Batch 2 tahun 2024.",
      },
      {
        fullName: "Sri Wahyuni",
        district: "Candimulyo",
        village: "Tegalsari",
        commodity: "Durian & Buah Lokal",
        membershipStatus: "ACTIVE",
        latitude: -7.4812,
        longitude: 110.2641,
        address: "Dusun Tegalsari RT 03, Candimulyo",
        bioOrNotes: "Pengembang budidaya durian lokal unggulan.",
      },
      {
        fullName: "Herman Yosef Dwi",
        district: "Dukun",
        village: "Sumber",
        commodity: "Cabai & Sayur Mayur",
        membershipStatus: "ACTIVE",
        latitude: -7.5492,
        longitude: 110.3341,
        address: "Desa Sumber, Kecamatan Dukun",
        bioOrNotes: "Kawasan rawan bencana Merapi dengan metode budidaya adaptif.",
      },
    ],
  });
  console.log("✅ Participants seeded.");

  // 6. Seed GIS Land Maps (GeoJSON Polygons for Magelang lands)
  await prisma.gisLandMap.deleteMany({});
  await prisma.gisLandMap.create({
    data: {
      ownerName: "Bapak Ahmad (Lahan Percontohan Padi Organik)",
      status: "MITRA",
      farmerGroup: "Poktan Subur Makmur",
      address: "Poboyo, Muntilan",
      areaHectares: 14.5,
      commodity: "Padi Organik",
      cultivator: "Anggota Poktan",
      inputType: "KML_UPLOAD",
      colorHex: "#22c55e",
      centerLat: -7.5815,
      centerLng: 110.2984,
      geoJsonData: JSON.stringify({
        type: "Feature",
        properties: { name: "Lahan Padi Organik Poboyo" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [110.296, -7.58],
              [110.301, -7.58],
              [110.301, -7.583],
              [110.296, -7.583],
              [110.296, -7.58],
            ],
          ],
        },
      }),
    },
  });

  await prisma.gisLandMap.create({
    data: {
      ownerName: "PCNU Magelang (Kawasan Konservasi & Kebun Buah Alpukat Merbabu)",
      status: "ASSET_PCNU",
      farmerGroup: "Poktan Tani Lestari",
      address: "Krogowanan, Sawangan",
      areaHectares: 28.2,
      commodity: "Alpukat & Kopi",
      cultivator: "Warga Sekitar",
      inputType: "KML_UPLOAD",
      colorHex: "#16a34a",
      centerLat: -7.5342,
      centerLng: 110.3541,
      geoJsonData: JSON.stringify({
        type: "Feature",
        properties: { name: "Kebun Buah Sawangan" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [110.35, -7.53],
              [110.358, -7.53],
              [110.358, -7.538],
              [110.35, -7.538],
              [110.35, -7.53],
            ],
          ],
        },
      }),
    },
  });
  console.log("✅ GIS Land Maps seeded.");

  // 7. Seed Donation Campaign & Default Transactions
  await prisma.donationCampaign.upsert({
    where: { id: 1 },
    update: {
      title: "Donasi Hijau: 10.000 Pohon untuk Petani & Konservasi Magelang",
      description:
        "Mari dukung gerakan hijau LPPNU Kab. Magelang melalui penanaman pohon produktif (Alpukat, Durian, Mangga) dan pendampingan pupuk organik bagi kelompok tani binaan.",
      targetAmount: 50000000.0,
      bankName: "Bank Syariah Indonesia (BSI)",
      bankAccount: "7123456789",
      accountHolder: "PC LPPNU KABUPATEN MAGELANG",
    },
    create: {
      id: 1,
      title: "Donasi Hijau: 10.000 Pohon untuk Petani & Konservasi Magelang",
      description:
        "Mari dukung gerakan hijau LPPNU Kab. Magelang melalui penanaman pohon produktif (Alpukat, Durian, Mangga) dan pendampingan pupuk organik bagi kelompok tani binaan.",
      targetAmount: 50000000.0,
      bankName: "Bank Syariah Indonesia (BSI)",
      bankAccount: "7123456789",
      accountHolder: "PC LPPNU KABUPATEN MAGELANG",
    },
  });

  await prisma.donationTransaction.deleteMany({});
  await prisma.donationTransaction.createMany({
    data: [
      {
        donorName: "H. Abdullah Munir",
        donorEmail: "abdullah.munir@gmail.com",
        donorPhone: "081234567890",
        amount: 2500000.0,
        proofImageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
        status: "APPROVED",
        adminNotes: "Bukti transfer sesuai. Terima kasih hamba Allah.",
      },
      {
        donorName: "Keluarga Besar Lazisnu Muntilan",
        donorEmail: "lazisnu.muntilan@nu.or.id",
        donorPhone: "085678901234",
        amount: 5000000.0,
        proofImageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
        status: "APPROVED",
        adminNotes: "Dana terkumpul untuk 500 bibit alpukat.",
      },
      {
        donorName: "Rizal Hamzah",
        donorEmail: "rizal.h@yahoo.com",
        donorPhone: "087890123456",
        amount: 500000.0,
        proofImageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
        status: "PENDING",
        adminNotes: "Menunggu pengecekan mutasi bank admin.",
      },
    ],
  });
  console.log("✅ Donation campaign & transactions seeded.");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
