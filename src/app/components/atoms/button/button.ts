import { Component, input, OnDestroy, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
  standalone: true,
})
export class Button implements OnDestroy {
  variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  size = input<'small' | 'medium' | 'large' | 'extra-small'>('medium');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  loadingText = input('Cargando...');
  successFeedback = input<boolean>(false);
  successText = input('Agregado');
  successDuration = input<number>(1500);
  onClick = output<void>();

  protected readonly showSuccess = signal(false);
  private feedbackTimer?: ReturnType<typeof setTimeout>;

  handleClick() {
    if (this.disabled() || this.loading()) return;

    this.onClick.emit();

    if (!this.successFeedback()) return;

    this.showSuccess.set(true);
    clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(
      () => this.showSuccess.set(false),
      Math.max(0, this.successDuration()),
    );
  }

  ngOnDestroy() {
    clearTimeout(this.feedbackTimer);
  }
}
