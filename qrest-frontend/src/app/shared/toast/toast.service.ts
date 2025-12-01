import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'error' | 'success' | 'warning';

export interface ToastEvent {
  message: string;
  type?: ToastType;
  durationMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private subject = new Subject<ToastEvent>();

  constructor(private ngZone: NgZone) {}

  // Emite un toast (llama desde fuera de zone es seguro)
  show(message: string, type: ToastType = 'error', durationMs = 3000) {
    // Aseguramos que la emisión se haga dentro de la zone para que el host detecte cambios
    this.ngZone.run(() => this.subject.next({ message, type, durationMs }));
  }

  onToast(): Observable<ToastEvent> {
    return this.subject.asObservable();
  }
}
