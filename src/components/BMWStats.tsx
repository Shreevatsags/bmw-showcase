const stats = [
  { value: "530", unit: "HP", label: "Peak Power" },
  { value: "3.6", unit: "s", label: "0-60 mph" },
  { value: "190", unit: "mph", label: "Top Speed" },
  { value: "358", unit: "mi", label: "Electric Range" },
];

const BMWStats = () => {
  return (
    <section className="py-24 border-y border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-4xl md:text-5xl font-bold">
                {stat.value}
                <span className="text-bmw-blue text-2xl md:text-3xl ml-1">{stat.unit}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BMWStats;
