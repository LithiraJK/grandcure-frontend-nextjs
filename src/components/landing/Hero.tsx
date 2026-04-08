"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="bg-[#f7f9fc] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pt-36">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-5 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8 lg:col-span-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3c596f]">
            Curated Sanctuary Care Platform
          </p>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#191c1e] sm:text-5xl lg:text-6xl">
            Compassionate Elderly Care, Curated for Your Peace of Mind.
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-[#3a4248] sm:text-lg">
            Experience a new standard of in-home care. Verified professionals,
            real-time updates, and an interface designed for clarity.
          </p>

          <div className="pt-2">
            <button
              type="button"
              className="inline-flex h-12 items-center rounded-full bg-gradient-to-r from-[#00497a] to-[#11629d] px-7 text-sm font-semibold text-white transition duration-200 hover:scale-105 hover:shadow-[0_12px_30px_-18px_rgba(17,98,157,0.85)]"
            >
              Find Care Now
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="relative hidden min-h-[420px] lg:col-span-2 lg:block"
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_25%_30%,rgba(17,98,157,0.16),transparent_54%),radial-gradient(circle_at_72%_68%,rgba(38,167,188,0.18),transparent_52%),linear-gradient(145deg,rgba(255,255,255,0.95),rgba(235,243,250,0.72))]" />
          <div className="absolute -left-8 top-16 h-24 w-24 rounded-full bg-[#d9edf8]/75 backdrop-blur-xl" />
          <div className="absolute bottom-16 right-6 h-28 w-28 rounded-full bg-[#d8f4f0]/75 backdrop-blur-xl" />
        </motion.div>
      </div>
    </section>
  );
}
