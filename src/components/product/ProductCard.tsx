import { memo, useState } from "react";
import { Card, Carousel } from "antd";
import { useUiStore } from "../../store/uiStore";
import type { Product } from "../../features/products/types";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const selectProduct = useUiStore((s) => s.selectProduct);
  const [isHovering, setIsHovering] = useState(false);

  const gallery = product.images?.length
    ? product.images
    : [product.thumbnail];
  const hasMultiple = gallery.length > 1;

  const open = () => selectProduct(product);

  return (
    <Card
      hoverable
      onClick={open}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      cover={
        <div
          className="product-card-carousel bg-gray-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Carousel
            arrows={false}
            dots={hasMultiple}
            infinite={hasMultiple}
            draggable={hasMultiple}
            autoplay={isHovering && hasMultiple}
            autoplaySpeed={1500}
            pauseOnHover={false}
          >
            {gallery.map((src) => (
              <div key={src}>
                <div
                  onClick={open}
                  className="flex h-52 w-full cursor-pointer items-center justify-center bg-gray-50"
                >
                  <img
                    src={src}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      }
    >
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-gray-500">
        Price: <span className="text-black">${product.price}</span>
      </p>
      <p className="text-gray-500">
        Brand: <span className="text-black">{product.brand}</span>
      </p>
      <p className="text-gray-500">
        Category: <span className="text-black">{product.category}</span>
      </p>
    </Card>
  );
};

export default memo(ProductCard);
