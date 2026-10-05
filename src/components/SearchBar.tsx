"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, KeyRound, Search, AlertTriangle } from "lucide-react";
import { isValidEmail } from "@/lib/check";
import type { CheckMode } from "@/lib/types";

interface Props {
  onCheck: (mode: CheckMode, value: string) => void;
  disabled: boolean;
}

export default function SearchBar({ onCheck, disabled }: Props) {
  const [mode, setMode] = useState<CheckMode>("email");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function validate(): string | null {
    const v = value.trim();
    if (!v) return "Saisis un email ou un mot de passe.";
    if (mode === "email") {
      if (!isValidEmail(v)) return "Format d'email invalide. Ex : toi@domaine.com";
    } else {
      if (v.length < 4) return "Mot de passe trop court pour une analyse (min. 4 caractères).";
    }
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onCheck(mode, value.trim());
  }

  function switchMode(m: CheckMode) {
    setMode(m);
    setValue("");
    setError(null);
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(
          [
            { id: "email" as CheckMode, label: "EMAIL", icon: Mail },
            { id: "password" as CheckMode, label: "MOT DE PASSE", icon: KeyRound },
          ]
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => switchMode(id)}
            disabled={disabled}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all ${
              mode === id
                ? "bg-[#0d1322] text-[#00e5ff] box-glow-cyan"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {mode === id && (
              <motion.span
                layoutId="tab-underline"
                className="absolute -bottom-px left-2 right-2 h-px bg-[#00e5ff]"
              />
            )}
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative overflow-hidden rounded-2xl bg-[#0d1322]/90 backdrop-blur ${
            disabled ? "" : "laser-border"
          }`}
        >
          {!disabled && <span className="scan-beam" aria-hidden />}
          <div className="relative flex items-center gap-3 px-4 py-4">
            <Search className="w-5 h-5 text-[#00e5ff] shrink-0" />
            <input
              type={mode === "password" ? "password" : "email"}
              inputMode={mode === "email" ? "email" : "text"}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              value={value}
              disabled={disabled}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder={
                mode === "email"
                  ? "ton@email.com — scanne tes fuites…"
                  : "•••••••• — testé en local, jamais envoyé"
              }
              className="flex-1 bg-transparent outline-none text-base sm:text-lg text-slate-100 placeholder:text-slate-600 font-mono min-w-0"
              aria-label={mode === "email" ? "Email à vérifier" : "Mot de passe à vérifier"}
            />
            <button
              type="submit"
              disabled={disabled}
              className="shrink-0 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#00e5ff] to-[#00ff9d] text-[#090d16] hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {disabled ? "SCAN…" : "SCAN"}
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 text-sm text-[#ff0055] font-mono"
          >
            <AlertTriangle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Privacy note */}
      <p className="mt-4 text-center text-[11px] font-mono text-slate-500 leading-relaxed">
        {mode === "email" ? (
          <>
            Ton email est vérifié via <span className="text-slate-300">XposedOrNot</span> —
            aucune base de données, aucun logging.
          </>
        ) : (
          <>
            Hachage <span className="text-slate-300">SHA-1 en local</span> — seul un
            fragment de 5 caractères est envoyé (k-anonymity). Ton mot de passe ne quitte jamais cet onglet.
          </>
        )}
      </p>
    </motion.div>
  );
}
