"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function WhyExistsSection() {
  return (
    <section className="relative border-b border-border/40 px-6 py-24 sm:px-10 lg:px-16 bg-bg overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Column: Minimal Sticky Portrait & Info */}
        <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-[120px] lg:h-fit">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border bg-bg2 dark:bg-bg3 mb-6 shadow-sm">
            <Image
              src="/images/pfp.png"
              alt="Atharva"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <h3 className="font-sans font-medium text-[15px] text-text">
            Atharva Baodhankar
          </h3>
          <p className="font-sans text-[12px] text-muted mt-0.5">
            Founder & Builder
          </p>
          
          <div className="mt-6 pt-6 border-t border-border/30 w-full font-mono text-[11px] text-dim leading-relaxed">
            <span className="block text-text/60 font-semibold mb-1">PROJECTS</span>
            Socio3 · ProofChain · ChainCure · ZeroLeak
          </div>
        </div>

        {/* Right Column: Editorial Copy */}
        <div className="lg:col-span-8 space-y-10 lg:pl-4 max-w-2xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="space-y-6"
          >
            <span className="font-mono text-[10px] tracking-wider text-accent uppercase font-semibold">
              {"// Why this exists"}
            </span>
            
            <h2 className="font-serif font-light text-3xl sm:text-[38px] tracking-tight text-text leading-[1.15]">
              I built the resource I wish I had.
            </h2>

            <div className="font-sans text-[15px] leading-relaxed text-muted space-y-5">
              <p>
                When I started, there simply weren&apos;t any resources that explained blockchain properly. Outdated tutorials rushed directly into writing smart contracts, completely skipping the fundamental mechanics of how these distributed networks actually function under the hood.
              </p>
              <p>
                Nobody taught the common, expensive mistakes that almost every developer makes starting out. I had to learn those lessons the hard way—by breaking things, debugging mysterious failures, and wasting gas.
              </p>
              <p className="text-text font-medium">
                I built this because I want my fellow developers to have a clear, honest path to follow. You shouldn&apos;t have to waste your time copy-pasting random scripts just to build basic intuition.
              </p>
            </div>
          </motion.div>

          {/* Minimal CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="pt-6 border-t border-border/30 flex items-center justify-between gap-6"
          >
            <div className="space-y-1">
              <p className="font-sans font-medium text-sm text-text">
                Ready to build the foundation?
              </p>
              <p className="font-sans text-[12px] text-dim">
                Start with Track 0 to understand what a blockchain really is.
              </p>
            </div>
            
            <Link
              href="/learn/track-0"
              className="group inline-flex items-center gap-1 font-mono text-[13px] font-semibold text-accent hover:text-accent/80 transition-colors whitespace-nowrap"
            >
              Start Track 0
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
