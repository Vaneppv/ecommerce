import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconAlertTriangle, IconLogout, provideTablerIcons } from '@tabler/icons-angular';
import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog Molecule', () => {
  let fixture: ComponentFixture<ConfirmDialog>;
  let component: ConfirmDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [provideTablerIcons({ IconAlertTriangle, IconLogout })],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
  });

  it('no renderiza el diálogo si open es false', () => {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.dialog-card');
    expect(dialog).toBeNull();
  });

  it('renderiza título, mensaje y botones cuando open es true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('title', '¿Cerrar sesión?');
    fixture.componentRef.setInput('message', '¿Deseas salir de la cuenta?');
    fixture.componentRef.setInput('confirmText', 'Salir');
    fixture.componentRef.setInput('cancelText', 'Volver');
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.dialog-card');
    expect(dialog).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#dialog-title').textContent).toContain(
      '¿Cerrar sesión?',
    );
    expect(fixture.nativeElement.querySelector('#dialog-desc').textContent).toContain(
      '¿Deseas salir de la cuenta?',
    );

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].textContent).toContain('Volver');
    expect(buttons[1].textContent).toContain('Salir');
  });

  it('emite onConfirm al hacer clic en el botón de confirmar', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    let confirmed = false;
    component.onConfirm.subscribe(() => (confirmed = true));

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();

    expect(confirmed).toBe(true);
  });

  it('emite onCancel al hacer clic en cancelar o en el backdrop', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    let cancelCount = 0;
    component.onCancel.subscribe(() => cancelCount++);

    // Cancel button click
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[0].click();
    expect(cancelCount).toBe(1);

    // Backdrop click
    const backdrop = fixture.nativeElement.querySelector('.dialog-backdrop') as HTMLElement;
    backdrop.click();
    expect(cancelCount).toBe(2);
  });

  it('emite onCancel al presionar la tecla Escape', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    let canceled = false;
    component.onCancel.subscribe(() => (canceled = true));

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(canceled).toBe(true);
  });
});
