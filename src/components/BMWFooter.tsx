const BMWFooter = () => {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container">
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
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sedans</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">SUVs</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Electric</a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-foreground mb-1">Company</p>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Press</a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-foreground mb-1">Support</p>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Dealers</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Service</a>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-12">
          © 2026 BMW. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default BMWFooter;
