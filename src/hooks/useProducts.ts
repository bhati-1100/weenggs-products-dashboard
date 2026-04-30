import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getCategories } from "../api/productApi";

import type { Category, Product } from "../features/products/types";

type FiltersType = {
  page: number;
  limit: number;
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
};

export const useProducts = (filters: FiltersType) => {
  const search = filters.search.trim();

  const {
    data: productsResponse,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["products", search, filters.category],
    queryFn: ({ signal }) =>
      getProducts({ search, category: filters.category }, signal),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: Infinity,
  });

  // Memoised filter+paginate so we don't recompute on every re-render.
  const { pagedProducts, total } = useMemo(() => {
    const allProducts: Product[] = productsResponse?.products ?? [];

    // The dummyjson category endpoint doesn't accept `q`, so when both
    // category and search are active we filter by search client-side.
    const needsClientSideSearch = Boolean(filters.category && search);
    const haystack = search.toLowerCase();

    const matched = allProducts.filter((item) => {
      if (item.price < filters.minPrice || item.price > filters.maxPrice) {
        return false;
      }
      if (needsClientSideSearch) {
        const text =
          `${item.title} ${item.description} ${item.brand}`.toLowerCase();
        if (!text.includes(haystack)) return false;
      }
      return true;
    });

    const start = (filters.page - 1) * filters.limit;
    return {
      pagedProducts: matched.slice(start, start + filters.limit),
      total: matched.length,
    };
  }, [
    productsResponse,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.page,
    filters.limit,
    search,
  ]);

  return {
    data: pagedProducts,
    categories,
    total,
    limit: filters.limit,
    loading: isLoading,
    fetching: isFetching,
    categoriesLoading,
    error,
  };
};
