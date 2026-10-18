'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Receipt,
  Users,
  Settings,
  ShieldCheck,
  ArrowLeft,
  BarChart3,
  ClipboardList,
  Utensils,
  UserCheck,
} from 'lucide-react';
import { useBusinessStore } from '../../presentation/store/business-store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { config } = useBusinessStore();

  const navigation = [
    { name: 'Ringkasan & Metrik', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Laporan & Analitik Bisnis', href: '/dashboard/reports', icon: BarChart3, highlight: true },
    { name: 'Katalog Produk & Harga', href: '/dashboard/products', icon: Package },
    { name: 'Stok Opname & Mutasi', href: '/dashboard/inventory', icon: ClipboardList },
    { name: 'Riwayat Transaksi & Struk', href: '/dashboard/orders', icon: Receipt },
    { name: 'Pelanggan & Kasbon', href: '/dashboard/customers', icon: Users },
    { name: 'Staf & Bagi Hasil Komisi', href: '/dashboard/staff', icon: UserCheck },
    { name: 'Denah Meja Resto & Cafe', href: '/dashboard/tables', icon: Utensils },
    { name: 'Pengaturan PT Vistara', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between select-none">
        <div className="flex-1 overflow-y-auto">
          {/* Brand */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  <span className="truncate">{config.productName}</span>
                </div>
                <div className="text-[10px] text-cyan-400 truncate font-semibold">
                  {config.companyLegalName}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Return to POS Terminal */}
          <div className="p-3">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition duration-150"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Buka Kasir POS Terminal</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                      : item.highlight
                      ? 'text-cyan-300 hover:text-white hover:bg-slate-850 bg-cyan-950/20 border border-cyan-800/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1 bg-slate-950/40">
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium">PT Vistara Teknologi Indonesia</span>
          </div>
          <div>Versi: {config.systemVersion}</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
