'use client';

import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  History,
  ClipboardList,
} from 'lucide-react';
import { useBusinessStore } from '../../../presentation/store/business-store';
import { formatIndoDateTime } from '../../../application/services/formatters';

export default function InventoryPage() {
  const { products, inventoryLogs, addInventoryLog } = useBusinessStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [logType, setLogType] = useState<'IN' | 'OUT' | 'ADJUSTMENT' | 'DAMAGE'>('IN');
  const [quantity, setQuantity] = useState<number>(10);
  const [reason, setReason] = useState<string>('');
  const [performedBy, setPerformedBy] = useState<string>('Staff Gudang');

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0) return;

    addInventoryLog({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: logType,
      quantity,
      currentStock: selectedProduct.stock,
      reason: reason || (logType === 'IN' ? 'Stok Masuk / Restock' : 'Penyesuaian Stok'),
      performedBy,
    });

    setIsModalOpen(false);
    setReason('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-400" />
            <span>Stok Opname & Mutasi Inventori</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Audit fisik persediaan, pencatatan barang masuk (restock), barang rusak, dan selisih stok
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Mutasi / Stok Opname</span>
        </button>
      </div>

      {/* Current Stock Quick Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">Total Macam SKU Produk</span>
          <div className="text-2xl font-black text-white mt-1">{products.length} Item</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">Peringatan Stok Menipis (Stok ≤ 5)</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {products.filter((p) => p.stock <= 5 && !p.isService).length} Item
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400">Riwayat Mutasi Tercatat</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {inventoryLogs.length} Catatan
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <History className="w-4 h-4 text-blue-400" />
            <span>Log Mutasi Persediaan Terkini</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Nama Produk</th>
                <th className="py-3 px-4 text-center">Jenis Mutasi</th>
                <th className="py-3 px-4 text-center">Jumlah</th>
                <th className="py-3 px-4 text-center">Sisa Stok Akhir</th>
                <th className="py-3 px-4">Alasan / Keterangan</th>
                <th className="py-3 px-4">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {inventoryLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 text-slate-400">{formatIndoDateTime(log.date)}</td>
                  <td className="py-3 px-4 font-semibold text-white">{log.productName}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.type === 'IN'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.type === 'DAMAGE'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {log.type === 'IN'
                        ? 'Masuk (+)'
                        : log.type === 'DAMAGE'
                        ? 'Rusak (-)'
                        : 'Penyesuaian'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold font-mono">
                    {log.type === 'IN' ? `+${log.quantity}` : `-${log.quantity}`}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-white font-mono">
                    {log.currentStock}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{log.reason}</td>
                  <td className="py-3 px-4 text-slate-400">{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Mutation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="font-bold text-base text-white">Catat Mutasi / Stok Opname</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Pilih Produk
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {products
                    .filter((p) => !p.isService)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stok Saat Ini: {p.stock} {p.unit})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Jenis Penyesuaian
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogType('IN')}
                    className={`py-2 text-xs rounded-xl border font-semibold ${
                      logType === 'IN'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Stok Masuk (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogType('DAMAGE')}
                    className={`py-2 text-xs rounded-xl border font-semibold ${
                      logType === 'DAMAGE'
                        ? 'bg-red-600/20 border-red-500 text-red-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Barang Rusak (-)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogType('ADJUSTMENT')}
                    className={`py-2 text-xs rounded-xl border font-semibold ${
                      logType === 'ADJUSTMENT'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Set Stok Fisik
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Jumlah Penyesuaian
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Keterangan / Alasan
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Contoh: Penerimaan dari supplier / hasil audit fisik bulanan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Petugas Pemeriksa
                </label>
                <input
                  type="text"
                  value={performedBy}
                  onChange={(e) => setPerformedBy(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Simpan Mutasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
