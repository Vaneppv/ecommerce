import { FormControl } from '@angular/forms';
import { cardNumberValidator, expiryValidator, passesLuhn } from './validators';

describe('validators', () => {
  describe('cardNumberValidator', () => {
    it('acepta números de tarjeta válidos con o sin separadores', () => {
      expect(cardNumberValidator(new FormControl('4111111111111111'))).toBeNull();
      expect(cardNumberValidator(new FormControl('4111 1111 1111 1111'))).toBeNull();
      expect(cardNumberValidator(new FormControl('5555-5555-5555-4444'))).toBeNull();
    });

    it('rechaza números con dígito de control inválido', () => {
      expect(cardNumberValidator(new FormControl('4111111111111112'))).toEqual({
        cardNumber: true,
      });
    });

    it('rechaza valores no numéricos o con longitud incorrecta', () => {
      expect(cardNumberValidator(new FormControl('abcd'))).toEqual({ cardNumber: true });
      expect(cardNumberValidator(new FormControl('4111'))).toEqual({ cardNumber: true });
    });

    it('no marca error en un campo vacío (lo cubre required)', () => {
      expect(cardNumberValidator(new FormControl(''))).toBeNull();
    });
  });

  describe('expiryValidator', () => {
    const validator = expiryValidator(() => new Date(2026, 10, 15)); // noviembre de 2026

    it('acepta el mes actual y fechas futuras', () => {
      expect(validator(new FormControl('11/26'))).toBeNull();
      expect(validator(new FormControl('01/30'))).toBeNull();
    });

    it('rechaza fechas vencidas', () => {
      expect(validator(new FormControl('10/26'))).toEqual({ expiry: true });
      expect(validator(new FormControl('12/25'))).toEqual({ expiry: true });
    });

    it('rechaza formatos inválidos', () => {
      expect(validator(new FormControl('13/30'))).toEqual({ expiry: true });
      expect(validator(new FormControl('1/30'))).toEqual({ expiry: true });
      expect(validator(new FormControl('11-30'))).toEqual({ expiry: true });
    });

    it('no marca error en un campo vacío', () => {
      expect(validator(new FormControl(''))).toBeNull();
    });
  });

  it('passesLuhn distingue secuencias válidas e inválidas', () => {
    expect(passesLuhn('79927398713')).toBe(true);
    expect(passesLuhn('79927398710')).toBe(false);
  });
});
