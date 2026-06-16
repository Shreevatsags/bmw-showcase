import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import CarThumb from "@/components/CarThumb";
import { getCar } from "@/data/cars";

const FEATURED_IDS = ["x5", "m4", "i5"] as const;

const models = FEATURED_IDS
  .map((id) => getCar(id))
  .filter((c): c is NonNullable<ReturnType<typeof getCar>> => !!c)
  .map((c) => ({
    id: c.id,
    name: c.name,
    category: c.tagline,
    car: c,
    price: `From $${c.price.toLocaleString()}`,
  }));

const BMWModels = () => {
  return (
    <section id="models" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-bmw-blue/3 rounded-full blur-[120px] animate-glow-pulse" />

      <div className="container relative">
        <ScrollReveal>
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-3">
            Lineup
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-16">
            Our Models
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {models.map((model, i) => (
            <ScrollReveal key={model.id} delay={i * 150}>
              <Link
                to={`/models/${model.id}`}
                className="group relative block bg-card rounded-lg overflow-hidden border border-border hover:border-bmw-blue/40 transition-all duration-500 hover:glow-blue hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-black">
                  <CarThumb car={model.car} className="absolute inset-0" />
                  <div className="absolute inset-0 bg-bmw-blue/0 group-hover:bg-bmw-blue/10 transition-colors duration-500 pointer-events-none" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 transition-colors duration-300 group-hover:text-bmw-blue/70">
                    {model.category}
                  </p>
                  <h3 className="font-heading text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-foreground">
                    {model.name}
                  </h3>
                  <p className="text-sm text-bmw-blue font-medium">{model.price}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/models"
            className="inline-flex items-center px-6 py-3 border border-bmw-blue/40 text-bmw-blue rounded-md font-medium hover:bg-bmw-blue hover:text-primary-foreground transition-colors"
          >
            View all models
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BMWModels;
