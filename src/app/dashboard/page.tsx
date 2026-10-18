'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Receipt,
  Users,
  Package,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Store,
  Boxes,
  Utensils,
  Scissors,
  Clock,
} from 'lucide-react';
import { useBusinessStore } from '../../presentation/store/business-store';
import { formatRupiah, formatIndoDateTime } from '../../application/services/formatters';

export default function DashboardOverviewPage() {
  const { config, orders, products, customers, currentShift } = useBusinessStore();

  // Calculated Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.grandTotal, 0);
  const totalOrders = orders.length;
  const totalKasbonOutstanding = customers.reduce((sum, c) => sum + c.kasbonBalance, 0);
  const activeProductCount = products.filter((p) => p.isActive).length;

  // Breakdown by Industry
  const industryStats = {
    RETAIL: orders.filter((o) => o.industryMode === 'RETAIL').reduce((s, o) => s + o.grandTotal, 0),
    FNB: orders.filter((o) => o.industryMode === 'FNB').reduce((s, o) => s + o.grandTotal, 0),
    SERVICE: orders.filter((o) => o.industryMode === 'SERVICE').reduce((s, o) => s + o.grandTotal, 0),
    WHOLESALE: orders.filter((o) => o.industryMode === 'WHOLESALE').reduce((s, o) => s + o.grandTotal, 0),
    HYBRID: orders.filter((o) => o.industryMode === 'HYBRID').reduce((s, o) => s + o.grandTotal, 0),
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-blue-900/40 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{config.companyLegalName}</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Ringkasan Eksekutif & POS Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {config.storeName} • {config.storeAddress}
          </p>
        </div>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 self-start md:self-auto transition"
        >
          Buka Terminal Kasir
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Penjualan Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{formatRupiah(totalRevenue)}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Semua kanal bisnis aktif</span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Transaksi Berhasil</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalOrders} Pesanan</div>
          <div className="text-[11px] text-slate-400">Tercatat di sistem Vistara</div>
        </div>

        {/* Kasbon / Receivables */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Piutang Kasbon / Tempo</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {formatRupiah(totalKasbonOutstanding)}
          </div>
          <div className="text-[11px] text-slate-400">Total piutang pelanggan aktif</div>
        </div>

        {/* Active Products */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Katalog Produk & Layanan</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{activeProductCount} SKU</div>
          <div className="text-[11px] text-purple-400">4 Format Industri Didukung</div>
        </div>
      </div>

      {/* Middle Section: Industry Breakdown & Shift Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Industry Modes Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white">Pendapatan Berdasarkan Kategori Bisnis</h3>
            <span className="text-xs text-slate-400">Universal Omni-Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Retail & Minimarket</span>
                <div className="font-bold text-sm text-white">{formatRupiah(industryStats.RETAIL)}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Resto & Cafe (F&B)</span>
                <div className="font-bold text-sm text-white">{formatRupiah(industryStats.FNB)}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Jasa, Salon & Bengkel</span>
                <div className="font-bold text-sm text-white">{formatRupiah(industryStats.SERVICE)}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Grosir & B2B Volume</span>
                <div className="font-bold text-sm text-white">{formatRupiah(industryStats.WHOLESALE)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Cash Drawer Shift */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Shift Kasir Aktif</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              {currentShift ? currentShift.status : 'TUTUP'}
            </span>
          </div>

          {currentShift ? (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Petugas:</span>
                <span className="text-white font-semibold">{currentShift.cashierName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Modal Awal:</span>
                <span className="text-slate-200 font-medium">
                  {formatRupiah(currentShift.initialCash)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Penjualan Tunai:</span>
                <span className="font-semibold">+{formatRupiah(currentShift.cashSalesTotal)}</span>
              </div>
              <div className="flex justify-between text-cyan-400">
                <span>Penjualan Non-Tunai:</span>
                <span>{formatRupiah(currentShift.nonCashSalesTotal)}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                <span>Total Kas Fisik Sistem:</span>
                <span className="text-emerald-400">
                  {formatRupiah(currentShift.expectedCashTotal)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Tidak ada shift yang sedang dibuka.</p>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white">Transaksi Kasir Terakhir</h3>
          <Link href="/dashboard/orders" className="text-xs text-blue-400 hover:underline">
            Lihat Semua Transaksi →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            Belum ada transaksi yang dilakukan hari ini. Buka kasir untuk memulai penjualan!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">No. Invoice</th>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3">Mode Bisnis</th>
                  <th className="py-2.5 px-3">Pelanggan</th>
                  <th className="py-2.5 px-3">Metode Bayar</th>
                  <th className="py-2.5 px-3 text-right">Total Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-850 transition">
                    <td className="py-3 px-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                    <td className="py-3 px-3 text-slate-400">{formatIndoDateTime(ord.createdAt)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                        {ord.industryMode}
                      </span>
                    </td>
                    <td className="py-3 px-3">{ord.customer ? ord.customer.name : 'Walk-in'}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{ord.paymentMethod}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400">
                      {formatRupiah(ord.grandTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
