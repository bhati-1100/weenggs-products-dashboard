import { memo } from "react";
import { Input, Select, Slider } from "antd";
import { SearchOutlined, AppstoreOutlined } from "@ant-design/icons";

import { useFiltersStore } from "../../store/filtersStore";
import type { Category } from "../../features/products/types";

type FiltersProps = {
  categories: Category[];
};

const Filters = ({ categories }: FiltersProps) => {
  // Subscribe to slices individually so e.g. typing in search doesn't
  // re-render the price slider, and vice versa.
  const search = useFiltersStore((s) => s.search);
  const category = useFiltersStore((s) => s.category);
  const minPrice = useFiltersStore((s) => s.minPrice);
  const maxPrice = useFiltersStore((s) => s.maxPrice);
  const setFilter = useFiltersStore((s) => s.setFilter);

  const options = categories.map((item) => ({
    label: item.name,
    value: item.slug,
  }));

  return (
    <div className="mb-6 grid gap-3 md:grid-cols-3">
      {/* Search */}
      <Input
        size="large"
        allowClear
        placeholder="Search products"
        prefix={<SearchOutlined className="text-gray-400" />}
        value={search}
        onChange={(e) => setFilter("search", e.target.value)}
        className="!rounded-lg"
      />

      {/* Category */}
      <Select
        size="large"
        allowClear
        placeholder="All categories"
        value={category || undefined}
        options={options}
        onChange={(value) => setFilter("category", value || "")}
        suffixIcon={<AppstoreOutlined className="text-gray-400" />}
        className="w-full"
      />

      {/* Price */}
      <div className="flex h-10 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3">
        <span className="whitespace-nowrap text-xs font-medium text-gray-600">
          ${minPrice}–${maxPrice}
        </span>
        <Slider
          range
          min={0}
          max={3000}
          value={[minPrice, maxPrice]}
          onChange={(value) => {
            const [min, max] = value as [number, number];
            setFilter("minPrice", min);
            setFilter("maxPrice", max);
          }}
          className="!my-0 flex-1"
        />
      </div>
    </div>
  );
};

export default memo(Filters);
