export interface Shift {
  id: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  status: 'OPEN' | 'CLOSED';
  
  initialCash: number;       // Modal awal kasir
  cashSalesTotal: number;    // Penjualan tunai tercatat sistem
  nonCashSalesTotal: number; // QRIS, EDC, Transfer
  cashIn: number;            // Uang masuk manual (kas masuk)
  cashOut: number;           // Pengeluaran kas kecil (beli es batu/galon dsb)
  
  expectedCashTotal: number; // initialCash + cashSalesTotal + cashIn - cashOut
  actualClosingCash?: number;// Hitungan fisik uang tunai saat tutup kasir
  cashDifference?: number;   // Selisih (actual - expected)
  notes?: string;
}
