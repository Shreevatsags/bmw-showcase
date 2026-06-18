import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/bmw-hero.jpg";
import { Button } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

const BMWHero = () => {
  return (
    <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
      {/* Background image with Ken-Burns drift */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease }}
        className="absolute inset-0 overflow-hidden"
      >
        <img
          src={heroImage}
          alt="BMW luxury sedan in dramatic studio lighting"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-center animate-hero-drift"
        />
      </motion.div>

      {/* Layered gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />

      {/* Animated glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
        className="absolute bottom-0 left-1/4 w-[500px] h-[260px] bg-bmw-blue/15 rounded-full blur-[100px] animate-glow-pulse"
      />

      {/* Floating spec chip */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 1.1, ease }}
        className="hidden lg:flex absolute top-32 right-12 flex-col gap-3 z-10"
      >
        {[
          { label: "0–60 mph", value: "3.6s" },
          { label: "Top Speed", value: "155 mph" },
          { label: "Output", value: "536 hp" },
        ].map((spec) => (
          <div
            key={spec.label}
            className="px-4 py-3 rounded-lg border border-border bg-background/40 backdrop-blur-xl min-w-[140px]"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {spec.label}
            </p>
            <p className="font-heading text-lg font-semibold text-foreground">{spec.value}</p>
          </div>
        ))}
      </motion.div>

      <div className="container relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-4"
        >
          The Ultimate Driving Machine
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6"
        >
          BMW 7 Series
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="text-lg text-muted-foreground max-w-md mb-8"
        >
          Where visionary technology meets uncompromising luxury. Redefine what it means to drive.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95, ease }}
          className="flex flex-wrap gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none px-8 transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(var(--bmw-blue)/0.5)] hover:-translate-y-0.5 group"
          >
            <Link to="/models">
              Explore Lineup
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border text-foreground hover:bg-secondary rounded-none px-8 transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <Play className="mr-2 group-hover:scale-110 transition-transform" size={16} />
            Watch Film
          </Button>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-bmw-blue to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default BMWHero;
