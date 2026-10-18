export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  tier: 'REGULAR' | 'VIP' | 'WHOLESALE_PARTNER';
  loyaltyPoints: number;
  
  // Kasbon / Tempo (Accounts Receivable) for B2B/Wholesale/Warung
  allowKasbon: boolean;
  kasbonLimit: number;
  kasbonBalance: number; // Current unpaid balance
  
  notes?: string;
  createdAt: string;
}
