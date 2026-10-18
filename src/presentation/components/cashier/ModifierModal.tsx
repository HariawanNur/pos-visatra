'use client';

import React, { useState } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { Product, ModifierGroup, ModifierOption } from '../../../core/entities/product';
import { SelectedModifier } from '../../../core/entities/order';
import { formatRupiah } from '../../../application/services/formatters';

interface ModifierModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedModifiers: SelectedModifier[], kitchenNotes?: string) => void;
}

export const ModifierModal: React.FC<ModifierModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selections, setSelections] = useState<Record<string, ModifierOption[]>>({});
  const [kitchenNotes, setKitchenNotes] = useState<string>('');

  if (!isOpen || !product || !product.modifiers) return null;

  const handleToggleOption = (group: ModifierGroup, option: ModifierOption) => {
    const current = selections[group.id] || [];

    if (group.maxSelection === 1) {
      // Single select (radio)
      setSelections({ ...selections, [group.id]: [option] });
    } else {
      // Multi-select (checkbox)
      const exists = current.some((o) => o.id === option.id);
      if (exists) {
        setSelections({
          ...selections,
          [group.id]: current.filter((o) => o.id !== option.id),
        });
      } else {
        if (current.length < group.maxSelection) {
          setSelections({
            ...selections,
            [group.id]: [...current, option],
          });
        }
      }
    }
  };

  const handleConfirm = () => {
    const flattened: SelectedModifier[] = [];
    product.modifiers?.forEach((group) => {
      const chosen = selections[group.id] || [];
      chosen.forEach((opt) => {
        flattened.push({
          groupId: group.id,
          groupName: group.name,
          optionId: opt.id,
          optionName: opt.name,
          priceDelta: opt.priceDelta,
        });
      });
    });

    onConfirm(flattened, kitchenNotes || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h3 className="font-bold text-base text-white">{product.name}</h3>
            <p className="text-xs text-slate-400">Pilih varian, rasa & catatan dapur</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Groups */}
        <div className="p-5 overflow-y-auto space-y-5">
          {product.modifiers.map((group) => {
            const chosen = selections[group.id] || [];

            return (
              <div key={group.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">{group.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {group.required ? '(Wajib)' : '(Opsional)'} • Max {group.maxSelection}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.options.map((opt) => {
                    const isSelected = chosen.some((o) => o.id === opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleOption(group, opt)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white font-medium'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-xs">{opt.name}</span>
                        {opt.priceDelta > 0 && (
                          <span className="text-[11px] text-cyan-400 font-semibold">
                            +{formatRupiah(opt.priceDelta)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Kitchen notes */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 block">
              Catatan Khusus Dapur / Barista
            </label>
            <input
              type="text"
              placeholder="Contoh: Pisahkan sambal, es sedikit..."
              value={kitchenNotes}
              onChange={(e) => setKitchenNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition"
          >
            Tambahkan ke Pesanan
          </button>
        </div>
      </div>
    </div>
  );
};
