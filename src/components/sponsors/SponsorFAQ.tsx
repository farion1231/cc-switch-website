import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/useLanguage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function SponsorFAQ() {
  const { t } = useLanguage();
  const copy = t.sponsorsPage.faq;

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
            {copy.title}
          </h2>

          <Accordion type="single" collapsible className="mt-8 md:mt-10">
            {copy.items.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium md:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
