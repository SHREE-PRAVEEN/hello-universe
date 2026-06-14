import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { PlatformSection } from "@/components/platform-section";
import { ProductsSection } from "@/components/products-section";
import { VerticalsSection } from "@/components/verticals-section";
import { PricingSection } from "@/components/pricing-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <PlatformSection />
      <ProductsSection />
      <VerticalsSection />
      <PricingSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
