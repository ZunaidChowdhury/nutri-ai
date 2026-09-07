import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturedMealsSection from "@/components/landing/FeaturedMealsSection";
import AgentSpotlightSection from "@/components/landing/AgentSpotlightSection";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import NewsletterSection from "@/components/landing/NewsletterSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <AgentSpotlightSection />
      <FeaturedMealsSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <FinalCTASection />
    </>
  );
}
