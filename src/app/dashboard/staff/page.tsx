'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Scissors,
  Wrench,
  Sparkles,
  Phone,
  Trash2,
  Percent,
} from 'lucide-react';
import { useBusinessStore } from '../../../presentation/store/business-store';
import { StaffMember } from '../../../core/entities/staff';
import { formatRupiah } from '../../../application/services/formatters';

export default function StaffPage() {
  const { staff, addStaff, deleteStaff } = useBusinessStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('BARBER');
  const [phone, setPhone] = useState('');
  const [commissionPercentage, setCommissionPercentage] = useState<number>(30);

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStaff: StaffMember = {
      id: `stf_${Date.now()}`,
      name,
      role,
      phone: phone || undefined,
      commissionPercentage,
      totalEarningsToday: 0,
      isActive: true,
    };

    addStaff(newStaff);
    setIsModalOpen(false);
    setName('');
    setPhone('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span>Manajemen Staf, Kapster & Teknisi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengaturan peran karyawan, penetapan persentase bagi hasil / komisi layanan, dan pemantauan pendapatan harian
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Staf Baru</span>
        </button>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">
                  {member.role}
                </span>
                <button
                  onClick={() => deleteStaff(member.id)}
                  className="text-slate-500 hover:text-red-400 transition"
                  title="Hapus Staf"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-base text-white">{member.name}</h3>
              {member.phone && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{member.phone}</span>
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Skema Komisi:</span>
                <span className="font-bold text-cyan-400">{member.commissionPercentage}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Komisi Hari Ini:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {formatRupiah(member.totalEarningsToday)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Staff */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="font-bold text-base text-white">Tambah Staf / Petugas Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rian Hidayat"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Peran (Role)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as StaffMember['role'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="CASHIER">Kasir</option>
                  <option value="BARBER">Barber (Kapster Rambut)</option>
                  <option value="STYLIST">Stylist / Terapis</option>
                  <option value="TECHNICIAN">Teknisi / Mekanik Bengkel</option>
                  <option value="WAITER">Pramusaji / Waiter</option>
                  <option value="MANAGER">Store Manager / SPV</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Persentase Komisi Layanan (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={commissionPercentage}
                  onChange={(e) => setCommissionPercentage(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Contoh: 30% dari nilai pengerjaan potong rambut akan masuk ke pendapatan staf.
                </span>
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
                  Simpan Staf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
