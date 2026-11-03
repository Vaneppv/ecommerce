import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Input } from './input';

describe('Input Atom', () => {
  let fixture: ComponentFixture<Input>;
  let component: Input;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Input],
    }).compileComponents();

    fixture = TestBed.createComponent(Input);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('enlaza el valor y los atributos del input nativo', () => {
    fixture.componentRef.setInput('value', 'Zapatillas');
    fixture.componentRef.setInput('placeholder', 'Buscar...');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('Zapatillas');
    expect(input.placeholder).toBe('Buscar...');
  });

  it('emite onInput al escribir en el input', () => {
    let emitted = '';
    component.onInput.subscribe((val) => (emitted = val));

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'Nuevo texto';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toBe('Nuevo texto');
  });
});
