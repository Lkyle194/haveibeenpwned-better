"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import type { Severity } from "@/lib/types";

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: "#ff0055",
  high: "#ff6b35",
  medium: "#ffd60a",
  low: "#00e5ff",
  safe: "#00ff9d",
};

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "CRITIQUE",
  high: "ÉLEVÉ",
  medium: "MODÉRÉ",
  low: "FAIBLE",
  safe: "SÉCURISÉ",
};

interface Props {
  score: number;
  severity: Severity;
}

/**
 * Jauge circulaire animée du Cyber Karma Score.
 * L'arc se remplit de 0 → score avec un compteur synchronisé.
 */
export default function ScoreGauge({ score, severity }: Props) {
  const color = SEVERITY_COLOR[severity];
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [score]);

  const R = 84;
  const CIRC = 2 * Math.PI * R;
  const progress = display / 100;
  const dashOffset = CIRC * (1 - progress);

  return (
    <div className="relative w-52 h-52 sm:w-60 sm:h-60 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        {/* Track */}
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="#1c2a45"
          strokeWidth="12"
        />
        {/* Progress arc */}
        <motion.circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: dashOffset }}
          style={{
            filter: `drop-shadow(0 0 10px ${color})`,
            transition: "stroke 0.4s ease",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={severity}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[10px] font-mono tracking-[0.25em] mb-1"
          style={{ color }}
        >
          {SEVERITY_LABEL[severity]}
        </motion.span>
        <span
          className="text-5xl sm:text-6xl font-black tabular-nums"
          style={{ color, textShadow: `0 0 18px ${color}88` }}
        >
          {display}
        </span>
        <span className="text-[10px] font-mono text-slate-500 tracking-widest mt-1">
          CYBER KARMA
        </span>
      </div>
    </div>
  );
}
