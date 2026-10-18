'use client';

import React, { useState } from 'react';
import { X, Utensils, CheckCircle, Users } from 'lucide-react';
import { RestaurantTable } from '../../../core/entities/table';
import { useBusinessStore } from '../../store/business-store';
import { usePosStore } from '../../store/pos-store';

interface TableSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableSelectModal: React.FC<TableSelectModalProps> = ({ isOpen, onClose }) => {
  const { tables } = useBusinessStore();
  const { selectedTable, setSelectedTable } = usePosStore();
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

  if (!isOpen) return null;

  const zones = ['ALL', ...Array.from(new Set(tables.map((t) => t.zone)))];

  const filteredTables = tables.filter((t) => {
    if (selectedZone !== 'ALL' && t.zone !== selectedZone) return false;
    return true;
  });

  const handleSelect = (table: RestaurantTable) => {
    setSelectedTable(table.number);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div>
            <h3 className="font-bold text-base text-white">Pilih Meja Resto & Cafe</h3>
            <p className="text-xs text-slate-400">Pilih nomor meja tamu untuk pesanan Dine-In</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zone Filters */}
        <div className="px-3.5 sm:px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedZone === zone
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {zone === 'ALL' ? 'Semua Area' : zone}
            </button>
          ))}
        </div>

        {/* Table Map Grid */}
        <div className="p-5 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredTables.map((tbl) => {
              const isCurrent = selectedTable === tbl.number;
              const isOccupied = tbl.status === 'OCCUPIED';

              return (
                <button
                  key={tbl.id}
                  onClick={() => handleSelect(tbl)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30'
                      : isOccupied
                      ? 'bg-slate-950/50 border-red-900/40 opacity-70'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-white">{tbl.number}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isOccupied
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {isOccupied ? 'Terisi' : 'Kosong'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-[11px] truncate">{tbl.zone}</span>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Users className="w-3 h-3" />
                      <span>{tbl.capacity} org</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
          <button
            onClick={() => {
              setSelectedTable(null);
              onClose();
            }}
            className="text-xs text-red-400 hover:underline"
          >
            Hapus Pilihan Meja (Takeaway/None)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
