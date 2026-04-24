// database.js
// Simulasi database pengguna Kartu Energi Rakyat (KER)
// Di sistem nyata, ini datanya diambil dari server via API

const DATABASE_KER = {
  "KER-001-3271": {
    id: "KER-001-3271",
    nama: "Budi Santoso",
    nik: "3271010101800001",
    alamat: "Jl. Mawar No. 12, Bandung",
    statusSosial: "DTKS",         // Penerima bantuan sosial
    kendaraan: [
      { plat: "D 1234 AB", jenis: "Motor", cc: 110 },
    ],
    subsidiAktif: true,
    kuotaBulanan: 20,             // liter/bulan
    kuotaTerpakai: 8,             // liter sudah terpakai bulan ini
    fotoUrl: "https://i.pravatar.cc/150?img=3"
  },
  "KER-002-3273": {
    id: "KER-002-3273",
    nama: "Siti Rahayu",
    nik: "3273020202850002",
    alamat: "Jl. Melati No. 5, Cimahi",
    statusSosial: "DTKS",
    kendaraan: [
      { plat: "D 5678 CD", jenis: "Motor", cc: 125 },
      { plat: "D 9999 EF", jenis: "Mobil", cc: 1000 },
    ],
    subsidiAktif: true,
    kuotaBulanan: 40,
    kuotaTerpakai: 40,            // kuota habis
    fotoUrl: "https://i.pravatar.cc/150?img=5"
  },
  "KER-003-3275": {
    id: "KER-003-3275",
    nama: "Ahmad Fauzi",
    nik: "3275030303900003",
    alamat: "Jl. Kenanga No. 99, Bekasi",
    statusSosial: "Non-DTKS",
    kendaraan: [
      { plat: "B 4321 GH", jenis: "Mobil", cc: 2000 },
    ],
    subsidiAktif: false,          // tidak berhak subsidi
    kuotaBulanan: 0,
    kuotaTerpakai: 0,
    fotoUrl: "https://i.pravatar.cc/150?img=8"
  },
  "KER-004-7371": {
    id: "KER-004-7371",
    nama: "Dewi Lestari",
    nik: "7371040404950004",
    alamat: "Jl. Anggrek No. 7, Makassar",
    statusSosial: "DTKS",
    kendaraan: [
      { plat: "DD 1111 IJ", jenis: "Motor", cc: 110 },
    ],
    subsidiAktif: true,
    kuotaBulanan: 20,
    kuotaTerpakai: 5,
    fotoUrl: "https://i.pravatar.cc/150?img=9"
  }
};

// Fungsi untuk mencari pengguna berdasarkan ID dari QR
function cariPengguna(idKer) {
  return DATABASE_KER[idKer] || null;
}
