import { Dish } from './dish.model';

export interface Menu {
  id?: number;
  nombre: string;
  platillos: Dish[];     // lista de objetos (o solo ids, según backend)
  platillosIds?: number[]; // útil al enviar al backend
}
