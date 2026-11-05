import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('inicia sin usuario activo si localStorage está vacío', () => {
    expect(service.user()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('inicia sesión correctamente con la cuenta demo predeterminada', () => {
    const success = service.login('demo@tienda.com', 'demo1234');
    expect(success).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.user()?.email).toBe('demo@tienda.com');
    expect(service.user()?.name).toBe('Demo');

    // Verifica persistencia de sesión
    const savedUser = JSON.parse(localStorage.getItem('ecommerce_user') || '{}');
    expect(savedUser.email).toBe('demo@tienda.com');
  });

  it('falla el inicio de sesión con contraseña errónea o correo no registrado', () => {
    expect(service.login('demo@tienda.com', 'incorrecta')).toBe(false);
    expect(service.login('noexiste@correo.com', '123456')).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('registra una nueva cuenta en localStorage e inicia sesión automáticamente', () => {
    const result = service.register('Juan Pérez', 'juan@ejemplo.com', 'secreto123');
    expect(result.success).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.user()?.name).toBe('Juan Pérez');
    expect(service.user()?.email).toBe('juan@ejemplo.com');

    // Verifica que la cuenta se guardó en ecommerce_accounts
    const accounts = JSON.parse(localStorage.getItem('ecommerce_accounts') || '[]');
    expect(accounts.length).toBe(1);
    expect(accounts[0].email).toBe('juan@ejemplo.com');
    expect(accounts[0].name).toBe('Juan Pérez');
  });

  it('rechaza el registro si el correo ya existe (incluyendo demo)', () => {
    const duplicateDemo = service.register('Otro', 'demo@tienda.com', 'clave123');
    expect(duplicateDemo.success).toBe(false);
    expect(duplicateDemo.error).toContain('Ya existe una cuenta registrada');

    service.register('Ana', 'ana@correo.com', 'clave123');
    const duplicateAna = service.register('Ana 2', 'ANA@correo.com', 'otraClave');
    expect(duplicateAna.success).toBe(false);
    expect(duplicateAna.error).toContain('Ya existe una cuenta registrada');
  });

  it('permite iniciar sesión con una cuenta recién registrada', () => {
    service.register('Carlos', 'carlos@tienda.com', 'password99');
    service.logout();
    expect(service.isLoggedIn()).toBe(false);

    const loginOk = service.login('carlos@tienda.com', 'password99');
    expect(loginOk).toBe(true);
    expect(service.user()?.name).toBe('Carlos');
  });

  it('logout limpia la sesión activa pero mantiene las cuentas registradas en localStorage', () => {
    service.register('Lucía', 'lucia@tienda.com', 'pass123');
    service.logout();

    expect(service.user()).toBeNull();
    expect(localStorage.getItem('ecommerce_user')).toBeNull();

    const storedAccounts = JSON.parse(localStorage.getItem('ecommerce_accounts') || '[]');
    expect(storedAccounts.some((a: any) => a.email === 'lucia@tienda.com')).toBe(true);
  });
});
