import type { Metadata } from "next";

import { CaregiverProfiles } from "@/components/landing/CaregiverProfiles";
import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { PublicNavbar } from "@/components/landing/PublicNavbar";
import { PublicFooter } from "@/components/landing/PublicFooter";
import { Testimonials } from "@/components/landing/Testimonials";

export const metadata: Metadata = {
  title: "GrandCure | Curated Elderly Care",
  description:
    "Compassionate in-home elderly care with verified professionals, real-time clarity, and a calm editorial experience.",
  openGraph: {
    title: "GrandCure | Curated Elderly Care",
    description:
      "Experience a new standard of in-home care with trusted caregivers and real-time visibility.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <PublicNavbar />
      <Hero />
      <Features />
      <CaregiverProfiles />
      <Testimonials />
      <FinalCta />
      <PublicFooter />
    </main>
  );
}
