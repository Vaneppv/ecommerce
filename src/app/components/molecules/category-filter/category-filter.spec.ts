import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFilter } from './category-filter';

describe('CategoryFilter', () => {
  let fixture: ComponentFixture<CategoryFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFilter);
    fixture.componentRef.setInput('categories', ['ropa', 'electrónica']);
    fixture.componentRef.setInput('selectedCategory', 'ropa');
    fixture.detectChanges();
  });

  it('renderiza "Todas" y las categorías con su etiqueta formateada', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'app-category-chip button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent?.trim()).toBe('Todas');
    expect(buttons[1].textContent?.trim()).toBe('Ropa');
    expect(buttons[2].textContent?.trim()).toBe('Electrónica');
  });

  it('marca la categoría seleccionada como activa', () => {
    const buttons = fixture.nativeElement.querySelectorAll(
      'app-category-chip button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons[1].classList.contains('is-active')).toBe(true);
    expect(buttons[0].classList.contains('is-active')).toBe(false);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('marca "Todas" como activa cuando no hay categoría seleccionada', () => {
    fixture.componentRef.setInput('selectedCategory', 'todas');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      'app-category-chip button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons[0].classList.contains('is-active')).toBe(true);
    expect(buttons[1].classList.contains('is-active')).toBe(false);
  });

  it('compara la categoría seleccionada sin distinguir mayúsculas', () => {
    fixture.componentRef.setInput('selectedCategory', 'ROPA');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      'app-category-chip button',
    ) as NodeListOf<HTMLButtonElement>;

    expect(buttons[1].classList.contains('is-active')).toBe(true);
  });

  it('emite "todas" al pulsar el chip de todas las categorías', () => {
    let selected: string | undefined;
    fixture.componentInstance.onCategoryChange.subscribe((value) => (selected = value));

    const buttons = fixture.nativeElement.querySelectorAll(
      'app-category-chip button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[0].click();

    expect(selected).toBe('todas');
  });

  it('emite el valor de la categoría al pulsar un chip', () => {
    let selected: string | undefined;
    fixture.componentInstance.onCategoryChange.subscribe((value) => (selected = value));

    const buttons = fixture.nativeElement.querySelectorAll(
      'app-category-chip button',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[2].click();

    expect(selected).toBe('electrónica');
  });
});
