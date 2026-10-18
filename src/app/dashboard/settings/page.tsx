'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Building,
  Store,
  Printer,
  Percent,
  Check,
  Save,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';
import { useBusinessStore } from '../../../presentation/store/business-store';
import { IndustryMode } from '../../../core/types/industry';

export default function SettingsPage() {
  const { config, updateConfig } = useBusinessStore();

  const [form, setForm] = useState({
    companyLegalName: config.companyLegalName,
    productName: config.productName,
    brandWebsite: config.brandWebsite,
    supportContact: config.supportContact,
    storeName: config.storeName,
    storeAddress: config.storeAddress,
    storePhone: config.storePhone,
    taxIdentificationNumber: config.taxIdentificationNumber || '',
    defaultIndustryMode: config.defaultIndustryMode,
    taxRatePercent: config.taxRatePercent,
    serviceChargePercent: config.serviceChargePercent,
    receiptPrinterWidth: config.receiptPrinterWidth,
    receiptFooterMessage: config.receiptFooterMessage,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          <span>Pengaturan Sistem & Profil Perusahaan</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Konfigurasi identitas legal PT Vistara Teknologi Indonesia, outlet cabang, dan tarif pajak
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Pengaturan sistem berhasil disimpan dan diterapkan secara realtime!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Corporate Identity (PT VISTARA TEKNOLOGI INDONESIA) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Identitas Legal Pengembang & Lisensi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nama Perusahaan (Corporate Legal)
              </label>
              <input
                type="text"
                required
                value={form.companyLegalName}
                onChange={(e) => setForm({ ...form, companyLegalName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nama Produk Sistem POS
              </label>
              <input
                type="text"
                required
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Situs Resmi / Website Vendor
              </label>
              <input
                type="text"
                value={form.brandWebsite}
                onChange={(e) => setForm({ ...form, brandWebsite: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Kontak Dukungan Teknis / Support
              </label>
              <input
                type="text"
                value={form.supportContact}
                onChange={(e) => setForm({ ...form, supportContact: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Store / Outlet Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Store className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Profil Toko / Outlet Aktif</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nama Toko / Outlet
              </label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Telepon Toko
              </label>
              <input
                type="text"
                required
                value={form.storePhone}
                onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Alamat Lengkap Toko
              </label>
              <input
                type="text"
                required
                value={form.storeAddress}
                onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                NPWP / Identitas Pajak Perusahaan
              </label>
              <input
                type="text"
                value={form.taxIdentificationNumber}
                onChange={(e) => setForm({ ...form, taxIdentificationNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Operational & Taxes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Percent className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Tarif Pajak & Operasional</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Tarif PPN (%)
              </label>
              <input
                type="number"
                value={form.taxRatePercent}
                onChange={(e) => setForm({ ...form, taxRatePercent: Number(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Standar Indonesia: 11%</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Service Charge Resto (%)
              </label>
              <input
                type="number"
                value={form.serviceChargePercent}
                onChange={(e) =>
                  setForm({ ...form, serviceChargePercent: Number(e.target.value) || 0 })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Ukuran Lebar Kertas Printer
              </label>
              <select
                value={form.receiptPrinterWidth}
                onChange={(e) =>
                  setForm({
                    ...form,
                    receiptPrinterWidth: e.target.value as '58mm' | '80mm',
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="80mm">80mm (Standar Thermal Struk Kasir)</option>
                <option value="58mm">58mm (Mini Thermal Portabel Bluetooth)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Pesan Footer Struk Kasir
              </label>
              <textarea
                rows={3}
                value={form.receiptFooterMessage}
                onChange={(e) => setForm({ ...form, receiptFooterMessage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition duration-150"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  );
}
