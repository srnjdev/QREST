import { Dish } from './dish.model';

export interface Menu {
  id?: number;
  name: string;
  description: string;
  restaurantId: number;
  restaurantName?: string;
  qrCode: string;
  qrImageUrl?: string;
  active: boolean;
  dishes?: Dish[];
}

export interface Restaurant {
  id?: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  active: boolean;
}
