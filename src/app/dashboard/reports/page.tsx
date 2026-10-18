'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  Layers,
  DollarSign,
  PieChart,
  Users,
  Award,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { useBusinessStore } from '../../../presentation/store/business-store';
import { formatRupiah, formatIndoDateTime } from '../../../application/services/formatters';

export default function ReportsPage() {
  const { orders, products, staff, currentShift, config } = useBusinessStore();

  const [activeTab, setActiveTab] = useState<'SALES_PROFIT' | 'TOP_PRODUCTS' | 'STAFF_COMMISSION' | 'CASH_SHIFT'>('SALES_PROFIT');
  const [dateFilter, setDateFilter] = useState<'TODAY' | 'ALL'>('ALL');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (dateFilter === 'TODAY') {
      const todayStr = new Date().toISOString().slice(0, 10);
      return orders.filter((o) => o.createdAt.startsWith(todayStr));
    }
    return orders;
  }, [orders, dateFilter]);

  // Financial Calculations
  const grossSales = filteredOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscount = filteredOrders.reduce((sum, o) => sum + o.discountAmount, 0);
  const netSales = grossSales - totalDiscount;
  const totalTax = filteredOrders.reduce((sum, o) => sum + o.taxAmount, 0);
  const grandTotalSales = filteredOrders.reduce((sum, o) => sum + o.grandTotal, 0);

  // Calculate COGS (Harga Pokok Penjualan)
  const totalCOGS = useMemo(() => {
    return filteredOrders.reduce((sumOrder, order) => {
      const orderCOGS = order.items.reduce((sumItem, item) => {
        const prod = products.find((p) => p.id === item.productId);
        const costPrice = prod ? prod.costPrice : item.basePrice * 0.7; // fallback estimation
        return sumItem + costPrice * item.quantity;
      }, 0);
      return sumOrder + orderCOGS;
    }, 0);
  }, [filteredOrders, products]);

  const grossProfit = netSales - totalCOGS;
  const profitMarginPercent = netSales > 0 ? ((grossProfit / netSales) * 100).toFixed(1) : '0';

  // Sales by Payment Method
  const paymentMethodStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {
      CASH: { count: 0, total: 0 },
      QRIS: { count: 0, total: 0 },
      DEBIT_CARD: { count: 0, total: 0 },
      TEMPO_KASBON: { count: 0, total: 0 },
    };

    filteredOrders.forEach((o) => {
      if (!stats[o.paymentMethod]) {
        stats[o.paymentMethod] = { count: 0, total: 0 };
      }
      stats[o.paymentMethod].count += 1;
      stats[o.paymentMethod].total += o.grandTotal;
    });

    return stats;
  }, [filteredOrders]);

  // Top Selling Products Ranking
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; sku: string; qty: number; revenue: number; category: string }>();

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = map.get(item.productId) || {
          name: item.productName,
          sku: item.sku,
          qty: 0,
          revenue: 0,
          category: products.find((p) => p.id === item.productId)?.category || 'General',
        };
        existing.qty += item.quantity;
        existing.revenue += item.subtotal;
        map.set(item.productId, existing);
      });
    });

    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredOrders, products]);

  // Staff Commission Recap
  const staffCommissions = useMemo(() => {
    const map = new Map<string, { name: string; role: string; count: number; totalOmset: number; commissionEarned: number }>();

    staff.forEach((s) => {
      map.set(s.id, {
        name: s.name,
        role: s.role,
        count: 0,
        totalOmset: 0,
        commissionEarned: 0,
      });
    });

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.assignedStaffId && map.has(item.assignedStaffId)) {
          const entry = map.get(item.assignedStaffId)!;
          const staffMember = staff.find((s) => s.id === item.assignedStaffId);
          const commPercent = staffMember?.commissionPercentage || 0;
          entry.count += 1;
          entry.totalOmset += item.subtotal;
          entry.commissionEarned += Math.round((item.subtotal * commPercent) / 100);
        }
      });
    });

    return Array.from(map.values()).filter((s) => s.count > 0 || s.commissionEarned > 0);
  }, [filteredOrders, staff]);

  // Export to CSV Function
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'LAPORAN TRANSAKSI PENJUALAN - PT VISTARA TEKNOLOGI INDONESIA\n';
    csvContent += `Generated at: ${new Date().toLocaleString('id-ID')}\n\n`;
    csvContent += 'No Invoice,Tanggal,Mode Bisnis,Pelanggan,Kasir,Metode Pembayaran,Subtotal,Diskon,PPN,Grand Total\n';

    filteredOrders.forEach((o) => {
      const row = [
        o.orderNumber,
        `"${formatIndoDateTime(o.createdAt)}"`,
        o.industryMode,
        `"${o.customer ? o.customer.name : 'Walk-in'}"`,
        `"${o.cashierName}"`,
        o.paymentMethod,
        o.subtotal,
        o.discountAmount,
        o.taxAmount,
        o.grandTotal,
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Penjualan_Vistara_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{config.companyLegalName}</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span>Pusat Laporan & Analitik Keuangan Bisnis</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Laporan Penjualan, Laba Rugi (P&L), Margin Keuntungan, Produk Terlaris, dan Komisi Staf
          </p>
        </div>

        {/* Date Filter & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setDateFilter('TODAY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                dateFilter === 'TODAY'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setDateFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                dateFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Periode
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-xs font-bold flex items-center gap-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV / Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Omset Penjualan Bersih */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs font-medium text-slate-400">Total Penjualan Bersih (Net Sales)</span>
          <div className="text-2xl font-black text-white">{formatRupiah(netSales)}</div>
          <div className="text-[11px] text-slate-400">
            Kotor: {formatRupiah(grossSales)} | Diskon: {formatRupiah(totalDiscount)}
          </div>
        </div>

        {/* HPP (COGS) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs font-medium text-slate-400">Harga Pokok Penjualan (HPP / Modal)</span>
          <div className="text-2xl font-black text-slate-300 font-mono">{formatRupiah(totalCOGS)}</div>
          <div className="text-[11px] text-slate-400">Total modal persediaan barang terjual</div>
        </div>

        {/* Laba Kotor (Gross Profit) */}
        <div className="bg-slate-900 border border-emerald-900/40 bg-gradient-to-br from-emerald-950/20 to-slate-900 rounded-2xl p-5 space-y-2">
          <span className="text-xs font-medium text-emerald-400">Estimasi Laba Kotor (Gross Profit)</span>
          <div className="text-2xl font-black text-emerald-400">{formatRupiah(grossProfit)}</div>
          <div className="text-[11px] text-emerald-300 font-semibold">
            Margin Keuntungan: {profitMarginPercent}%
          </div>
        </div>

        {/* Total PPN 11% */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <span className="text-xs font-medium text-slate-400">Pajak Terkumpul (PPN {config.taxRatePercent}%)</span>
          <div className="text-2xl font-black text-cyan-400">{formatRupiah(totalTax)}</div>
          <div className="text-[11px] text-slate-400">Total Tagihan Bruto: {formatRupiah(grandTotalSales)}</div>
        </div>
      </div>

      {/* Navigation Tabs for Reports */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('SALES_PROFIT')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition ${
            activeTab === 'SALES_PROFIT'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Ringkasan & Metode Bayar
        </button>
        <button
          onClick={() => setActiveTab('TOP_PRODUCTS')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition ${
            activeTab === 'TOP_PRODUCTS'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Produk & Layanan Terlaris (Ranking)
        </button>
        <button
          onClick={() => setActiveTab('STAFF_COMMISSION')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition ${
            activeTab === 'STAFF_COMMISSION'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Rekap Komisi Staf & Kapster
        </button>
        <button
          onClick={() => setActiveTab('CASH_SHIFT')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition ${
            activeTab === 'CASH_SHIFT'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Audit Laci Kasir & Shift
        </button>
      </div>

      {/* Tab 1: Ringkasan Penjualan & Metode Pembayaran */}
      {activeTab === 'SALES_PROFIT' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods Breakdown */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-400" />
              <span>Penerimaan Berdasarkan Metode Bayar</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-200">Tunai (Cash)</span>
                  <div className="text-[10px] text-slate-400">{paymentMethodStats.CASH.count} transaksi</div>
                </div>
                <div className="text-sm font-bold text-emerald-400 font-mono">
                  {formatRupiah(paymentMethodStats.CASH.total)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-200">QRIS Dinamis</span>
                  <div className="text-[10px] text-slate-400">{paymentMethodStats.QRIS.count} transaksi</div>
                </div>
                <div className="text-sm font-bold text-cyan-400 font-mono">
                  {formatRupiah(paymentMethodStats.QRIS.total)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-200">Kartu Debit / EDC</span>
                  <div className="text-[10px] text-slate-400">{paymentMethodStats.DEBIT_CARD.count} transaksi</div>
                </div>
                <div className="text-sm font-bold text-blue-400 font-mono">
                  {formatRupiah(paymentMethodStats.DEBIT_CARD.total)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-amber-300">Tempo / Kasbon Piutang</span>
                  <div className="text-[10px] text-slate-400">{paymentMethodStats.TEMPO_KASBON.count} transaksi</div>
                </div>
                <div className="text-sm font-bold text-amber-400 font-mono">
                  {formatRupiah(paymentMethodStats.TEMPO_KASBON.total)}
                </div>
              </div>
            </div>
          </div>

          {/* Sales Transaction List */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-white">Rincian Transaksi Penjualan</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">No. Invoice</th>
                    <th className="py-2.5 px-3">Waktu</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Metode</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                    <th className="py-2.5 px-3 text-right">PPN</th>
                    <th className="py-2.5 px-3 text-right">Grand Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-850/60 transition">
                      <td className="py-3 px-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                      <td className="py-3 px-3 text-slate-400">{formatIndoDateTime(ord.createdAt)}</td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {ord.industryMode}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200">{ord.paymentMethod}</td>
                      <td className="py-3 px-3 text-right font-mono">{formatRupiah(ord.subtotal)}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400">{formatRupiah(ord.taxAmount)}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400 font-mono">
                        {formatRupiah(ord.grandTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Top Selling Products */}
      {activeTab === 'TOP_PRODUCTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Peringkat Produk & Menu Terlaris</span>
            </h3>
            <span className="text-xs text-slate-400">Berdasarkan Total Nilai Penjualan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 text-center">Rank</th>
                  <th className="py-3 px-4">Nama Produk / Menu</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-center">Qty Terjual</th>
                  <th className="py-3 px-4 text-right">Kontribusi Omset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topProducts.map((item, idx) => (
                  <tr key={item.sku} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                          idx === 0
                            ? 'bg-amber-500 text-slate-950'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-950'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{item.sku}</td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-center font-bold text-cyan-400 font-mono text-sm">
                      {item.qty}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-400 font-mono text-sm">
                      {formatRupiah(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Staff & Kapster Commission */}
      {activeTab === 'STAFF_COMMISSION' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Rekapitulasi Komisi Staf, Kapster & Teknisi</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Perhitungan komisi otomatis berdasarkan pengerjaan layanan jasa (Barbershop, Salon, Bengkel)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nama Staf / Petugas</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4 text-center">Jumlah Layanan Dikerjakan</th>
                  <th className="py-3 px-4 text-right">Nilai Layanan Dihasilkan</th>
                  <th className="py-3 px-4 text-right">Komisi Berhak Diterima</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {staffCommissions.map((s) => (
                  <tr key={s.name} className="hover:bg-slate-850/60 transition">
                    <td className="py-3.5 px-4 font-bold text-white text-sm">{s.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-cyan-400 font-mono">
                      {s.count} Layanan
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                      {formatRupiah(s.totalOmset)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400 font-mono text-sm">
                      {formatRupiah(s.commissionEarned)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Laci Kasir & Shift */}
      {activeTab === 'CASH_SHIFT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <span>Audit Arus Kas Laci Kasir (Cash Drawer Reconciliation)</span>
            </h3>
          </div>

          {currentShift ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                  Informasi Shift Berjalan
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kasir:</span>
                  <span className="font-semibold text-white">{currentShift.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Waktu Buka Shift:</span>
                  <span>{formatIndoDateTime(currentShift.openedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Modal Kas Awal:</span>
                  <span className="font-semibold">{formatRupiah(currentShift.initialCash)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Penjualan Tunai:</span>
                  <span className="font-semibold">+{formatRupiah(currentShift.cashSalesTotal)}</span>
                </div>
                <div className="flex justify-between text-cyan-400">
                  <span>Penjualan Non-Tunai:</span>
                  <span>{formatRupiah(currentShift.nonCashSalesTotal)}</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Kas Keluar (Petty Cash):</span>
                  <span>-{formatRupiah(currentShift.cashOut)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                  <span>Total Kas Fisik Sistem:</span>
                  <span className="text-emerald-400 font-mono">
                    {formatRupiah(currentShift.expectedCashTotal)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-sm text-white border-b border-slate-800 pb-2">
                  Catatan Audit Kasir
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Laporan rekonsiliasi kas ini digunakan untuk mencocokkan jumlah uang fisik yang ada di laci kasir dengan pencatatan otomatis transaksi penjualan tunai dan pengeluaran kas kecil (petty cash).
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  Status Shift: <strong className="text-emerald-400">{currentShift.status}</strong>
                  <br />
                  Log: {currentShift.notes || 'Tidak ada catatan selisih'}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Belum ada data shift.</p>
          )}
        </div>
      )}
    </div>
  );
}
