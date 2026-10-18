import { create } from 'zustand';
import { UserSession, UserRole, TenantOutlet, DEMO_TENANTS } from '../../core/entities/user';

export interface DemoAccount {
  email: string;
  role: UserRole;
  roleLabel: string;
  name: string;
  avatarInitials: string;
  passwordHint: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'owner@vistara.co.id',
    role: 'SUPERADMIN',
    roleLabel: 'Owner / CEO Vistara',
    name: 'Arya Wicaksana, M.Kom',
    avatarInitials: 'AW',
    passwordHint: 'admin123',
  },
  {
    email: 'manager@vistara.co.id',
    role: 'MANAGER',
    roleLabel: 'Store / Outlet Manager',
    name: 'Hendra Wijaya',
    avatarInitials: 'HW',
    passwordHint: 'manager123',
  },
  {
    email: 'cashier@vistara.co.id',
    role: 'CASHIER',
    roleLabel: 'Kasir Frontliner',
    name: 'Siti Rahmawati',
    avatarInitials: 'SR',
    passwordHint: 'kasir123',
  },
];

interface AuthState {
  currentUser: UserSession | null;
  isAuthenticated: boolean;
  activeOutlet: TenantOutlet;

  // Actions
  login: (email: string, password: string, outletId?: string) => { success: boolean; errorMessage?: string };
  quickDemoLogin: (role: UserRole, outletId?: string) => void;
  logout: () => void;
  switchOutlet: (outlet: TenantOutlet) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Default session active for smooth client demo out of the box
  currentUser: {
    id: 'usr_owner_01',
    name: 'Arya Wicaksana, M.Kom',
    email: 'owner@vistara.co.id',
    role: 'SUPERADMIN',
    roleLabel: 'Owner / CEO Vistara',
    tenantId: 'tenant_vistara_global',
    tenantName: 'PT VISTARA TEKNOLOGI INDONESIA',
    activeOutlet: DEMO_TENANTS[0],
    avatarInitials: 'AW',
  },
  isAuthenticated: true,
  activeOutlet: DEMO_TENANTS[0],

  login: (email, password, outletId) => {
    const trimmedEmail = email.trim().toLowerCase();
    const demoUser = DEMO_ACCOUNTS.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!demoUser) {
      return {
        success: false,
        errorMessage: 'Akun tidak terdaftar. Gunakan salah satu akun demo Vistara yang tersedia di bawah.',
      };
    }

    if (password !== demoUser.passwordHint && password !== 'admin123' && password !== 'password') {
      return {
        success: false,
        errorMessage: `Kata sandi salah. Gunakan kata sandi demo: ${demoUser.passwordHint}`,
      };
    }

    const targetOutlet = DEMO_TENANTS.find((o) => o.id === outletId) || DEMO_TENANTS[0];

    const session: UserSession = {
      id: `usr_${demoUser.role.toLowerCase()}_01`,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      roleLabel: demoUser.roleLabel,
      tenantId: 'tenant_vistara_global',
      tenantName: 'PT VISTARA TEKNOLOGI INDONESIA',
      activeOutlet: targetOutlet,
      avatarInitials: demoUser.avatarInitials,
    };

    set({
      currentUser: session,
      isAuthenticated: true,
      activeOutlet: targetOutlet,
    });

    return { success: true };
  },

  quickDemoLogin: (role, outletId) => {
    const demoUser = DEMO_ACCOUNTS.find((u) => u.role === role) || DEMO_ACCOUNTS[0];
    const targetOutlet = DEMO_TENANTS.find((o) => o.id === outletId) || DEMO_TENANTS[0];

    const session: UserSession = {
      id: `usr_${demoUser.role.toLowerCase()}_01`,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      roleLabel: demoUser.roleLabel,
      tenantId: 'tenant_vistara_global',
      tenantName: 'PT VISTARA TEKNOLOGI INDONESIA',
      activeOutlet: targetOutlet,
      avatarInitials: demoUser.avatarInitials,
    };

    set({
      currentUser: session,
      isAuthenticated: true,
      activeOutlet: targetOutlet,
    });
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
    });
  },

  switchOutlet: (outlet) => {
    set((state) => ({
      activeOutlet: outlet,
      currentUser: state.currentUser
        ? { ...state.currentUser, activeOutlet: outlet }
        : null,
    }));
  },
}));
