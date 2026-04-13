import heroImage from "@/assets/bmw-hero.jpg";
import { Button } from "@/components/ui/button";

const BMWHero = () => {
  return (
    <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
      <img
        src={heroImage}
        alt="BMW luxury sedan in dramatic studio lighting"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[2s] hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Animated glow accent */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] bg-bmw-blue/10 rounded-full blur-[80px] animate-glow-pulse" />

      <div className="container relative z-10">
        <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          The Ultimate Driving Machine
        </p>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          BMW 7 Series
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.7s" }}>
          Where visionary technology meets uncompromising luxury. Redefine what it means to drive.
        </p>
        <div className="flex gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "1s" }}>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(var(--bmw-blue)/0.5)] hover:-translate-y-0.5">
            Explore
          </Button>
          <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary rounded-none px-8 transition-all duration-300 hover:-translate-y-0.5">
            Configure
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BMWHero;
