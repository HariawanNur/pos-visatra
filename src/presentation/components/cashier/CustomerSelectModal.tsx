'use client';

import React, { useState } from 'react';
import { X, UserPlus, Search, Phone, CreditCard, Check, Sparkles } from 'lucide-react';
import { Customer } from '../../../core/entities/customer';
import { useBusinessStore } from '../../store/business-store';
import { usePosStore } from '../../store/pos-store';
import { formatRupiah } from '../../../application/services/formatters';

interface CustomerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSelectModal: React.FC<CustomerSelectModalProps> = ({ isOpen, onClose }) => {
  const { customers, addCustomer } = useBusinessStore();
  const { selectedCustomer, setSelectedCustomer } = usePosStore();

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [allowKasbon, setAllowKasbon] = useState(false);
  const [kasbonLimit, setKasbonLimit] = useState<number>(5000000);

  if (!isOpen) return null;

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    onClose();
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const created: Customer = {
      id: `cust_${Date.now()}`,
      name: newName,
      phone: newPhone,
      tier: 'REGULAR',
      loyaltyPoints: 0,
      allowKasbon,
      kasbonLimit: allowKasbon ? kasbonLimit : 0,
      kasbonBalance: 0,
      createdAt: new Date().toISOString(),
    };

    addCustomer(created);
    setSelectedCustomer(created);
    setShowAddForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="font-bold text-base text-white">Data Pelanggan & Member</h3>
            <p className="text-xs text-slate-400">Pilih pelanggan untuk poin loyalitas & kasbon</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!showAddForm ? (
          <>
            <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama atau no. telepon..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {/* Option: Walk-in Customer (General) */}
              <button
                onClick={() => handleSelect(null)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                  !selectedCustomer
                    ? 'bg-blue-600/20 border-blue-500 text-white font-medium'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-white">Pelanggan Umum (Walk-in)</div>
                  <div className="text-[11px] text-slate-400">Tanpa pencatatan kasbon & poin</div>
                </div>
                {!selectedCustomer && <Check className="w-4 h-4 text-blue-400" />}
              </button>

              {filtered.map((c) => {
                const isCurrent = selectedCustomer?.id === c.id;

                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      isCurrent
                        ? 'bg-blue-600/20 border-blue-500 text-white font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{c.name}</span>
                        {c.tier === 'VIP' && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded font-semibold">
                            VIP
                          </span>
                        )}
                        {c.tier === 'WHOLESALE_PARTNER' && (
                          <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 rounded font-semibold">
                            Mitra Grosir
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{c.phone}</span>
                        <span>• Poin: {c.loyaltyPoints}</span>
                      </div>
                      {c.allowKasbon && (
                        <div className="text-[10px] text-amber-400 mt-1">
                          Limit Kasbon: {formatRupiah(c.kasbonLimit)} (Terpakai:{' '}
                          {formatRupiah(c.kasbonBalance)})
                        </div>
                      )}
                    </div>

                    {isCurrent && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Quick Add Customer Form */
          <form onSubmit={handleCreateCustomer} className="p-5 space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nama Lengkap / Nama Toko
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Contoh: Bpk. Bambang / Toko Cahaya"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowKasbon}
                  onChange={(e) => setAllowKasbon(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Izinkan Pembayaran Tempo / Kasbon (Hutang)</span>
              </label>

              {allowKasbon && (
                <div className="mt-2.5">
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Plafon Limit Kredit (Rp)
                  </label>
                  <input
                    type="number"
                    value={kasbonLimit}
                    onChange={(e) => setKasbonLimit(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Simpan & Pilih
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
