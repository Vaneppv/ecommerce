import { AbstractControl } from '@angular/forms';

export function errorMessage(
  control: AbstractControl | null,
  patternMessage?: string,
): string | null {
  if (!control || !control.invalid || !(control.touched || control.dirty)) return null;

  const errors = control.errors ?? {};
  if (errors['required']) return 'Este campo es obligatorio.';
  if (errors['email']) return 'Ingresa un correo válido.';
  if (errors['minlength']) {
    return `Escribe al menos ${errors['minlength'].requiredLength} caracteres.`;
  }
  if (errors['pattern']) return patternMessage ?? 'Revisa el formato.';
  if (errors['cardNumber']) return 'Número de tarjeta inválido.';
  if (errors['expiry']) return 'Fecha inválida o vencida (usa MM/AA).';
  return 'Valor no válido.';
}