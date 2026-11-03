import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryChip } from './category-chip';

describe('CategoryChip', () => {
  let fixture: ComponentFixture<CategoryChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryChip],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryChip);
    fixture.componentRef.setInput('label', 'Belleza');
    fixture.componentRef.setInput('value', 'beauty');
    fixture.detectChanges();
  });

  it('renderiza la etiqueta y usa un botón', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('Belleza');
    expect(button.type).toBe('button');
  });

  it('emite su valor al hacer clic', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    let selected: string | undefined;
    fixture.componentInstance.selected.subscribe((value) => (selected = value));

    button.click();

    expect(selected).toBe('beauty');
  });

  it('marca el estado activo con clase y aria-pressed', () => {
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('is-active')).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('no marca el estado activo por defecto', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('is-active')).toBe(false);
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
