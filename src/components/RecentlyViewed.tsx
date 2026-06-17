import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import CarThumb from "@/components/CarThumb";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import { getCar } from "@/data/cars";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const RecentlyViewed = () => {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getRecentlyViewed());
  }, []);

  const items = ids.map((id) => getCar(id)).filter(Boolean) as ReturnType<typeof getCar>[];
  if (items.length === 0) return null;

  return (
    <section className="py-16 border-t border-border">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-bmw-blue">
            <Clock size={18} />
            <p className="text-sm font-medium tracking-[0.3em] uppercase">Recently viewed</p>
          </div>
          <Link to="/models" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            All models <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((c) => (
            <Link
              key={c!.id}
              to={`/models/${c!.id}`}
              className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-bmw-blue/50 transition"
            >
              <div className="aspect-[4/3] bg-black">
                <CarThumb car={c!} className="w-full h-full" />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold truncate">{c!.name}</p>
                <p className="text-[11px] text-bmw-blue">{formatPrice(c!.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
