import { useEffect, useState } from "react";
import { Menu, X, GitCompareArrows } from "lucide-react";
import { Link } from "react-router-dom";
import { getCompare, subscribeCompare } from "@/lib/compare";

const navItems: { label: string; to: string }[] = [
  { label: "Models", to: "/models" },
  { label: "Electric", to: "/models?cat=Electric" },
  { label: "Performance", to: "/models?cat=M%20Performance" },
  { label: "Compare", to: "/compare" },
];

const BMWHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    setCompareCount(getCompare().length);
    return subscribeCompare((ids) => setCompareCount(ids.length));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-heading text-2xl font-bold tracking-tight text-foreground">
          BMW
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/compare"
            className="relative inline-flex items-center gap-1.5 text-xs uppercase tracking-wider border border-border rounded-md px-3 py-1.5 hover:border-bmw-blue hover:text-bmw-blue transition-colors"
          >
            <GitCompareArrows size={14} />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] rounded-full bg-bmw-blue text-primary-foreground px-1">
                {compareCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-card border-t border-border px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default BMWHeader;
