import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';
import { Alert } from '../../components/atoms/alert/alert';
import { Button } from '../../components/atoms/button/button';
import { Image } from '../../components/atoms/image/image';
import { AuthService } from '../../core/auth.service';
import { CartService } from '../../core/cart.service';
import { errorMessage } from '../../core/form-errors';
import { Order } from '../../core/models/order.model';
import { OrderService } from '../../core/order.service';
import { cardNumberValidator, expiryValidator } from '../../core/validators';

type FieldName =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'address'
  | 'city'
  | 'postalCode'
  | 'cardName'
  | 'cardNumber'
  | 'expiry'
  | 'cvv';

interface Field {
  name: FieldName;
  label: string;
  type: 'text' | 'email' | 'tel';
  icon: string;
  autocomplete: string;
  placeholder: string;
  inputmode?: 'numeric' | 'tel' | 'text' | 'email';
  patternMessage?: string;
  half?: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    Button,
    Alert,
    Image,
    TablerIconComponent,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  protected readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly orders = inject(OrderService);
  private readonly fb = inject(FormBuilder);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly errorMessage = errorMessage;
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly order = signal<Order | null>(null);

  protected readonly shippingFields: Field[] = [
    {
      name: 'fullName',
      label: 'Nombre completo',
      type: 'text',
      icon: 'user',
      autocomplete: 'name',
      placeholder: 'Ej. María Pérez',
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      icon: 'mail',
      autocomplete: 'email',
      placeholder: 'ejemplo@correo.com',
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'tel',
      icon: 'phone',
      autocomplete: 'tel',
      placeholder: '0414 1234567',
      inputmode: 'tel',
      patternMessage: 'Usa entre 7 y 15 dígitos (puede incluir +, espacios o guiones).',
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      icon: 'map-pin',
      autocomplete: 'street-address',
      placeholder: 'Calle, número, apartamento',
    },
    {
      name: 'city',
      label: 'Ciudad',
      type: 'text',
      icon: 'building',
      autocomplete: 'address-level2',
      placeholder: 'Ej. Caracas',
      half: true,
    },
    {
      name: 'postalCode',
      label: 'Código postal',
      type: 'text',
      icon: 'mail',
      autocomplete: 'postal-code',
      placeholder: '1010',
      inputmode: 'numeric',
      patternMessage: 'El código postal debe tener entre 4 y 6 dígitos.',
      half: true,
    },
  ];

  protected readonly cardNameField: Field = {
    name: 'cardName',
    label: 'Nombre en la tarjeta',
    type: 'text',
    icon: 'user',
    autocomplete: 'cc-name',
    placeholder: 'Como aparece en la tarjeta',
  };

  protected readonly cardNumberField: Field = {
    name: 'cardNumber',
    label: 'Número de tarjeta',
    type: 'text',
    icon: 'credit-card',
    autocomplete: 'cc-number',
    placeholder: '4111 1111 1111 1111',
    inputmode: 'numeric',
  };

  protected readonly expiryField: Field = {
    name: 'expiry',
    label: 'Vencimiento',
    type: 'text',
    icon: 'calendar',
    autocomplete: 'cc-exp',
    placeholder: 'MM/AA',
    inputmode: 'numeric',
    half: true,
  };

  protected readonly cvvField: Field = {
    name: 'cvv',
    label: 'CVV',
    type: 'text',
    icon: 'lock',
    autocomplete: 'cc-csc',
    placeholder: '123',
    inputmode: 'numeric',
    patternMessage: 'El CVV debe tener 3 o 4 dígitos.',
    half: true,
  };

  protected readonly form = this.fb.nonNullable.group({
    fullName: [this.auth.user()?.name ?? '', [Validators.required, Validators.minLength(3)]],
    email: [this.auth.user()?.email ?? '', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s()-]{7,15}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]],
    cardName: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, cardNumberValidator]],
    expiry: ['', [Validators.required, expiryValidator()]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    acceptTerms: [false, [Validators.requiredTrue]],
  });

  /** Agrupa el número de tarjeta de a 4 dígitos mientras se escribe. */
  onCardNumberInput(event: Event): void {
    const digits = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 19);
    this.form.controls.cardNumber.setValue(digits.replace(/(\d{4})(?=\d)/g, '$1 '));
  }

  /** Inserta la barra del formato MM/AA mientras se escribe. */
  onExpiryInput(event: Event): void {
    const digits = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.form.controls.expiry.setValue(
      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits,
    );
  }

  /** Limita el CVV a dígitos. */
  onCvvInput(event: Event): void {
    const digits = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.form.controls.cvv.setValue(digits);
  }

  submit(): void {
    if (this.submitting() || this.cart.items().length === 0) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      afterNextRender(
        () => this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
        { injector: this.injector },
      );
      return;
    }

    const { fullName, email, phone, address, city, postalCode, cardName, cardNumber, expiry, cvv } =
      this.form.getRawValue();

    this.submitting.set(true);
    this.submitError.set(null);

    try {
      this.orders
        .place({
          shipping: { fullName, email, phone, address, city, postalCode },
          payment: { cardName, cardNumber, expiry, cvv },
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (order) => {
            this.order.set(order);
            this.submitting.set(false);
            window.scrollTo({ top: 0 });
          },
          error: () => this.fail(),
        });
    } catch {
      this.fail();
    }
  }

  private fail(): void {
    this.submitting.set(false);
    this.submitError.set('No pudimos procesar tu compra. Inténtalo de nuevo.');
  }
}
