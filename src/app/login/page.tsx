'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ShieldCheck,
  Lock,
  Mail,
  Building2,
  Store,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { useAuthStore, DEMO_ACCOUNTS } from '../../presentation/store/auth-store';
import { DEMO_TENANTS, UserRole } from '../../core/entities/user';
import { useBusinessStore } from '../../presentation/store/business-store';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickDemoLogin } = useAuthStore();
  const { config } = useBusinessStore();

  const [email, setEmail] = useState('owner@vistara.co.id');
  const [password, setPassword] = useState('admin123');
  const [selectedOutletId, setSelectedOutletId] = useState(DEMO_TENANTS[0].id);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const res = login(email, password, selectedOutletId);
      setIsLoading(false);

      if (res.success) {
        // If cashier, go to POS directly; otherwise go to dashboard or POS
        if (email.includes('cashier')) {
          router.push('/');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMessage(res.errorMessage || 'Terjadi kesalahan saat login.');
      }
    }, 400);
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      quickDemoLogin(role, selectedOutletId);
      setIsLoading(false);
      if (role === 'CASHIER') {
        router.push('/');
      } else {
        router.push('/dashboard');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-slate-950 text-slate-100 select-none overflow-x-hidden">
      {/* Left Column: SaaS Value Proposition & Brand Banner */}
      <div className="w-full md:w-5/12 lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 border-r border-slate-800/80 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/20">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  {config.productName}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ENTERPRISE
                </span>
              </div>
              <div className="text-xs text-cyan-400 font-semibold tracking-wide">
                {config.companyLegalName}
              </div>
            </div>
          </div>
        </div>

        {/* Main Hero Pitch */}
        <div className="relative z-10 py-10 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              SaaS Multi-Tenant Cloud Architecture
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Satu Sistem POS untuk Seluruh Model Bisnis Anda.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Dirancang untuk kemudahan operasional multi-cabang dari Retail Minimarket, Restoran & Cafe (F&B), Barbershop & Jasa, hingga Grosir B2B dengan harga bertingkat dan piutang kasbon.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Universal Omni-Engine</h4>
                <p className="text-[11px] text-slate-400">
                  Denah meja resto, varian/modifier dapur, komisi kapster, dan tier grosir dalam satu aplikasi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Laporan Keuangan & Laba Rugi</h4>
                <p className="text-[11px] text-slate-400">
                  Perhitungan HPP otomatis, laba kotor, PPN 11%, dan rekonsiliasi kas laci kasir real-time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Dukungan Cetak Thermal Lengkap</h4>
                <p className="text-[11px] text-slate-400">
                  Kompatibel otomatis dengan printer kasir 58mm & 80mm USB / Bluetooth tanpa driver rumit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-6 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Hak Cipta © 2026 PT VISTARA TEKNOLOGI INDONESIA</span>
          <span className="text-[10px] text-slate-600">v2.5.0-PRO</span>
        </div>
      </div>

      {/* Right Column: Interactive Login Form with One-Click Demo Accounts */}
      <div className="flex-1 p-6 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white tracking-tight">Masuk ke Portal Bisnis</h3>
            <p className="text-xs text-slate-400">
              Pilih outlet cabang dan gunakan akun demo untuk menguji coba sistem.
            </p>
          </div>

          {/* Error Banner if any */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            {/* Multi-Tenant / Branch Outlet Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-blue-400" />
                <span>Pilih Outlet / Cabang Toko</span>
              </label>
              <select
                value={selectedOutletId}
                onChange={(e) => setSelectedOutletId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
              >
                {DEMO_TENANTS.map((outlet) => (
                  <option key={outlet.id} value={outlet.id}>
                    {outlet.name} - {outlet.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Email input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Alamat Email Pengguna</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@vistara.co.id"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 transition"
              />
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kata Sandi</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Untuk akun demo, gunakan kata sandi: admin123')}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition duration-150 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses Verifikasi...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard / POS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts Section */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Akses Cepat Demo Klien
              </span>
              <span className="text-[10px] text-cyan-400 font-medium">1-Click Login</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Owner */}
              <button
                type="button"
                onClick={() => handleQuickLogin('SUPERADMIN')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-xs group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                    👑
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                      Login sebagai Owner / Direktur
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Akses penuh seluruh cabang, laporan laba rugi & pengaturan
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
              </button>

              {/* Manager */}
              <button
                type="button"
                onClick={() => handleQuickLogin('MANAGER')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-xs group-hover:bg-blue-500 group-hover:text-slate-950 transition">
                    💼
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                      Login sebagai Store Manager
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Akses stok inventori, komisi staf & riwayat transaksi cabang
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
              </button>

              {/* Cashier */}
              <button
                type="button"
                onClick={() => handleQuickLogin('CASHIER')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                    🖥️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                      Login sebagai Kasir Frontliner
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Langsung diarahkan ke Terminal Kasir POS kecepatan tinggi
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition" />
              </button>
            </div>
          </div>

          {/* Secure SSL notice */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Enterprise Multi-Tenant Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
