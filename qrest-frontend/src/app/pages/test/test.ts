import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-test',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <h1 class="text-4xl font-bold text-green-600 mb-4">✅ Angular funciona correctamente</h1>
      <p class="text-lg">Esta es una página de prueba sin dependencias del backend.</p>
      <p class="mt-4">Fecha actual: {{ currentDate }}</p>
      <div class="mt-8 p-4 bg-blue-100 rounded">
        <h2 class="font-bold">Estado de la aplicación:</h2>
        <ul class="list-disc ml-6 mt-2">
          <li>✅ Angular se inicializa correctamente</li>
          <li>✅ El routing funciona</li>
          <li>✅ Los componentes se renderizan</li>
          <li>✅ Tailwind CSS funciona</li>
        </ul>
      </div>
    </div>
  `
})
export class TestComponent {
    currentDate = new Date().toLocaleString();
}
