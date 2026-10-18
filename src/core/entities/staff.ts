export interface StaffMember {
  id: string;
  name: string;
  role: 'CASHIER' | 'BARBER' | 'STYLIST' | 'TECHNICIAN' | 'WAITER' | 'MANAGER';
  phone?: string;
  commissionPercentage: number;
  totalEarningsToday: number;
  isActive: boolean;
}
