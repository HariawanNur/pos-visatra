'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutHelpModal: React.FC<ShortcutHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'F1', desc: 'Fokus pencarian produk atau scan barcode scanner' },
    { key: 'F2', desc: 'Buka modal pembayaran & proses tagihan transaksi' },
    { key: 'F4', desc: 'Buka denah meja untuk pesanan F&B (Restoran)' },
    { key: 'F8', desc: 'Pilih data pelanggan atau periksa kasbon' },
    { key: 'Esc', desc: 'Tutup jendela pop-up atau batalkan transaksi aktif' },
    { key: 'Enter', desc: 'Konfirmasi pembayaran saat di dalam modal bayar' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Panduan Shortcut Keyboard POS</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 space-y-2.5">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80"
            >
              <kbd className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-cyan-300 shadow-sm">
                {s.key}
              </kbd>
              <span className="text-xs text-slate-300 text-right max-w-[260px]">{s.desc}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
