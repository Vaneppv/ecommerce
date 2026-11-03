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
  clicked = false;

  handleClick() {
    this.clicked = true;
  }
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

  it('no está deshabilitado por defecto y tiene las clases correspondientes', () => {
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
    expect(btn.classList.contains('primary')).toBe(true);
    expect(btn.classList.contains('medium')).toBe(true);
  });

  it('se deshabilita cuando disabled es true', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('se deshabilita y muestra spinner cuando loading es true', () => {
    host.loading.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.querySelector('.spinner')).toBeTruthy();
  });

  it('emite onClick cuando se hace clic estando habilitado', () => {
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(host.clicked).toBe(true);
  });
});
