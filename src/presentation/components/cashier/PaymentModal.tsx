'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Banknote,
  QrCode,
  CreditCard,
  Building,
  FileClock,
  CheckCircle,
  AlertCircle,
  Printer,
  Sparkles,
} from 'lucide-react';
import { usePosStore } from '../../store/pos-store';
import { useBusinessStore } from '../../store/business-store';
import { PaymentMethod } from '../../../core/types/industry';
import { formatRupiah } from '../../../application/services/formatters';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const {
    getTotals,
    discountAmount,
    setDiscountAmount,
    selectedCustomer,
    executeCheckout,
  } = usePosStore();

  const { config } = useBusinessStore();
  const totals = getTotals();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set default cash tendered to grandTotal when opening modal
  useEffect(() => {
    if (isOpen) {
      setCashReceived(totals.grandTotal);
      setErrorMsg(null);
    }
  }, [isOpen, totals.grandTotal]);

  if (!isOpen) return null;

  const cashChange = Math.max(0, cashReceived - totals.grandTotal);

  const quickCashAmounts = [
    totals.grandTotal, // Uang Pas
    Math.ceil(totals.grandTotal / 50000) * 50000,
    100000,
    200000,
    500000,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= totals.grandTotal);

  const handleConfirmPayment = () => {
    setErrorMsg(null);

    const res = executeCheckout(
      paymentMethod,
      paymentMethod === 'CASH' ? cashReceived : undefined,
      paymentRef || undefined,
      notes || undefined
    );

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.errorMessage || 'Terjadi kesalahan saat memproses pembayaran');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-750 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white">Pembayaran & Selesai</h3>
            <p className="text-[11px] sm:text-xs text-slate-400">
              {config.companyLegalName} • {config.storeName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Total Due Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-medium">
                Total Tagihan
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {formatRupiah(totals.grandTotal)}
              </div>
            </div>
            {selectedCustomer && (
              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-850">
                <span className="text-[10px] sm:text-[11px] text-slate-400">Pelanggan</span>
                <div className="text-xs sm:text-sm font-semibold text-white">{selectedCustomer.name}</div>
                {selectedCustomer.allowKasbon && (
                  <div className="text-[11px] sm:text-xs text-amber-400">
                    Sisa Limit Kasbon: {formatRupiah(selectedCustomer.kasbonLimit - selectedCustomer.kasbonBalance)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'CASH'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs">Tunai (Cash)</span>
              </button>

              <button
                onClick={() => setPaymentMethod('QRIS')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'QRIS'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs">QRIS Dinamis</span>
              </button>

              <button
                onClick={() => setPaymentMethod('DEBIT_CARD')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'DEBIT_CARD'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Kartu Debit / EDC</span>
              </button>

              <button
                onClick={() => setPaymentMethod('TEMPO_KASBON')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'TEMPO_KASBON'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <FileClock className="w-5 h-5" />
                <span className="text-xs">Tempo / Kasbon</span>
              </button>
            </div>
          </div>

          {/* CASH Method Controls */}
          {paymentMethod === 'CASH' && (
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block">
                Uang Diterima dari Pelanggan
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  Rp
                </span>
                <input
                  type="number"
                  value={cashReceived || ''}
                  onChange={(e) => setCashReceived(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xl font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Quick Cash Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {quickCashAmounts.map((amt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCashReceived(amt)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                  >
                    {amt === totals.grandTotal ? 'Uang Pas' : formatRupiah(amt)}
                  </button>
                ))}
              </div>

              {/* Change calculation */}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Kembalian:</span>
                <span
                  className={`text-xl font-black ${
                    cashReceived >= totals.grandTotal ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {formatRupiah(cashChange)}
                </span>
              </div>
            </div>
          )}

          {/* QRIS Method Controls */}
          {paymentMethod === 'QRIS' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-44 h-44 bg-white rounded-xl p-3 flex items-center justify-center shadow-lg">
                {/* Simulated QR Code Canvas */}
                <div className="w-full h-full bg-slate-900 rounded p-2 flex flex-col items-center justify-center text-center">
                  <QrCode className="w-20 h-20 text-white mb-1" />
                  <span className="text-[10px] text-white font-mono font-bold">QRIS STANDAR</span>
                  <span className="text-[9px] text-slate-400">PT VISTARA TEKNOLOGI</span>
                </div>
              </div>
              <div className="text-xs text-slate-300">
                Arahkan aplikasi m-Banking (BCA, Mandiri, BRI, GoPay, OVO, Dana) ke QR di atas.
              </div>
            </div>
          )}

          {/* CARD / EDC Method Controls */}
          {(paymentMethod === 'DEBIT_CARD' || paymentMethod === 'CREDIT_CARD') && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Nomor Kartu / No. Approval EDC (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: BCA-EDC 982173 / 4 Digit Terakhir"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* TEMPO / KASBON Method Controls */}
          {paymentMethod === 'TEMPO_KASBON' && (
            <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <FileClock className="w-4 h-4" />
                <span>Transaksi Kasbon / Piutang Usaha</span>
              </div>
              {!selectedCustomer ? (
                <p className="text-red-400 font-medium">
                  Harap pilih data pelanggan terlebih dahulu sebelum memilih metode Kasbon.
                </p>
              ) : (
                <div className="text-slate-300 space-y-1">
                  <p>Pelanggan: <strong className="text-white">{selectedCustomer.name}</strong></p>
                  <p>Plafon Kredit: <strong>{formatRupiah(selectedCustomer.kasbonLimit)}</strong></p>
                  <p>Hutang Saat Ini: <strong>{formatRupiah(selectedCustomer.kasbonBalance)}</strong></p>
                  <p className="text-amber-300 font-semibold pt-1">
                    Total Setelah Transaksi: {formatRupiah(selectedCustomer.kasbonBalance + totals.grandTotal)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Batal
          </button>

          <button
            onClick={handleConfirmPayment}
            disabled={paymentMethod === 'CASH' && cashReceived < totals.grandTotal}
            className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Selesaikan & Cetak Struk</span>
          </button>
        </div>
      </div>
    </div>
  );
};
