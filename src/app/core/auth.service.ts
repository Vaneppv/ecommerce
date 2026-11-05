import { Injectable, computed, signal } from '@angular/core';
import { User } from './models/user.model';

export interface Account {
  email: string;
  password: string;
  name: string;
}

const DEFAULT_ACCOUNTS: Account[] = [
  { email: 'demo@tienda.com', password: 'demo1234', name: 'Demo' },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userStorageKey = 'ecommerce_user';
  private readonly accountsStorageKey = 'ecommerce_accounts';

  readonly user = signal<User | null>(this.loadUser());
  readonly isLoggedIn = computed(() => this.user() !== null);

  getAccounts(): Account[] {
    try {
      const stored = localStorage.getItem(this.accountsStorageKey);
      const parsed: Account[] = stored ? (JSON.parse(stored) as Account[]) : [];
      const map = new Map<string, Account>();
      for (const acc of DEFAULT_ACCOUNTS) {
        map.set(acc.email.toLowerCase(), acc);
      }
      for (const acc of parsed) {
        map.set(acc.email.toLowerCase(), acc);
      }
      return Array.from(map.values());
    } catch {
      return [...DEFAULT_ACCOUNTS];
    }
  }

  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const account = this.getAccounts().find(
      (a) => a.email === normalizedEmail && a.password === password,
    );
    if (!account) return false;

    const user: User = { email: account.email, name: account.name };
    this.user.set(user);
    this.saveUser(user);
    return true;
  }

  register(name: string, email: string, password: string): { success: boolean; error?: string } {
    const cleanName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!cleanName || !normalizedEmail || !password) {
      return { success: false, error: 'Todos los campos son obligatorios.' };
    }

    const accounts = this.getAccounts();
    if (accounts.some((a) => a.email === normalizedEmail)) {
      return {
        success: false,
        error: 'Ya existe una cuenta registrada con este correo electrónico.',
      };
    }

    const newAccount: Account = {
      name: cleanName,
      email: normalizedEmail,
      password,
    };

    try {
      const stored = localStorage.getItem(this.accountsStorageKey);
      const list: Account[] = stored ? (JSON.parse(stored) as Account[]) : [];
      list.push(newAccount);
      localStorage.setItem(this.accountsStorageKey, JSON.stringify(list));
    } catch {
      return { success: false, error: 'No se pudo guardar la cuenta en el almacenamiento local.' };
    }

    const user: User = { email: newAccount.email, name: newAccount.name };
    this.user.set(user);
    this.saveUser(user);
    return { success: true };
  }

  logout(): void {
    this.user.set(null);
    this.saveUser(null);
  }

  private loadUser(): User | null {
    try {
      const stored = localStorage.getItem(this.userStorageKey);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  }

  private saveUser(user: User | null): void {
    try {
      if (user) localStorage.setItem(this.userStorageKey, JSON.stringify(user));
      else localStorage.removeItem(this.userStorageKey);
    } catch {}
  }
}
