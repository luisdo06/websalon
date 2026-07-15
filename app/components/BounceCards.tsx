"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import "./BounceCards.css";

const getNoRotationTransform = (t: string) => {
  if (/rotate\([\s\S]*?\)/.test(t)) return t.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
  if (t === "none") return "rotate(0deg)";
  return `${t} rotate(0deg)`;
};

const getPushedTransform = (base: string, offsetX: number) => {
  const re = /translate\(([-0-9.]+)px\)/;
  const m = base.match(re);
  if (m) return base.replace(re, `translate(${parseFloat(m[1]) + offsetX}px)`);
  return base === "none" ? `translate(${offsetX}px)` : `${base} translate(${offsetX}px)`;
};

export default function BounceCards({
  className = "",
  images = [],
  containerWidth = 400,
  containerHeight = 400,
  cardSize = 200,
  animationDelay = 0.4,
  animationStagger = 0.08,
  easeType = "elastic.out(1, 0.6)",
  transformStyles = [
    "rotate(10deg) translate(-170px)",
    "rotate(5deg) translate(-85px)",
    "rotate(-3deg)",
    "rotate(-10deg) translate(85px)",
    "rotate(2deg) translate(170px)",
  ],
  enableHover = false,
}: {
  className?: string;
  images: string[];
  containerWidth?: number;
  containerHeight?: number;
  cardSize?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bounce-card",
        { scale: 0 },
        { scale: 1, stagger: animationStagger, ease: easeType, delay: animationDelay },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    images.forEach((_, i) => {
      const target = q(`.bounce-card-${i}`);
      gsap.killTweensOf(target);
      const base = transformStyles[i] || "none";
      if (i === hoveredIdx) {
        gsap.to(target, { transform: getNoRotationTransform(base), duration: 0.4, ease: "back.out(1.4)", overwrite: "auto" });
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160;
        gsap.to(target, { transform: getPushedTransform(base, offsetX), duration: 0.4, ease: "back.out(1.4)", delay: Math.abs(hoveredIdx - i) * 0.05, overwrite: "auto" });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !containerRef.current) return;
    const q = gsap.utils.selector(containerRef);
    images.forEach((_, i) => {
      const target = q(`.bounce-card-${i}`);
      gsap.killTweensOf(target);
      gsap.to(target, { transform: transformStyles[i] || "none", duration: 0.4, ease: "back.out(1.4)", overwrite: "auto" });
    });
  };

  return (
    <div
      className={`bounceCardsContainer ${className}`}
      ref={containerRef}
      style={{ position: "relative", width: containerWidth, height: containerHeight, ["--bounce-card-size" as string]: `${cardSize}px` } as CSSProperties}
    >
      {images.map((src, idx) => (
        <div
          key={src}
          className={`bounce-card bounce-card-${idx}`}
          style={{ transform: transformStyles[idx] ?? "none" }}
          onMouseEnter={() => pushSiblings(idx)}
          onMouseLeave={resetSiblings}
        >
          {/* gsap anima estas cartas con transform absoluto; next/image rompe el layout */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bounce-image" src={src} alt="" draggable={false} /> {/* react-doctor-disable-line react-doctor/nextjs-no-img-element */}
        </div>
      ))}
    </div>
  );
}
