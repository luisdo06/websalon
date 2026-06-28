"use client";

import React, {
  useState,
  Children,
  useRef,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, MotionConfig, type Variants } from "motion/react";
import { C } from "@/lib/theme";
import "./Stepper.css";

/* useLayoutEffect en cliente, useEffect en SSR (evita el warning de Next) */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface StepperProps {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  /** Validación previa: si devuelve false, no avanza ni completa. */
  validateStep?: (step: number) => boolean;
  backButtonText?: string;
  nextButtonText?: string;
  completeButtonText?: string;
  disableStepIndicators?: boolean;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  validateStep,
  backButtonText = "Atrás",
  nextButtonText = "Continuar",
  completeButtonText = "Finalizar",
  disableStepIndicators = false,
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) { setDirection(-1); updateStep(currentStep - 1); }
  };

  const handleNext = () => {
    if (validateStep && !validateStep(currentStep)) return;
    if (!isLastStep) { setDirection(1); updateStep(currentStep + 1); }
  };

  const handleComplete = () => {
    if (validateStep && !validateStep(currentStep)) return;
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="stepper-outer">
        <div className="stepper-card" style={{ border: `1px solid ${C.accent}25` }}>
          <div className="stepper-indicator-row">
            {stepsArray.map((_, index) => {
              const stepNumber = index + 1;
              const isNotLastStep = index < totalSteps - 1;
              return (
                <React.Fragment key={stepNumber}>
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      /* solo se permite retroceder por el indicador; avanzar exige validación */
                      if (clicked < currentStep) { setDirection(-1); updateStep(clicked); }
                    }}
                  />
                  {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
                </React.Fragment>
              );
            })}
          </div>

          <StepContentWrapper
            isCompleted={isCompleted}
            currentStep={currentStep}
            direction={direction}
            className="stepper-content"
          >
            {stepsArray[currentStep - 1]}
          </StepContentWrapper>

          {!isCompleted && (
            <div className="stepper-footer">
              <div className={`stepper-nav ${currentStep !== 1 ? "spread" : "end"}`}>
                {currentStep !== 1 && (
                  <button type="button" onClick={handleBack} className="stepper-back">
                    {backButtonText}
                  </button>
                )}
                <button type="button" onClick={isLastStep ? handleComplete : handleNext} className="stepper-next">
                  {isLastStep ? completeButtonText : nextButtonText}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}

function StepContentWrapper({
  isCompleted, currentStep, direction, children, className,
}: {
  isCompleted: boolean; currentStep: number; direction: number; children: ReactNode; className?: string;
}) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({
  children, direction, onHeightReady,
}: {
  children: ReactNode; direction: number; onHeightReady: (h: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? "50%" : "-50%", opacity: 0 }),
};

export function Step({ children }: { children: ReactNode }) {
  return <div className="stepper-step">{children}</div>;
}

function StepIndicator({
  step, currentStep, onClickStep, disableStepIndicators,
}: {
  step: number; currentStep: number; onClickStep: (clicked: number) => void; disableStepIndicators?: boolean;
}) {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="stepper-indicator"
      style={disableStepIndicators ? { pointerEvents: "none", opacity: 0.5 } : {}}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { backgroundColor: C.surface2, color: `${C.text}66` },
          active: { backgroundColor: C.accent, color: C.accent },
          complete: { backgroundColor: C.accent, color: C.bg },
        }}
        transition={{ duration: 0.3 }}
        className="stepper-indicator-inner"
      >
        {status === "complete" ? (
          <CheckIcon className="stepper-check" />
        ) : status === "active" ? (
          <div className="stepper-active-dot" />
        ) : (
          <span>{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: "transparent" },
    complete: { width: "100%", backgroundColor: C.accent },
  };

  return (
    <div className="stepper-connector">
      <motion.div
        className="stepper-connector-inner"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
