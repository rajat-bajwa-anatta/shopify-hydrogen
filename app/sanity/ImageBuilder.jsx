import sanityClient from '~/sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);

const sanityImage = (source) => {
  return builder.image(source);
}

export default sanityImage;