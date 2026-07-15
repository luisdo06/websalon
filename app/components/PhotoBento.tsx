"use client";

import { useRef, useEffect, useCallback, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import "./PhotoBento.css";

const DEFAULT_GLOW_COLOR = "90, 138, 56"; /* verde de la paleta */
const MOBILE_BREAKPOINT = 768;

export interface BentoItem {
  src?: string;
  alt?: string;
  label?: string;
  placeholder?: boolean;
}

const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement("div");
  el.className = "bento-particle";
  el.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},0.6);pointer-events:none;z-index:100;left:${x}px;top:${y}px;`;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlow = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

function CardShell({
  children,
  className = "",
  style,
  disableAnimations = false,
  particleCount = 10,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true,
}: {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  disableAnimations?: boolean;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const isHoveredRef = useRef(false);
  const memoized = useRef<HTMLElement[]>([]);
  const initialized = useRef(false);
  const magnetismRef = useRef<gsap.core.Tween | null>(null);

  const initParticles = useCallback(() => {
    if (initialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoized.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor),
    );
    initialized.current = true;
  }, [particleCount, glowColor]);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismRef.current?.kill();
    particlesRef.current.forEach((p) => {
      gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(1.7)", onComplete: () => p.parentNode?.removeChild(p) });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!initialized.current) initParticles();
    memoized.current.forEach((particle, index) => {
      const t = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true) as HTMLElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to(clone, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: "none", repeat: -1, yoyo: true });
        gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: "power2.inOut", repeat: -1, yoyo: true });
      }, index * 100);
      timeoutsRef.current.push(t);
    });
  }, [initParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;

    const onEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt) gsap.to(el, { rotateX: 4, rotateY: 4, duration: 0.3, ease: "power2.out", transformPerspective: 1000 });
    };
    const onLeave = () => {
      isHoveredRef.current = false;
      clearParticles();
      if (enableTilt) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      if (enableMagnetism) gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    };
    const onMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      if (enableTilt) {
        gsap.to(el, { rotateX: ((y - cy) / cy) * -8, rotateY: ((x - cx) / cx) * 8, duration: 0.1, ease: "power2.out", transformPerspective: 1000 });
      }
      if (enableMagnetism) {
        magnetismRef.current = gsap.to(el, { x: (x - cx) * 0.04, y: (y - cy) * 0.04, duration: 0.3, ease: "power2.out" });
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDist = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
      const ripple = document.createElement("div");
      ripple.style.cssText = `position:absolute;width:${maxDist * 2}px;height:${maxDist * 2}px;border-radius:50%;background:radial-gradient(circle, rgba(${glowColor},0.35) 0%, rgba(${glowColor},0.18) 30%, transparent 70%);left:${x - maxDist}px;top:${y - maxDist}px;pointer-events:none;z-index:1000;`;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ripple.remove() });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("click", onClick);
    return () => {
      isHoveredRef.current = false;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("click", onClick);
      clearParticles();
    };
    // react-doctor-disable-next-line react-doctor/prefer-use-effect-event -- useEffectEvent es experimental; no lo adoptamos por una micro-optimización
  }, [animateParticles, clearParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div ref={cardRef} className={`${className} bento-card`} style={{ ...style, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  );
}

function GlobalSpotlight({
  gridRef,
  disableAnimations,
  spotlightRadius,
  glowColor,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations: boolean;
  spotlightRadius: number;
  glowColor: string;
}) {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef.current) return;
    const spotlight = document.createElement("div");
    spotlight.className = "bento-global-spotlight";
    spotlight.style.cssText = `position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;background:radial-gradient(circle, rgba(${glowColor},0.12) 0%, rgba(${glowColor},0.06) 15%, rgba(${glowColor},0.03) 25%, rgba(${glowColor},0.015) 40%, transparent 65%);z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:multiply;`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const onMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const inside = !!rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      const cards = gridRef.current.querySelectorAll<HTMLElement>(".bento-card");
      if (!inside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
        cards.forEach((c) => c.style.setProperty("--glow-intensity", "0"));
        return;
      }
      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDist = Infinity;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2;
        const eff = Math.max(0, dist);
        minDist = Math.min(minDist, eff);
        let intensity = 0;
        if (eff <= proximity) intensity = 1;
        else if (eff <= fadeDistance) intensity = (fadeDistance - eff) / (fadeDistance - proximity);
        updateCardGlow(card, e.clientX, e.clientY, intensity, spotlightRadius);
      });
      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });
      const targetOpacity = minDist <= proximity ? 0.8 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8 : 0;
      gsap.to(spotlightRef.current, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: "power2.out" });
    };
    const onLeave = () => {
      gridRef.current?.querySelectorAll<HTMLElement>(".bento-card").forEach((c) => c.style.setProperty("--glow-intensity", "0"));
      if (spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, spotlightRadius, glowColor]);

  return null;
}

export default function PhotoBento({
  items,
  glowColor = DEFAULT_GLOW_COLOR,
  spotlightRadius = 300,
  particleCount = 10,
  className = "",
}: {
  items: BentoItem[];
  glowColor?: string;
  spotlightRadius?: number;
  particleCount?: number;
  className?: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const disableAnimations = isMobile;

  return (
    <>
      <GlobalSpotlight gridRef={gridRef} disableAnimations={disableAnimations} spotlightRadius={spotlightRadius} glowColor={glowColor} />
      <div className={`bento-grid bento-section ${className}`} ref={gridRef}>
        {items.map((item, i) => (
          <CardShell
            key={item.src ?? item.label ?? `slot-${i}`}
            className={`bento-card--glow ${item.placeholder ? "bento-card--placeholder" : ""}`}
            style={{ ["--glow-color" as string]: glowColor } as CSSProperties}
            disableAnimations={disableAnimations}
            particleCount={particleCount}
            glowColor={glowColor}
          >
            {item.placeholder ? (
              <div className="bento-placeholder">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="14" rx="2" /><circle cx="12" cy="13" r="3.2" /><path d="M8 6l1.5-2h5L16 6" />
                </svg>
                <span>Próximamente</span>
              </div>
            ) : (
              <>
                {/* tarjetas con tilt/partículas de gsap y posición absoluta; next/image rompe el layout */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="bento-photo" src={item.src} alt={item.alt || item.label || ""} draggable={false} /> {/* react-doctor-disable-line react-doctor/nextjs-no-img-element */}
                {item.label && <span className="bento-label">{item.label}</span>}
              </>
            )}
          </CardShell>
        ))}
      </div>
    </>
  );
}
