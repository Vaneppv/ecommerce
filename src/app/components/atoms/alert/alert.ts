import { Component, input, output } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';

@Component({
  standalone: true,
  imports: [TablerIconComponent],
  selector: 'app-alert',
  styleUrl: './alert.css',
  templateUrl: './alert.html'
})
export class Alert {
  type = input<'success' | 'error' | 'warning' | 'info'> ('info');
  closable = input<boolean>(true);
  timeout = input<number | null>(3);
  message = input<string>('');
  onClose = output<void>();

  private timer: any;

  ngOnInit() {
    if (this.timeout() != null) {
      this.timer = setTimeout(() => {
        this.onClose.emit();
      }, (this.timeout() ?? 3) * 1000);
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  getIconName(): string {
    switch (this.type()) {
      case 'success': return 'circle-check';
      case 'error': return 'circle-x';
      case 'warning': return 'alert-triangle';
      case 'info': return 'info-circle';
      default: return 'info-circle';
    }
  }

  getIconColor(): string {
    switch (this.type()) {
      case 'success': return '#059669';
      case 'error': return '#DC2626';
      case 'warning': return '#F59E0B';
      case 'info': return '#2563EB';
      default: return '#6B7280';
    }
  }
}