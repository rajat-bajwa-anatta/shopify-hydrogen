import ProductCard from './ProductCard';

export default function Products({moduleData}) {
  if (moduleData._type !== 'products') {
    return <div>Error: Not a "products" section</div>;
  }

  const {title, products} = moduleData;

  return (
    <section className="container">
      <h2 className="text-4xl font-bold dark:text-white text-center">
        {title}
      </h2>
      <div className="products-grid">
        {products.map((item, index) => (
          <ProductCard
            key={index}
            productId={item?.productWithVariant?.product._ref.replace(
              'shopifyProduct-',
              'gid://shopify/Product/',
            )}
          />
        ))}
      </div>
    </section>
  );
}
