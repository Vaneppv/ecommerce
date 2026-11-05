import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `
    <app-button
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [loading]="loading()"
      [loadingText]="loadingText()"
      [successFeedback]="successFeedback()"
      [successText]="successText()"
      [successDuration]="successDuration()"
      (onClick)="handleClick()"
    >
      Click me
    </app-button>
  `,
})
class TestHost {
  readonly variant = signal<'primary' | 'secondary' | 'ghost'>('primary');
  readonly size = signal<'small' | 'medium' | 'large' | 'extra-small'>('medium');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  readonly loadingText = signal('Cargando...');
  readonly successFeedback = signal(false);
  readonly successText = signal('Agregado');
  readonly successDuration = signal(1500);
  clicked = 0;

  handleClick() {
    this.clicked += 1;
  }
}

function getButton(fixture: ComponentFixture<TestHost>): HTMLButtonElement {
  return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
}

describe('Button Atom', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('no está deshabilitado por defecto y tiene las clases correspondientes', () => {
    const btn = getButton(fixture);
    expect(btn.disabled).toBe(false);
    expect(btn.classList.contains('primary')).toBe(true);
    expect(btn.classList.contains('medium')).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBeNull();
  });

  it('se deshabilita cuando disabled es true', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const btn = getButton(fixture);
    expect(btn.disabled).toBe(true);
  });

  it('se deshabilita, muestra el spinner y aria-busy cuando loading es true', () => {
    host.loading.set(true);
    host.loadingText.set('Procesando...');
    fixture.detectChanges();

    const btn = getButton(fixture);
    expect(btn.disabled).toBe(true);
    expect(btn.querySelector('.spinner')).toBeTruthy();
    expect(btn.textContent).toContain('Procesando...');
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });

  it('emite onClick cuando se hace clic estando habilitado', () => {
    const btn = getButton(fixture);
    btn.click();

    expect(host.clicked).toBe(1);
    expect(btn.querySelector('.btn-feedback')).toBeNull();
    expect(btn.classList.contains('is-success')).toBe(false);
  });

  it('muestra feedback de éxito y vuelve al contenido original', () => {
    vi.useFakeTimers();
    host.successFeedback.set(true);
    fixture.detectChanges();

    const btn = getButton(fixture);
    btn.click();
    fixture.detectChanges();

    expect(btn.classList.contains('is-success')).toBe(true);
    expect(btn.querySelector('.btn-feedback')?.textContent).toContain('Agregado');
    expect(btn.querySelector('.btn-content')?.classList.contains('is-hidden')).toBe(true);

    vi.advanceTimersByTime(1500);
    fixture.detectChanges();

    expect(btn.classList.contains('is-success')).toBe(false);
    expect(btn.querySelector('.btn-feedback')).toBeNull();
    expect(btn.querySelector('.btn-content')?.classList.contains('is-hidden')).toBe(false);
    expect(host.clicked).toBe(1);
  });

  it('permite clics repetidos y reinicia el temporizador del feedback', () => {
    vi.useFakeTimers();
    host.successFeedback.set(true);
    fixture.detectChanges();

    const btn = getButton(fixture);
    btn.click();
    fixture.detectChanges();

    vi.advanceTimersByTime(1000);
    btn.click();
    fixture.detectChanges();

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(host.clicked).toBe(2);
    expect(btn.classList.contains('is-success')).toBe(true);

    vi.advanceTimersByTime(500);
    fixture.detectChanges();

    expect(btn.classList.contains('is-success')).toBe(false);
  });

  it('no emite ni muestra feedback si está deshabilitado', () => {
    host.disabled.set(true);
    host.successFeedback.set(true);
    fixture.detectChanges();

    const btn = getButton(fixture);
    btn.click();
    fixture.detectChanges();

    expect(host.clicked).toBe(0);
    expect(btn.querySelector('.btn-feedback')).toBeNull();
  });

  it('usa el texto de éxito personalizado', () => {
    vi.useFakeTimers();
    host.successFeedback.set(true);
    host.successText.set('Añadido');
    fixture.detectChanges();

    const btn = getButton(fixture);
    btn.click();
    fixture.detectChanges();

    expect(btn.querySelector('.btn-feedback')?.textContent).toContain('Añadido');
  });
});
