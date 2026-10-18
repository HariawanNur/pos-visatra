'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ScanBarcode,
  Layers,
  Sparkles,
  Tag,
  Scissors,
  Coffee,
  Store,
  Boxes,
  Plus,
} from 'lucide-react';
import { Product } from '../../../core/entities/product';
import { usePosStore } from '../../store/pos-store';
import { useBusinessStore } from '../../store/business-store';
import { formatRupiah } from '../../../application/services/formatters';

interface ProductGridProps {
  onSelectProductWithModifiers: (product: Product) => void;
  onSelectServiceProduct: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  onSelectProductWithModifiers,
  onSelectServiceProduct,
}) => {
  const { industryMode, addToCart } = usePosStore();
  const { products } = useBusinessStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter products by industry mode & search & category
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Industry Mode check
      if (industryMode !== 'HYBRID') {
        if (!item.targetIndustry.includes(industryMode)) return false;
      }

      // 2. Category check
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Search query check (name, sku, barcode)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSku = item.sku.toLowerCase().includes(q);
        const matchBarcode = item.barcode?.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBarcode) return false;
      }

      return item.isActive;
    });
  }, [products, industryMode, selectedCategory, searchQuery]);

  // Extract unique categories based on current active industry
  const categories = useMemo(() => {
    const list = products
      .filter((p) => industryMode === 'HYBRID' || p.targetIndustry.includes(industryMode))
      .map((p) => p.category);
    return ['ALL', ...Array.from(new Set(list))];
  }, [products, industryMode]);

  // Handle barcode quick scan (Enter key in search bar)
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check exact barcode or SKU match
    const exactMatch = products.find(
      (p) =>
        p.barcode?.toLowerCase() === searchQuery.toLowerCase() ||
        p.sku.toLowerCase() === searchQuery.toLowerCase()
    );

    if (exactMatch) {
      handleProductClick(exactMatch);
      setSearchQuery('');
    }
  };

  const handleProductClick = (product: Product) => {
    if (product.modifiers && product.modifiers.length > 0) {
      onSelectProductWithModifiers(product);
    } else if (product.isService) {
      onSelectServiceProduct(product);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden">
      {/* Top Search & Barcode Interceptor */}
      <div className="p-3 sm:p-4 pb-2 border-b border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center justify-between shrink-0">
        <form onSubmit={handleBarcodeSubmit} className="relative w-full sm:w-80 md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="pos-search-input"
            type="text"
            placeholder="Cari produk / scan barcode (F1)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          <ScanBarcode className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1 scrollbar-none shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="flex-1 p-3 sm:p-4 pb-28 lg:pb-4 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
            <Layers className="w-12 h-12 mb-3 text-slate-600 stroke-[1.5]" />
            <p className="text-sm font-medium">Tidak ada produk ditemukan</p>
            <p className="text-xs text-slate-600 mt-1 text-center">Coba sesuaikan pencarian atau ganti filter mode bisnis</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3">
            {filteredProducts.map((product) => {
              const hasWholesaleTiers = product.wholesaleTiers && product.wholesaleTiers.length > 0;
              const hasModifiers = product.modifiers && product.modifiers.length > 0;
              const isService = product.isService;

              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group relative bg-slate-850 hover:bg-slate-800/90 border border-slate-750 hover:border-blue-500/60 rounded-xl p-2.5 sm:p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-150 hover:shadow-lg hover:shadow-blue-500/5 active:scale-[0.98]"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 truncate max-w-[65px] sm:max-w-[80px]">
                      {product.sku}
                    </span>

                    {/* Industry indicator pill */}
                    {isService ? (
                      <span className="flex items-center gap-1 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        <Scissors className="w-2.5 h-2.5" />
                        Jasa
                      </span>
                    ) : hasModifiers ? (
                      <span className="flex items-center gap-1 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                        <Coffee className="w-2.5 h-2.5" />
                        Custom
                      </span>
                    ) : hasWholesaleTiers ? (
                      <span className="flex items-center gap-1 text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                        <Boxes className="w-2.5 h-2.5" />
                        Grosir
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        Stok: {product.stock}
                      </span>
                    )}
                  </div>

                  {/* Product Title & Info */}
                  <div className="mb-2 sm:mb-3">
                    <h3 className="font-semibold text-slate-100 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-blue-300 transition">
                      {product.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">{product.category}</p>
                  </div>

                  {/* Wholesale Tier Notice if any */}
                  {hasWholesaleTiers && (
                    <div className="mb-2 p-1.5 rounded bg-purple-950/40 border border-purple-900/40 text-[9px] sm:text-[10px] text-purple-300">
                      Grosir min {product.wholesaleTiers![0].minQuantity} {product.unit}:{' '}
                      <span className="font-semibold">
                        {formatRupiah(product.wholesaleTiers![0].unitPrice)}
                      </span>
                    </div>
                  )}

                  {/* Price & Add Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <div className="text-[10px] sm:text-xs text-slate-400 leading-none">Harga</div>
                      <div className="font-bold text-xs sm:text-sm text-cyan-400">
                        {formatRupiah(product.basePrice)}
                      </div>
                    </div>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition">
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
