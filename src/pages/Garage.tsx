import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Loader2, Trash2 } from "lucide-react";
import BMWHeader from "@/components/BMWHeader";
import BMWFooter from "@/components/BMWFooter";
import CarThumb from "@/components/CarThumb";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cars, getCar } from "@/data/cars";
import { toast } from "@/hooks/use-toast";

interface GarageRow {
  id: string;
  car_id: string;
  color: string | null;
  finish: string | null;
  flake: string | null;
  nickname: string | null;
  created_at: string;
}

interface BookingRow {
  id: string;
  car_id: string;
  preferred_date: string;
  preferred_time: string;
  location: string | null;
  status: string;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const Garage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [garage, setGarage] = useState<GarageRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setFetching(true);
      const [g, b] = await Promise.all([
        supabase.from("garage").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("test_drive_bookings").select("id, car_id, preferred_date, preferred_time, location, status")
          .eq("user_id", user.id).order("preferred_date", { ascending: true }),
      ]);
      if (g.data) setGarage(g.data as GarageRow[]);
      if (b.data) setBookings(b.data as BookingRow[]);
      setFetching(false);
    })();
  }, [user]);

  const removeFromGarage = async (rowId: string) => {
    const { error } = await supabase.from("garage").delete().eq("id", rowId);
    if (error) {
      toast({ title: "Remove failed", description: error.message, variant: "destructive" });
      return;
    }
    setGarage((g) => g.filter((r) => r.id !== rowId));
    toast({ title: "Removed from garage" });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-bmw-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BMWHeader />
      <main className="pt-28 pb-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-3">Your Account</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">My Garage</h1>
            <p className="text-muted-foreground mb-12">
              Saved vehicles, your custom builds, and upcoming test drives — all in one place.
            </p>
          </motion.div>

          <section className="mb-20">
            <h2 className="font-heading text-2xl font-bold mb-6">Saved Vehicles</h2>
            {fetching ? (
              <Loader2 className="animate-spin text-bmw-blue" />
            ) : garage.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-12 text-center">
                <p className="text-muted-foreground mb-4">Your garage is empty.</p>
                <Link to="/models" className="text-bmw-blue hover:underline">Browse the lineup →</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {garage.map((row) => {
                  const car = getCar(row.car_id);
                  if (!car) return null;
                  const displayCar = row.color ? { ...car, bodyColor: row.color } : car;
                  return (
                    <motion.div
                      key={row.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-card border border-border rounded-xl overflow-hidden hover:border-bmw-blue/50 transition-all"
                    >
                      <Link to={`/models/${car.id}`}>
                        <div className="aspect-[4/3] bg-black">
                          <CarThumb car={displayCar} className="w-full h-full" />
                        </div>
                      </Link>
                      <div className="p-5">
                        <Link to={`/models/${car.id}`}>
                          <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-bmw-blue transition-colors">
                            {car.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-bmw-blue mb-3">{formatPrice(car.price)}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          {row.color && (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: row.color }} />
                              {row.finish} · {row.flake}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromGarage(row.id)}
                          className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold mb-6">Test Drive Bookings</h2>
            {bookings.length === 0 ? (
              <div className="border border-dashed border-border rounded-xl p-12 text-center">
                <Calendar className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No bookings yet. Schedule one from any model page.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => {
                  const car = getCar(b.car_id);
                  return (
                    <div key={b.id} className="flex items-center justify-between bg-card border border-border rounded-lg p-5">
                      <div>
                        <p className="font-heading text-lg font-semibold">{car?.name ?? b.car_id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(b.preferred_date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                          {" · "}{b.preferred_time}
                          {b.location ? ` · ${b.location}` : ""}
                        </p>
                      </div>
                      <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full border ${
                        b.status === "confirmed" ? "border-green-500/40 text-green-500" :
                        b.status === "cancelled" ? "border-destructive/40 text-destructive" :
                        "border-bmw-blue/40 text-bmw-blue"
                      }`}>{b.status}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <BMWFooter />
    </div>
  );
};

export default Garage;
