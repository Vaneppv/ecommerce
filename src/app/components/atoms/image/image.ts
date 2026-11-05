import { Component, input, output, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-image',
  styleUrl: './image.css',
  templateUrl: './image.html',
  standalone: true,
})
export class Image {
  src = input<string>('');
  alt = input<string>('');
  loading = input<boolean>(true);
  placeholder = input<string>('');

  onLoad = output<void>();
  onError = output<string>();

  readonly isLoaded = signal(false);
  readonly hasError = signal(false);

  private readonly fallbackSrc =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="%23c9964a" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';

  getImageSrc(): string {
    if (this.hasError() || !this.src()) {
      return this.placeholder() || this.fallbackSrc;
    }
    return this.src();
  }

  handleLoad() {
    this.isLoaded.set(true);
    this.onLoad.emit();
  }

  handleError() {
    this.hasError.set(true);
    this.onError.emit('Error al cargar la imagen');
  }
}
