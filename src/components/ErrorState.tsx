"use client";

import { motion } from "framer-motion";
import { AlertOctagon, RotateCcw } from "lucide-react";

interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto px-4 mt-10"
    >
      <div className="rounded-2xl bg-[#0d1322]/80 border border-[#ff0055]/40 box-glow-red p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#ff0055]/10 border border-[#ff0055]/40 flex items-center justify-center"
        >
          <AlertOctagon className="w-8 h-8 text-[#ff0055]" />
        </motion.div>

        <p className="font-mono text-sm text-[#ff0055] glow-red mb-2">
          {"// ERREUR SYSTÈME"}
        </p>
        <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">{message}</p>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff0055] to-[#ff6b35] text-white text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          RÉESSAYER
        </button>
      </div>
    </motion.div>
  );
}
