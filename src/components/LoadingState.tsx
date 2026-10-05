"use client";

import { motion } from "framer-motion";
import { Radar } from "lucide-react";
import type { CheckMode } from "@/lib/types";

interface Props {
  mode: CheckMode;
  target: string;
}

const STEPS_EMAIL = [
  "Connexion à la base de fuites…",
  "Interrogation de XposedOrNot…",
  "Corrélation des services compromis…",
  "Calcul du Cyber Karma…",
];

const STEPS_PASSWORD = [
  "Hachage SHA-1 en local…",
  "Envoi du fragment k-anonyme (5 chars)…",
  "Recherche dans les fuites Pwned…",
  "Calcul du Cyber Karma…",
];

export default function LoadingState({ mode, target }: Props) {
  const steps = mode === "email" ? STEPS_EMAIL : STEPS_PASSWORD;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto px-4 mt-10"
    >
      <div className="rounded-2xl bg-[#0d1322]/80 border border-[#1c2a45] p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-5 rounded-full border-2 border-[#00e5ff]/30 border-t-[#00e5ff] flex items-center justify-center"
        >
          <Radar className="w-7 h-7 text-[#00e5ff]" />
        </motion.div>

        <p className="font-mono text-sm text-[#00e5ff] glow-cyan mb-1">
          SCAN EN COURS
        </p>
        <p className="font-mono text-xs text-slate-500 mb-6 truncate">
          cible : {target}
        </p>

        {/* Terminal steps */}
        <div className="text-left max-w-sm mx-auto space-y-2 font-mono text-xs">
          {steps.map((s, i) => (
            <motion.p
              key={s}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.55 }}
              className="text-slate-400"
            >
              <span className="text-[#00ff9d] mr-2">▸</span>
              {s}
              <span
                className="term-dot inline-block w-1.5 h-1.5 rounded-full bg-[#00e5ff] ml-2 align-middle"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
