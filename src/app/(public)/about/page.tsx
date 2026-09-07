import Link from "next/link";
import {
  HiSparkles,
  HiLightningBolt,
  HiChartPie,
  HiShieldCheck,
  HiAcademicCap,
  HiHeart,
  HiArrowRight,
  HiChip,
  HiCheck,
} from "react-icons/hi";

const agentDetails = [
  {
    title: "AI Meal Planner",
    role: "Autonomous Menu Architect",
    model: "openai/gpt-oss-120b",
    description:
      "Synthesizes 21 distinct meals into a balanced 7-day schedule, aligning exact caloric targets, macronutrient distributions, budget, and dietary preferences in seconds.",
    icon: HiSparkles,
    bgClass: "bg-[#DDF5F0] dark:bg-accent/20",
    textClass: "text-[#007F78] dark:text-accent",
    borderClass: "hover:border-[#007F78]/40",
    badges: ["7-Day Schedule", "Zero Macro Deficits", "Instant Swaps"],
  },
  {
    title: "Meal Analyzer",
    role: "Diagnostic Nutrition Engine",
    model: "openai/gpt-oss-120b",
    description:
      "Evaluates logged meal patterns to identify micronutrient gaps, protein distribution timing, and caloric pacing, translating raw nutritional data into actionable coaching advice.",
    icon: HiLightningBolt,
    bgClass: "bg-[#EAF7DE] dark:bg-[#65B82E]/20",
    textClass: "text-[#65B82E] dark:text-[#65B82E]",
    borderClass: "hover:border-[#65B82E]/40",
    badges: ["Macro Distribution", "Nutritional Gaps", "Habit Coaching"],
  },
  {
    title: "Food Classifier",
    role: "Automated Tagging & Vision",
    model: "openai/gpt-oss-120b",
    description:
      "Categorizes recipes and logged ingredients by cuisine origin, allergen presence, and preparation complexity with a verified 99.4% confidence rating.",
    icon: HiChartPie,
    bgClass: "bg-[#FFFBEB] dark:bg-[#F59E0B]/20",
    textClass: "text-[#F59E0B] dark:text-[#F59E0B]",
    borderClass: "hover:border-[#F59E0B]/40",
    badges: ["99.4% Confidence", "Cuisine Detection", "Allergen Screening"],
  },
];

