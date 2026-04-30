import { useState } from "react";
import { Rate, Tag } from "antd";
import Modal from "../common/Modal";
import type { Product } from "../../features/products/types";

type ProductDetailsModalProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

const ProductDetailsBody = ({ product }: { product: Product }) => {
  const [activeImage, setActiveImage] = useState(product.thumbnail);

  const gallery = product.images?.length ? product.images : [product.thumbnail];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <div className="flex h-72 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-50">
          <img
            src={activeImage}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        </div>

        {gallery.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {gallery.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(src)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border ${
                  src === activeImage
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Rate disabled allowHalf value={product.rating} />
          <span className="text-sm text-gray-500">
            {product.rating.toFixed(1)}
          </span>
        </div>

        <p className="text-3xl font-bold text-gray-900">${product.price}</p>

        <div className="flex flex-wrap gap-2">
          <Tag color="blue">{product.category}</Tag>
          {product.brand && <Tag color="purple">{product.brand}</Tag>}
        </div>

        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">
            Description
          </h4>
          <p className="text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsModal = ({
  product,
  open,
  onClose,
}: ProductDetailsModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        product ? (
          <span className="text-lg font-semibold">{product.title}</span>
        ) : null
      }
      width={820}
    >
      {product && <ProductDetailsBody key={product.id} product={product} />}
    </Modal>
  );
};

export default ProductDetailsModal;
