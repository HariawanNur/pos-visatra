'use client';

import React from 'react';
import { Printer, Check, X, ArrowLeft, Share2 } from 'lucide-react';
import { usePosStore } from '../../store/pos-store';
import { useBusinessStore } from '../../store/business-store';
import { formatRupiah, formatIndoDateTime } from '../../../application/services/formatters';

export const ThermalReceiptModal: React.FC = () => {
  const { lastCompletedOrder, isReceiptModalOpen, closeReceiptModal } = usePosStore();
  const { config } = useBusinessStore();

  if (!isReceiptModalOpen || !lastCompletedOrder) return null;

  const order = lastCompletedOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Actions */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
            <Check className="w-4 h-4" />
            <span>Transaksi Berhasil</span>
          </div>
          <button
            onClick={closeReceiptModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 flex justify-center">
          <div
            id="thermal-receipt-area"
            className="w-full max-w-[340px] bg-white text-black p-5 rounded shadow-md font-mono text-[12px] leading-relaxed selection:bg-none"
          >
            {/* Header: PT VISTARA & Store */}
            <div className="text-center pb-3 border-b border-dashed border-gray-400 space-y-0.5">
              <div className="font-extrabold text-sm uppercase tracking-tight text-black">
                {config.storeName}
              </div>
              <div className="text-[10px] text-gray-700 font-sans font-bold">
                {config.companyLegalName}
              </div>
              <div className="text-[10px] text-gray-600 leading-tight">
                {config.storeAddress}
              </div>
              <div className="text-[10px] text-gray-600">
                Telp: {config.storePhone}
              </div>
              {config.taxIdentificationNumber && (
                <div className="text-[9px] text-gray-500">
                  NPWP: {config.taxIdentificationNumber}
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>No. Invoice:</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{formatIndoDateTime(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{order.cashierName}</span>
              </div>
              {order.tableNumber && (
                <div className="flex justify-between font-bold">
                  <span>Meja / Lokasi:</span>
                  <span>{order.tableNumber}</span>
                </div>
              )}
              {order.customer && (
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span>{order.customer.name}</span>
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="py-2 border-b border-dashed border-gray-400 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold">{item.productName}</div>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="text-[10px] text-gray-600 pl-2">
                      {item.modifiers.map((m) => m.optionName).join(', ')}
                    </div>
                  )}
                  {item.assignedStaffName && (
                    <div className="text-[10px] text-gray-600 pl-2">
                      Petugas: {item.assignedStaffName}
                    </div>
                  )}
                  <div className="flex justify-between text-[11px]">
                    <span>
                      {item.quantity} x {formatRupiah(item.unitPrice)}
                    </span>
                    <span className="font-semibold">{formatRupiah(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span>Diskon</span>
                  <span>-{formatRupiah(order.discountAmount)}</span>
                </div>
              )}
              {order.serviceChargeAmount > 0 && (
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>{formatRupiah(order.serviceChargeAmount)}</span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>PPN ({order.taxPercent}%)</span>
                  <span>{formatRupiah(order.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[13px] font-black pt-1 border-t border-dotted border-gray-300">
                <span>TOTAL</span>
                <span>{formatRupiah(order.grandTotal)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Metode Bayar:</span>
                <span className="font-bold">{order.paymentMethod}</span>
              </div>
              {order.paymentMethod === 'CASH' && (
                <>
                  <div className="flex justify-between">
                    <span>Tunai Diterima:</span>
                    <span>{formatRupiah(order.cashReceived || order.grandTotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Kembalian:</span>
                    <span>{formatRupiah(order.cashChange || 0)}</span>
                  </div>
                </>
              )}
              {order.paymentReference && (
                <div className="flex justify-between text-[10px]">
                  <span>Ref / EDC:</span>
                  <span>{order.paymentReference}</span>
                </div>
              )}
            </div>

            {/* Footer / Branding */}
            <div className="pt-3 text-center text-[10px] text-gray-600 space-y-1">
              <p className="whitespace-pre-line">{config.receiptFooterMessage}</p>
              <div className="pt-2 text-[9px] text-gray-400">
                Sistem POS dikembangkan oleh:
                <br />
                <strong>{config.companyLegalName}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={closeReceiptModal}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Transaksi Baru
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
