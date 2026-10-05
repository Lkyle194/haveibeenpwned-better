"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CheckResult } from "@/lib/types";

interface Props {
  result: CheckResult;
}

/**
 * Carte du verdict / roast humoristique.
 * Le texte est "typé" caractère par caractère pour l'effet terminal.
 */
export default function RoastCard({ result }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-2xl bg-[#0d1322] border border-[#1c2a45] p-6 overflow-hidden"
    >
      {/* Corner accents */}
      <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00e5ff]/60 rounded-tl-2xl" />
      <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00e5ff]/60 rounded-tr-2xl" />
      <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00e5ff]/60 rounded-bl-2xl" />
      <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00e5ff]/60 rounded-br-2xl" />

      <div className="flex items-start gap-4">
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.5 }}
          className="text-4xl sm:text-5xl shrink-0"
          aria-hidden
        >
          {result.roastEmoji}
        </motion.span>
        <div className="min-w-0">
          <p className="text-[10px] font-mono tracking-[0.3em] text-slate-500 mb-2">
            {"// VERDICT DU SYSTÈME"}
          </p>
          <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-medium">
            <Typewriter text={result.roast} delay={500} />
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/** Effet machine à écrire. */
function Typewriter({ text, delay }: { text: string; delay: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(i);
        if (i >= text.length) clearInterval(interval);
      }, 18);
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay]);

  return (
    <>
      {text.slice(0, shown)}
      {shown < text.length && <span className="blink text-[#00e5ff]">▊</span>}
    </>
  );
}
