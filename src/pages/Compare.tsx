import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus, X, GitCompareArrows } from "lucide-react";
import BMWHeader from "@/components/BMWHeader";
import BMWFooter from "@/components/BMWFooter";
import CarThumb from "@/components/CarThumb";
import { cars, getCar } from "@/data/cars";
import {
  COMPARE_MAX,
  clearCompare,
  getCompare,
  removeFromCompare,
  subscribeCompare,
  toggleCompare,
} from "@/lib/compare";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

type Best = "high" | "low";
function bestIndex(values: number[], dir: Best): number {
  if (values.length === 0) return -1;
  let idx = 0;
  for (let i = 1; i < values.length; i++) {
    if (dir === "high" ? values[i] > values[idx] : values[i] < values[idx]) idx = i;
  }
  return idx;
}

const Compare = () => {
  const [ids, setIds] = useState<string[]>([]);
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    setIds(getCompare());
    return subscribeCompare(setIds);
  }, []);

  const selected = ids.map((id) => getCar(id)).filter(Boolean) as ReturnType<typeof getCar>[];
  const slots = Array.from({ length: COMPARE_MAX }, (_, i) => selected[i] ?? null);

  const rows: { label: string; values: number[]; format: (v: number) => string; best: Best }[] = [
    {
      label: "Price",
      values: selected.map((c) => c!.price),
      format: (v) => formatPrice(v),
      best: "low",
    },
    {
      label: "Horsepower",
      values: selected.map((c) => c!.specs.horsepower),
      format: (v) => `${v} hp`,
      best: "high",
    },
    {
      label: "0–60 mph",
      values: selected.map((c) => c!.specs.acceleration),
      format: (v) => `${v}s`,
      best: "low",
    },
    {
      label: "Top speed",
      values: selected.map((c) => c!.specs.topSpeed),
      format: (v) => `${v} mph`,
      best: "high",
    },
    {
      label: "Range",
      values: selected.map((c) => c!.specs.range),
      format: (v) => `${v} mi`,
      best: "high",
    },
    {
      label: "Seats",
      values: selected.map((c) => c!.specs.seats),
      format: (v) => `${v}`,
      best: "high",
    },
  ];

  const maxBars = {
    horsepower: Math.max(...cars.map((c) => c.specs.horsepower)),
    topSpeed: Math.max(...cars.map((c) => c.specs.topSpeed)),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BMWHeader />

      <main className="pt-28 pb-24">
        <div className="container">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-3">
                Compare
              </p>
              <h1 className="font-heading text-4xl md:text-5xl font-bold">
                Side by side
              </h1>
              <p className="text-muted-foreground mt-2">
                Compare up to {COMPARE_MAX} BMWs. Best value in each row is highlighted.
              </p>
            </div>
            {selected.length > 0 && (
              <button
                onClick={() => clearCompare()}
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <X size={14} /> Clear all
              </button>
            )}
          </div>

          {/* Slot row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {slots.map((car, idx) =>
              car ? (
                <div key={car.id} className="relative bg-card border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => removeFromCompare(car.id)}
                    aria-label="Remove"
                    className="absolute top-2 right-2 z-10 w-7 h-7 inline-flex items-center justify-center rounded-full bg-background/80 border border-border hover:border-bmw-blue hover:text-bmw-blue"
                  >
                    <X size={14} />
                  </button>
                  <div className="aspect-[4/3] bg-black">
                    <CarThumb car={car} className="w-full h-full" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{car.category}</p>
                    <Link to={`/models/${car.id}`} className="font-heading text-lg font-semibold hover:text-bmw-blue">
                      {car.name}
                    </Link>
                    <p className="text-bmw-blue text-sm mt-1">{formatPrice(car.price)}</p>
                  </div>
                </div>
              ) : (
                <button
                  key={`empty-${idx}`}
                  onClick={() => setPicker(true)}
                  className="aspect-[4/3] sm:aspect-auto sm:min-h-[260px] border border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-bmw-blue/60 transition"
                >
                  <Plus size={28} className="mb-2" />
                  <span className="text-sm">Add a BMW</span>
                </button>
              ),
            )}
          </div>

          {selected.length < 2 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <GitCompareArrows className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">
                Add at least 2 models to see a side-by-side comparison.
              </p>
              <button
                onClick={() => setPicker(true)}
                className="px-5 py-2 bg-bmw-blue text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
              >
                Choose models
              </button>
            </div>
          ) : (
            <>
              {/* Spec table */}
              <div className="overflow-x-auto bg-card border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground w-40">Spec</th>
                      {selected.map((c) => (
                        <th key={c!.id} className="text-left px-4 py-3 font-heading">{c!.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const winner = bestIndex(row.values, row.best);
                      return (
                        <tr key={row.label} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 text-muted-foreground">{row.label}</td>
                          {row.values.map((v, i) => (
                            <td
                              key={i}
                              className={`px-4 py-3 ${i === winner ? "text-bmw-blue font-semibold" : ""}`}
                            >
                              {row.format(v)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    <tr className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-muted-foreground">Drivetrain</td>
                      {selected.map((c) => (
                        <td key={c!.id} className="px-4 py-3">{c!.specs.drivetrain}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">Transmission</td>
                      {selected.map((c) => (
                        <td key={c!.id} className="px-4 py-3">{c!.specs.transmission}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Performance bars */}
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-heading text-lg mb-4">Horsepower</h3>
                  <div className="space-y-3">
                    {selected.map((c) => (
                      <div key={c!.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{c!.name}</span>
                          <span className="text-bmw-blue">{c!.specs.horsepower} hp</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full bg-bmw-blue rounded-full transition-all"
                            style={{ width: `${(c!.specs.horsepower / maxBars.horsepower) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-heading text-lg mb-4">Top speed</h3>
                  <div className="space-y-3">
                    {selected.map((c) => (
                      <div key={c!.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{c!.name}</span>
                          <span className="text-bmw-blue">{c!.specs.topSpeed} mph</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full bg-bmw-blue rounded-full transition-all"
                            style={{ width: `${(c!.specs.topSpeed / maxBars.topSpeed) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features grid */}
              <div className="mt-10">
                <h3 className="font-heading text-2xl mb-4">Signature features</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {selected.map((c) => (
                    <div key={c!.id} className="bg-card border border-border rounded-lg p-5">
                      <p className="font-heading font-semibold mb-3">{c!.name}</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {c!.features.map((f) => (
                          <li key={f} className="flex gap-2">
                            <span className="text-bmw-blue">›</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Picker modal */}
      {picker && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPicker(false)}
        >
          <div
            className="bg-card border border-border rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border sticky top-0 bg-card">
              <h3 className="font-heading text-lg">Choose a model</h3>
              <button onClick={() => setPicker(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 grid sm:grid-cols-2 gap-3">
              {cars.map((c) => {
                const inList = ids.includes(c.id);
                const full = ids.length >= COMPARE_MAX && !inList;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (full) return;
                      toggleCompare(c.id);
                      if (ids.length + 1 >= COMPARE_MAX || inList) setPicker(false);
                    }}
                    disabled={full}
                    className={`flex items-center gap-3 p-3 rounded-md border text-left transition ${
                      inList
                        ? "border-bmw-blue bg-bmw-blue/10"
                        : full
                        ? "border-border opacity-40 cursor-not-allowed"
                        : "border-border hover:border-bmw-blue/60"
                    }`}
                  >
                    <div className="w-16 h-12 rounded bg-black overflow-hidden shrink-0">
                      <CarThumb car={c} className="w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.category} · {formatPrice(c.price)}</p>
                    </div>
                    {inList && <span className="text-xs text-bmw-blue">Added</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <BMWFooter />
    </div>
  );
};

export default Compare;
