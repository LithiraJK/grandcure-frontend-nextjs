import Image from "next/image";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-neutral lg:grid lg:grid-cols-[1fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="inline-flex items-center gap-2 text-xl font-bold font-display">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          GrandCure
        </div>

        <div className="space-y-8">
            <div className="relative aspect-4/2 object-cover w-full overflow-hidden rounded-2xl border border-white/25 bg-linear-to-br from-cyan-300/30 to-teal-200/15">
              <Image
                src="/login-illustrator-1.jpg"
                alt="GrandCure care illustration"
                fill
                priority
                sizes="(min-width: 1280px) 32vw, (min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>


          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-display font-extrabold leading-tight">
              Empathetic care, powered by clarity.
            </h1>
            <p className="text-base leading-relaxed text-blue-100/95">
              Manage patient records and care plans with a sanctuary designed for comfort and professional precision.
            </p>
            <p className="text-sm italic leading-relaxed text-blue-100/80">
              &quot;GrandCure provides the digital breathing room our team needs to focus on what matters most: the patients.&quot;
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl">{children}</div>
      </section>
    </main>
  );
}
