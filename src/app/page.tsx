import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { PublicNavbar } from "@/components/landing/PublicNavbar";
import { PublicFooter } from "@/components/landing/PublicFooter";
import { Testimonials } from "@/components/landing/Testimonials";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <PublicNavbar />
      <Hero />
      <Features />
      <Testimonials />
      <FinalCta />
      <PublicFooter />
    </main>
  );
}
