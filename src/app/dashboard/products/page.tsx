'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Tag,
  Boxes,
  Scissors,
  Coffee,
  Store,
  Layers,
  Trash2,
  Sparkles,
  Clock,
  Percent,
  Info,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useBusinessStore } from '../../../presentation/store/business-store';
import { Product, WholesaleTier } from '../../../core/entities/product';
import { formatRupiah } from '../../../application/services/formatters';

type IndustryType = 'RETAIL' | 'FNB' | 'SERVICE' | 'WHOLESALE';

interface IndustryPreset {
  mode: IndustryType;
  label: string;
  icon: typeof Store;
  badgeColor: string;
  defaultCategories: string[];
  defaultUnit: string;
  unitOptions: string[];
  skuPrefix: string;
  namePlaceholder: string;
  isService: boolean;
  defaultStock: number;
  defaultCost: number;
  defaultPrice: number;
}

const INDUSTRY_PRESETS: Record<IndustryType, IndustryPreset> = {
  SERVICE: {
    mode: 'SERVICE',
    label: 'Jasa & Barbershop',
    icon: Scissors,
    badgeColor: 'emerald',
    defaultCategories: ['Barbershop / Salon', 'Otomotif & Detailing', 'Bengkel', 'Perawatan & Spa'],
    defaultUnit: 'sesi',
    unitOptions: ['sesi', 'layanan', 'jam', 'orang', 'mobil', 'motor'],
    skuPrefix: 'SRV',
    namePlaceholder: 'Contoh: Gentlemen Haircut & Hot Towel / Cuci & Wax',
    isService: true,
    defaultStock: 999,
    defaultCost: 10000,
    defaultPrice: 65000,
  },
  FNB: {
    mode: 'FNB',
    label: 'Resto & Cafe (F&B)',
    icon: Coffee,
    badgeColor: 'amber',
    defaultCategories: ['Beverage & Coffee', 'Food & Meals', 'Bakery & Pastry', 'Snack & Dessert'],
    defaultUnit: 'cup',
    unitOptions: ['cup', 'porsi', 'gelas', 'plate', 'botol', 'pcs'],
    skuPrefix: 'FNB',
    namePlaceholder: 'Contoh: Iced Caramel Macchiato / Nasi Goreng Spesial',
    isService: false,
    defaultStock: 100,
    defaultCost: 8000,
    defaultPrice: 25000,
  },
  RETAIL: {
    mode: 'RETAIL',
    label: 'Ritel & Minimarket',
    icon: Store,
    badgeColor: 'blue',
    defaultCategories: ['Sembako', 'Makanan Instan', 'Minuman', 'Snack & Biskuit', 'Kebutuhan Rumah Tangga'],
    defaultUnit: 'pcs',
    unitOptions: ['pcs', 'botol', 'pouch', 'bungkus', 'sak', 'pack', 'dus'],
    skuPrefix: 'RET',
    namePlaceholder: 'Contoh: Minyak Goreng Bimoli 2L / Sabun Mandi 450ml',
    isService: false,
    defaultStock: 50,
    defaultCost: 7500,
    defaultPrice: 10000,
  },
  WHOLESALE: {
    mode: 'WHOLESALE',
    label: 'Grosir & Distributor',
    icon: Boxes,
    badgeColor: 'purple',
    defaultCategories: ['Grosir Sembako', 'Bahan Pokok Grosir', 'Distributor Makanan', 'Pakan & Ternak'],
    defaultUnit: 'karton',
    unitOptions: ['karton', 'dus', 'karung', 'peti', 'lusin', 'bal', 'kodi'],
    skuPrefix: 'WHS',
    namePlaceholder: 'Contoh: Beras Ramos 50kg / Telur Ayam 1 Peti',
    isService: false,
    defaultStock: 30,
    defaultCost: 45000,
    defaultPrice: 55000,
  },
};

