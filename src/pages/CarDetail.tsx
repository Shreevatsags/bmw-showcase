import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Gauge, Zap, Timer, Users, Cog, Wrench, Check } from "lucide-react";
import BMWHeader from "@/components/BMWHeader";
import BMWFooter from "@/components/BMWFooter";
import Car3D from "@/components/Car3D";
import ScrollReveal from "@/components/ScrollReveal";
import { getCar, cars } from "@/data/cars";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const car = id ? getCar(id) : undefined;

  if (!car) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <BMWHeader />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="font-heading text-3xl mb-4">Model not found</h1>
            <Link to="/models" className="text-bmw-blue hover:underline">
              Back to all models
            </Link>
          </div>
        </main>
        <BMWFooter />
      </div>
    );
  }

  const related = cars.filter((c) => c.id !== car.id && c.category === car.category).slice(0, 3);

  const specItems = [
    { icon: Zap, label: "Horsepower", value: `${car.specs.horsepower} hp` },
    { icon: Gauge, label: "Top Speed", value: `${car.specs.topSpeed} mph` },
    { icon: Timer, label: "0–60 mph", value: `${car.specs.acceleration}s` },
    { icon: Wrench, label: "Range", value: `${car.specs.range} mi` },
    { icon: Users, label: "Seats", value: `${car.specs.seats}` },
    { icon: Cog, label: "Drivetrain", value: car.specs.drivetrain },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BMWHeader />

      <main className="pt-24 pb-24">
        <div className="container">
          <Link
            to="/models"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} className="mr-1" /> All Models
          </Link>

          {/* Hero: 3D + summary */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-20">
            <div className="relative h-[420px] md:h-[520px] rounded-xl overflow-hidden border border-border bg-gradient-to-b from-card to-background">
              <Car3D
                bodyColor={car.bodyColor}
                accentColor={car.accentColor}
                bodyType={car.bodyType}
                className="absolute inset-0"
              />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground pointer-events-none">
                <span>Interactive 3D · drag to rotate · scroll to zoom</span>
                <span>{car.bodyType}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-3">
                {car.category}
              </p>
              <h1 className="font-heading text-4xl md:text-6xl font-bold mb-3">
                {car.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-2">{car.tagline}</p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {car.description}
              </p>

              <div className="flex items-end gap-6 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Starting at</p>
                  <p className="font-heading text-3xl font-bold text-bmw-blue">
                    {formatPrice(car.price)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-bmw-blue text-primary-foreground rounded-md font-medium hover:opacity-90 transition glow-blue">
                  Build Yours
                </button>
                <button className="px-6 py-3 border border-border rounded-md font-medium hover:border-bmw-blue hover:text-bmw-blue transition">
                  Schedule Test Drive
                </button>
              </div>
            </div>
          </div>

          {/* Specs */}
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold mb-8">Performance & Specs</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-20">
            {specItems.map(({ icon: Icon, label, value }, i) => (
              <ScrollReveal key={label} delay={i * 60}>
                <div className="bg-card border border-border rounded-lg p-6 hover:border-bmw-blue/40 transition-colors">
                  <Icon className="text-bmw-blue mb-3" size={22} />
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {label}
                  </p>
                  <p className="font-heading text-2xl font-semibold">{value}</p>
                </div>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={360}>
              <div className="bg-card border border-border rounded-lg p-6 sm:col-span-2 md:col-span-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Transmission
                </p>
                <p className="font-heading text-xl">{car.specs.transmission}</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Features */}
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold mb-8">Signature Features</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4 mb-20">
            {car.features.map((f, i) => (
              <ScrollReveal key={f} delay={i * 60}>
                <div className="flex items-start gap-3 bg-card border border-border rounded-lg p-5">
                  <Check className="text-bmw-blue mt-0.5 shrink-0" size={20} />
                  <p>{f}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <>
              <h2 className="font-heading text-3xl font-bold mb-8">Also in {car.category}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/models/${r.id}`}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:border-bmw-blue/50 transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-semibold mb-1">{r.name}</h3>
                      <p className="text-sm text-bmw-blue">{formatPrice(r.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <BMWFooter />
    </div>
  );
};

export default CarDetail;
