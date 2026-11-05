import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import {
  IconArrowLeft,
  IconCircleX,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
  IconLock,
  IconMail,
  IconUser,
  IconUserPlus,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { AuthService } from '../../../core/auth.service';
import { Login } from './login';

describe('Login Component', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        provideTablerIcons({
          IconLock,
          IconMail,
          IconEye,
          IconEyeOff,
          IconInfoCircle,
          IconCircleX,
          IconArrowLeft,
          IconUser,
          IconUserPlus,
        }),
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse e iniciar en modo login por defecto', () => {
    expect(component).toBeTruthy();
    expect(component['mode']()).toBe('login');
    expect(component['loginForm'].value).toEqual({ email: '', password: '' });
  });

  it('permite alternar entre los modos de login y registro', () => {
    component.setMode('register');
    fixture.detectChanges();
    expect(component['mode']()).toBe('register');

    const titleEl = fixture.nativeElement.querySelector('#auth-title');
    expect(titleEl.textContent).toContain('Crear cuenta');

    component.setMode('login');
    fixture.detectChanges();
    expect(component['mode']()).toBe('login');
    expect(titleEl.textContent).toContain('Iniciar sesión');
  });

  it('muestra errores de validación si se envía el formulario de login vacío', () => {
    component.submitLogin();
    fixture.detectChanges();

    expect(component['loginForm'].invalid).toBe(true);
    const errors = fixture.nativeElement.querySelectorAll('.form-error');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('muestra mensaje de error si las credenciales de login son incorrectas', () => {
    component['loginForm'].setValue({
      email: 'erroneo@tienda.com',
      password: 'password_falso',
    });

    component.submitLogin();
    fixture.detectChanges();

    expect(component['authError']()).toContain('Correo o contraseña incorrectos');
    const alertEl = fixture.nativeElement.querySelector('app-alert');
    expect(alertEl).toBeTruthy();
  });

  it('inicia sesión correctamente con las credenciales demo y navega', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    component['loginForm'].setValue({
      email: 'demo@tienda.com',
      password: 'demo1234',
    });

    component.submitLogin();
    fixture.detectChanges();

    expect(authService.isLoggedIn()).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith('/products');
  });

  it('valida campos obligatorios y coincidencia de contraseñas en modo registro', () => {
    component.setMode('register');
    fixture.detectChanges();

    // Enviar vacío
    component.submitRegister();
    fixture.detectChanges();
    expect(component['registerForm'].invalid).toBe(true);

    // Contraseñas no coincidentes
    component['registerForm'].setValue({
      name: 'Carlos Pérez',
      email: 'carlos@tienda.com',
      password: 'password123',
      confirmPassword: 'distinta_password',
    });
    fixture.detectChanges();

    expect(component['registerForm'].controls.confirmPassword.hasError('mismatch')).toBe(true);
  });

  it('registra una cuenta nueva, persiste en localStorage e inicia sesión automáticamente', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');
    component.setMode('register');
    fixture.detectChanges();

    component['registerForm'].setValue({
      name: 'María López',
      email: 'maria@ejemplo.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.submitRegister();
    fixture.detectChanges();

    expect(authService.isLoggedIn()).toBe(true);
    expect(authService.user()?.name).toBe('María López');
    expect(navigateSpy).toHaveBeenCalledWith('/products');

    // Verificar en localStorage
    const savedAccounts = JSON.parse(localStorage.getItem('ecommerce_accounts') || '[]');
    expect(savedAccounts.some((a: any) => a.email === 'maria@ejemplo.com')).toBe(true);
  });

  it('muestra alerta si se intenta registrar un correo ya existente', () => {
    component.setMode('register');
    fixture.detectChanges();

    component['registerForm'].setValue({
      name: 'Demo Clon',
      email: 'demo@tienda.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.submitRegister();
    fixture.detectChanges();

    expect(component['authError']()).toContain('Ya existe una cuenta registrada');
    const alertEl = fixture.nativeElement.querySelector('app-alert');
    expect(alertEl).toBeTruthy();
  });

  it('alterna la visibilidad de la contraseña en los inputs', () => {
    expect(component['showPassword']()).toBe(false);

    const toggleBtn = fixture.nativeElement.querySelector(
      '.toggle-password-btn',
    ) as HTMLButtonElement;
    toggleBtn.click();
    fixture.detectChanges();

    expect(component['showPassword']()).toBe(true);

    toggleBtn.click();
    fixture.detectChanges();
    expect(component['showPassword']()).toBe(false);
  });
});
