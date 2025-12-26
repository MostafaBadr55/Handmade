export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  imageUrl?: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
  description?: string;
  categoryId?: number;
  subCategoryId?: number;
  shopId?: number;
  createdAt?: string;
}
