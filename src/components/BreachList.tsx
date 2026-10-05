"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Database } from "lucide-react";
import type { Breach, CheckResult, Severity } from "@/lib/types";

const SEVERITY_STYLE: Record<
  Severity,
  { color: string; label: string; glow: string }
> = {
  critical: { color: "#ff0055", label: "CRITIQUE", glow: "box-glow-red" },
  high: { color: "#ff6b35", label: "ÉLEVÉ", glow: "" },
  medium: { color: "#ffd60a", label: "MODÉRÉ", glow: "" },
  low: { color: "#00e5ff", label: "FAIBLE", glow: "" },
  safe: { color: "#00ff9d", label: "SÛR", glow: "box-glow-green" },
};

interface Props {
  result: CheckResult;
}

export default function BreachList({ result }: Props) {
  const { breaches, dataTypes, mode } = result;

  // Cas : aucune fuite
  if (breaches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full rounded-2xl bg-[#0d1322] border border-[#00ff9d]/40 box-glow-green p-6 text-center"
      >
        <ShieldCheck className="w-12 h-12 text-[#00ff9d] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-[#00ff9d] glow-green mb-1">
          {mode === "email" ? "Aucune fuite détectée" : "Mot de passe jamais vu"}
        </h3>
        <p className="text-sm text-slate-400">
          {mode === "email"
            ? "Ton email n'apparaît dans aucune base de fuites connue. Continue comme ça."
            : "Ce mot de passe n'a jamais été exposé dans les fuites publiques. Solide."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header de la section */}
      <div className="flex items-center gap-2 text-slate-300">
        <Database className="w-4 h-4 text-[#ff0055]" />
        <h3 className="font-mono text-sm tracking-wider">
          {breaches.length} {breaches.length > 1 ? "SERVICES" : "SERVICE"} COMPROMIS
        </h3>
      </div>

      {/* Cartes de fuites */}
      <div className="grid gap-3">
        {breaches.map((b, i) => (
          <BreachCard key={b.service} breach={b} index={i} />
        ))}
      </div>

      {/* Types de données compromis (union) */}
      {dataTypes.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] font-mono tracking-widest text-slate-500 mb-2">
            DONNÉES EXPOSÉES
          </p>
          <div className="flex flex-wrap gap-2">
            {dataTypes.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#101a2e] border border-[#1c2a45] text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BreachCard({ breach, index }: { breach: Breach; index: number }) {
  const s = SEVERITY_STYLE[breach.severity];
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.06, duration: 0.35, ease: "easeOut" }}
      className={`rounded-xl bg-[#0d1322] border border-[#1c2a45] p-4 ${s.glow}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldAlert
            className="w-4 h-4 shrink-0"
            style={{ color: s.color }}
          />
          <span className="font-semibold text-slate-100 truncate">
            {breach.service}
          </span>
        </div>
        <span
          className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider"
          style={{ color: s.color, backgroundColor: `${s.color}1a`, border: `1px solid ${s.color}55` }}
        >
          {s.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-6">
        {breach.dataTypes.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-[#101a2e]"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
