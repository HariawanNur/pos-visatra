'use client';

import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Users,
  Layers,
  Trash2,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useBusinessStore } from '../../../presentation/store/business-store';
import { RestaurantTable } from '../../../core/entities/table';

export default function TablesManagementPage() {
  const { tables, addTable, updateTableStatus, deleteTable } = useBusinessStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [number, setNumber] = useState('');
  const [zone, setZone] = useState('Indoor Utama');
  const [capacity, setCapacity] = useState<number>(4);

  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;

    const newTbl: RestaurantTable = {
      id: `tbl_${Date.now()}`,
      number,
      zone,
      capacity,
      status: 'AVAILABLE',
    };

    addTable(newTbl);
    setIsModalOpen(false);
    setNumber('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-400" />
            <span>Manajemen Meja & Denah Area F&B</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengaturan penomoran meja, zonasi ruangan resto & cafe, serta kapasitas kursi pengunjung
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Meja Baru</span>
        </button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map((t) => {
          const isOccupied = t.status === 'OCCUPIED';

          return (
            <div
              key={t.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-150 ${
                isOccupied
                  ? 'bg-red-950/20 border-red-900/50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isOccupied
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {isOccupied ? 'Terisi' : 'Kosong'}
                  </span>
                  <button
                    onClick={() => deleteTable(t.id)}
                    className="text-slate-500 hover:text-red-400 transition"
                    title="Hapus Meja"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="font-black text-xl text-white mt-1">{t.number}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate">{t.zone}</div>
              </div>

              <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Users className="w-3.5 h-3.5" />
                  <span>{t.capacity} org</span>
                </div>

                <button
                  onClick={() =>
                    updateTableStatus(
                      t.id,
                      t.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE'
                    )
                  }
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  {isOccupied ? 'Kosongkan' : 'Tandai Terisi'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Table */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="font-bold text-base text-white">Tambah Meja Resto</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTable} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nomor / Nama Meja
                </label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Contoh: Meja 07 / VIP Room B"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Area / Zonasi
                </label>
                <input
                  type="text"
                  required
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Indoor Utama / Outdoor / VIP Lantai 2"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Kapasitas Kursi (Orang)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
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
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  Simpan Meja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
