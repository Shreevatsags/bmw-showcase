import suvImage from "@/assets/bmw-suv.jpg";
import coupeImage from "@/assets/bmw-coupe.jpg";
import electricImage from "@/assets/bmw-electric.jpg";
import heroImage from "@/assets/bmw-hero.jpg";

export type CarCategory = "Sedan" | "SUV" | "Coupé" | "Electric" | "M Performance" | "Convertible";

export interface Car {
  id: string;
  name: string;
  category: CarCategory;
  tagline: string;
  description: string;
  price: number; // USD
  image: string;
  bodyColor: string; // hex for 3D model
  accentColor: string;
  specs: {
    horsepower: number;
    topSpeed: number; // mph
    acceleration: number; // 0-60 mph in seconds
    range: number; // miles (fuel range or electric range)
    seats: number;
    drivetrain: string;
    transmission: string;
  };
  features: string[];
  bodyType: "sedan" | "suv" | "coupe";
}

export const cars: Car[] = [
  {
    id: "x5",
    name: "BMW X5",
    category: "SUV",
    tagline: "Sports Activity Vehicle",
    description:
      "Commanding presence meets dynamic capability. The BMW X5 redefines what an SAV can be with refined luxury and trail-ready strength.",
    price: 65200,
    image: suvImage,
    bodyColor: "#1f2937",
    accentColor: "#60a5fa",
    specs: {
      horsepower: 375,
      topSpeed: 151,
      acceleration: 5.3,
      range: 480,
      seats: 5,
      drivetrain: "xDrive AWD",
      transmission: "8-speed Steptronic",
    },
    features: ["Panoramic Sky Lounge LED roof", "Live Cockpit Pro", "Harman Kardon Audio", "Adaptive M Suspension"],
    bodyType: "suv",
  },
  {
    id: "m4",
    name: "BMW M4 Competition",
    category: "M Performance",
    tagline: "Pure Performance Coupé",
    description:
      "Track-bred precision wrapped in sculpted carbon. The M4 Competition delivers uncompromising performance with everyday usability.",
    price: 84100,
    image: coupeImage,
    bodyColor: "#dc2626",
    accentColor: "#fbbf24",
    specs: {
      horsepower: 503,
      topSpeed: 180,
      acceleration: 3.8,
      range: 380,
      seats: 4,
      drivetrain: "M xDrive AWD",
      transmission: "8-speed M Steptronic",
    },
    features: ["Carbon fiber roof", "M Carbon bucket seats", "Adaptive M Suspension", "M Sport exhaust"],
    bodyType: "coupe",
  },
  {
    id: "i5",
    name: "BMW i5 eDrive40",
    category: "Electric",
    tagline: "Fully Electric Sedan",
    description:
      "Silent power. Limitless range of expression. The i5 brings electric driving to the heart of the executive class.",
    price: 66800,
    image: electricImage,
    bodyColor: "#1e3a8a",
    accentColor: "#22d3ee",
    specs: {
      horsepower: 335,
      topSpeed: 120,
      acceleration: 5.7,
      range: 295,
      seats: 5,
      drivetrain: "RWD",
      transmission: "Single-speed automatic",
    },
    features: ["Curved Display", "BMW IconicSounds Electric", "DC Fast Charging 205 kW", "Heat pump system"],
    bodyType: "sedan",
  },
  {
    id: "7series",
    name: "BMW 7 Series",
    category: "Sedan",
    tagline: "Flagship Luxury Sedan",
    description:
      "The pinnacle of presence. Every detail of the 7 Series is engineered to elevate the act of driving—and being driven.",
    price: 96400,
    image: heroImage,
    bodyColor: "#0f172a",
    accentColor: "#e2e8f0",
    specs: {
      horsepower: 375,
      topSpeed: 149,
      acceleration: 5.2,
      range: 460,
      seats: 5,
      drivetrain: "xDrive AWD",
      transmission: "8-speed Steptronic",
    },
    features: ["31.3\" Theater Screen", "Executive Lounge seating", "Crystal headlights", "Bowers & Wilkins Diamond"],
    bodyType: "sedan",
  },
  {
    id: "ix",
    name: "BMW iX xDrive50",
    category: "Electric",
    tagline: "Electric Sports Activity Vehicle",
    description:
      "A technology flagship reimagined as an SAV. The iX combines 324-mile range with breakthrough design inside and out.",
    price: 87100,
    image: suvImage,
    bodyColor: "#0e7490",
    accentColor: "#a3e635",
    specs: {
      horsepower: 516,
      topSpeed: 124,
      acceleration: 4.4,
      range: 324,
      seats: 5,
      drivetrain: "xDrive AWD",
      transmission: "Single-speed automatic",
    },
    features: ["Shy-tech interior", "Curved Display", "Panoramic glass roof", "DC Fast Charging 195 kW"],
    bodyType: "suv",
  },
  {
    id: "m8",
    name: "BMW M8 Competition",
    category: "M Performance",
    tagline: "Grand Tourer Coupé",
    description:
      "Luxury and motorsport, fused. The M8 Competition is the most powerful BMW coupé ever produced for the road.",
    price: 138000,
    image: coupeImage,
    bodyColor: "#111827",
    accentColor: "#f59e0b",
    specs: {
      horsepower: 617,
      topSpeed: 190,
      acceleration: 3.0,
      range: 360,
      seats: 4,
      drivetrain: "M xDrive AWD",
      transmission: "8-speed M Steptronic",
    },
    features: ["M Carbon ceramic brakes", "Active M Differential", "M Carbon exterior package", "Merino full leather"],
    bodyType: "coupe",
  },
  {
    id: "3series",
    name: "BMW 3 Series",
    category: "Sedan",
    tagline: "The Sports Sedan",
    description:
      "The benchmark sports sedan, refined for a new era. Agile, connected and unmistakably BMW.",
    price: 44500,
    image: heroImage,
    bodyColor: "#ffffff",
    accentColor: "#1d4ed8",
    specs: {
      horsepower: 255,
      topSpeed: 130,
      acceleration: 5.6,
      range: 520,
      seats: 5,
      drivetrain: "RWD / xDrive AWD",
      transmission: "8-speed Steptronic",
    },
    features: ["Live Cockpit Plus", "Wireless Apple CarPlay", "Sport seats", "Adaptive LED headlights"],
    bodyType: "sedan",
  },
  {
    id: "x7",
    name: "BMW X7",
    category: "SUV",
    tagline: "Flagship 3-Row SAV",
    description:
      "Commanding stature meets first-class comfort across three rows. The X7 carries the family in unmistakable presence.",
    price: 83100,
    image: suvImage,
    bodyColor: "#374151",
    accentColor: "#fde047",
    specs: {
      horsepower: 375,
      topSpeed: 130,
      acceleration: 5.6,
      range: 470,
      seats: 7,
      drivetrain: "xDrive AWD",
      transmission: "8-speed Steptronic",
    },
    features: ["Six-seat configuration", "Sky Lounge panoramic roof", "Crystal iDrive controller", "Soft-close doors"],
    bodyType: "suv",
  },
];

export const getCar = (id: string) => cars.find((c) => c.id === id);
