// src/app/shared/toast/toast.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.html'
})
export class ToastComponent {
  @Input() message = '';
  @Input() type: 'error' | 'success' | 'warning' = 'error';
  @Input() show = false;

  close() {
    this.show = false;
  }
}
