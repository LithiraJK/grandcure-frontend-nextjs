import Image from "next/image";
import { BadgeCheck, Circle, ShieldCheck } from "lucide-react";

type CaregiverProfile = {
  id: string;
  name: string;
  specialty: string;
  yearsExperience: number;
  imageUrl: string;
};

const caregivers: CaregiverProfile[] = [
  {
    id: "cg-1",
    name: "David R.",
    specialty: "Post-Surgery Recovery",
    yearsExperience: 8,
    imageUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cg-2",
    name: "Elena M.",
    specialty: "Dementia Care",
    yearsExperience: 12,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cg-3",
    name: "Michael S.",
    specialty: "Mobility Specialist",
    yearsExperience: 6,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "cg-4",
    name: "Sarah L.",
    specialty: "Companion Care",
    yearsExperience: 10,
    imageUrl: "https://images.unsplash.com/photo-1594824804732-ca8db7f8a7a9?auto=format&fit=crop&w=600&q=80",
  },
];

export function CaregiverProfiles() {
  return (
    <section className="bg-[radial-gradient(120%_120%_at_10%_0%,#eef6ff_0%,#f7f9fc_55%,#f2f8fb_100%)] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl space-y-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3c596f]">
            Care Team Spotlight
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#1d2227] sm:text-4xl lg:text-5xl">
            Meet trusted caregivers ready to support your family.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#51606d] sm:text-base">
            Handpicked professionals with verified credentials, proven care experience, and
            strong patient-first communication.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {caregivers.map((caregiver) => (
            <article
              key={caregiver.id}
              className="group relative overflow-hidden rounded-3xl border border-[#d9e5ef] bg-white/95 p-6 shadow-[0_14px_40px_-30px_rgba(20,38,54,0.55)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_55px_-30px_rgba(20,38,54,0.5)]"
            >
              <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-b-[2rem] bg-gradient-to-b from-[#eaf3fb] to-transparent" />

              <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-[#0f6a73]/15 transition group-hover:ring-[#0f6a73]/25">
                <div className="absolute inset-0 rounded-full bg-[#0f6a73]/8" />
                <Image
                  src={caregiver.imageUrl}
                  alt={`${caregiver.name} profile`}
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                />
              </div>

              <div className="space-y-4 pt-5 text-center">
                <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-[#1d2227]">
                  {caregiver.name}
                </h3>
                <p className="text-base font-semibold text-[#2a6c95]">{caregiver.specialty}</p>

                <p className="inline-flex items-center gap-2 text-sm font-medium text-[#5f6770]">
                  <Circle className="h-2.5 w-2.5 fill-current" />
                  {caregiver.yearsExperience} Years Experience
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bfe3c8] bg-[#ecf9f0] px-3 py-1 text-xs font-semibold text-[#256b2a]">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c7daef] bg-[#edf4fb] px-3 py-1 text-xs font-semibold text-[#245d84]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Certified
                  </span>
                </div>

                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[#2f77a8]/45 bg-white px-6 text-sm font-semibold tracking-wide text-[#2f77a8] transition duration-200 hover:border-[#2f77a8] hover:bg-[#eef6fc]"
                >
                  View Profile
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
