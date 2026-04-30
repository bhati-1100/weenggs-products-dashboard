import { create } from "zustand";

export type Filters = {
  page: number;
  limit: number;
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
};

type FiltersState = Filters & {
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setPage: (page: number) => void;
  reset: () => void;
};

const initial: Filters = {
  page: 1,
  limit: 12,
  search: "",
  category: "",
  minPrice: 0,
  maxPrice: 3000,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initial,
  setFilter: (key, value) =>
    set((state) => ({ ...state, [key]: value, page: 1 })),
  setPage: (page) => set({ page }),
  reset: () => set(initial),
}));
