import { Link } from "react-router-dom";
import suvImage from "@/assets/bmw-suv.jpg";
import coupeImage from "@/assets/bmw-coupe.jpg";
import electricImage from "@/assets/bmw-electric.jpg";
import ScrollReveal from "@/components/ScrollReveal";

const models = [
  {
    name: "BMW X5",
    category: "Sports Activity Vehicle",
    image: suvImage,
    price: "From $65,200",
  },
  {
    name: "BMW M4",
    category: "Performance Coupé",
    image: coupeImage,
    price: "From $74,700",
  },
  {
    name: "BMW i5",
    category: "Electric Sedan",
    image: electricImage,
    price: "From $66,800",
  },
];

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
            <ScrollReveal key={model.name} delay={i * 150}>
              <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-bmw-blue/40 transition-all duration-500 hover:glow-blue hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={model.image}
                    alt={model.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Blue overlay on hover */}
                  <div className="absolute inset-0 bg-bmw-blue/0 group-hover:bg-bmw-blue/10 transition-colors duration-500" />
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
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BMWModels;
