import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Search, X, Plus, Check } from "lucide-react";
import BMWHeader from "@/components/BMWHeader";
import BMWFooter from "@/components/BMWFooter";
import ScrollReveal from "@/components/ScrollReveal";
import CarThumb from "@/components/CarThumb";
import { cars, CarCategory } from "@/data/cars";
import { ArrowRight } from "lucide-react";
import { COMPARE_MAX, getCompare, subscribeCompare, toggleCompare } from "@/lib/compare";
import { toast } from "@/hooks/use-toast";

const categoryOrder: CarCategory[] = [
  "Sedan",
  "SUV",
  "Coupé",
  "Electric",
  "M Performance",
  "Convertible",
];

type SortKey = "featured" | "price-asc" | "price-desc" | "power-desc" | "accel-asc";
type FuelKey = "all" | "electric" | "gas";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const Models = () => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<CarCategory | "All">(
    (params.get("cat") as CarCategory) ?? "All",
  );
  const [fuel, setFuel] = useState<FuelKey>((params.get("fuel") as FuelKey) ?? "all");
  const [sort, setSort] = useState<SortKey>((params.get("sort") as SortKey) ?? "featured");
  const [maxPrice, setMaxPrice] = useState<number>(Number(params.get("max")) || 150000);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    setCompareIds(getCompare());
    return subscribeCompare(setCompareIds);
  }, []);

  // Sync filters to URL
  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (category !== "All") next.set("cat", category);
    if (fuel !== "all") next.set("fuel", fuel);
    if (sort !== "featured") next.set("sort", sort);
    if (maxPrice !== 150000) next.set("max", String(maxPrice));
    setParams(next, { replace: true });
  }, [query, category, fuel, sort, maxPrice, setParams]);

  const filtered = useMemo(() => {
    let list = cars.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      );
    }
    if (category !== "All") list = list.filter((c) => c.category === category);
    if (fuel === "electric") list = list.filter((c) => c.category === "Electric");
    if (fuel === "gas") list = list.filter((c) => c.category !== "Electric");
    list = list.filter((c) => c.price <= maxPrice);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "power-desc":
        list.sort((a, b) => b.specs.horsepower - a.specs.horsepower);
        break;
      case "accel-asc":
        list.sort((a, b) => a.specs.acceleration - b.specs.acceleration);
        break;
      default:
        break;
    }
    return list;
  }, [query, category, fuel, sort, maxPrice]);

  // Group by category only when sort is "featured" AND there is no category filter
  const grouped = useMemo(() => {
    if (sort !== "featured" || category !== "All") return null;
    const map = new Map<CarCategory, typeof cars>();
    for (const car of filtered) {
      const list = map.get(car.category) ?? [];
      list.push(car);
      map.set(car.category, list);
    }
    return categoryOrder
      .map((cat) => ({ category: cat, items: map.get(cat) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [filtered, sort, category]);

  const handleCompare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const car = cars.find((c) => c.id === id);
    const res = toggleCompare(id);
    if (res.full) {
      toast({
        title: "Compare list full",
        description: `Remove a car to add another (max ${COMPARE_MAX}).`,
      });
      return;
    }
    toast({
      title: res.added ? `Added ${car?.name}` : `Removed ${car?.name}`,
      description: res.added ? "View the Compare page to see them side-by-side." : undefined,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setFuel("all");
    setSort("featured");
    setMaxPrice(150000);
  };

  const renderCard = (car: typeof cars[number], i: number) => {
    const inCompare = compareIds.includes(car.id);
    return (
      <ScrollReveal key={car.id} delay={i * 60}>
        <Link
          to={`/models/${car.id}`}
          className="group block bg-card rounded-lg overflow-hidden border border-border hover:border-bmw-blue/50 transition-all duration-500 hover:-translate-y-1 hover:glow-blue"
        >
          <div className="aspect-[4/3] overflow-hidden relative bg-black">
            <CarThumb car={car} className="absolute inset-0" />
            <div className="absolute top-3 left-3 bg-background/70 backdrop-blur-md text-xs uppercase tracking-wider px-2 py-1 rounded z-10">
              {car.category}
            </div>
            <button
              onClick={(e) => handleCompare(car.id, e)}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
              className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded border backdrop-blur-md transition ${
                inCompare
                  ? "border-bmw-blue bg-bmw-blue/20 text-bmw-blue"
                  : "border-border bg-background/70 text-muted-foreground hover:text-foreground hover:border-bmw-blue/60"
              }`}
            >
              {inCompare ? <Check size={12} /> : <Plus size={12} />}
              Compare
            </button>
          </div>
          <div className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {car.tagline}
            </p>
            <h3 className="font-heading text-xl font-semibold mb-3">{car.name}</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Starting at</p>
                <p className="text-bmw-blue font-semibold">{formatPrice(car.price)}</p>
              </div>
              <span className="inline-flex items-center text-sm text-foreground group-hover:text-bmw-blue transition-colors">
                Details <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </ScrollReveal>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BMWHeader />

      <main className="pt-28 pb-24">
        <div className="container">
          <ScrollReveal>
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-3">
              The Lineup
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
              All BMW Models
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-10">
              Explore the full range — search, filter and compare up to {COMPARE_MAX} BMWs side by side.
            </p>
          </ScrollReveal>

          {/* Filter bar */}
          <div className="sticky top-16 z-30 -mx-4 px-4 py-4 mb-10 bg-background/85 backdrop-blur-xl border-y border-border">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search models, e.g. M4, electric, sport..."
                  className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-bmw-blue"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CarCategory | "All")}
                className="bg-card border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-bmw-blue"
              >
                <option value="All">All series</option>
                {categoryOrder.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value as FuelKey)}
                className="bg-card border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-bmw-blue"
              >
                <option value="all">All fuel types</option>
                <option value="electric">Electric</option>
                <option value="gas">Combustion</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-card border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-bmw-blue"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="power-desc">Most powerful</option>
                <option value="accel-asc">Fastest 0–60</option>
              </select>

              <label className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-md px-3 py-2">
                <span>Max</span>
                <input
                  type="range"
                  min={40000}
                  max={150000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-bmw-blue"
                />
                <span className="font-mono text-foreground">{formatPrice(maxPrice)}</span>
              </label>

              {(query || category !== "All" || fuel !== "all" || sort !== "featured" || maxPrice !== 150000) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X size={14} /> Clear
                </button>
              )}

              <div className="ml-auto text-xs text-muted-foreground">
                {filtered.length} of {cars.length} models
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground mb-4">No models match those filters.</p>
              <button onClick={clearFilters} className="text-bmw-blue hover:underline text-sm">
                Reset filters
              </button>
            </div>
          ) : grouped ? (
            <div className="space-y-20">
              {grouped.map(({ category: cat, items }) => (
                <section key={cat} id={cat.toLowerCase().replace(/\s+/g, "-")}>
                  <ScrollReveal>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="font-heading text-2xl md:text-3xl font-bold">{cat}</h2>
                      <span className="text-sm text-muted-foreground">
                        {items.length} model{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </ScrollReveal>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((c, i) => renderCard(c, i))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => renderCard(c, i))}
            </div>
          )}
        </div>
      </main>

      {/* Floating compare tray */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-card/95 backdrop-blur-xl border border-border rounded-full shadow-lg pl-2 pr-4 py-2 flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground pl-2">
            {compareIds.length}/{COMPARE_MAX} to compare
          </span>
          <Link
            to="/compare"
            className="text-xs font-semibold uppercase tracking-wider bg-bmw-blue text-primary-foreground px-3 py-1.5 rounded-full hover:opacity-90"
          >
            Compare now
          </Link>
        </div>
      )}

      <BMWFooter />
    </div>
  );
};

export default Models;
