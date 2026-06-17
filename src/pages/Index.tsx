import BMWHeader from "@/components/BMWHeader";
import BMWHero from "@/components/BMWHero";
import BMWModels from "@/components/BMWModels";
import BMWStats from "@/components/BMWStats";
import BMWFooter from "@/components/BMWFooter";
import RecentlyViewed from "@/components/RecentlyViewed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BMWHeader />
      <BMWHero />
      <BMWStats />
      <BMWModels />
      <RecentlyViewed />
      <BMWFooter />
    </div>
  );
};

export default Index;
