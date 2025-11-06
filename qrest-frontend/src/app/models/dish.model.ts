export interface Dish {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  imageUrl?: string;
  available: boolean;
  active: boolean;
  allergens?: string[];
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
  displayOrder: number;
  active: boolean;
}
