import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastEvent } from './toast.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div class="fixed bottom-6 right-6 z-50">
        <div
          class="flex items-center gap-3 max-w-md px-4 py-3 rounded shadow-lg text-white transition-transform duration-200"
          [class.bg-red-600]="type() === 'error'"
          [class.bg-green-600]="type() === 'success'"
          [class.bg-yellow-500]="type() === 'warning'"
        >
          <div class="flex-1">
            <div class="font-medium">{{ message() }}</div>
          </div>
          <button (click)="hide()" class="ml-2 px-2 py-1 rounded hover:opacity-90" aria-label="Cerrar">✕</button>
        </div>
      </div>
    }
  `
})
export class ToastHostComponent {
  message = signal('');
  type = signal<ToastEvent['type']>('error');
  visible = signal(false);
  private timeoutId: any = null;

  constructor(private toast: ToastService) {
    // Nos suscribimos a emisiones del servicio
    this.toast.onToast().subscribe(evt => this.show(evt));
  }

  private show(evt: ToastEvent) {
    // Cancelar toast anterior si existe
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.message.set(evt.message);
    this.type.set(evt.type ?? 'error');
    this.visible.set(true);

    this.timeoutId = setTimeout(() => {
      this.visible.set(false);
      this.timeoutId = null;
    }, evt.durationMs ?? 3000);
  }

  hide() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.visible.set(false);
  }
}
