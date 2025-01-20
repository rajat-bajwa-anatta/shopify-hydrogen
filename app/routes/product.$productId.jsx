import {json} from '@shopify/remix-oxygen';
import gql from 'graphql-tag';

const PRODUCT_QUERY = gql`
  query ProductQuery($id: ID!) {
    product(id: $id) {
      id
      title
      descriptionHtml
      featuredImage {
        url
        altText
      }
      variants(first: 5) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const loader = async ({context, params}) => {
  const {productId} = params;

  const {data} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {id: productId},
  });

  if (!data.product) {
    throw new Response('Product not found', {status: 404});
  }

  return json({product: data.product});
};

export default function ProductDetail() {
  const {product} = useLoaderData();

  return (
    <div>
      <h1>{product.title}</h1>
      <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
      {product.featuredImage && (
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || 'Product Image'}
        />
      )}
      <h2>Variants</h2>
      <ul>
        {product.variants.edges.map(({node}) => (
          <li key={node.id}>
            {node.title} - {node.price.amount} {node.price.currencyCode}
          </li>
        ))}
      </ul>
    </div>
  );
}
