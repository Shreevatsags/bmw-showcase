import { useEffect, useState } from "react";
import Car3D from "@/components/Car3D";
import type { Car } from "@/data/cars";
import { getCustomization } from "@/lib/carCustomization";

interface CarThumbProps {
  car: Car;
  className?: string;
}

/**
 * Lightweight 3D thumbnail that reflects the user's saved color/finish
 * for the given car. Falls back to the car's default palette.
 */
const CarThumb = ({ car, className }: CarThumbProps) => {
  const read = () => getCustomization(car.id);
  const [c, setC] = useState(read);

  useEffect(() => {
    const update = () => setC(read());
    window.addEventListener("bmw:customization-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("bmw:customization-updated", update);
      window.removeEventListener("storage", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car.id]);

  return (
    <Car3D
      bodyColor={c?.color ?? car.bodyColor}
      accentColor={car.accentColor}
      bodyType={car.bodyType}
      finish={c?.finish ?? "gloss"}
      flake={c?.flake ?? "metal"}
      autoRotate
      interactive={false}
      className={className}
    />
  );
};

export default CarThumb;
