import React, {useState} from 'react';

const AccordionItem = ({title, content}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      style={{
        marginBottom: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
    >
      <div
        onClick={toggleAccordion}
        style={{
          padding: '1rem',
          background: '#f7f7f7',
          cursor: 'pointer',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {title}
        <span
          style={{
            transform: isOpen ? 'rotate(90deg)' : 'rotate(0)',
            transition: 'transform 0.3s',
          }}
        >
          ▶
        </span>
      </div>
      <div
        style={{
          maxHeight: isOpen ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, padding 0.3s ease',
          padding: isOpen ? '1rem' : '0',
          background: '#fff',
          borderTop: isOpen ? '1px solid #ccc' : 'none',
        }}
      >
        {isOpen && <div>{content}</div>}
      </div>
    </div>
  );
};

export default AccordionItem;
