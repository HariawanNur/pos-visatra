import { TableStatus } from '../types/industry';

export interface RestaurantTable {
  id: string;
  number: string; // e.g. "Meja 01", "VIP-A"
  zone: string;   // e.g. "Indoor AC", "Outdoor / Smoking", "Lantai 2"
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  guestCount?: number;
}
