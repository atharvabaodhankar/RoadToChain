"use client";

import { useState } from "react";
import { Module } from "@/lib/curriculum";
import LessonItem from "./LessonItem";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModuleAccordionProps {
  module: Module;
  trackSlug: string;
  trackColor: string;
  defaultOpen?: boolean;
}

export default function ModuleAccordion({
  module,
  trackSlug,
  trackColor,
  defaultOpen = false,
}: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border bg-bg/50">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-bg2/40"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-dim">
              {module.number}
            </span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: trackColor }} />
            <span className="font-mono text-xs text-muted">
              {module.lessons.length} lessons
            </span>
          </div>
          <h3 className="mt-1.5 font-sans text-base font-semibold tracking-tight text-text">
            {module.name}
          </h3>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            {module.description}
          </p>
        </div>
        
        {/* Toggle Arrow */}
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-bg3 hover:text-text">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </button>

      {/* Accordion Content Container */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2.5 px-5 pb-5 border-t border-border/20 pt-4 bg-bg2/20">
              {module.lessons.map((lesson, index) => {
                const moduleSlug = `module-${module.number.split(".")[1]}`;
                return (
                  <LessonItem
                    key={lesson.slug}
                    lesson={lesson}
                    trackSlug={trackSlug}
                    moduleSlug={moduleSlug}
                    lessonIndex={index}
                    trackColor={trackColor}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
