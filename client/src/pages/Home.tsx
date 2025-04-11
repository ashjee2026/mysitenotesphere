import HeroSection from "@/components/Home/HeroSection";
import CategorySection from "@/components/Home/CategorySection";
import FeaturedResources from "@/components/Home/FeaturedResources";
import ResourceTypeSection from "@/components/Home/ResourceTypeSection";
import RecentlyAdded from "@/components/Home/RecentlyAdded";
import CallToAction from "@/components/Home/CallToAction";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection />
      <FeaturedResources />
      <ResourceTypeSection />
      <RecentlyAdded />
      <CallToAction />
    </main>
  );
}
