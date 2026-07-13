"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import "./Stack.css";

export interface StackImage {
  src: string;
  alt: string;
}

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false,
}: {
  children: ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <motion.div className="card-rotate-disabled" style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackCard {
  id: number;
  img: StackImage;
  rot: number;
}

export default function Stack({
  images,
  randomRotation = false,
  sensitivity = 200,
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
}: {
  images: StackImage[];
  randomRotation?: boolean;
  sensitivity?: number;
  animationConfig?: { stiffness: number; damping: number };
  sendToBackOnClick?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < mobileBreakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const [stack, setStack] = useState<StackCard[]>(() =>
    images.map((img, i) => ({ id: i + 1, img, rot: randomRotation ? Math.random() * 8 - 4 : 0 })),
  );

  const sendToBack = (id: number) => {
    setStack((prev) => {
      const n = [...prev];
      const idx = n.findIndex((c) => c.id === id);
      const [card] = n.splice(idx, 1);
      n.unshift(card);
      return n;
    });
  };

  useEffect(() => {
    if (!autoplay || stack.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setStack((prev) => {
        const n = [...prev];
        const top = n.pop();
        if (top) n.unshift(top);
        return n;
      });
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isPaused, stack.length]);

  return (
    <div
      className="stack-container"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => (
        <CardRotate
          key={card.id}
          onSendToBack={() => sendToBack(card.id)}
          sensitivity={sensitivity}
          disableDrag={shouldDisableDrag}
        >
          <motion.div
            className="card"
            onClick={() => shouldEnableClick && sendToBack(card.id)}
            animate={{
              rotateZ: (stack.length - index - 1) * 4 + card.rot,
              scale: 1 + index * 0.06 - stack.length * 0.06,
              transformOrigin: "90% 90%",
            }}
            initial={false}
            transition={{ type: "spring", stiffness: animationConfig.stiffness, damping: animationConfig.damping }}
          >
            <Image
              src={card.img.src}
              alt={card.img.alt}
              fill
              quality={90}
              sizes="(max-width:768px) 80vw, 380px"
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </CardRotate>
      ))}
    </div>
  );
}
