import useSingleProductQuery from '~/graphql/SingleProductQuery';
import {Image, Money} from '@shopify/hydrogen';

export default function ProductCard({productId}) {
  if (!productId) {
    return <div>Error: No product Id found</div>;
  }

  const {product, loading, error} = useSingleProductQuery(productId);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <a
      href={`/products/${product.handle}`}
      className="product-item"
      key={product.id}
      prefetch="intent"
    >
      {product.images && (
        <Image
          alt={product.images.nodes[0].altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </a>
  );
}
