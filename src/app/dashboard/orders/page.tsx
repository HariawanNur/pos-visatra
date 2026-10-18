'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Printer,
  Calendar,
  CreditCard,
  Banknote,
  QrCode,
  FileClock,
  ArrowUpRight,
} from 'lucide-react';
import { useBusinessStore } from '../../../presentation/store/business-store';
import { usePosStore } from '../../../presentation/store/pos-store';
import { ThermalReceiptModal } from '../../../presentation/components/cashier/ThermalReceiptModal';
import { formatRupiah, formatIndoDateTime } from '../../../application/services/formatters';
import { Order } from '../../../core/entities/order';

export default function OrdersHistoryPage() {
  const { orders } = useBusinessStore();
  const { openReceiptModal } = usePosStore();

  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');

  const filteredOrders = orders.filter((o) => {
    if (filterMethod !== 'ALL' && o.paymentMethod !== filterMethod) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchInv = o.orderNumber.toLowerCase().includes(q);
      const matchCust = o.customer?.name.toLowerCase().includes(q);
      const matchCashier = o.cashierName.toLowerCase().includes(q);
      return matchInv || matchCust || matchCashier;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-400" />
            <span>Riwayat Transaksi & Struk</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftar lengkap seluruh transaksi penjualan kasir dan cetak ulang struk termal
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari invoice, kasir, atau pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'CASH', 'QRIS', 'DEBIT_CARD', 'TEMPO_KASBON'].map((method) => (
            <button
              key={method}
              onClick={() => setFilterMethod(method)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                filterMethod === method
                  ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {method === 'ALL'
                ? 'Semua Metode'
                : method === 'CASH'
                ? 'Tunai'
                : method === 'TEMPO_KASBON'
                ? 'Tempo / Kasbon'
                : method}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Tidak ada riwayat transaksi yang cocok dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">No. Invoice</th>
                  <th className="py-3 px-4">Waktu Transaksi</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Kasir</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4 text-right">Total Transaksi</th>
                  <th className="py-3 px-4 text-center">Struk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {formatIndoDateTime(ord.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                        {ord.industryMode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.customer ? ord.customer.name : 'Pelanggan Umum'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{ord.cashierName}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {ord.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-400 font-mono text-sm">
                      {formatRupiah(ord.grandTotal)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => openReceiptModal(ord)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 flex items-center justify-center gap-1.5 transition text-[11px] font-semibold mx-auto"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ThermalReceiptModal />
    </div>
  );
}