const values = [
  {
    icon: HiHeart,
    title: "Universal Accessibility",
    description:
      "Nutrition guidance should never be a luxury. NutriAI is 100% free with no paywalls, hidden tiers, or subscriptions.",
    accent: "text-[#007F78] dark:text-accent",
    bgAccent: "bg-[#DDF5F0] dark:bg-accent/20",
  },
  {
    icon: HiShieldCheck,
    title: "Absolute Data Privacy",
    description:
      "Your meal logs, biometric targets, and personal eating patterns are strictly yours. We never sell, monetize, or broker your personal data.",
    accent: "text-[#65B82E] dark:text-[#65B82E]",
    bgAccent: "bg-[#EAF7DE] dark:bg-[#65B82E]/20",
  },
  {
    icon: HiAcademicCap,
    title: "Grounded in Science",
    description:
      "We avoid short-lived fad diets. Every recommendation is built on proven metabolic science, evidence-backed macro splits, and sustainable habits.",
    accent: "text-[#007F78] dark:text-accent",
    bgAccent: "bg-[#DDF5F0] dark:bg-accent/20",
  },
  {
    icon: HiChip,
    title: "Autonomous Intelligence",
    description:
      "Powered by openai/gpt-oss-120b inference to solve multidimensional meal planning in sub-second timeframes without human friction.",
    accent: "text-[#F59E0B] dark:text-[#F59E0B]",
    bgAccent: "bg-[#FFFBEB] dark:bg-[#F59E0B]/20",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-[#F7FAF8] min-h-screen dark:bg-[#0a0a0a]">
      {/* 1. Hero Section */}
      <section className="w-full border-b border-[#DCE9E4] bg-white/80 backdrop-blur-md dark:border-border dark:bg-[#121c19]/80">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-[#F7FAF8] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-2xs dark:border-border dark:bg-surface-secondary dark:text-accent">
            <HiSparkles className="h-3.5 w-3.5" />
            <span>The NutriAI Vision</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#163330] leading-tight dark:text-foreground">
            Empowering Smarter Living Through{" "}
            <span className="text-[#007F78] dark:text-accent">Autonomous AI Nutrition</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#55706B] dark:text-muted">
            NutriAI was founded on a simple conviction: healthy eating should be effortless,
            personalized, and scientifically validated — never limited by costly consultations or confusing diet fads.
          </p>

          {/* Quick Highlight Metrics */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl mx-auto">
            {[
              { label: "Free Forever", val: "100%" },
              { label: "Specialized AI Agents", val: "3 Autonomous" },
              { label: "Accuracy Index", val: "99.4%" },
              { label: "Average Plan Generation", val: "< 2s" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#DCE9E4] bg-white p-3.5 text-center shadow-2xs dark:border-border dark:bg-[#1a1a1a]"
              >
                <span className="block text-xl sm:text-2xl font-black text-[#163330] dark:text-foreground">
                  {stat.val}
                </span>
                <span className="mt-1 block text-xs font-medium text-[#55706B] dark:text-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Mission & Origin (Split Section) */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#DDF5F0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#007F78] dark:bg-accent/20 dark:text-accent mb-4">
              <span>Our Purpose</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl dark:text-foreground">
              Bridging the Chasm Between Good Intentions and Daily Reality
            </h2>

            <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-[#55706B] dark:text-muted">
              <p>
                Almost everyone wants to eat better. Yet more than 80% of individuals abandon their
                nutritional goals within three weeks. The breakdown rarely happens due to lack of willpower
                — it happens because of decision fatigue, tedious logging, and disjointed recipe preparation.
              </p>
              <p>
                Traditional calorie trackers treat humans like accountants, demanding manual barcode scans
                and gram-by-gram weighing while offering zero proactive assistance. Generic diet plans force
                rigid food choices that ignore personal lifestyle, culinary preferences, and cultural diversity.
              </p>
              <p>
                NutriAI changes this paradigm fundamentally. By deploying a trio of cooperative AI agents
                powered by high-speed LLM reasoning, we automate the entire lifecycle: from 7-day schedule synthesis
                and grocery consolidation to adaptive dish swaps and holistic habit analysis.
              </p>
            </div>
          </div>

          {/* Interactive Feature Card */}
          <div className="lg:col-span-5">
            <div className="rounded-[1.75rem] border border-[#DCE9E4] bg-white p-6 sm:p-8 shadow-sm dark:border-border dark:bg-[#151f1c]">
              <h3 className="text-lg font-bold text-[#163330] dark:text-foreground">
                The NutriAI Core Standard
              </h3>
              <p className="mt-1 text-xs text-[#55706B] dark:text-muted">
                What distinguishes our platform from conventional apps
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  {
                    title: "Autonomous 7-Day Planning",
                    desc: "Eliminates repetitive daily decisions with complete balanced weekly schedules.",
                  },
                  {
                    title: "1-Click Macro-Preserving Swaps",
                    desc: "Swap any meal on the fly without breaking your daily caloric or protein goals.",
                  },
                  {
                    title: "Zero Food Waste Grocery Lists",
                    desc: "Synthesizes recipes into a unified aisle-by-aisle shopping checklist.",
                  },
                  {
                    title: "Continuous Habit Insights",
                    desc: "Identifies nutritional deficiencies without guilt trips or punitive alerts.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl bg-[#F7FAF8] p-3 dark:bg-surface-secondary">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF7DE] text-[#65B82E] text-xs font-bold dark:bg-[#65B82E]/20">
                      <HiCheck className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#163330] dark:text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#55706B] dark:text-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Tri-Agent Intelligence Engine */}
      <section className="w-full bg-[#EEF7F3] py-16 sm:py-24 border-y border-[#DCE9E4] dark:bg-[#0c1613] dark:border-border">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-2xs dark:border-border dark:bg-surface-secondary dark:text-accent">
              <HiChip className="h-3.5 w-3.5" />
              <span>Multi-Agent Architecture</span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl dark:text-foreground">
              Powered by Three Specialized AI Agents
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#55706B] dark:text-muted">
              Instead of a generic chatbot, NutriAI relies on modular, purpose-built agents running on high-speed inference.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {agentDetails.map((agent) => (
              <div
                key={agent.title}
                className={`flex flex-col justify-between rounded-[1.75rem] border border-[#DCE9E4] bg-white p-7 sm:p-8 shadow-xs transition-all duration-300 hover:shadow-md ${agent.borderClass} dark:border-border dark:bg-[#151f1c]`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${agent.bgClass}`}>
                      <agent.icon className={`h-6 w-6 ${agent.textClass}`} />
                    </div>
                    <span className="rounded-full bg-[#F7FAF8] border border-[#DCE9E4] px-2.5 py-0.5 text-[10px] font-bold text-[#55706B] dark:bg-surface-secondary dark:border-border dark:text-muted">
                      {agent.model}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#163330] dark:text-foreground">
                    {agent.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#007F78] dark:text-accent mt-0.5">
                    {agent.role}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-[#55706B] dark:text-muted">
                    {agent.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#DCE9E4] pt-4 dark:border-border">
                  <div className="flex flex-wrap gap-1.5">
                    {agent.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-lg bg-[#F7FAF8] px-2 py-1 text-[10px] font-semibold text-[#55706B] border border-[#DCE9E4]/60 dark:bg-surface-secondary dark:border-border dark:text-muted"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Core Values & Commitments */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE9E4] bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#007F78] shadow-2xs dark:border-border dark:bg-surface-secondary dark:text-accent">
            <span>Guiding Principles</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163330] sm:text-4xl dark:text-foreground">
            Our Commitments to Mindful Eaters
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#55706B] dark:text-muted">
            The philosophical and operational standards that govern every model, algorithm, and feature we build.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex items-start gap-4 rounded-2xl border border-[#DCE9E4] bg-white p-6 sm:p-7 shadow-xs transition-all hover:border-[#007F78]/30 hover:shadow-sm dark:border-border dark:bg-[#151f1c]"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${v.bgAccent}`}>
                <v.icon className={`h-6 w-6 ${v.accent}`} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#163330] dark:text-foreground">
                  {v.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#55706B] dark:text-muted">
                  {v.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom Action Card */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#007F78] p-8 sm:p-12 text-center text-white shadow-xl dark:bg-[#005F5A]">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Experience Intelligent Nutrition?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/90">
              Join thousands of healthy individuals who have automated their meal planning and macro tracking with NutriAI.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="!no-underline inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#007F78] shadow-sm hover:bg-[#F7FAF8] dark:text-[#005F5A]"
              >
                <span>Get Started Free</span>
                <HiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/meals"
                className="!no-underline inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20"
              >
                Explore Recipe Library
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