export default function ProductsPage() {
  const { products, addProduct, deleteProduct } = useBusinessStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [targetIndustry, setTargetIndustry] = useState<IndustryType>('RETAIL');
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('Sembako');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState('');
  const [basePrice, setBasePrice] = useState<number>(10000);
  const [costPrice, setCostPrice] = useState<number>(7500);
  const [stock, setStock] = useState<number>(50);
  const [unit, setUnit] = useState('pcs');
  const [isService, setIsService] = useState(false);
  const [commissionPercentage, setCommissionPercentage] = useState<number>(30);
  const [serviceDurationMinutes, setServiceDurationMinutes] = useState<number>(40);
  const [isKitchenItem, setIsKitchenItem] = useState(false);

  // Wholesale tier state
  const [hasWholesaleTier, setHasWholesaleTier] = useState(false);
  const [tierMinQty, setTierMinQty] = useState<number>(10);
  const [tierUnitPrice, setTierUnitPrice] = useState<number>(48000);

  // Categories list for filter bar
  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    if (filterCategory !== 'ALL' && p.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const detectIndustryFromCategory = (cat: string): IndustryType => {
    if (['Barbershop / Salon', 'Otomotif & Detailing', 'Bengkel', 'Perawatan & Spa'].includes(cat)) {
      return 'SERVICE';
    }
    if (['Beverage & Coffee', 'Food & Meals', 'Bakery & Pastry', 'Snack & Dessert'].includes(cat)) {
      return 'FNB';
    }
    if (['Grosir Sembako', 'Bahan Pokok Grosir', 'Distributor Makanan', 'Pakan & Ternak'].includes(cat)) {
      return 'WHOLESALE';
    }
    return 'RETAIL';
  };

  const applyIndustryPreset = (mode: IndustryType, specificCategory?: string) => {
    const preset = INDUSTRY_PRESETS[mode];
    setTargetIndustry(mode);
    setIsCustomCategory(false);
    setCustomCategoryText('');

    if (specificCategory && specificCategory !== 'ALL') {
      setCategory(specificCategory);
    } else {
      setCategory(preset.defaultCategories[0]);
    }

    setUnit(preset.defaultUnit);
    setCostPrice(preset.defaultCost);
    setBasePrice(preset.defaultPrice);
    setStock(preset.defaultStock);
    setIsService(preset.isService);

    if (preset.isService) {
      setCommissionPercentage(30);
      setServiceDurationMinutes(40);
    }

    if (mode === 'FNB') {
      setIsKitchenItem(true);
    } else {
      setIsKitchenItem(false);
    }

    if (mode === 'WHOLESALE') {
      setHasWholesaleTier(true);
      setTierMinQty(10);
      setTierUnitPrice(Math.round(preset.defaultPrice * 0.9));
    } else {
      setHasWholesaleTier(false);
    }

    // Generate intelligent SKU
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setSku(`${preset.skuPrefix}-${randomSuffix}`);
  };

  const handleOpenAddModal = () => {
    const detectedMode =
      filterCategory !== 'ALL' ? detectIndustryFromCategory(filterCategory) : 'RETAIL';
    applyIndustryPreset(detectedMode, filterCategory !== 'ALL' ? filterCategory : undefined);
    setName('');
    setBarcode('');
    setIsAddModalOpen(true);
  };

  const handleIndustryChange = (mode: IndustryType) => {
    applyIndustryPreset(mode);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const finalCategory = isCustomCategory ? customCategoryText.trim() || category : category;

    let wholesaleTiers: WholesaleTier[] | undefined = undefined;
    if (hasWholesaleTier && tierMinQty > 0 && tierUnitPrice > 0) {
      wholesaleTiers = [
        {
          id: `wt_${Date.now()}`,
          minQuantity: tierMinQty,
          unitPrice: tierUnitPrice,
          label: `Grosir min ${tierMinQty} ${unit}`,
        },
      ];
    }

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      sku,
      barcode: barcode || undefined,
      name,
      category: finalCategory,
      basePrice,
      costPrice,
      stock: isService ? 999 : stock,
      unit,
      targetIndustry: [targetIndustry, 'HYBRID'],
      isService,
      serviceDurationMinutes: isService ? serviceDurationMinutes : undefined,
      commissionPercentage: isService ? commissionPercentage : undefined,
      isKitchenItem: targetIndustry === 'FNB' ? isKitchenItem : undefined,
      wholesaleTiers,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProduct(newProd);
    setIsAddModalOpen(false);
  };

  const activePreset = INDUSTRY_PRESETS[targetIndustry];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-400" />
            <span>Katalog Produk & Inventori</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kelola SKU, harga modal, harga jual, stok minimum, dan tarif komisi kapster/teknisi
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition self-start sm:self-auto active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, SKU, atau barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">SKU / Barcode</th>
                <th className="py-3 px-4">Nama Produk / Layanan</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Target Industri</th>
                <th className="py-3 px-4 text-right">Harga Modal</th>
                <th className="py-3 px-4 text-right">Harga Jual</th>
                <th className="py-3 px-4 text-center">Stok</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    Tidak ada produk dalam kategori ini. Klik "+ Tambah Produk Baru" untuk menambahkan.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-400">
                      <div>{p.sku}</div>
                      {p.barcode && <div className="text-[10px] text-slate-500">{p.barcode}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span>{p.name}</span>
                        {p.wholesaleTiers && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-medium">
                            Grosir
                          </span>
                        )}
                        {p.isService && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                            <Scissors className="w-2.5 h-2.5" />
                            Jasa ({p.commissionPercentage || 0}%)
                          </span>
                        )}
                        {p.isKitchenItem && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-medium">
                            Dapur
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{p.category}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.targetIndustry.map((ind) => (
                          <span
                            key={ind}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                          >
                            {ind}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono">
                      {formatRupiah(p.costPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-cyan-400 font-mono">
                      {formatRupiah(p.basePrice)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {p.isService ? (
                        <span className="px-2 py-0.5 rounded-full font-semibold text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Sesi Layanan
                        </span>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.stock <= 5
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {p.stock} {p.unit}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Product - Adaptive Contextual Multi-Industry */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <activePreset.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Tambah Produk / Layanan Baru</h3>
                  <p className="text-xs text-slate-400">
                    Formulir adaptif menyesuaikan model bisnis yang dipilih
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateProduct} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              {/* 1. Industry Mode Selector Pills */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Pilih Model Bisnis / Industri
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(Object.keys(INDUSTRY_PRESETS) as IndustryType[]).map((key) => {
                    const preset = INDUSTRY_PRESETS[key];
                    const Icon = preset.icon;
                    const isSelected = targetIndustry === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleIndustryChange(key)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col items-center sm:items-start gap-1 transition ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? 'text-blue-400' : 'text-slate-500'
                          }`}
                        />
                        <span className="text-[11px] font-bold text-center sm:text-left leading-tight">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Product / Service Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nama {isService ? 'Layanan Jasa' : 'Produk / Menu'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={activePreset.namePlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* 3. SKU & Barcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Kode SKU
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder={`Contoh: ${activePreset.skuPrefix}-001`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Barcode {isService && '(Opsional untuk Jasa)'}
                  </label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Scan / ketik nomor barcode..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 4. Adaptive Category Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Kategori {activePreset.label}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition"
                  >
                    {isCustomCategory ? '← Pilih dari Daftar' : '+ Buat Kategori Baru'}
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    type="text"
                    required
                    value={customCategoryText}
                    onChange={(e) => setCustomCategoryText(e.target.value)}
                    placeholder="Ketik nama kategori baru..."
                    className="w-full bg-slate-950 border border-blue-500/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {activePreset.defaultCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    {/* Keep current category if it was pre-selected from active filter tab */}
                    {!activePreset.defaultCategories.includes(category) && (
                      <option value={category}>{category}</option>
                    )}
                  </select>
                )}
              </div>

              {/* 5. Satuan (Unit) */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Satuan Takaran
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {activePreset.unitOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setUnit(opt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                        unit === opt
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Ketik satuan kustom jika berbeda..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 6. Pricing (Cost & Selling) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Harga Modal / HPP
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={costPrice || ''}
                      onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Harga Jual ke Pelanggan
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-cyan-400 font-bold">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={basePrice || ''}
                      onChange={(e) => setBasePrice(Number(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 7. Service Specific Fields (If Jasa / Barber / Salon) */}
              {isService && (
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                    <Scissors className="w-4 h-4" />
                    <span>Pengaturan Khusus Layanan Jasa & Staf</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-300 block mb-1 flex items-center gap-1">
                        <Percent className="w-3 h-3 text-emerald-400" />
                        <span>Komisi Petugas (%)</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={commissionPercentage}
                        onChange={(e) => setCommissionPercentage(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Estimasi: {formatRupiah((basePrice * commissionPercentage) / 100)} / pengerjaan
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-300 block mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>Estimasi Durasi (Menit)</span>
                      </label>
                      <input
                        type="number"
                        min="5"
                        value={serviceDurationMinutes}
                        onChange={(e) => setServiceDurationMinutes(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-emerald-300/80 bg-emerald-950/40 p-2 rounded-lg flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                    <span>
                      Produk jasa otomatis memicu jendela penugasan kapster/teknisi di kasir POS dan menghitung komisi staf harian secara otomatis.
                    </span>
                  </div>
                </div>
              )}

              {/* 8. F&B Kitchen Ticket Toggle */}
              {targetIndustry === 'FNB' && (
                <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-amber-300">Cetak Tiket Pesanan Dapur</div>
                    <div className="text-[10px] text-slate-400">
                      Otomatis pisahkan struk untuk juru masak / barista saat transaksi selesai
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isKitchenItem}
                    onChange={(e) => setIsKitchenItem(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              )}

              {/* 9. Wholesale Tier Pricing Toggle */}
              {targetIndustry === 'WHOLESALE' && (
                <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-purple-300">
                        Harga Grosir Bertingkat (Tier Pricing)
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Harga satuan turun otomatis ketika kuantitas belanja mencapai target
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hasWholesaleTier}
                      onChange={(e) => setHasWholesaleTier(e.target.checked)}
                      className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                    />
                  </div>

                  {hasWholesaleTier && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-900/40">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">
                          Min. Qty Grosir ({unit})
                        </label>
                        <input
                          type="number"
                          min="2"
                          value={tierMinQty}
                          onChange={(e) => setTierMinQty(Number(e.target.value) || 2)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">
                          Harga Satuan Grosir
                        </label>
                        <input
                          type="number"
                          value={tierUnitPrice}
                          onChange={(e) => setTierUnitPrice(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-cyan-400 font-bold font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 10. Stock Control */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Stok Awal Inventori
                </label>
                {isService ? (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                    <span>Layanan Jasa (Tidak memerlukan stok fisik barang)</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">
                      Unlimited
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                      {unit}
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition active:scale-[0.98]"
                >
                  Simpan Produk Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
