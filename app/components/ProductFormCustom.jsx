import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {useState, useEffect} from 'react';

export function ProductFormCustom({product, selectedVariant, onVariantChange}) {
  const {open} = useAside();
  // console.log(product);
  return (
    <div className="product-form">
      <ProductOptions
        selectedVariant={selectedVariant}
        product={product}
        onVariantChange={onVariantChange}
      />
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

/**
 * @param {{option: VariantOption}}
 */

function ProductOptions({product, onVariantChange}) {
  // Extract attributes from variants
  const variants = product.variants.nodes;
  const attributes = {};

  // Group attributes (e.g., Color, Size)
  variants.forEach((variant) => {
    variant.selectedOptions.forEach(({name, value}) => {
      if (!attributes[name]) {
        attributes[name] = new Set();
      }
      attributes[name].add(value);
    });
  });

  // Convert sets to arrays
  const attributeOptions = Object.entries(attributes).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: Array.from(value),
    }),
    {},
  );

  const initialSelectedAttributes = variants[0].selectedOptions.reduce(
    (acc, {name, value}) => ({
      ...acc,
      [name]: value,
    }),
    {},
  );

  // State to track selected attributes
  const [selectedAttributes, setSelectedAttributes] = useState(
    initialSelectedAttributes,
  );
  const [selectedVariant2, setSelectedVariant2] = useState(
    product.variants.nodes[0],
  );

  useEffect(() => {
    if (onVariantChange) {
      onVariantChange(selectedVariant2);
    }
  }, [selectedVariant2, onVariantChange]);

  // Handle attribute selection
  const handleAttributeChange = (attribute, value) => {
    const updatedAttributes = {...selectedAttributes, [attribute]: value};

    setSelectedAttributes(updatedAttributes);

    // Find the variant matching the selected attributes
    const matchedVariant = variants.find((variant) =>
      variant.selectedOptions.every(
        ({name, value}) => updatedAttributes[name] === value,
      ),
    );

    setSelectedVariant2(matchedVariant);
  };

  return (
    <div>
      {Object.entries(attributeOptions).map(([attribute, options]) => (
        <div className="optionWrapper" key={attribute}>
          <h4>{attribute}</h4>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleAttributeChange(attribute, option)}
              className={
                selectedAttributes[attribute] === option
                  ? 'option-btn isActive'
                  : 'option-btn'
              }
            >
              {option}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
