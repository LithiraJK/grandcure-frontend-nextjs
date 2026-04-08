import { Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "GrandCure gave our family complete peace of mind. Every update arrived exactly when we needed it.",
    name: "Anita Lawson",
    role: "Daughter of Patient",
  },
  {
    quote:
      "The caregiver verification process is incredibly reassuring. It feels premium, thoughtful, and safe.",
    name: "Marcus Bennett",
    role: "Family Coordinator",
  },
  {
    quote:
      "The interface is calm and beautifully clear. We can track care quality without stress.",
    name: "Ruth Campbell",
    role: "Primary Guardian",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#f7f9fc] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3c596f]">
            Family Voices
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[#191c1e] sm:text-5xl">
            Trusted by families who expect clarity and compassion.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl bg-white p-8 sm:p-10">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e7f0f8] text-[#0e5e89]">
                <Quote className="h-4 w-4" />
              </span>
              <p className="mt-6 text-base leading-relaxed text-[#3a4248]">&quot;{item.quote}&quot;</p>
              <p className="mt-6 font-display text-2xl font-extrabold tracking-tight text-[#191c1e]">
                {item.name}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#4b545b]">{item.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
