"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  title?: string;
  subtitle?: string;
  count?: number;
};

export default function HeroBanner({
  title = "Churidar Suits",
  subtitle = "Handcrafted Pakistani churidar sets for every occasion — from daily elegance to bridal grandeur.",
  count,
}: Props) {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full overflow-hidden aspect-[16/7] md:aspect-[21/8] bg-black"
      >
        {/* Hero Background Image */}
        <Image
          src="/bh-hro.png"
          alt="Banat Halima Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Subtle Dark Vignette Overlay for Crisp Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col justify-end text-white">
          <div className="max-w-2xl mx-4 md:mx-10">
            <span className="inline-block bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-amber-200 text-[11px] font-body font-semibold px-3 py-1 rounded-full mb-2 tracking-wider uppercase">
              Exclusive Pakistani Collection
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-white drop-shadow-md">
              {title}
            </h1>
            <p className="text-xs sm:text-sm font-body text-white/90 mt-2 line-clamp-2 max-w-xl font-normal drop-shadow-xs">
              {subtitle}
            </p>
            {count !== undefined && (
              <p className="text-xs font-body font-medium text-amber-200/90 mt-2">
                Showing {count} items
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
