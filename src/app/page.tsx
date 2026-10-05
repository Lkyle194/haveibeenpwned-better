"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import ScoreGauge from "@/components/ScoreGauge";
import RoastCard from "@/components/RoastCard";
import BreachList from "@/components/BreachList";
import SecurityChecklist from "@/components/SecurityChecklist";
import ShareCard from "@/components/ShareCard";
import { runCheck } from "@/lib/check";
import type { CheckMode, UiState } from "@/lib/types";

export default function Home() {
  const [state, setState] = useState<UiState>({ status: "idle" });
  const lastRequest = useRef<{ mode: CheckMode; value: string } | null>(null);

  const handleCheck = useCallback(async (mode: CheckMode, value: string) => {
    lastRequest.current = { mode, value };
    setState({ status: "loading", mode, target: value });
    try {
      const result = await runCheck(mode, value);
      setState({ status: "success", result });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error ? err.message : "Erreur inconnue. Réessaie.",
      });
    }
  }, []);

  const handleRetry = useCallback(() => {
    const req = lastRequest.current;
    if (req) handleCheck(req.mode, req.value);
  }, [handleCheck]);

  // Confettis si score 100 (une fois par résultat).
  const confettiFired = useRef(false);
  useEffect(() => {
    if (state.status === "success" && state.result.score === 100 && !confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.4 },
        colors: ["#00ff9d", "#00e5ff", "#ffffff"],
      });
      setTimeout(
        () =>
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.5 },
            colors: ["#00ff9d", "#00e5ff"],
          }),
        250
      );
      setTimeout(
        () =>
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.5 },
            colors: ["#00ff9d", "#00e5ff"],
          }),
        400
      );
    }
    if (state.status !== "success") confettiFired.current = false;
  }, [state]);

  const disabled = state.status === "loading";

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <SearchBar onCheck={handleCheck} disabled={disabled} />

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          {state.status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="font-mono text-sm text-slate-500 mb-2">
                <span className="text-[#00ff9d]">▸</span> EN ATTENTE D&apos;UNE CIBLE
              </p>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Saisis un <span className="text-[#00e5ff]">email</span> ou un{" "}
                <span className="text-[#00e5ff]">mot de passe</span> pour lancer
                le scan. Ton score Cyber Karma, les fuites et un verdict
                sarcastique t&apos;attendent.
              </p>
            </motion.div>
          )}

          {state.status === "loading" && (
            <LoadingState key="loading" mode={state.mode} target={state.target} />
          )}

          {state.status === "error" && (
            <ErrorState key="error" message={state.message} onRetry={handleRetry} />
          )}

          {state.status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Score + Roast */}
              <div className="grid sm:grid-cols-2 gap-6 items-start">
                <div className="rounded-2xl bg-[#0d1322] border border-[#1c2a45] p-6">
                  <ScoreGauge score={state.result.score} severity={state.result.severity} />
                </div>
                <RoastCard result={state.result} />
              </div>

              {/* Fuites */}
              <BreachList result={state.result} />

              {/* Checklist */}
              <SecurityChecklist result={state.result} />

              {/* Partage */}
              <ShareCard result={state.result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="w-full border-t border-[#1c2a45] py-6">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-600">
          <span>
            LEAK<span className="text-[#00e5ff]">ROAST</span> — fait pour épater tes potes
          </span>
          <span>
            APIs : XposedOrNot · Pwned Passwords (k-anonymity) · zéro base de données
          </span>
        </div>
      </footer>
    </main>
  );
}
