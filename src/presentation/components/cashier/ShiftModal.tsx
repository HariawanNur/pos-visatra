'use client';

import React, { useState } from 'react';
import { X, Clock, Banknote, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { useBusinessStore } from '../../store/business-store';
import { formatRupiah, formatIndoDateTime } from '../../../application/services/formatters';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose }) => {
  const { currentShift, openShift, closeShift, config } = useBusinessStore();

  const [cashierName, setCashierName] = useState('Siti Rahmawati');
  const [initialCash, setInitialCash] = useState<number>(500000);
  const [actualCash, setActualCash] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const isShiftOpen = currentShift && currentShift.status === 'OPEN';

  const handleStartShift = (e: React.FormEvent) => {
    e.preventDefault();
    openShift(cashierName, initialCash);
    onClose();
  };

  const handleCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    closeShift(actualCash, notes);
    onClose();
  };

  const cashDifference = isShiftOpen ? actualCash - currentShift.expectedCashTotal : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base text-white">Manajemen Shift & Kas Laci</h3>
              <p className="text-xs text-slate-400">{config.companyLegalName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          {isShiftOpen ? (
            <form onSubmit={handleCloseShift} className="space-y-4">
              {/* Active Shift Stats */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Kasir Bertugas:</span>
                  <span className="font-bold text-white">{currentShift.cashierName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Waktu Buka Shift:</span>
                  <span>{formatIndoDateTime(currentShift.openedAt)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Modal Awal Kas:</span>
                  <span className="font-semibold">{formatRupiah(currentShift.initialCash)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Penjualan Tunai:</span>
                  <span className="font-semibold">+{formatRupiah(currentShift.cashSalesTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-cyan-400">
                  <span>Penjualan Non-Tunai (QRIS/EDC):</span>
                  <span>{formatRupiah(currentShift.nonCashSalesTotal)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Perkiraan Total Kas di Laci:</span>
                  <span className="text-emerald-400">
                    {formatRupiah(currentShift.expectedCashTotal)}
                  </span>
                </div>
              </div>

              {/* Close Shift Cash Count */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Hitungan Uang Fisik di Laci Kasir (Cash Count)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    value={actualCash || ''}
                    onChange={(e) => setActualCash(Number(e.target.value) || 0)}
                    placeholder="Masukkan jumlah fisik uang kasir..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Difference Status */}
              {actualCash > 0 && (
                <div
                  className={`p-3 rounded-xl border text-xs flex justify-between items-center ${
                    cashDifference === 0
                      ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                      : cashDifference > 0
                      ? 'bg-blue-950/30 border-blue-800 text-blue-300'
                      : 'bg-red-950/30 border-red-800 text-red-300'
                  }`}
                >
                  <span>Selisih Kasir:</span>
                  <span className="font-bold text-sm">
                    {cashDifference > 0 ? `+${formatRupiah(cashDifference)}` : formatRupiah(cashDifference)}
                    {cashDifference === 0 && ' (Pas / Seimbang)'}
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Catatan Tutup Shift (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Kas seimbang, uang pecahan diserahkan ke SPV"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Tutup Shift Sekarang</span>
                </button>
              </div>
            </form>
          ) : (
            /* Open New Shift Form */
            <form onSubmit={handleStartShift} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nama Kasir yang Bertugas
                </label>
                <input
                  type="text"
                  required
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Modal Awal Kasir / Float (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={initialCash}
                  onChange={(e) => setInitialCash(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Uang pecahan awal yang ada di dalam cash drawer untuk uang kembalian.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Buka Shift Baru
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
