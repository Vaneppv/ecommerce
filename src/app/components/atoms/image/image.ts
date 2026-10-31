import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-image',
  styleUrl: './image.css',
  templateUrl: './image.html',
  standalone: true
})
export class Image {
  src = input<string>('');
  alt = input<string>('');
  loading = input<boolean>(true);
  placeholder = input<string>('');
  onLoad = output<void>();
  onError = output<string>();
}
