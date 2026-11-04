import { Component, HostListener, input, output } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { Button } from '../../atoms/button/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [TablerIconComponent, Button],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  open = input<boolean>(false);
  title = input<string>('¿Confirmar acción?');
  message = input<string>('');
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');
  confirmVariant = input<'primary' | 'secondary' | 'ghost'>('primary');
  icon = input<string>('alert-triangle');

  onConfirm = output<void>();
  onCancel = output<void>();

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.open()) {
      this.cancel();
    }
  }

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
