import React, {useEffect, useState, Suspense} from 'react';
import {Await} from '@remix-run/react';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductFormCustom} from '~/components/ProductFormCustom';
import ProductImageSlider from './ProductImageSlider';

async function fetchGraphQL(query, storeFrontDomain, storeFrontToken) {
  const response = await fetch(
    `https://${storeFrontDomain}/api/2025-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storeFrontToken,
      },
      body: JSON.stringify({query}),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export default function Product({productId}) {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = `
      query {
        product(id: "${productId}") {
          id
          handle
          title
          images(first: 20) {
            nodes {
              altText
              originalSrc
            }
          }
          options {
              name
              optionValues {
                name
              }
          }
          variants(first: 50) {
            nodes {
              id
              title
              compareAtPrice {
                amount
                currencyCode
              }
              price {
                amount
                currencyCode
              }
              sku
              image {
                url
              }
              availableForSale
              selectedOptions {
                name
                value
              }
              product {
                handle
                title
              }
            }
          }
        }
      }
    `;

    const storeFrontToken = import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN;
    const storeFrontDomain = import.meta.env.VITE_PUBLIC_STORE_DOMAIN;

    fetchGraphQL(query, storeFrontDomain, storeFrontToken)
      .then((response) => {
        const productData = response.data.product;
        setProduct(productData);

        setSelectedVariant(productData.variants.nodes[0]); // Set the first variant as the default
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]); // Re-run effect when productId changes

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
