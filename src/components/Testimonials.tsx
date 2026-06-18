import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  car: string;
  rating: number;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marcus Chen",
    role: "Architect, San Francisco",
    quote:
      "The i7 isn't transportation — it's a moving meditation room. The silence at 80 mph is unreal.",
    car: "BMW i7 xDrive60",
    rating: 5,
    initials: "MC",
  },
  {
    name: "Sofia Ramírez",
    role: "F1 Engineer, Madrid",
    quote:
      "I've driven supercars that cost three times as much. Nothing carves a back road like the M4 Competition.",
    car: "BMW M4 Competition",
    rating: 5,
    initials: "SR",
  },
  {
    name: "Daniel Okafor",
    role: "Founder, Lagos",
    quote:
      "Three kids, two dogs, weekend ski trips. The X5 does it all and still feels like a sports sedan.",
    car: "BMW X5 xDrive40i",
    rating: 5,
    initials: "DO",
  },
  {
    name: "Aria Tanaka",
    role: "Designer, Tokyo",
    quote:
      "The iX changed how I think about EVs. Range anxiety isn't a thing — it's just a faster, quieter BMW.",
    car: "BMW iX xDrive50",
    rating: 5,
    initials: "AT",
  },
];

const Testimonials = () => (
  <section className="py-24 border-t border-border">
    <div className="container">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-4">
            Owner Stories
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Driven by those who demand more
          </h2>
          <p className="text-muted-foreground">
            Real reflections from the people behind the wheel.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <motion.article
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="relative p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm hover:border-bmw-blue/40 transition-colors"
          >
            <Quote
              className="absolute top-5 right-5 text-bmw-blue/20"
              size={36}
              aria-hidden
            />
            <div className="flex gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star key={idx} size={14} className="fill-bmw-blue text-bmw-blue" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 mb-6">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bmw-blue to-bmw-blue/40 flex items-center justify-center font-heading text-sm font-semibold text-primary-foreground">
                {t.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{t.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{t.role}</p>
                <p className="text-[10px] uppercase tracking-wider text-bmw-blue mt-0.5 truncate">
                  {t.car}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
