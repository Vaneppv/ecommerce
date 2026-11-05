import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';
import { Button } from '../../../components/atoms/button/button';
import { Alert } from '../../../components/atoms/alert/alert';
import { AuthService } from '../../../core/auth.service';
import { errorMessage } from '../../../core/form-errors';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) return null;
  if (confirmPassword.errors && !confirmPassword.errors['mismatch']) return null;
  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ mismatch: true });
    return { mismatch: true };
  } else {
    confirmPassword.setErrors(null);
    return null;
  }
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Button, Alert, TablerIconComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  protected readonly errorMessage = errorMessage;
  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly authError = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly registerForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordMatchValidator] },
  );

  setMode(newMode: 'login' | 'register') {
    this.mode.set(newMode);
    this.authError.set(null);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    if (this.auth.login(email, password)) {
      this.redirectAfterAuth();
    } else {
      this.authError.set('Correo o contraseña incorrectos.');
    }
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.getRawValue();
    const result = this.auth.register(name, email, password);
    if (result.success) {
      this.redirectAfterAuth();
    } else {
      this.authError.set(result.error ?? 'Ocurrió un error al registrar la cuenta.');
    }
  }

  private redirectAfterAuth() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/products');
  }
}
