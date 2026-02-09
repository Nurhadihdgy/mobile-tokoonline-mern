export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

