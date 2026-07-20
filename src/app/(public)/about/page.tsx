import { HiSparkles, HiChartBar, HiTag } from "react-icons/hi";

const values = [
  {
    title: "Accessibility",
    description:
      "Premium AI-powered nutrition tools available to everyone, completely free. No paywalls, no subscription tiers.",
  },
  {
    title: "Privacy First",
    description:
      "Your dietary data is yours alone. We never sell or share personal information with third parties.",
  },
  {
    title: "Science-Based",
    description:
      "Our recommendations are grounded in nutritional science, not trends. Sustainable eating over extreme restrictions.",
  },
  {
    title: "Continuous Improvement",
    description:
      "We constantly refine our AI models and features based on user feedback and the latest research.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50/50 to-transparent px-4 py-20 text-center dark:from-primary-950/20 md:px-8 lg:px-16">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          About NutriAI
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-foreground/60">
          We believe everyone deserves access to intelligent nutrition guidance.
          NutriAI combines cutting-edge artificial intelligence with nutritional
          science to help you eat smarter.
        </p>
      </section>

      {/* Mission */}
      <section className="px-4 py-16 md:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
          <p className="mb-4 text-foreground/70 leading-relaxed">
            NutriAI was born from a simple idea: nutrition guidance should be
            personalized, accessible, and intelligent. Most people know they
            should eat better, but generic advice rarely sticks. By harnessing
            the power of AI, we create meal plans and nutritional insights that
            adapt to your unique lifestyle, preferences, and goals.
          </p>
          <p className="text-foreground/70 leading-relaxed">
            Whether you are looking to lose weight, build muscle, maintain a
            balanced diet, or simply explore new cuisines, NutriAI is your
            intelligent companion on the journey to better health.
          </p>
        </div>
      </section>

      {/* AI Agents */}
      <section className="bg-default-50 px-4 py-16 md:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Powered by Three AI Agents
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: HiSparkles,
                title: "Meal Planning",
                desc: "Generates personalized 7-day meal plans based on your goals, restrictions, and preferences.",
              },
              {
                icon: HiChartBar,
                title: "Nutrition Analysis",
                desc: "Analyzes your eating patterns and identifies deficiencies with actionable recommendations.",
              },
              {
                icon: HiTag,
                title: "Food Classification",
                desc: "Automatically tags meals by cuisine type with confidence scoring for better organization.",
              },
            ].map((agent) => (
              <div
                key={agent.title}
                className="flex flex-col items-center gap-3 rounded-xl border border-default-200 p-6 text-center"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <agent.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold">{agent.title}</h3>
                <p className="text-sm text-foreground/60">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16 md:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Our Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-default-200 p-6"
              >
                <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                <p className="text-foreground/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
