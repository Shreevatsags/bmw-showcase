import suvImage from "@/assets/bmw-suv.jpg";
import coupeImage from "@/assets/bmw-coupe.jpg";
import electricImage from "@/assets/bmw-electric.jpg";

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
    <section id="models" className="py-24">
      <div className="container">
        <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-3">
          Lineup
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-16">
          Our Models
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.name}
              className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-bmw-blue/40 transition-colors duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={model.image}
                  alt={model.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {model.category}
                </p>
                <h3 className="font-heading text-xl font-semibold mb-2">{model.name}</h3>
                <p className="text-sm text-bmw-blue font-medium">{model.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BMWModels;
