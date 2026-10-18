export type UserRole = 'SUPERADMIN' | 'MANAGER' | 'CASHIER';

export interface TenantOutlet {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  tenantId: string;
  tenantName: string;
  activeOutlet: TenantOutlet;
  avatarInitials: string;
}

export const DEMO_TENANTS: TenantOutlet[] = [
  {
    id: 'out_jkt_01',
    name: 'Vistara Central Flagship (Jakarta)',
    city: 'Jakarta Selatan',
    address: 'Mega Kuningan Tech Center Lt. 8',
  },
  {
    id: 'out_bdg_02',
    name: 'Vistara Eatery & Lounge (Bandung)',
    city: 'Bandung',
    address: 'Jl. Riau No. 45, Dago',
  },
  {
    id: 'out_sby_03',
    name: 'Vistara Mart & Grosir (Surabaya)',
    city: 'Surabaya',
    address: 'Komplek Pergudangan Margomulyo Indah Blok B-2',
  },
];
