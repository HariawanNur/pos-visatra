'use client';

import React from 'react';
import { X, UserCheck, Scissors, Wrench, Sparkles } from 'lucide-react';
import { Product } from '../../../core/entities/product';
import { StaffMember } from '../../../core/entities/staff';
import { useBusinessStore } from '../../store/business-store';
import { formatRupiah } from '../../../application/services/formatters';

interface StaffAssignModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (staff: StaffMember) => void;
}

export const StaffAssignModal: React.FC<StaffAssignModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { staff } = useBusinessStore();

  if (!isOpen || !product) return null;

  const activeStaff = staff.filter((s) => s.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div>
            <h3 className="font-bold text-base text-white">Tugaskan Petugas / Kapster</h3>
            <p className="text-xs text-slate-400">
              Layanan: <strong className="text-slate-200">{product.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Staff List */}
        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {activeStaff.map((member) => {
            const commissionEst = Math.round(
              (product.basePrice * (member.commissionPercentage || 0)) / 100
            );

            return (
              <button
                key={member.id}
                onClick={() => {
                  onConfirm(member);
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/60 flex items-center justify-between transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200 group-hover:text-white">
                      {member.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Peran: {member.role} • Komisi: {member.commissionPercentage}%
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500">Estimasi Komisi</div>
                  <div className="text-xs font-semibold text-emerald-400">
                    {formatRupiah(commissionEst)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
