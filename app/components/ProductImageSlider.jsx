import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Thumbs} from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import {useState} from 'react';

// Register the modules
SwiperCore.use([Navigation, Thumbs]);

function ProductImageSlider({images}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="product-image-slider">
      {/* Main Slider */}
      <Swiper
        spaceBetween={10}
        navigation
        thumbs={{swiper: thumbsSwiper}}
        className="main-slider"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.originalSrc}
              alt={image.altText || `Product Image ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Slider */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={5}
        watchSlidesProgress
        className="thumbnail-slider"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.originalSrc}
              alt={image.altText || `Thumbnail ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductImageSlider;
