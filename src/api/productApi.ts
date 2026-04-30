import axiosInstance from "./axiosInstance";
import type { Category, ProductResponse } from "../features/products/types";

type ProductsQuery = {
  search?: string;
  category?: string;
};

export const getProducts = async (
  filters: ProductsQuery,
  signal?: AbortSignal
): Promise<ProductResponse> => {
  const search = filters.search?.trim() ?? "";
  const category = filters.category ?? "";

  let url = "/products";
  const params: Record<string, string | number> = { limit: 0 };

  if (category) {
    url = `/products/category/${category}`;
  } else if (search) {
    url = "/products/search";
    params.q = search;
  }

  const response = await axiosInstance.get<ProductResponse>(url, {
    params,
    signal,
  });

  return response.data;
};

export const getCategories = async (
  signal?: AbortSignal
): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>(
    "/products/categories",
    { signal }
  );

  return response.data;
};
