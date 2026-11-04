import { Injectable, computed, signal } from '@angular/core';
import { User } from './models/user.model';

interface Account {
  email: string;
  password: string;
  name: string;
}

const ACCOUNTS: Account[] = [{ email: 'demo@tienda.com', password: 'demo1234', name: 'Demo' }];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'ecommerce_user';

  readonly user = signal<User | null>(this.load());
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(email: string, password: string): boolean {
    const account = ACCOUNTS.find(
      (a) => a.email === email.trim().toLowerCase() && a.password === password,
    );
    if (!account) return false;

    const user: User = { email: account.email, name: account.name };
    this.user.set(user);
    this.save(user);
    return true;
  }

  logout(): void {
    this.user.set(null);
    this.save(null);
  }

  private load(): User | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  }

  private save(user: User | null): void {
    try {
      if (user) localStorage.setItem(this.storageKey, JSON.stringify(user));
      else localStorage.removeItem(this.storageKey);
    } catch {
    }
  }
}