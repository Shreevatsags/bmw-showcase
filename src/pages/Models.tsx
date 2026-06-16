import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import BMWHeader from "@/components/BMWHeader";
import BMWFooter from "@/components/BMWFooter";
import ScrollReveal from "@/components/ScrollReveal";
import CarThumb from "@/components/CarThumb";
import { cars, CarCategory } from "@/data/cars";
import { ArrowRight } from "lucide-react";

const categories: ("All" | CarCategory)[] = [
  "All",
  "Sedan",
  "SUV",
  "Coupé",
  "Electric",
  "M Performance",
];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const Models = () => {
  const [active, setActive] = useState<"All" | CarCategory>("All");

  const filtered = useMemo(
    () => (active === "All" ? cars : cars.filter((c) => c.category === active)),
    [active]
  );

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
            <p className="text-muted-foreground max-w-2xl mb-10">
              Explore the full range — sedans, SUVs, coupés and fully electric BMWs.
              Click any model for details and an interactive 3D view.
            </p>
          </ScrollReveal>

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  active === c
                    ? "bg-bmw-blue text-primary-foreground border-bmw-blue glow-blue"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-bmw-blue/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car, i) => (
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
                    <h2 className="font-heading text-xl font-semibold mb-3">{car.name}</h2>
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
        </div>
      </main>

      <BMWFooter />
    </div>
  );
};

export default Models;
