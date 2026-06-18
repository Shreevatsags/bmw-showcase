import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Gauge, Zap, Timer, Users, Cog, Wrench, Check, Share2, GitCompareArrows, Heart, CalendarDays } from "lucide-react";
import BMWHeader from "@/components/BMWHeader";
import BMWFooter from "@/components/BMWFooter";
import Car3D from "@/components/Car3D";
import ScrollReveal from "@/components/ScrollReveal";
import CarThumb from "@/components/CarThumb";
import TestDriveDialog from "@/components/TestDriveDialog";
import { getCar, cars } from "@/data/cars";
import {
  customizationFromSearch,
  customizationToQuery,
  getCustomization,
  saveCustomization,
  type Finish,
  type Flake,
} from "@/lib/carCustomization";
import { COMPARE_MAX, getCompare, subscribeCompare, toggleCompare } from "@/lib/compare";
import { pushRecentlyViewed } from "@/lib/recentlyViewed";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const PAINT_OPTIONS = [
  { name: "Alpine White", hex: "#f5f5f5" },
  { name: "Jet Black", hex: "#0b0b0d" },
  { name: "Mineral Grey", hex: "#4b5563" },
  { name: "Storm Bay", hex: "#1e3a8a" },
  { name: "Estoril Blue", hex: "#1d4ed8" },
  { name: "Sky Cyan", hex: "#22d3ee" },
  { name: "Toronto Red", hex: "#dc2626" },
  { name: "São Paulo Yellow", hex: "#facc15" },
  { name: "Frozen Green", hex: "#16a34a" },
  { name: "Tanzanite Violet", hex: "#7c3aed" },
];

const FINISH_OPTIONS: { value: Finish; label: string; hint: string }[] = [
  { value: "gloss", label: "Gloss", hint: "Mirror-bright clearcoat" },
  { value: "matte", label: "Matte", hint: "Soft, non-reflective" },
];

