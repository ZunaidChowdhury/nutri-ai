import HeroSection from "@/components/landing/HeroSection";
import BentoFeaturesSection from "@/components/landing/BentoFeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AgentSpotlightSection from "@/components/landing/AgentSpotlightSection";
import AgentPipelineSection from "@/components/landing/AgentPipelineSection";
import FeaturedMealsSection from "@/components/landing/FeaturedMealsSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import NewsletterSection from "@/components/landing/NewsletterSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import PricingSection from "@/components/landing/PricingSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      {/* Engineered for Total Nutrition Clarity section (disabled) */}
      {/* <BentoFeaturesSection /> */}
      <HowItWorksSection />
      <AgentSpotlightSection />
      {/* How Our Tri-Agent Engine Works section (disabled) */}
      {/* <AgentPipelineSection /> */}
      <FeaturedMealsSection />
      <ComparisonSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCTASection />
      <FAQSection />
      <NewsletterSection />
    </>
  );
}
