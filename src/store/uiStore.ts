import { create } from "zustand";
import type { Product } from "../features/products/types";

type UiState = {
  selectedProduct: Product | null;
  selectProduct: (product: Product | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedProduct: null,
  selectProduct: (selectedProduct) => set({ selectedProduct }),
}));
