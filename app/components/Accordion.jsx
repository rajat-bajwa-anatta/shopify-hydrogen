import AccordionItem from './AccordionItem';
import PortableTextRenderer from '~/sanity/PortableTextRenderer';

export default function Accordion({moduleData}) {
  if (moduleData._type !== 'accordion') {
    return <div>Error: Not a accordion section</div>;
  }

  const accordionData = moduleData?.groups;

  return (
    <section className="container">
      <h2 className="text-4xl font-bold dark:text-white text-center">
        Accordions FAQ
      </h2>
      {accordionData.map((item, index) => (
        <AccordionItem
          key={index}
          title={item?.title}
          content={<PortableTextRenderer content={item.body} />}
        />
      ))}
    </section>
  );
}
