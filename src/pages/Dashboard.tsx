import { Pagination, Spin } from "antd";
import { lazy, Suspense } from "react";
import useDebounce from "../hooks/useDebounce";
import { useProducts } from "../hooks/useProducts";
import { useFiltersStore } from "../store/filtersStore";
import { useUiStore } from "../store/uiStore";
import Filters from "../components/product/Filters";
import ProductCard from "../components/product/ProductCard";

const ProductDetailsModal = lazy(
  () => import("../components/product/ProductDetailsModal"),
);

const Dashboard = () => {
  // Subscribe to slices individually to avoid wide re-renders.
  const page = useFiltersStore((s) => s.page);
  const limit = useFiltersStore((s) => s.limit);
  const search = useFiltersStore((s) => s.search);
  const category = useFiltersStore((s) => s.category);
  const minPrice = useFiltersStore((s) => s.minPrice);
  const maxPrice = useFiltersStore((s) => s.maxPrice);
  const setPage = useFiltersStore((s) => s.setPage);

  const debouncedSearch = useDebounce(search, 500);

  const { data, loading, fetching, total, categories, error } = useProducts({
    page,
    limit,
    search: debouncedSearch,
    category,
    minPrice,
    maxPrice,
  });

  const selectedProduct = useUiStore((s) => s.selectedProduct);
  const selectProduct = useUiStore((s) => s.selectProduct);

  if (error) {
    return (
      <div className="py-20 text-center text-red-600">
        Failed to load products. Please refresh the page.
      </div>
    );
  }

  return (
    <div>
      <Filters categories={categories} />

      <Spin spinning={loading || fetching} size="large">
        <div className="grid min-h-50 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.length === 0 && !loading ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              No products found for the selected category or filters.
            </div>
          ) : (
            data.map((item) => <ProductCard key={item.id} product={item} />)
          )}
        </div>
      </Spin>

      <div className="mt-8 flex justify-center">
        <Pagination
          current={page}
          total={total}
          pageSize={limit}
          onChange={setPage}
          showSizeChanger={false}
          showTotal={(count, range) =>
            count === 0
              ? "No products"
              : `${range[0]}–${range[1]} of ${count} products`
          }
        />
      </div>

      <Suspense fallback={null}>
        <ProductDetailsModal
          product={selectedProduct}
          open={Boolean(selectedProduct)}
          onClose={() => selectProduct(null)}
        />
      </Suspense>
    </div>
  );
};

export default Dashboard;
