import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passesLuhn(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

export const cardNumberValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const digits = String(control.value ?? '').replace(/[\s-]/g, '');
  if (!digits) return null;
  return /^\d{13,19}$/.test(digits) && passesLuhn(digits) ? null : { cardNumber: true };
};

export function expiryValidator(now: () => Date = () => new Date()): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) return null;

    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
    if (!match) return { expiry: true };

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    const today = now();
    const expired =
      year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth() + 1);

    return expired ? { expiry: true } : null;
  };
}
