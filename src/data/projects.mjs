export const companyProjects = [
  { slug: 'resort-kai-padalarang', name: 'Resort KAI Padalarang', location: 'Bandung Barat', image: 'resort-kai-padalarang.webp' },
  { slug: 'rumah-tinggal-cilegon-park', name: 'Rumah Tinggal 2 Lantai Cilegon Park', location: 'Cilegon', image: 'rumah-cilegon-park.webp' },
  { slug: 'asrama-polisi-sepolwan', name: 'Asrama Polisi Sepolwan', location: 'Jakarta Selatan', image: 'asrama-polisi-sepolwan.webp' },
  { slug: 'klinik-orthopedi-articular', name: 'Klinik Orthopedi Articular', location: 'Jakarta', image: 'klinik-orthopedi-articular.webp' },
  { slug: 'perluasan-kantor-wisma-ratu', name: 'Perluasan Kantor Wisma Ratu', location: 'Bekasi', image: 'kantor-wisma-ratu.webp' },
  { slug: 'renovasi-klinik-apotik-jatimakmur', name: 'Klinik & Apotik Jatimakmur', location: 'Bekasi', image: 'klinik-jatimakmur.webp' },
  { slug: 'kolam-renang-militer-tirto-sagoro', name: 'KSO Kolam Renang Militer Tirto Sagoro-05', location: 'Makassar', image: 'kolam-tirto-sagoro.webp' },
  { slug: 'water-treatment-plant-katapop', name: 'KSO Water Treatment Plant 3 Katapop', location: 'Sorong', image: 'wtp-katapop.webp' },
  { slug: 'renovasi-kantor-ojk-pekanbaru', name: 'Renovasi Kantor OJK', location: 'Pekanbaru', image: 'kantor-ojk-pekanbaru.webp' },
  { slug: 'sistem-parkir-rs-paru-salatiga', name: 'Sistem Parkir RS Paru', location: 'Salatiga', image: 'parkir-rs-paru-salatiga.webp' },
];

export const featuredProjects = companyProjects.filter(({ slug }) => [
  'resort-kai-padalarang',
  'asrama-polisi-sepolwan',
  'klinik-orthopedi-articular',
  'kolam-renang-militer-tirto-sagoro',
  'water-treatment-plant-katapop',
].includes(slug));

export const buildingReferences = [
  ['Kinanti Residence 4, Rusun Tenaga Pendidik UGM', 'Sleman, DI Yogyakarta', '6 lantai', '2022–2023', 'kinanti-residence-4-ugm.webp'],
  ['Gedung Induk Siti Walidah UMS', 'Sukoharjo, Jawa Tengah', '7 lantai', '2014–2016', 'gedung-induk-siti-walidah-ums.webp'],
  ['Gedung Jenderal Sudirman UMKT', 'Samarinda, Kalimantan Timur', '7 lantai', '2022–2023', 'gedung-jenderal-sudirman-umkt.webp'],
  ['Gedung LATERIO BRIN', 'Ancol, Jakarta Utara', '8 lantai', '2020–2022', 'gedung-laterio-brin.webp'],
  ['Gedung Rawat Inap Baru RSUD Banten', 'Kota Serang, Banten', '8 lantai', '2018–2020', 'rawat-inap-rsud-banten.webp'],
  ['Gedung Rektorat Unpas, Kampus II', 'Kota Bandung, Jawa Barat', '8 lantai', '2019–2021', 'rektorat-unpas.webp'],
  ['Gedung Utama UNU Yogyakarta', 'Sleman, DI Yogyakarta', '9 lantai', '2021–2023', 'gedung-utama-unu-yogyakarta.webp'],
  ['SMAMDA Tower', 'Surabaya, Jawa Timur', '9 lantai', '2018–2020', 'smamda-tower.webp'],
  ['Gedung Keuangan Negara Jayapura', 'Jayapura, Papua', '10 lantai', '2018–2021', 'gedung-keuangan-negara-jayapura.webp'],
  ['Gedung Utama Kampus 4 UAD', 'Bantul, DI Yogyakarta', '10 lantai', '2016–2018', 'kampus-4-uad.webp'],
  ['Landmark BSI Aceh', 'Banda Aceh, Aceh', '10 lantai', '2022–2024', 'landmark-bsi-aceh.webp'],
  ['UMP Tower KH A.R. Fachruddin', 'Banyumas, Jawa Tengah', '10 lantai', '2018–2021', 'ump-tower.webp'],
  ['Gedung Prof. Roosseno / SGLC FT UGM', 'Sleman, DI Yogyakarta', '11 lantai', '2020–2023', 'sglc-ft-ugm.webp'],
  ['Gedung Research Center ITS', 'Surabaya, Jawa Timur', '11 lantai', '2017–2019', 'research-center-its.webp'],
  ['UNS Tower Ki Hadjar Dewantara', 'Surakarta, Jawa Tengah', '11 lantai', '2019–2022', 'uns-tower.webp'],
  ['RS Kemenkes Makassar', 'Makassar, Sulawesi Selatan', '12 lantai', '2021–2024', 'rs-kemenkes-makassar.webp'],
  ['At-Tauhid Tower, Universitas Muhammadiyah Surabaya', 'Surabaya, Jawa Timur', '13 lantai', '2016–2018', 'at-tauhid-tower-umsurabaya.webp'],
  ['Pusat Pembelajaran Arntz-Geise 2 UNPAR', 'Bandung, Jawa Barat', '14 lantai', '2017–2021', 'arntz-geise-2-unpar.webp'],
  ['Gedung Utama Kementerian PU', 'Jakarta Selatan', '17 lantai', '2010–2014', 'gedung-utama-kementerian-pu.webp'],
  ['Menara Phinisi UNM', 'Makassar, Sulawesi Selatan', '17 lantai', '2013–2016', 'menara-phinisi-unm.webp'],
].map(([name, location, floors, period, image]) => ({ name, location, floors, period, image }));
