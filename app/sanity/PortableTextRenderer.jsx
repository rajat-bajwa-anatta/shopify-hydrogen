import { PortableText } from '@portabletext/react';

const components = {
  types: {
    image: ({ value }) => (
      <img src={value.asset.url} alt={value.alt || 'Sanity Image'} />
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-4xl font-bold">{children}</h1>,
    normal: ({ children }) => <p className="text-base">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ml-5">{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

const PortableTextRenderer = ({ content }) => (
  <PortableText value={content} components={components} />
);

export default PortableTextRenderer;
