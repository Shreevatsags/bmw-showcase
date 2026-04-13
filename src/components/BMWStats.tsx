import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { value: "530", unit: "HP", label: "Peak Power" },
  { value: "3.6", unit: "s", label: "0-60 mph" },
  { value: "190", unit: "mph", label: "Top Speed" },
  { value: "358", unit: "mi", label: "Electric Range" },
];

const BMWStats = () => {
  return (
    <section className="py-24 border-y border-border relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-bmw-blue/5 rounded-full blur-[100px] animate-glow-pulse" />

      <div className="container relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 120}>
              <div className="text-center group cursor-default">
                <p className="font-heading text-4xl md:text-5xl font-bold transition-transform duration-300 group-hover:scale-110">
                  {stat.value}
                  <span className="text-bmw-blue text-2xl md:text-3xl ml-1">{stat.unit}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BMWStats;
