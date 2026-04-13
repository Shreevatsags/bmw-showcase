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
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="container relative z-10 animate-fade-up">
        <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-4">
          The Ultimate Driving Machine
        </p>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6">
          BMW 7 Series
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          Where visionary technology meets uncompromising luxury. Redefine what it means to drive.
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8">
            Explore
          </Button>
          <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary rounded-none px-8">
            Configure
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BMWHero;
