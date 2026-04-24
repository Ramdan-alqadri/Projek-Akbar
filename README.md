# 🛢️ KER — Kartu Energi Rakyat
## Sistem Verifikasi Subsidi BBM

---

## 📁 Struktur File

```
ker-system/
├── index.html      ← Halaman utama + panel-panel UI
├── style.css       ← Tampilan (dark theme, responsif)
├── app.js          ← Logika scan QR + tampil data
├── database.js     ← Simulasi database pengguna
└── README.md       ← Panduan ini
```

---

## 🚀 Cara Menjalankan

**Cara 1 — Pakai VS Code (paling mudah):**
1. Buka folder `ker-system` di VS Code
2. Install ekstensi **Live Server**
3. Klik kanan `index.html` → **Open with Live Server**
4. Browser terbuka otomatis di `http://127.0.0.1:5500`

**Cara 2 — Pakai Python:**
```bash
cd ker-system
python -m http.server 8000
# Buka browser: http://localhost:8000
```

> ⚠️ **Jangan buka langsung sebagai file!** (file://)
> Kamera tidak akan bekerja tanpa HTTP server karena alasan keamanan browser.

---

## 🧪 Data Uji Coba

| ID KER | Nama | Status |
|--------|------|--------|
| KER-001-3271 | Budi Santoso | ✅ Aktif, kuota tersedia |
| KER-002-3273 | Siti Rahayu | ⛽ Kuota habis |
| KER-003-3275 | Ahmad Fauzi | 🚫 Tidak berhak subsidi |
| KER-004-7371 | Dewi Lestari | ✅ Aktif, kuota tersedia |

---

## 🧠 Cara Kerja (Flow)

```
Petugas scan QR
      ↓
Web baca teks dari QR
      ↓
Ambil ID dari teks QR
      ↓
Cari ID di database.js  ←→  (di sistem nyata: fetch API ke server)
      ↓
Ambil data pengguna:
  - Nama, NIK, alamat
  - Kendaraan terdaftar
  - Status subsidi
  - Sisa kuota
      ↓
Tampilkan di layar
+ Izinkan / Tolak transaksi
```

---

## 🔧 Cara Generate QR Code untuk Kartu Fisik

Gunakan situs: https://qrcode-monkey.com atau https://goqr.me
- Isi konten QR dengan ID KER, contoh: `KER-001-3271`
- Download gambar QR
- Cetak di kartu fisik

---

## 📡 Pengembangan Selanjutnya

Untuk sistem nyata, ganti bagian `database.js` + logika `cariPengguna()` dengan:

```javascript
// Contoh: fetch ke API backend
async function cariPengguna(id) {
  const res = await fetch(`https://api-ker.go.id/pengguna/${id}`);
  if (!res.ok) return null;
  return await res.json();
}
```

Backend bisa dibangun dengan:
- **Node.js + Express** (JavaScript)
- **Python + FastAPI** (Python)
- Database: PostgreSQL / MySQL

---

## 📄 Lisensi
Proyek edukasi — bebas digunakan dan dikembangkan.
