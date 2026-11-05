import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TablerIconComponent],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {}
