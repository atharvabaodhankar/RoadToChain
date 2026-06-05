"use client";

import { useEffect, useState } from "react";

interface Heading {
  text: string;
  id: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Use the first intersecting heading
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -75% 0px",
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="space-y-3 font-sans">
      <h5 className="text-[10px] font-bold tracking-wider text-dim uppercase">
        On this page
      </h5>
      <nav className="space-y-2 border-l border-border pl-0">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  const offset = 80;
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elementRect = el.getBoundingClientRect().top;
                  const elementPosition = elementRect - bodyRect;
                  const offsetPosition = elementPosition - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                  });
                  setActiveId(heading.id);
                }
              }}
              className={`block text-[12px] leading-relaxed transition-colors duration-150 pl-4 border-l -ml-[1px] ${
                heading.level === 3 ? "pl-6 text-[11px]" : "font-medium"
              } ${
                isActive
                  ? "text-accent border-accent font-semibold"
                  : "text-muted border-transparent hover:text-text hover:border-border2"
              }`}
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
