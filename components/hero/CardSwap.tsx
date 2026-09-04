"use client";

import React, {
  Children,
  forwardRef,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import gsap from "gsap";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass = "", className = "", ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`w-full h-full rounded-2xl border border-black/10 dark:border-white/15 bg-white/95 dark:bg-[#13131a]/95 backdrop-blur-md text-text [transform-style:preserve-3d] [backface-visibility:hidden] shadow-[0_10px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_45px_rgba(0,0,0,0.45)] transition-colors ${customClass} ${className}`.trim()}
    />
  )
);
Card.displayName = "Card";

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLDivElement | null, slot: Slot, skew: number) => {
  if (!el) return;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    scale: 1,
    opacity: 1,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  children: ReactNode;
}

const CardSwap = ({
  width = 460,
  height = 195,
  cardDistance = 24,
  verticalDistance = 30,
  delay = 3500,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 6,
  children,
}: CardSwapProps) => {
  const childArr = Children.toArray(children);
  const cardElements = useRef<(HTMLDivElement | null)[]>([]);
  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>();
  const isAnimatingRef = useRef(false);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const total = childArr.length;
    cardElements.current.forEach((el, i) => {
      if (el) {
        placeNow(el, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
      }
    });

    const swap = () => {
      if (isAnimatingRef.current) return;
      if (order.current.length < 2) return;

      const currentOrder = [...order.current];
      const frontIdx = currentOrder[0];
      const rest = currentOrder.slice(1);
      const elFront = cardElements.current[frontIdx];
      if (!elFront) return;

      isAnimatingRef.current = true;
      const count = currentOrder.length;
      const backSlot = makeSlot(count - 1, cardDistance, verticalDistance, count);

      const tl = gsap.timeline({
        onComplete: () => {
          order.current = [...rest, frontIdx];
          isAnimatingRef.current = false;
        },
      });
      tlRef.current = tl;

      // 1. Front card drops down and subtly fades
      tl.to(
        elFront,
        {
          y: "+=260",
          opacity: 0.25,
          duration: 0.5,
          ease: "power2.in",
        },
        0
      );

      // 2. Remaining cards slide forward smoothly into their new slot
      rest.forEach((idx, i) => {
        const el = cardElements.current[idx];
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, count);
        tl.set(el, { zIndex: slot.zIndex }, 0.22);
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: 0.6,
            ease: "power2.out",
          },
          0.22 + i * 0.04
        );
      });

      // 3. Move dropped card to behind the stack at the lowest z-index
      tl.call(
        () => {
          gsap.set(elFront, {
            x: backSlot.x,
            y: backSlot.y + 120,
            z: backSlot.z,
            zIndex: 0,
          });
        },
        undefined,
        0.52
      );

      // 4. Slide dropped card up smoothly into the back slot
      tl.to(
        elFront,
        {
          y: backSlot.y,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
        },
        0.55
      );

      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        1.1
      );
    };

    // Auto-shuffle interval
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      if (node) {
        const pause = () => {
          tlRef.current?.pause();
          clearInterval(intervalRef.current);
        };
        const resume = () => {
          tlRef.current?.play();
          clearInterval(intervalRef.current);
          intervalRef.current = window.setInterval(swap, delay);
        };

        node.addEventListener("mouseenter", pause);
        node.addEventListener("mouseleave", resume);

        return () => {
          node.removeEventListener("mouseenter", pause);
          node.removeEventListener("mouseleave", resume);
          clearInterval(intervalRef.current);
        };
      }
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, childArr.length]);

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
      style={{ width, height }}
    >
      {childArr.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            cardElements.current[i] = el;
          }}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d] [will-change:transform] cursor-pointer select-none"
          style={{ width, height }}
          onClick={() => {
            onCardClick?.(i);
            if (!isAnimatingRef.current && order.current.length > 1) {
              // Trigger a manual swap
              const currentOrder = [...order.current];
              const frontIdx = currentOrder[0];
              const rest = currentOrder.slice(1);
              const elFront = cardElements.current[frontIdx];
              if (!elFront) return;

              isAnimatingRef.current = true;
              const count = currentOrder.length;
              const backSlot = makeSlot(count - 1, cardDistance, verticalDistance, count);

              const tl = gsap.timeline({
                onComplete: () => {
                  order.current = [...rest, frontIdx];
                  isAnimatingRef.current = false;
                },
              });
              tlRef.current = tl;

              tl.to(
                elFront,
                {
                  y: "+=260",
                  opacity: 0.25,
                  duration: 0.5,
                  ease: "power2.in",
                },
                0
              );

              rest.forEach((idx, step) => {
                const el = cardElements.current[idx];
                if (!el) return;
                const slot = makeSlot(step, cardDistance, verticalDistance, count);
                tl.set(el, { zIndex: slot.zIndex }, 0.22);
                tl.to(
                  el,
                  {
                    x: slot.x,
                    y: slot.y,
                    z: slot.z,
                    duration: 0.6,
                    ease: "power2.out",
                  },
                  0.22 + step * 0.04
                );
              });

              tl.call(
                () => {
                  gsap.set(elFront, {
                    x: backSlot.x,
                    y: backSlot.y + 120,
                    z: backSlot.z,
                    zIndex: 0,
                  });
                },
                undefined,
                0.52
              );

              tl.to(
                elFront,
                {
                  y: backSlot.y,
                  opacity: 1,
                  duration: 0.55,
                  ease: "power2.out",
                },
                0.55
              );

              tl.call(
                () => {
                  gsap.set(elFront, { zIndex: backSlot.zIndex });
                },
                undefined,
                1.1
              );
            }
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default CardSwap;
