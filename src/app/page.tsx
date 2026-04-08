import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { PublicNavbar } from "@/components/landing/PublicNavbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <PublicNavbar />
      <Hero />
      <Features />
    </main>
  );
}
