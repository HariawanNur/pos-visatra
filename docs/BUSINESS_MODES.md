# Panduan Penggunaan Mode Bisnis (Multi-Industry Guide)

Sistem **VISTARA OMNI-POS** oleh **PT VISTARA TEKNOLOGI INDONESIA** dirancang untuk bekerja fleksibel pada berbagai jenis usaha di Indonesia. Berikut adalah penjelasan alur kerja (*workflow*) untuk masing-masing model bisnis.

---

## 1. Mode Ritel & Minimarket (Retail Mode)
**Cocok untuk:** Toko kelontong, minimarket, toko sembako, toko busana/fashion, toko aksesoris.

### Fitur Utama:
- **Scan Barcode Cepat:** Arahkan kursor atau gunakan shortcut **`F1`** untuk langsung memindai barcode menggunakan scanner USB atau Bluetooth. Jika barcode cocok, item langsung masuk ke keranjang belanja.
- **Pencarian Cepat:** Pencarian cerdas berdasarkan nama produk atau kode SKU.
- **Peringatan Stok Minimum:** Indikator visual merah jika stok tersisa 5 atau kurang.
- **Kalkulator Kembalian Tunai:** Pilihan pecahan uang cepat (Uang Pas, 50rb, 100rb, 200rb, 500rb) dan kalkulasi otomatis uang kembalian pembeli.

---

## 2. Mode Resto, Cafe & Warung (F&B Mode)
**Cocok untuk:** Coffee shop, restoran keluarga, cafe & lounge, rumah makan padang, warteg modern, fast food.

### Fitur Utama:
- **Denah Meja Visual (Table Map):** Tekan tombol **Meja** atau shortcut **`F4`** untuk memilih nomor meja tamu (tersedia filter zona: *Indoor*, *Lantai 2 VIP*, *Outdoor Smoking*).
- **Tipe Pesanan:** Pilih apakah tamu ingin **Dine In** (Makan di tempat), **Take Away** (Bungkus), atau **Delivery**.
- **Kustomisasi Pesanan (Modifiers):**
  - Pemilihan tingkat kemanisan (*Normal Sugar*, *Less Sugar 50%*, *No Sugar*).
  - Pilihan ekstra topping (*Brown Sugar Boba*, *Extra Espresso Shot*, *Ganti Susu Oat*).
  - Pilihan tingkat kepedasan (*Tidak Pedas*, *Sedang*, *Pedas Gila*) dan pilihan jenis telur.
- **Catatan Dapur:** Kolom teks khusus untuk instruksi koki atau barista (contoh: "pisahkan es batu", "kuah dipisah").

---

## 3. Mode Jasa & Pelayanan (Service Mode)
**Cocok untuk:** Barbershop, salon kecantikan, spa & reflexology, tempat cuci mobil (car wash), bengkel servis motor/mobil, laundry kiloan.

### Fitur Utama:
- **Penetapan Petugas / Kapster / Teknisi:** Saat memilih layanan (misal: *Gentlemen Haircut* atau *Servis Motor*), sistem memunculkan jendela pemilihan petugas yang mengerjakan layanan tersebut.
- **Perhitungan Komisi Otomatis:** Sistem langsung menghitung estimasi komisi staf (misal 30% untuk kapster atau 35% untuk teknisi) secara otomatis dan tercatat pada shift kerja harian.
- **Durasi Layanan:** Menampilkan estimasi waktu pengerjaan untuk pengaturan antrean pelanggan.

---

## 4. Mode Grosir & Distributor (Wholesale / B2B Mode)
**Cocok untuk:** Agen sembako grosir, toko bahan bangunan, distributor makanan ringan, supplier resto.

### Fitur Utama:
- **Harga Bertingkat (Tier Pricing):**
  - Harga unit secara otomatis turun ketika jumlah item mencapai jumlah tertentu:
    - Contoh Telur Ayam Fresh:
      - 1 - 9 tray: `Rp 58.000` / tray
      - 10 - 49 tray: `Rp 53.000` / tray
      - 50+ tray: `Rp 50.500` / tray
- **Pembayaran Tempo / Kasbon (Hutang Usaha):**
  - Khusus pelanggan mitra grosir yang terdaftar.
  - Sistem memeriksa **Plafon Kredit (Credit Limit)** dan **Sisa Hutang Berjalan**. Jika total tagihan baru melebihi limit kredit, kasir akan menerima peringatan otomatis untuk mencegah piutang macet.
  - Terdapat menu khusus **Pelunasan Kasbon** di dashboard admin untuk mencatat saat pelanggan mencicil atau melunasi hutangnya.

---

## 5. Mode Universal / Hybrid (All-in-One)
Disediakan untuk bisnis modern yang memiliki berbagai lini pendapatan sekaligus, misalnya restoran yang menjual kopi kemasan eceran dan merchandise, atau bengkel yang memiliki cafe mini di ruang tunggu. Kasir tidak perlu mengganti aplikasi, seluruh item dapat ditransaksikan dalam satu nota struk yang sama.
