import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
  provideTablerIcons,
} from '@tabler/icons-angular';
import { Alert } from './alert';

describe('Alert Atom', () => {
  let fixture: ComponentFixture<Alert>;
  let component: Alert;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [Alert],
      providers: [
        provideTablerIcons({
          IconCircleCheck,
          IconCircleX,
          IconAlertTriangle,
          IconInfoCircle,
        }),
      ],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function createAlert(
    inputs: Partial<{ type: any; closable: boolean; timeout: number | null; message: string }> = {},
  ) {
    fixture = TestBed.createComponent(Alert);
    component = fixture.componentInstance;

    if (inputs.type !== undefined) fixture.componentRef.setInput('type', inputs.type);
    if (inputs.closable !== undefined) fixture.componentRef.setInput('closable', inputs.closable);
    if (inputs.timeout !== undefined) fixture.componentRef.setInput('timeout', inputs.timeout);
    if (inputs.message !== undefined) fixture.componentRef.setInput('message', inputs.message);

    fixture.detectChanges();
    return { fixture, component };
  }

  it('renderiza el mensaje y aplica las clases CSS correspondientes según el tipo', () => {
    const { fixture } = createAlert({ type: 'success', message: 'Operación exitosa' });
    const alertEl = fixture.nativeElement.querySelector('.alert');

    expect(alertEl.textContent).toContain('Operación exitosa');
    expect(alertEl.classList.contains('alert-success')).toBe(true);
    expect(alertEl.classList.contains('alert-error')).toBe(false);
  });

  it('se cierra automáticamente tras cumplirse el timeout programado', () => {
    let closed = false;
    const { component } = createAlert({ timeout: 2 });
    component.onClose.subscribe(() => (closed = true));

    vi.advanceTimersByTime(1999);
    expect(closed).toBe(false);

    vi.advanceTimersByTime(2);
    expect(closed).toBe(true);
  });

  it('no programa auto-cierre cuando timeout es null o menor o igual a 0', () => {
    let closed = false;
    const { component } = createAlert({ timeout: 0 });
    component.onClose.subscribe(() => (closed = true));

    vi.advanceTimersByTime(5000);
    expect(closed).toBe(false);
  });

  it('al cerrar manualmente con el botón se emite onClose y se cancela el timer evitando doble emisión', () => {
    let closeCallCount = 0;
    const { fixture, component } = createAlert({ timeout: 3, closable: true });
    component.onClose.subscribe(() => closeCallCount++);

    // Clic manual antes del timeout
    vi.advanceTimersByTime(1000);
    const closeBtn = fixture.nativeElement.querySelector('.alert-close') as HTMLButtonElement;
    closeBtn.click();

    expect(closeCallCount).toBe(1);

    // Avanzamos el tiempo más allá del timeout original
    vi.advanceTimersByTime(3000);
    // Debe mantenerse en 1 llamada, sin emitir nuevamente
    expect(closeCallCount).toBe(1);
  });

  it('limpia el timer al destruirse el componente sin lanzar errores', () => {
    let closed = false;
    const { fixture, component } = createAlert({ timeout: 2 });
    component.onClose.subscribe(() => (closed = true));

    fixture.destroy();
    vi.advanceTimersByTime(3000);

    expect(closed).toBe(false);
  });
});
