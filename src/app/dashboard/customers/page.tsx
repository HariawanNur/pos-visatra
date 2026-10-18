'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  CreditCard,
  CheckCircle,
  FileClock,
  ArrowDownCircle,
} from 'lucide-react';
import { useBusinessStore } from '../../../presentation/store/business-store';
import { Customer } from '../../../core/entities/customer';
import { formatRupiah, formatIndoDateTime } from '../../../application/services/formatters';

export default function CustomersPage() {
  const { customers, updateCustomerKasbon } = useBusinessStore();

  const [search, setSearch] = useState('');
  const [selectedPayCustomer, setSelectedPayCustomer] = useState<Customer | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handlePayKasbonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayCustomer || payAmount <= 0) return;

    // Deduct kasbon balance
    updateCustomerKasbon(selectedPayCustomer.id, -payAmount);
    setSelectedPayCustomer(null);
    setPayAmount(0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span>Data Pelanggan & Piutang Kasbon</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pantau limit kasbon/tempo, sisa hutang pelanggan, dan catat pelunasan kasbon
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-3 items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau telepon pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Nama Pelanggan</th>
                <th className="py-3 px-4">Kontak / Telepon</th>
                <th className="py-3 px-4">Tier / Tipe</th>
                <th className="py-3 px-4">Poin Loyalitas</th>
                <th className="py-3 px-4 text-right">Limit Kasbon</th>
                <th className="py-3 px-4 text-right">Sisa Hutang (Kasbon)</th>
                <th className="py-3 px-4 text-center">Aksi Pelunasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>{c.name}</div>
                    {c.address && <div className="text-[10px] text-slate-400">{c.address}</div>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{c.phone}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.tier === 'WHOLESALE_PARTNER'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : c.tier === 'VIP'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {c.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cyan-400 font-mono">
                    {c.loyaltyPoints} Pts
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-400 font-mono">
                    {c.allowKasbon ? formatRupiah(c.kasbonLimit) : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold font-mono">
                    <span className={c.kasbonBalance > 0 ? 'text-amber-400' : 'text-slate-400'}>
                      {formatRupiah(c.kasbonBalance)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {c.kasbonBalance > 0 ? (
                      <button
                        onClick={() => {
                          setSelectedPayCustomer(c);
                          setPayAmount(c.kasbonBalance);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 flex items-center justify-center gap-1.5 transition text-[11px] font-semibold mx-auto"
                      >
                        <ArrowDownCircle className="w-3.5 h-3.5" />
                        <span>Bayar Kasbon</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">Lunas</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Kasbon Modal */}
      {selectedPayCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="font-bold text-base text-white">Catat Pelunasan Kasbon</h3>
              <button
                onClick={() => setSelectedPayCustomer(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePayKasbonSubmit} className="p-5 space-y-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="text-slate-400">Pelanggan:</div>
                <div className="font-bold text-white text-sm">{selectedPayCustomer.name}</div>
                <div className="flex justify-between pt-1 text-slate-300">
                  <span>Total Hutang Saat Ini:</span>
                  <span className="font-bold text-amber-400">
                    {formatRupiah(selectedPayCustomer.kasbonBalance)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nominal Pembayaran Diterima (Rp)
                </label>
                <input
                  type="number"
                  required
                  max={selectedPayCustomer.kasbonBalance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPayCustomer(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Konfirmasi Pelunasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
