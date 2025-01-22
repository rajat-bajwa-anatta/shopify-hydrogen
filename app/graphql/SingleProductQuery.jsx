import {useEffect, useState} from 'react';

export default function useSingleProductQuery(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const storeFrontToken = import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN;
  const storeFrontDomain = import.meta.env.VITE_PUBLIC_STORE_DOMAIN;

  useEffect(() => {
    if (!productId) return;

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
        featuredImage {
          id
          altText
          url
          width
          height
        }
        options {
            name
            optionValues {
              name
            }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
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

    fetchGraphQL(query, storeFrontDomain, storeFrontToken)
      .then((response) => {
        const productData = response.data.product;
        setProduct(productData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId, storeFrontDomain, storeFrontToken]);

  return {product, loading, error};
}