const FLAKE_OPTIONS: { value: Flake; label: string; hint: string }[] = [
  { value: "metal", label: "Metallic", hint: "Deep metallic flake" },
  { value: "pearl", label: "Pearl", hint: "Iridescent shimmer" },
];

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const car = id ? getCar(id) : undefined;

  // Resolve initial customization: URL > localStorage > car default.
  const initial = useMemo(() => {
    if (!car) return null;
    const fromUrl = customizationFromSearch(location.search);
    const fromStore = getCustomization(car.id);
    return {
      color: fromUrl.color ?? fromStore?.color ?? car.bodyColor,
      finish: fromUrl.finish ?? fromStore?.finish ?? ("gloss" as Finish),
      flake: fromUrl.flake ?? fromStore?.flake ?? ("metal" as Flake),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car?.id]);

  const [bodyColor, setBodyColor] = useState(initial?.color ?? "#1f2937");
  const [finish, setFinish] = useState<Finish>(initial?.finish ?? "gloss");
  const [flake, setFlake] = useState<Flake>(initial?.flake ?? "metal");
  const [autoRotate, setAutoRotate] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const { user } = useAuth();
  const [inGarage, setInGarage] = useState(false);
  const [garageBusy, setGarageBusy] = useState(false);

  useEffect(() => {
    setCompareIds(getCompare());
    return subscribeCompare(setCompareIds);
  }, []);

  // Check whether this car is already in the user's garage
  useEffect(() => {
    if (!user || !car) { setInGarage(false); return; }
    supabase
      .from("garage")
      .select("id")
      .eq("user_id", user.id)
      .eq("car_id", car.id)
      .maybeSingle()
      .then(({ data }) => setInGarage(!!data));
  }, [user, car?.id]);

  useEffect(() => {
    if (car?.id) pushRecentlyViewed(car.id);
  }, [car?.id]);

  // Re-init when navigating between cars
  useEffect(() => {
    if (!car) return;
    const fromUrl = customizationFromSearch(location.search);
    const fromStore = getCustomization(car.id);
    setBodyColor(fromUrl.color ?? fromStore?.color ?? car.bodyColor);
    setFinish(fromUrl.finish ?? fromStore?.finish ?? "gloss");
    setFlake(fromUrl.flake ?? fromStore?.flake ?? "metal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car?.id]);

  // Persist + sync URL whenever selection changes
  useEffect(() => {
    if (!car) return;
    const c = { color: bodyColor, finish, flake };
    saveCustomization(car.id, c);
    const qs = customizationToQuery(c);
    navigate(`${location.pathname}?${qs}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyColor, finish, flake, car?.id]);

  if (!car) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <BMWHeader />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="font-heading text-3xl mb-4">Model not found</h1>
            <Link to="/models" className="text-bmw-blue hover:underline">
              Back to all models
            </Link>
          </div>
        </main>
        <BMWFooter />
      </div>
    );
  }

  const related = cars.filter((c) => c.id !== car.id && c.category === car.category).slice(0, 3);

  const specItems = [
    { icon: Zap, label: "Horsepower", value: `${car.specs.horsepower} hp` },
    { icon: Gauge, label: "Top Speed", value: `${car.specs.topSpeed} mph` },
    { icon: Timer, label: "0–60 mph", value: `${car.specs.acceleration}s` },
    { icon: Wrench, label: "Range", value: `${car.specs.range} mi` },
    { icon: Users, label: "Seats", value: `${car.specs.seats}` },
    { icon: Cog, label: "Drivetrain", value: car.specs.drivetrain },
  ];

  const handleShare = async () => {
    const qs = customizationToQuery({ color: bodyColor, finish, flake });
    const url = `${window.location.origin}${location.pathname}?${qs}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Share it — they'll see this exact color." });
    } catch {
      toast({ title: "Share link", description: url });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BMWHeader />

      <main className="pt-24 pb-24">
        <div className="container">
          <Link
            to="/models"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} className="mr-1" /> All Models
          </Link>

          {/* Hero: 3D + summary */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-20">
            <div className="relative h-[420px] md:h-[520px] rounded-xl overflow-hidden border border-border bg-gradient-to-b from-card to-background">
              <Car3D
                bodyColor={bodyColor}
                accentColor={car.accentColor}
                bodyType={car.bodyType}
                autoRotate={autoRotate}
                finish={finish}
                flake={flake}
                className="absolute inset-0"
              />
              <button
                onClick={() => setAutoRotate((v) => !v)}
                className="absolute top-3 right-3 bg-background/70 backdrop-blur-md border border-border text-xs uppercase tracking-wider px-3 py-1.5 rounded hover:border-bmw-blue/60 transition-colors"
              >
                {autoRotate ? "Pause" : "Rotate"}
              </button>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground pointer-events-none">
                <span>Interactive 3D · drag to rotate · scroll to zoom</span>
                <span>{finish} · {flake}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium tracking-[0.3em] uppercase text-bmw-blue mb-3">
                {car.category}
              </p>
              <h1 className="font-heading text-4xl md:text-6xl font-bold mb-3">
                {car.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-2">{car.tagline}</p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {car.description}
              </p>

              <div className="flex items-end gap-6 mb-8">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Starting at</p>
                  <p className="font-heading text-3xl font-bold text-bmw-blue">
                    {formatPrice(car.price)}
                  </p>
                </div>
              </div>

              {/* Paint customizer */}
              <div className="mb-6 p-5 bg-card border border-border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Exterior Paint
                  </p>
                  <p className="text-sm font-medium">
                    {PAINT_OPTIONS.find((p) => p.hex.toLowerCase() === bodyColor.toLowerCase())?.name ?? "Custom"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {PAINT_OPTIONS.map((p) => {
                    const active = p.hex.toLowerCase() === bodyColor.toLowerCase();
                    return (
                      <button
                        key={p.hex}
                        onClick={() => setBodyColor(p.hex)}
                        title={p.name}
                        aria-label={p.name}
                        className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                          active ? "border-bmw-blue scale-110 glow-blue" : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: p.hex }}
                      >
                        {active && (
                          <Check
                            size={16}
                            className="absolute inset-0 m-auto"
                            style={{
                              color: ["#f5f5f5", "#facc15"].includes(p.hex) ? "#000" : "#fff",
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <label className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Custom color:</span>
                  <input
                    type="color"
                    value={bodyColor}
                    onChange={(e) => setBodyColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border border-border"
                  />
                  <span className="font-mono uppercase">{bodyColor}</span>
                </label>
              </div>

              {/* Finish + Flake */}
              <div className="mb-8 grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-card border border-border rounded-lg">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Finish
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {FINISH_OPTIONS.map((opt) => {
                      const active = finish === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setFinish(opt.value)}
                          className={`text-left rounded-md border px-3 py-2 transition-all ${
                            active
                              ? "border-bmw-blue bg-bmw-blue/10 text-foreground"
                              : "border-border text-muted-foreground hover:text-foreground hover:border-bmw-blue/40"
                          }`}
                        >
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="text-[10px] uppercase tracking-wider opacity-70">
                            {opt.hint}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 bg-card border border-border rounded-lg">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Effect
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {FLAKE_OPTIONS.map((opt) => {
                      const active = flake === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setFlake(opt.value)}
                          className={`text-left rounded-md border px-3 py-2 transition-all ${
                            active
                              ? "border-bmw-blue bg-bmw-blue/10 text-foreground"
                              : "border-border text-muted-foreground hover:text-foreground hover:border-bmw-blue/40"
                          }`}
                        >
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="text-[10px] uppercase tracking-wider opacity-70">
                            {opt.hint}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  disabled={garageBusy}
                  onClick={async () => {
                    if (!user) { navigate("/auth"); return; }
                    setGarageBusy(true);
                    if (inGarage) {
                      const { error } = await supabase
                        .from("garage").delete()
                        .eq("user_id", user.id).eq("car_id", car.id);
                      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                      else { setInGarage(false); toast({ title: "Removed from garage" }); }
                    } else {
                      const { error } = await supabase.from("garage").insert({
                        user_id: user.id, car_id: car.id,
                        color: bodyColor, finish, flake,
                      });
                      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                      else { setInGarage(true); toast({ title: `Saved ${car.name} to your garage` }); }
                    }
                    setGarageBusy(false);
                  }}
                  className={`px-6 py-3 rounded-md font-medium inline-flex items-center gap-2 transition ${
                    inGarage
                      ? "bg-bmw-blue text-primary-foreground glow-blue"
                      : "border border-border hover:border-bmw-blue hover:text-bmw-blue"
                  }`}
                >
                  <Heart size={16} className={inGarage ? "fill-current" : ""} />
                  {inGarage ? "In your garage" : "Save to garage"}
                </button>
                <TestDriveDialog
                  car={car}
                  trigger={
                    <button className="px-6 py-3 border border-border rounded-md font-medium inline-flex items-center gap-2 hover:border-bmw-blue hover:text-bmw-blue transition">
                      <CalendarDays size={16} /> Schedule Test Drive
                    </button>
                  }
                />

                <button
                  onClick={handleShare}
                  className="px-6 py-3 border border-border rounded-md font-medium inline-flex items-center gap-2 hover:border-bmw-blue hover:text-bmw-blue transition"
                >
                  <Share2 size={16} /> Share this color
                </button>
                {car && (() => {
                  const inCompare = compareIds.includes(car.id);
                  return (
                    <button
                      onClick={() => {
                        const res = toggleCompare(car.id);
                        if (res.full) {
                          toast({ title: "Compare list full", description: `Max ${COMPARE_MAX} models.` });
                          return;
                        }
                        toast({ title: res.added ? `Added ${car.name} to compare` : `Removed from compare` });
                      }}
                      className={`px-6 py-3 rounded-md font-medium inline-flex items-center gap-2 transition border ${
                        inCompare
                          ? "border-bmw-blue text-bmw-blue bg-bmw-blue/10"
                          : "border-border hover:border-bmw-blue hover:text-bmw-blue"
                      }`}
                    >
                      <GitCompareArrows size={16} /> {inCompare ? "In compare" : "Add to compare"}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Specs */}
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold mb-8">Performance & Specs</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-20">
            {specItems.map(({ icon: Icon, label, value }, i) => (
              <ScrollReveal key={label} delay={i * 60}>
                <div className="bg-card border border-border rounded-lg p-6 hover:border-bmw-blue/40 transition-colors">
                  <Icon className="text-bmw-blue mb-3" size={22} />
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {label}
                  </p>
                  <p className="font-heading text-2xl font-semibold">{value}</p>
                </div>
              </ScrollReveal>
            ))}
            <ScrollReveal delay={360}>
              <div className="bg-card border border-border rounded-lg p-6 sm:col-span-2 md:col-span-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Transmission
                </p>
                <p className="font-heading text-xl">{car.specs.transmission}</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Features */}
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold mb-8">Signature Features</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4 mb-20">
            {car.features.map((f, i) => (
              <ScrollReveal key={f} delay={i * 60}>
                <div className="flex items-start gap-3 bg-card border border-border rounded-lg p-5">
                  <Check className="text-bmw-blue mt-0.5 shrink-0" size={20} />
                  <p>{f}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <>
              <h2 className="font-heading text-3xl font-bold mb-8">Also in {car.category}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/models/${r.id}`}
                    className="group bg-card border border-border rounded-lg overflow-hidden hover:border-bmw-blue/50 transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-black">
                      <CarThumb car={r} className="w-full h-full" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-semibold mb-1">{r.name}</h3>
                      <p className="text-sm text-bmw-blue">{formatPrice(r.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <BMWFooter />
    </div>
  );
};

export default CarDetail;
