import { Activity, Layout, Shield } from "lucide-react";

type FeatureItem = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const features: FeatureItem[] = [
  {
    title: "Verified Trust",
    description:
      "Every caregiver profile is carefully reviewed, giving families confidence in each care decision.",
    icon: Shield,
  },
  {
    title: "Real-Time Clarity",
    description:
      "Receive timely updates on schedules, assignments, and care progress through a calm, readable interface.",
    icon: Activity,
  },
  {
    title: "Editorial Experience",
    description:
      "A refined interface language that prioritizes emotional comfort, hierarchy, and elegant flow.",
    icon: Layout,
  },
];

export function Features() {
  return (
    <section className="bg-[#f7f9fc] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3c596f]">
            Why GrandCure
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[#191c1e] sm:text-5xl">
            Sanctuary-level care infrastructure for modern families.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="rounded-2xl bg-white p-8 sm:p-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f0f8] text-[#0e5e89]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-7 font-display text-3xl font-extrabold tracking-tight text-[#191c1e]">
                  {feature.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#3a4248]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
