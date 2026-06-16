import { Link } from "react-router-dom";
import { useMemo } from "react";
import BMWHeader from "@/components/BMWHeader";
import BMWFooter from "@/components/BMWFooter";
import ScrollReveal from "@/components/ScrollReveal";
import CarThumb from "@/components/CarThumb";
import { cars, CarCategory } from "@/data/cars";
import { ArrowRight } from "lucide-react";

const categoryOrder: CarCategory[] = [
  "Sedan",
  "SUV",
  "Coupé",
  "Electric",
  "M Performance",
  "Convertible",
];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const Models = () => {
  const grouped = useMemo(() => {
    const map = new Map<CarCategory, typeof cars>();
    for (const car of cars) {
      const list = map.get(car.category) ?? [];
      list.push(car);
      map.set(car.category, list);
    }
    return categoryOrder
      .map((cat) => ({ category: cat, items: map.get(cat) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BMWHeader />

      <main className="pt-28 pb-24">
        <div className="container">
          <ScrollReveal>
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-3">
              The Lineup
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
              All BMW Models
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-16">
              Explore the full range — sedans, SUVs, coupés and fully electric BMWs.
              Click any model for details and an interactive 3D view.
            </p>
          </ScrollReveal>

          <div className="space-y-20">
            {grouped.map(({ category, items }) => (
              <section key={category} id={category.toLowerCase().replace(/\s+/g, "-")}>
                <ScrollReveal>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold">{category}</h2>
                    <span className="text-sm text-muted-foreground">{items.length} model{items.length !== 1 ? "s" : ""}</span>
                  </div>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((car, i) => (
                    <ScrollReveal key={car.id} delay={i * 80}>
                      <Link
                        to={`/models/${car.id}`}
                        className="group block bg-card rounded-lg overflow-hidden border border-border hover:border-bmw-blue/50 transition-all duration-500 hover:-translate-y-1 hover:glow-blue"
                      >
                        <div className="aspect-[4/3] overflow-hidden relative bg-black">
                          <CarThumb car={car} className="absolute inset-0" />
                          <div className="absolute top-3 left-3 bg-background/70 backdrop-blur-md text-xs uppercase tracking-wider px-2 py-1 rounded z-10">
                            {car.category}
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            {car.tagline}
                          </p>
                          <h3 className="font-heading text-xl font-semibold mb-3">{car.name}</h3>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground">Starting at</p>
                              <p className="text-bmw-blue font-semibold">{formatPrice(car.price)}</p>
                            </div>
                            <span className="inline-flex items-center text-sm text-foreground group-hover:text-bmw-blue transition-colors">
                              Details <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <BMWFooter />
    </div>
  );
};

export default Models;