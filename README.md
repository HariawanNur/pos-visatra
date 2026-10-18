# VISTARA OMNI-POS (Universal Multi-Industry Point of Sale)

> **Dikembangkan oleh:** **PT VISTARA TEKNOLOGI INDONESIA**  
> **Versi:** 2.5.0-PRO  
> **Arsitektur:** Clean Layered Architecture (Domain-Driven, Decoupled, Moduler & Extensible)

---

## 🌟 Tentang VISTARA OMNI-POS

**VISTARA OMNI-POS** adalah sistem Point of Sale (Kasir & Manajemen Bisnis) modern yang dirancang khusus untuk memenuhi kebutuhan operasional **seluruh kalangan dan model bisnis** dalam satu platform terpadu.

Banyak sistem POS di pasaran hanya dibuat untuk satu tipe usaha (misal hanya kasir toko ritel atau hanya resto). VISTARA OMNI-POS menghadirkan **Universal Multi-Industry Engine** yang dapat menyesuaikan workflow dan fitur secara instan hanya dengan satu klik:

1. **Retail & Minimarket**
   - Integrasi barcode scanner cepat (input buffer auto-focus).
   - Pengelompokan SKU, pelacakan stok minimum, dan kalkulator uang kembalian cepat.
2. **Resto, Cafe & Coffee Shop (F&B)**
   - Denah meja visual (*Interactive Table Map*) untuk area Indoor, VIP, dan Outdoor.
   - Pilihan pesanan: *Dine-In*, *Take Away*, dan *Delivery*.
   - Kustomisasi pesanan (*Modifiers*): Tingkat kemanisan (*Sugar Level*), *Extra Toppings*, tingkat kepedasan, dan catatan khusus dapur/barista.
   - Pemisahan struk dan tiket dapur (*Kitchen Order Ticket*).
3. **Jasa & Treatment (Barbershop, Salon & Bengkel)**
   - Penetapan petugas/kapster/teknisi per item pesanan.
   - Perhitungan komisi petugas otomatis secara realtime.
   - Manajemen durasi layanan.
4. **Grosir, Distributor & B2B (Volume Tier Pricing)**
   - Harga bertingkat dinamis (*Wholesale Price Tiers*): Harga otomatis turun saat quantity pembelian mencapai batas tier (misal eceran Rp 58.000, 10+ pcs Rp 53.000, 50+ pcs Rp 50.500).
   - Dukungan pembayaran **Tempo / Kasbon (Piutang Usaha)** dengan batas plafon kredit (*Credit Limit*) dan pencatatan riwayat pelunasan hutang pelanggan.
5. **Universal / Hybrid Mode**
   - Menggabungkan seluruh kapabilitas di atas secara berdampingan (contoh: Cafe yang juga menjual merchandise biji kopi eceran, atau Car Wash yang menyediakan cuci hidrolik sekaligus mini cafe dan sparepart).

---

## 🏛️ Arsitektur Bersih (Clean Architecture)

Proyek ini dibangun dengan memisahkan kode ke dalam layer-layer yang bersih dan saling lepas (*decoupled*):

