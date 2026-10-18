# Arsitektur Bersih (Clean Architecture) - VISTARA POS

Dokumen ini menjelaskan prinsip rancangan dan arsitektur teknis yang diterapkan pada **VISTARA OMNI-POS** oleh **PT VISTARA TEKNOLOGI INDONESIA**.

---

## 1. Prinsip Desain (Core Principles)

Sistem POS ini dirancang dengan prinsip **Clean & Modular Hexagonal Architecture**:

1. **Separation of Concerns (SoC)**  
   Kode dipisahkan menjadi layer yang memiliki tanggung jawab tunggal. Lapisan dalam (*Core / Domain*) tidak boleh mengetahui detail lapisan luar (*Framework / UI / Next.js*).
   
2. **Dependency Rule**  
   Ketergantungan selalu mengarah ke dalam:
   - Presentation (UI) tergantung pada Application Use Cases & Store.
   - Application Use Cases tergantung pada Domain Entities.
   - Domain Entities murni tidak tergantung pada apapun di luar standar bahasa TypeScript.

3. **High Cohesion & Low Coupling**  
   Setiap modul industri (Retail, F&B, Jasa, Grosir) menggunakan model data yang seragam sehingga dapat dijalankan sendiri-sendiri atau dikombinasikan dalam mode Universal / Hybrid.

---

## 2. Struktur Layer & Penjelasan Folder

### Layer 1: Core / Domain Layer (`src/core/`)
Berisi entitas bisnis murni dan definisi tipe. Tidak ada library UI, React hooks, atau Next.js di folder ini.
- **`entities/product.ts`**: Model data produk dengan fleksibilitas mendukung *Wholesale Tiers*, *F&B Modifiers*, dan *Service Commission*.
- **`entities/order.ts`**: Model pesanan belanja, baris item, potongan harga, dan kalkulasi PPN.
- **`entities/customer.ts`**: Model pelanggan, poin loyalitas, serta plafon dan saldo kasbon / piutang usaha.
- **`entities/table.ts`**: Model denah meja restoran, kapasitas pengunjung, dan zona meja.
- **`entities/staff.ts`**: Model staf, kapster, atau teknisi beserta persentase komisi pendapatan.
- **`entities/shift.ts`**: Model pembukuan shift kasir (*cash drawer*), modal awal, dan rekonsiliasi selisih kas fisik.
- **`entities/business-config.ts`**: Profil legal **PT VISTARA TEKNOLOGI INDONESIA**, nama outlet, dan parameter operasional.

---

### Layer 2: Application / Use Cases Layer (`src/application/`)
Berisi aturan bisnis dan alur kerja aplikasi:
- **`use-cases/cart-calculator.ts`**:
  - `getEffectiveUnitPrice()`: Menghitung harga jual yang berlaku berdasarkan volume pembelian grosir secara otomatis.
  - `calculateCartTotals()`: Menghitung subtotal, diskon, service charge resto, dan PPN (11%).
- **`use-cases/checkout-manager.ts`**:
  - `processCheckout()`: Validasi penerimaan uang tunai (hitung kembalian), validasi kelayakan kasbon berdasarkan plafon limit kredit pelanggan, dan pembuatan nomor invoice unik dengan prefix `VIS-`.
- **`services/formatters.ts`**: Format standar mata uang Rupiah (`formatRupiah`) dan tanggal waktu Indonesia WIB (`formatIndoDateTime`).

---

### Layer 3: Infrastructure Layer (`src/infrastructure/`)
Berisi implementasi teknis untuk akses data dan perangkat keras:
- **`repositories/mock-data.ts`**: Data awal yang realistis untuk pasar Indonesia mencakup ritel sembako, menu resto & cafe, layanan barbershop & salon, serta grosir karungan.
- **Dukungan Ekspansi**: Dapat langsung disambungkan ke database PostgreSQL, SQLite via Prisma, atau Cloud API tanpa merusak layer domain.

---

### Layer 4: Presentation Layer (`src/presentation/`)
Menangani interaksi pengguna, komponen antarmuka, dan manajemen state reaktif:
- **`store/pos-store.ts`**: Zustand store untuk transaksi kasir realtime, keranjang belanja, denah meja, dan kasir aktif.
- **`store/business-store.ts`**: Zustand store untuk katalog produk, data pelanggan, riwayat invoice, dan pengaturan PT Vistara.
- **`components/cashier/`**:
  - `CashierHeader.tsx`: Tab switcher mode industri (Retail, F&B, Jasa, Grosir, Universal).
  - `ProductGrid.tsx`: Katalog produk interaktif dengan buffer scan barcode dan kategori.
  - `CartPanel.tsx`: Panel keranjang belanja cepat dengan kontrol quantity dan rincian tagihan.
  - `PaymentModal.tsx`: Modal pembayaran tunai, QRIS dinamis, kartu debit/EDC, dan tempo kasbon.
  - `ThermalReceiptModal.tsx`: Preview cetak struk termal standar 58mm/80mm berlogo PT Vistara Teknologi Indonesia.
  - `ShiftModal.tsx`: Buka dan tutup shift kasir dengan audit kas fisik.
- **`hooks/useCashierShortcuts.ts`**: Listener shortcut keyboard kasir profesional (`F1` s/d `F8`, `Esc`, `Enter`).

---

## 3. Cara Menambah Fitur Baru (Extension Guide)

### Contoh: Menambahkan Metode Pembayaran Baru (misal: Transfer Bank / VA)
1. Buka `src/core/types/industry.ts` dan tambahkan tipe metode bayar:
   ```ts
   export type PaymentMethod = ... | 'VIRTUAL_ACCOUNT';
   ```
2. Buka `src/presentation/components/cashier/PaymentModal.tsx` dan tambahkan tombol opsi VA serta input nomor referensi transfer.
3. Logika penyimpanan dan pencatatan struk di `src/presentation/components/cashier/ThermalReceiptModal.tsx` akan langsung mengenali metode baru secara otomatis.

---

## 4. Keamanan & Performa
- Seluruh komputasi harga dilakukan menggunakan integer Rupiah untuk mencegah floating-point rounding errors.
- Menggunakan CSS `@media print` murni sehingga proses cetak struk ke printer thermal tidak membutuhkan driver pihak ketiga yang berat.
