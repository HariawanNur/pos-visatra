'use client';

import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { useBusinessStore } from '../../store/business-store';
import { formatRupiah } from '../../../application/services/formatters';

interface PettyCashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PettyCashModal: React.FC<PettyCashModalProps> = ({ isOpen, onClose }) => {
  const { currentShift, addCashMovement } = useBusinessStore();

  const [type, setType] = useState<'OUT' | 'IN'>('OUT');
  const [amount, setAmount] = useState<number>(20000);
  const [reason, setReason] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !reason.trim()) return;

    addCashMovement(type, amount, reason);
    onClose();
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base text-white">Kas Kecil (Petty Cash)</h3>
              <p className="text-xs text-slate-400">Catat kas masuk / kas keluar laci kasir</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* In / Out Switcher */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('OUT')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                type === 'OUT'
                  ? 'bg-red-600/20 border-red-500 text-red-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Kas Keluar (Pengeluaran)</span>
            </button>

            <button
              type="button"
              onClick={() => setType('IN')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                type === 'IN'
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Kas Masuk (Tambahan)</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Nominal Uang (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                Rp
              </span>
              <input
                type="number"
                required
                min={1000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Keperluan / Alasan
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Beli es batu kristal / galon air / bayar kurir"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              Simpan Mutasi Kas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
