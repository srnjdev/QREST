export interface Dish {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;   // URL devuelta por backend
}
