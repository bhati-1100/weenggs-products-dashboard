export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  images: string[];
  rating: number;
  brand: string;
}

export type Category = {
  slug: string;
  name: string;
  url: string;
};
export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}