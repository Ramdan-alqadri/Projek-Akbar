// app.js
// Logika utama: scan QR → cari di database → tampilkan data

// ── STATE ──────────────────────────────────────────────────
let scanner = null;
let scannerAktif = false;

// ── INISIALISASI ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  tampilkanPanel("panel-idle");
  document.getElementById("btn-scan").addEventListener("click", mulaiScan);
  document.getElementById("btn-stop").addEventListener("click", stopScan);
  document.getElementById("btn-reset").addEventListener("click", reset);
  document.getElementById("btn-input-manual").addEventListener("click", inputManual);
  document.getElementById("btn-cari-manual").addEventListener("click", cariManual);
  document.getElementById("input-id").addEventListener("keypress", (e) => {
    if (e.key === "Enter") cariManual();
  });
});

// ── PANEL MANAGER ──────────────────────────────────────────
function tampilkanPanel(panelId) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("aktif"));
  document.getElementById(panelId)?.classList.add("aktif");
}

// ── SCANNER QR ─────────────────────────────────────────────
function mulaiScan() {
  tampilkanPanel("panel-scanner");
  scannerAktif = true;

  scanner = new Html5Qrcode("qr-reader");
  const config = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0
  };

  scanner.start(
    { facingMode: "environment" },   // kamera belakang
    config,
    onScanBerhasil,
    onScanError
  ).catch((err) => {
    // Kalau kamera belakang gagal, coba kamera depan
    scanner.start(
      { facingMode: "user" },
      config,
      onScanBerhasil,
      onScanError
    ).catch(() => {
      tampilkanNotifikasi("❌ Tidak bisa mengakses kamera. Gunakan input manual.", "error");
      tampilkanPanel("panel-idle");
    });
  });
}

function stopScan() {
  if (scanner && scannerAktif) {
    scanner.stop().then(() => {
      scannerAktif = false;
      tampilkanPanel("panel-idle");
    });
  }
}

// ── HANDLER HASIL SCAN ─────────────────────────────────────
function onScanBerhasil(teks) {
  // Hentikan scanner setelah dapat hasil
  if (scanner && scannerAktif) {
    scanner.stop().then(() => {
      scannerAktif = false;
      prosesID(teks.trim());
    });
  }
}

function onScanError(err) {
  // Abaikan error scan biasa (kamera mencari QR)
  // Hanya log kalau debug diperlukan
}

// ── INPUT MANUAL ───────────────────────────────────────────
function inputManual() {
  tampilkanPanel("panel-manual");
  document.getElementById("input-id").focus();
}

function cariManual() {
  const id = document.getElementById("input-id").value.trim();
  if (!id) {
    tampilkanNotifikasi("⚠️ Masukkan ID KER terlebih dahulu.", "warning");
    return;
  }
  prosesID(id);
}

// ── PROSES ID (INTI SISTEM) ────────────────────────────────
function prosesID(id) {
  tampilkanPanel("panel-loading");

  // Simulasi delay jaringan (200ms) → di sistem nyata: fetch ke API
  setTimeout(() => {
    const pengguna = cariPengguna(id);  // fungsi dari database.js

    if (!pengguna) {
      tampilkanPanel("panel-idle");
      tampilkanNotifikasi(`❌ ID "${id}" tidak ditemukan dalam sistem.`, "error");
      return;
    }

    tampilkanHasilData(pengguna);
  }, 800);
}

// ── TAMPILKAN DATA ─────────────────────────────────────────
function tampilkanHasilData(data) {
  const kuotaSisa = data.kuotaBulanan - data.kuotaTerpakai;
  const persenTerpakai = data.kuotaBulanan > 0
    ? Math.round((data.kuotaTerpakai / data.kuotaBulanan) * 100)
    : 0;

  // Tentukan status & warna
  let statusLabel, statusKelas, izinLabel, izinKelas;

  if (!data.subsidiAktif) {
    statusLabel = "TIDAK BERHAK SUBSIDI";
    statusKelas = "status-ditolak";
    izinLabel = "🚫 TRANSAKSI DITOLAK";
    izinKelas = "izin-ditolak";
  } else if (kuotaSisa <= 0) {
    statusLabel = "KUOTA HABIS";
    statusKelas = "status-habis";
    izinLabel = "⛔ KUOTA BULAN INI HABIS";
    izinKelas = "izin-ditolak";
  } else {
    statusLabel = "AKTIF - BERHAK SUBSIDI";
    statusKelas = "status-aktif";
    izinLabel = `✅ IZINKAN TRANSAKSI (Sisa ${kuotaSisa}L)`;
    izinKelas = "izin-diizinkan";
  }

  // Buat HTML kendaraan
  const kendaraanHTML = data.kendaraan.map(k =>
    `<div class="kendaraan-item">
      <span class="plat">${k.plat}</span>
      <span class="detail-kendaraan">${k.jenis} ${k.cc}cc</span>
    </div>`
  ).join("");

  // Isi konten panel hasil
  document.getElementById("hasil-konten").innerHTML = `
    <div class="profil-header">
      <img src="${data.fotoUrl}" alt="Foto" class="foto-pengguna" onerror="this.src='https://i.pravatar.cc/150?img=1'">
      <div class="profil-info">
        <div class="nama">${data.nama}</div>
        <div class="nik">NIK: ${data.nik}</div>
        <div class="alamat">${data.alamat}</div>
        <span class="status-badge ${statusKelas}">${statusLabel}</span>
      </div>
    </div>

    <div class="kartu-id">ID KER: ${data.id}</div>

    <div class="bagian">
      <div class="bagian-judul">🚗 Kendaraan Terdaftar</div>
      <div class="kendaraan-list">${kendaraanHTML}</div>
    </div>

    <div class="bagian">
      <div class="bagian-judul">⛽ Kuota BBM Bulan Ini</div>
      <div class="kuota-bar-wrap">
        <div class="kuota-bar-bg">
          <div class="kuota-bar-fill ${persenTerpakai >= 100 ? 'penuh' : ''}"
               style="width: ${Math.min(persenTerpakai, 100)}%"></div>
        </div>
        <div class="kuota-angka">
          <span>${data.kuotaTerpakai}L terpakai</span>
          <span>${data.kuotaBulanan}L total</span>
        </div>
      </div>
    </div>

    <div class="izin-transaksi ${izinKelas}">
      ${izinLabel}
    </div>

    <div class="waktu-scan">
      📅 Dipindai: ${new Date().toLocaleString("id-ID")}
    </div>
  `;

  tampilkanPanel("panel-hasil");
}

// ── RESET ──────────────────────────────────────────────────
function reset() {
  document.getElementById("input-id").value = "";
  tampilkanPanel("panel-idle");
}

// ── NOTIFIKASI ─────────────────────────────────────────────
function tampilkanNotifikasi(pesan, tipe = "info") {
  const notif = document.getElementById("notifikasi");
  notif.textContent = pesan;
  notif.className = `notifikasi notif-${tipe} tampil`;

  setTimeout(() => {
    notif.classList.remove("tampil");
  }, 3500);
}
