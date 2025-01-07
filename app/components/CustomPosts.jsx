
import { useEffect, useState } from 'react';
import sanityClient from '~/sanity/client';
import sanityImage from '~/sanity/ImageBuilder';
import PortableTextRenderer from '~/sanity/PortableTextRenderer';

export default function CustomPosts() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const posts = await sanityClient.fetch('*[_type == "post"]');
      setPosts(posts);
    }
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <li className="hover:underline" key={post._id}>
            <a href={`/${post.slug.current}`}>
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            <img src={sanityImage(post.image).width(200).url()} />
            <PortableTextRenderer content={post.body} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}