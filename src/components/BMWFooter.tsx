import ScrollReveal from "@/components/ScrollReveal";

const BMWFooter = () => {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <p className="font-heading text-2xl font-bold mb-2">BMW</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Sheer Driving Pleasure. Experience innovation and luxury since 1916.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-foreground mb-1">Vehicles</p>
                <a href="#" className="text-muted-foreground hover:text-bmw-blue transition-colors duration-300">Sedans</a>
                <a href="#" className="text-muted-foreground hover:text-bmw-blue transition-colors duration-300">SUVs</a>
                <a href="#" className="text-muted-foreground hover:text-bmw-blue transition-colors duration-300">Electric</a>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-foreground mb-1">Company</p>
                <a href="#" className="text-muted-foreground hover:text-bmw-blue transition-colors duration-300">About</a>
                <a href="#" className="text-muted-foreground hover:text-bmw-blue transition-colors duration-300">Careers</a>
                <a href="#" className="text-muted-foreground hover:text-bmw-blue transition-colors duration-300">Press</a>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-foreground mb-1">Support</p>
                <a href="#" className="text-muted-foreground hover:text-bmw-blue transition-colors duration-300">Contact</a>
                <a href="#" className="text-muted-foreground hover:text-bmw-blue transition-colors duration-300">Dealers</a>
                <a href="#" className="text-muted-foreground hover:text-bmw-blue transition-colors duration-300">Service</a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <p className="text-xs text-muted-foreground mt-12">
          © 2026 BMW. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default BMWFooter;
