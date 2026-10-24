export interface Pillar {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  color: string;
  hookTag: string;
  lead: string;
  scope: string;
  highlights: string[];
  stats: { value: string; label: string };
  icon: string;
  details: string[];
}

export const PILLARS_DATA: Pillar[] = [
  {
    id: "01",
    num: "01",
    title: "Teknologi Informasi, IoT & Keamanan Siber",
    subtitle: "Enterprise Cybernetic & Connected Hardware",
    category: "Cyber & Digital",
    badge: "DIMENSI 01 • CYBERNETIC CORE",
    color: "#0ae3b0",
    hookTag: "CYBERNETIC & DEEP CLOUD",
    lead: "Merancang fondasi komputasi generasi masa depan melalui arsitektur komputasi awan, perangkat tertanam (IoT), dan pertahanan kedaulatan data tingkat tinggi.",
    scope: "Rekayasa perangkat lunak mutakhir, instrumentasi IoT cerdas, pertahanan siber terpadu, dan infrastruktur komputasi berdaya tahan ekstrem.",
    highlights: [
      "Cloud Architecture",
      "IoT Prototyping",
      "Cybersecurity Shield",
      "IT Hardware Procurement",
      "EduTech Academy"
    ],
    stats: { value: "99.98%", label: "Tingkat Ketersediaan & Keandalan Sistem" },
    icon: "lock_open",
    details: [
      "Pengembangan perangkat lunak berstandar mikroarsitektur dan high-concurrency.",
      "Sensor telemetry kustom & otomatisasi industri berbasis edge computing.",
      "Audit penetrasi berkala (VAPT) dan proteksi infrastruktur digital strategis."
    ]
  },
  {
    id: "02",
    num: "02",
    title: "Enjinering, Arsitektur & Konsultansi Bisnis",
    subtitle: "Spatial Engineering & Strategic Advisory",
    category: "Spasial & Strategi",
    badge: "DIMENSI 02 • SPATIAL & STRATEGY",
    color: "#9fcaff",
    hookTag: "PARAMETRIC ARCHITECTURE & ADVISORY",
    lead: "Sinergi antara presisi teknis rancang bangun dan ketajaman visi spasial guna melahirkan karya arsitektur ikonik, kawasan berkelanjutan, serta arah strategi yang transformatif.",
    scope: "Rancang bangun arsitektural parametrik, konsultansi teknis enjinering, akselerasi bisnis industri, masterplan pariwisata terpadu, dan periklanan naratif.",
    highlights: [
      "Architectural Blueprint",
      "Industrial Engineering",
      "Strategic Advisory",
      "Tourism Masterplan",
      "Creative Advertising"
    ],
    stats: { value: "35+", label: "Studi Desain & Advisory Selesai" },
    icon: "architecture",
    details: [
      "Desain arsitektur parametrik ramah lingkungan dan tata ruang terpadu.",
      "Kajian tekno-ekonomis industri & audit optimalisasi proses manufaktur.",
      "Kampanye branding naratif dan strategi penetrasi pasar komersial."
    ]
  },
  {
    id: "03",
    num: "03",
    title: "Perdagangan Besar & Agribisnis",
    subtitle: "Global Commodity & Cold Chain Distribution",
    category: "Komoditas & Agro",
    badge: "DIMENSI 03 • AGRI COLD-CHAIN",
    color: "#e2a96d",
    hookTag: "GLOBAL HARVEST & COLD-CHAIN",
    lead: "Menghubungkan kekayaan tanah nusantara langsung ke panggung internasional. Mengelola rantai dingin mutakhir untuk komoditas kopi, teh, kakao, hortikultura, hingga perbekalan agro-nutrisi bermutu tinggi.",
    scope: "Kurasi dan distribusi hasil bumi unggulan—kopi specialty, kakao, teh, beras, hortikultura, perbekalan agro, hingga tanaman hias bernilai tinggi.",
    highlights: [
      "Kopi & Kakao Komoditas",
      "Rantai Pasok Dingin",
      "Pupuk Agrokimia",
      "Agro-Eksportir",
      "Hortikultura & Peternakan"
    ],
    stats: { value: "1,200+", label: "Metrik Ton Distribusi Hasil Bumi / Thn" },
    icon: "agriculture",
    details: [
      "Sortasi biji kopi specialty & kakao fermentasi standar ekspor premium.",
      "Distribusi pupuk agrokimia ramah tanah serta bibit tanaman unggul.",
      "Sistem penyimpanan logistik dingin bersuhu terkelola untuk kesegaran maksimal."
    ]
  },
  {
    id: "04",
    num: "04",
    title: "Penyewaan, Logistik & Pemeliharaan Teknik",
    subtitle: "Fleet Management & Technical Maintenance",
    category: "Armada & Presisi",
    badge: "DIMENSI 04 • FLEET & PRECISION",
    color: "#5affcc",
    hookTag: "PRECISION FLEET & ENGINEERING CARE",
    lead: "Penyediaan armada komersial tangguh, aset multimedia produksi kelas sinema, manajemen fasilitas properti, hingga pemeliharaan sistem elektronika dan instrumentasi presisi tinggi.",
    scope: "Sewa armada mobilitas & logistik, perangkat multimedia broadcasting profesional, properti komersial, serta reparasi kelistrikan dan kalibrasi perangkat industri presisi.",
    highlights: [
      "Armada Angkutan",
      "Alat Multimedia",
      "Manajemen Properti",
      "Reparasi Elektrikal Presisi",
      "Hardware Lifecycle Care"
    ],
    stats: { value: "24/7", label: "Kesiapan Operasional & Respon Teknisi" },
    icon: "precision_manufacturing",
    details: [
      "Armada logistik terawat berkala dengan tracking real-time berbasis GPS.",
      "Rental rig kamera sinema, lighting studio, dan peranti server multimedia.",
      "Laboratorium kalibrasi dan perbaikan sirkuit elektronika daya presisi."
    ]
  }
];

export function filterPillars(tabId: string): Pillar[] {
  if (tabId === "ALL") return PILLARS_DATA;
  return PILLARS_DATA.filter(p => p.id === tabId);
}

export function getPillarById(id: string): Pillar | undefined {
  return PILLARS_DATA.find(p => p.id === id);
}

export function formatInquiryMailto(pillarTitle: string, clientName?: string, scopeNote?: string): string {
  const subject = `Inquiry Kolaborasi Solusi: ${pillarTitle}`;
  const body = `Halo Tim Kriya Studio,\n\nSaya ${clientName || "[Nama Anda/Perusahaan]"} tertarik untuk menjajaki sinergi pada ranah "${pillarTitle}".\n\nCatatan kebutuhan:\n${scopeNote || "- Diskusi studi kelayakan / penawaran teknis."}\n\nMohon informasi tindak lanjut dan jadwal sesi konsultasi awal.\n\nSalam,\n${clientName || "[Nama Pengirim]"}`;
  return `mailto:halo@kriya.my.id?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