```
vistara-pos/
├── src/
│   ├── core/                        # 1. DOMAIN LAYER (Pure TypeScript, Zero Framework Coupling)
│   │   ├── entities/                # Model bisnis inti: Product, Order, Customer, Table, Staff, Shift, BusinessConfig
│   │   ├── types/                   # IndustryMode, PaymentMethod, DineType, TableStatus
│   │   └── value-objects/           # Formatting, Validations
│   │
│   ├── application/                 # 2. USE CASES & SERVICES (Business Logic Orchestration)
│   │   ├── use-cases/               # cart-calculator (tier pricing & modifier), checkout-manager (cash, QRIS, kasbon)
│   │   └── services/                # formatters (Rupiah, WIB Date)
│   │
│   ├── infrastructure/              # 3. INFRASTRUCTURE & DATA ACCESS LAYER
│   │   └── repositories/            # Mock dataset terintegrasi, offline resilience ready
│   │
│   ├── presentation/                # 4. PRESENTATION & UI LAYER (Next.js 16 + Tailwind 4 + Zustand)
│   │   ├── components/
│   │   │   ├── cashier/             # CashierHeader, ProductGrid, CartPanel, PaymentModal, ThermalReceiptModal, ShiftModal, dll.
│   │   │   └── backoffice/          # DashboardStats, ProductsTable, OrdersTable, CustomerKasbon, Settings
│   │   ├── hooks/                   # useCashierShortcuts (F1-F12), barcode listener
│   │   └── store/                   # Zustand state stores (pos-store, business-store)
│   │
│   └── app/                         # NEXT.JS APP ROUTER
│       ├── (pos)/page.tsx           # Terminal Kasir POS Fullscreen (High Performance)
│       ├── dashboard/               # Backoffice Admin Management
│       │   ├── page.tsx             # Metrik Eksekutif & Ringkasan Penjualan
│       │   ├── products/page.tsx    # Manajemen Produk & Stok
│       │   ├── orders/page.tsx      # Riwayat Transaksi & Cetak Ulang Struk
│       │   ├── customers/page.tsx   # Data Pelanggan & Pelunasan Kasbon
│       │   └── settings/page.tsx    # Profil PT Vistara & Konfigurasi Pajak (PPN)
│       ├── globals.css              # Styling modern + Thermal receipt print engine (58mm/80mm)
│       └── layout.tsx
```

### Keunggulan Arsitektur:
- **Mudah Di-maintain:** Perubahan logika bisnis (misal cara hitung pajak atau komisi) hanya dilakukan di `src/application`, tanpa mengutak-atik tampilan UI.
- **Testable:** Lapisan domain dan use-cases tidak memiliki ketergantungan ke UI atau browser DOM.
- **Offline Resilience:** State disimpan secara reaktif menggunakan Zustand dan dapat dengan mudah disambungkan ke IndexedDB atau SQLite/Prisma kapan saja.

---

## 🚀 Panduan Memulai (Quickstart)

### 1. Menjalankan Server Development
Buka PowerShell atau terminal di folder proyek:
```bash
cd "D:\awang\Project Awang\vistara-pos"
pnpm dev
```
Buka browser di: **`http://localhost:3000`**

### 2. Membangun untuk Produksi (Production Build)
```bash
pnpm build
pnpm start
```

---

## ⌨️ Shortcut Keyboard Kasir (Cashier Pro Mode)

Untuk kecepatan transaksi kasir tanpa mouse:
- **`F1`**: Langsung fokus ke kolom pencarian produk / barcode scanner.
- **`F2`**: Buka modal pembayaran tagihan (*Checkout*).
- **`F4`**: Buka denah meja (*Resto Table Map*).
- **`F8`**: Buka pencarian pelanggan & informasi plafon kasbon.
- **`Esc`**: Tutup modal aktif atau batalkan pesanan.
- **`Enter`**: Konfirmasi pembayaran saat di dalam modal bayar.

---

## 🧾 Format Struk Termal & Cetak (Printing)

Struk termal telah dikonfigurasi dengan standar CSS `@media print` sehingga kompatibel langsung dengan printer mini thermal kasir (58mm dan 80mm):
- Logo & Legalitas Resmi: **PT VISTARA TEKNOLOGI INDONESIA**
- Nomor Invoice otomatis (`VIS-YYMMDD-XXXX`)
- Rincian item, varian/modifier, petugas/kapster, PPN, dan kembalian tunai.
- Pesan terima kasih dan barcode verifikasi.

---

## 🏢 Kepemilikan & Hak Cipta

Aplikasi dan arsitektur ini dikembangkan secara eksklusif untuk:  
**PT VISTARA TEKNOLOGI INDONESIA**  
*Enterprise Point of Sale & Omnichannel Business Solutions*
