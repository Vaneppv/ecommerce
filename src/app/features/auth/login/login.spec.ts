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
        }),
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse y tener el formulario vacío inicialmente', () => {
    expect(component).toBeTruthy();
    expect(component['form'].value).toEqual({ email: '', password: '' });
  });

  it('muestra errores de validación si se envía vacío', () => {
    component.submit();
    fixture.detectChanges();

    expect(component['form'].invalid).toBe(true);
    const errors = fixture.nativeElement.querySelectorAll('.form-error');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('muestra mensaje de error si las credenciales son incorrectas', () => {
    component['form'].setValue({
      email: 'erroneo@tienda.com',
      password: 'password_falso',
    });

    component.submit();
    fixture.detectChanges();

    expect(component['loginError']()).toContain('Correo o contraseña incorrectos');
    const alertEl = fixture.nativeElement.querySelector('app-alert');
    expect(alertEl).toBeTruthy();
  });

  it('inicia sesión correctamente con las credenciales demo y navega', () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl');

    component['form'].setValue({
      email: 'demo@tienda.com',
      password: 'demo1234',
    });

    component.submit();
    fixture.detectChanges();

    expect(authService.isLoggedIn()).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith('/products');
  });

  it('alterna la visibilidad de la contraseña al hacer clic en el botón toggle', () => {
    expect(component['showPassword']()).toBe(false);

    const toggleBtn = fixture.nativeElement.querySelector(
      '.toggle-password-btn',
    ) as HTMLButtonElement;
    toggleBtn.click();
    fixture.detectChanges();

    expect(component['showPassword']()).toBe(true);
    const passInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    expect(passInput.type).toBe('text');

    toggleBtn.click();
    fixture.detectChanges();
    expect(component['showPassword']()).toBe(false);
    expect(passInput.type).toBe('password');
  });

  it('muestra la tarjeta informativa con las credenciales de prueba', () => {
    const demoCard = fixture.nativeElement.querySelector('.demo-card');
    expect(demoCard).toBeTruthy();
    expect(demoCard.textContent).toContain('demo@tienda.com');
    expect(demoCard.textContent).toContain('demo1234');
  });
});
