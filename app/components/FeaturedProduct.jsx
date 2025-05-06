import Product from './Product';

export default function FeaturedProduct({moduleData}) {
  const {title, product} = moduleData;
  const productRefID = product._ref.split('-');
  const productId = `gid://shopify/Product/${
    productRefID[productRefID.length - 1]
  }`;

  return (
    <section className="container">
      <h2 className="text-4xl font-bold dark:text-white text-center font-semibold">
        {title}
      </h2>

      {product ? (
        <div className="featured-product">
          <Product productId={productId} />
        </div>
      ) : (
        <p>No product selected</p>
      )}
    </section>
  );
}
