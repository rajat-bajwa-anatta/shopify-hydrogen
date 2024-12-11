
import sanityClient from "~/sanity/client";
import React, { useEffect, useState } from 'react';

const POSTS_QUERY = `*[_type == "product"]{store {title,id}}
`;

export async function loader() {
  return await sanityClient.fetch(POSTS_QUERY);
}


export default function CustomHomepage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const sanityProducts = await loader();
      setProducts(sanityProducts);
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
        </div>
      ))}
    </div>
  );
}
