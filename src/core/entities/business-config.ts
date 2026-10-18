import { IndustryMode } from '../types/industry';

export interface BusinessConfig {
  // Corporate Identity
  companyLegalName: string; // PT VISTARA TEKNOLOGI INDONESIA
  productName: string;      // VISTARA POS Enterprise
  systemVersion: string;    // v2.5-omni
  brandWebsite: string;     // https://vistara.co.id
  supportContact: string;   // support@vistara.co.id / +62 812-3456-7890
  
  // Store / Outlet Info (Editable by merchant)
  storeName: string;
  storeAddress: string;
  storePhone: string;
  taxIdentificationNumber?: string; // NPWP
  
  // Operational Settings
  defaultIndustryMode: IndustryMode;
  taxRatePercent: number;       // e.g. 11 for PPN 11% or 0
  serviceChargePercent: number; // e.g. 5 for resto service charge
  currencySymbol: string;       // "Rp"
  receiptPrinterWidth: '58mm' | '80mm';
  receiptFooterMessage: string;
  enableSoundAlerts: boolean;
  enableStockWarning: boolean;
  autoPrintReceipt: boolean;
}

export const DEFAULT_VISTARA_CONFIG: BusinessConfig = {
  companyLegalName: "PT VISTARA TEKNOLOGI INDONESIA",
  productName: "VISTARA OMNI-POS",
  systemVersion: "2.5.0-PRO",
  brandWebsite: "https://vistara.co.id",
  supportContact: "support@vistara.co.id | (+62) 811-7000-888",
  
  storeName: "Vistara Flagship Store & Lounge",
  storeAddress: "Mega Kuningan Tech Center Lt. 8, Jakarta Selatan",
  storePhone: "(021) 5088-9999",
  taxIdentificationNumber: "01.234.567.8-012.000 (PT Vistara Teknologi Indonesia)",
  
  defaultIndustryMode: "HYBRID",
  taxRatePercent: 11, // PPN 11%
  serviceChargePercent: 0,
  currencySymbol: "Rp",
  receiptPrinterWidth: "80mm",
  receiptFooterMessage: "Terima kasih atas kunjungan Anda!\nPowered by PT VISTARA TEKNOLOGI INDONESIA",
  enableSoundAlerts: true,
  enableStockWarning: true,
  autoPrintReceipt: false,
};
