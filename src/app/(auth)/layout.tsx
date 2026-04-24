import Image from "next/image";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/branding/BrandLogo";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(120%_120%_at_6%_100%,#e4f2ea_0%,#edf2f7_28%,#f4f7fb_64%,#eef3f8_100%)] lg:grid lg:grid-cols-2 xl:grid-cols-[1.1fr_1fr]">
      {/* Decorative Background Blobs */}
      <div className="pointer-events-none absolute -left-24 top-18 h-72 w-72 rounded-full bg-[#88bde1]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-4 h-80 w-80 rounded-full bg-[#9dd9cf]/20 blur-3xl" />

      {/* Branding Section 
        Mobile: Displays at the top (without image)
        Desktop: Displays on the left (with image)
      */}
      <section className="relative flex flex-col justify-center px-6 pt-12 pb-6 sm:px-10 lg:px-14 lg:py-12">
        <div className="w-full max-w-xl mx-auto lg:max-w-[31rem] space-y-4 lg:space-y-6">
          <BrandLogo className="inline-block text-3xl sm:text-4xl" />

          

          {/* Text size adjusted for mobile screens */}
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight text-[#1f252b] xl:text-[3.55rem]">
            Your health journey,
            <br />
            <span className="text-[#0e5c8f]">curated with heart.</span>
          </h1>

          <p className="text-base sm:text-[1.09rem] leading-relaxed text-[#5c6873] max-w-md">
            We believe healthcare should feel like a sanctuary. Whether you&apos;re seeking care or
            providing it, you&apos;re in professional hands.
          </p>

          {/* Image - Hidden on mobile, visible on Large screens (lg:block) */}
          <div className="hidden lg:block relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[2rem] border border-white/40 shadow-[0_24px_44px_-34px_rgba(20,38,54,0.6)]">
            <Image
              src="/login-image.jpg"
              alt="GrandCure care illustration"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Form Section (Children) 
        Mobile: Displays at the bottom inside a subtle glass card
        Desktop: Displays on the right, seamlessly blending
      */}
      <section className="relative flex items-center justify-center px-6 pb-12 pt-2 sm:px-10 lg:px-12 lg:py-12">
        {/* Added a Glassmorphism card for mobile to make the form pop out against the background */}
        <div className="w-full max-w-lg xl:max-w-xl bg-white/50 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-6 sm:p-8 lg:p-0 rounded-[2rem] lg:rounded-none border border-white/40 lg:border-none shadow-xl lg:shadow-none">
          {children}
        </div>
      </section>
    </main>
  );
}