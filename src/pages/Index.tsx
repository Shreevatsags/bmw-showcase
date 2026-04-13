import BMWHeader from "@/components/BMWHeader";
import BMWHero from "@/components/BMWHero";
import BMWModels from "@/components/BMWModels";
import BMWStats from "@/components/BMWStats";
import BMWFooter from "@/components/BMWFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BMWHeader />
      <BMWHero />
      <BMWStats />
      <BMWModels />
      <BMWFooter />
    </div>
  );
};

export default Index;
