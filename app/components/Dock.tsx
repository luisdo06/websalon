"use client";

import {
  m,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionConfig,
  type MotionValue,
  type SpringOptions,
} from "motion/react";
import {
  Children,
  cloneElement,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";
import "./Dock.css";

export interface DockItemData {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

function DockItem({
  children, className = "", onClick, mouseX, spring, distance, magnification, baseItemSize, label,
}: {
  children: ReactNode; className?: string; onClick?: () => void; mouseX: MotionValue<number>;
  spring: SpringOptions; distance: number; magnification: number; baseItemSize: number; label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <m.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-label={label}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
    >
      {Children.map(children, (child) =>
        cloneElement(child as ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
      )}
    </m.div>
  );
}

function DockLabel({ children, isHovered }: { children: ReactNode; isHovered?: MotionValue<number> }) {
  const [isVisible, setIsVisible] = useState(false);

  /* motion value de respaldo para poder llamar el hook incondicionalmente
     (DockItem siempre inyecta `isHovered`, pero el tipo es opcional) */
  const fallback = useMotionValue(0);
  useMotionValueEvent(isHovered ?? fallback, "change", (latest) => setIsVisible(latest === 1));

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className="dock-label"
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </m.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children }: { children: ReactNode }) {
  return <div className="dock-icon">{children}</div>;
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 64,
  distance = 180,
  panelHeight = 64,
  dockHeight = 200,
  baseItemSize = 44,
}: {
  items: DockItemData[];
  className?: string;
  spring?: SpringOptions;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  dockHeight?: number;
  baseItemSize?: number;
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <MotionConfig reducedMotion="user">
      <m.div style={{ height, scrollbarWidth: "none" }} className="dock-outer">
        <m.div
          onMouseMove={({ pageX }) => { isHovered.set(1); mouseX.set(pageX); }}
          onMouseLeave={() => { isHovered.set(0); mouseX.set(Infinity); }}
          className={`dock-panel ${className}`}
          style={{ height: panelHeight }}
          role="toolbar"
          aria-label="Navegación"
        >
          {items.map((item) => (
            <DockItem
              key={item.label}
              onClick={item.onClick}
              className={item.className}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              label={item.label}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          ))}
        </m.div>
      </m.div>
    </MotionConfig>
  );
}
