import {useEffect, useState, Suspense} from 'react';
import {Await} from '@remix-run/react';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductFormCustom} from '~/components/ProductFormCustom';
import ProductImageSlider from './ProductImageSlider';
import useSingleProductQuery from '~/graphql/SingleProductQuery';

export default function Product({productId}) {
  const {product, loading, error} = useSingleProductQuery(productId);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (product && product.variants.nodes.length > 0) {
      setSelectedVariant(product.variants.nodes[0]);
    }
  }, [product]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <div className="products-grid">
      <div className="product-image feature-product-media">
        <ProductImageSlider images={product?.images.nodes} />
      </div>
      <div className="product-main">
        <h1 className="text-4xl">{product.title}</h1>
        <br />
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />
        <br />
        <Suspense
          fallback={
            <ProductFormCustom
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={handleVariantChange}
              variants={[]}
            />
          }
        >
          <Await
            errorElement="There was a problem loading product variants"
            resolve={product.variants}
          >
            {(data) => (
              <ProductFormCustom
                product={product}
                selectedVariant={selectedVariant}
                variants={data?.product?.variants.nodes || []}
                onVariantChange={handleVariantChange}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
