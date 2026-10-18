import { IndustryMode } from '../types/industry';

export interface WholesaleTier {
  id: string;
  minQuantity: number;
  unitPrice: number;
  label?: string; // e.g., "Grosir > 10 pcs"
}

export interface ModifierOption {
  id: string;
  name: string;
  priceDelta: number; // e.g. +Rp 3.000 for Extra Boba
}

export interface ModifierGroup {
  id: string;
  name: string; // e.g., "Level Gula", "Pilihan Topping"
  required: boolean;
  minSelection: number;
  maxSelection: number;
  options: ModifierOption[];
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  costPrice: number;
  stock: number;
  unit: string; // e.g. 'pcs', 'porsi', 'jam', 'dus'
  imageUrl?: string;
  targetIndustry: IndustryMode[]; // which industry mode this item appears in
  
  // Specific for Wholesale
  wholesaleTiers?: WholesaleTier[];
  
  // Specific for F&B
  modifiers?: ModifierGroup[];
  isKitchenItem?: boolean;
  
  // Specific for Services (Barbershop, Bengkel, Salon)
  isService?: boolean;
  serviceDurationMinutes?: number;
  commissionPercentage?: number;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
