"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, KeyRound, Smartphone, Globe, FileWarning } from "lucide-react";
import type { CheckResult } from "@/lib/types";

interface Item {
  id: string;
  icon: React.ElementType;
  label: string;
  hint: string;
  /** Toujours affiché, ou seulement si fuites détectées. */
  onlyIfBreached: boolean;
}

const ITEMS: Item[] = [
  {
    id: "unique-passwords",
    icon: KeyRound,
    label: "Un mot de passe unique par service",
    hint: "Jamais le même mot de passe sur deux sites. Utilise un gestionnaire de mots de passe.",
    onlyIfBreached: false,
  },
  {
    id: "2fa",
    icon: Smartphone,
    label: "Activer la double authentification (2FA)",
    hint: "Un code en plus sur ton téléphone bloque 99% des attaques par mot de passe volé.",
    onlyIfBreached: false,
  },
  {
    id: "rotate",
    icon: ShieldCheck,
    label: "Changer les mots de passe des services compromis",
    hint: "Commence par les plus critiques (banque, email, crypto).",
    onlyIfBreached: true,
  },
  {
    id: "breach-alerts",
    icon: FileWarning,
    label: "Activer les alertes de fuite",
    hint: "HaveIBeenPwned, Google, Apple… te préviennent si tes données refont surface.",
    onlyIfBreached: true,
  },
  {
    id: "alias-email",
    icon: Globe,
    label: "Utiliser un email alias pour les inscriptions",
    hint: "Un email jetable ou alias (Plausible, SimpleLogin) protège ton adresse principale.",
    onlyIfBreached: true,
  },
];

interface Props {
  result: CheckResult;
}

export default function SecurityChecklist({ result }: Props) {
  const [done, setDone] = useState<Set<string>>(new Set());

  const visible = ITEMS.filter(
    (i) => !i.onlyIfBreached || result.breachCount > 0
  );

  const completed = visible.filter((i) => done.has(i.id)).length;
  const progress = visible.length ? completed / visible.length : 0;

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="w-full rounded-2xl bg-[#0d1322] border border-[#1c2a45] p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm tracking-wider text-slate-300">
          PROTOCOLE DE SÉCURISATION
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          {completed}/{visible.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-[#1c2a45] overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] to-[#00ff9d]"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="space-y-2">
        {visible.map((item, i) => {
          const checked = done.has(item.id);
          const Icon = item.icon;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.07 }}
              className={`w-full flex items-start gap-3 text-left rounded-xl border p-3 transition-all ${
                checked
                  ? "border-[#00ff9d]/50 bg-[#00ff9d]/5"
                  : "border-[#1c2a45] bg-[#101a2e] hover:border-[#00e5ff]/40"
              }`}
            >
              <span
                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                  checked
                    ? "bg-[#00ff9d] border-[#00ff9d]"
                    : "border-[#2a3d63]"
                }`}
              >
                {checked && <Check className="w-3.5 h-3.5 text-[#090d16]" strokeWidth={3} />}
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-sm font-medium ${
                    checked ? "text-[#00ff9d] line-through opacity-70" : "text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" style={{ color: checked ? "#00ff9d" : "#00e5ff" }} />
                  {item.label}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {item.hint}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
