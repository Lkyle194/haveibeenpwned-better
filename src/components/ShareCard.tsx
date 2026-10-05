"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Share2, Download, MessageCircle, Check, Loader2 } from "lucide-react";
import type { CheckResult } from "@/lib/types";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#ff0055",
  high: "#ff6b35",
  medium: "#ffd60a",
  low: "#00e5ff",
  safe: "#00ff9d",
};

interface Props {
  result: CheckResult;
}

/**
 * Carte de partage : génère une image PNG du score (html-to-image),
 * téléchargeable ou partageable (WhatsApp / Web Share API).
 */
export default function ShareCard({ result }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const [copied, setCopied] = useState(false);

  const color = SEVERITY_COLOR[result.severity];

  async function renderCard(): Promise<string | null> {
    if (!cardRef.current) return null;
    try {
      return await toPng(cardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#090d16",
        cacheBust: true,
      });
    } catch {
      return null;
    }
  }

  async function handleDownload() {
    setBusy("download");
    const dataUrl = await renderCard();
    setBusy(null);
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `leakroast-score-${result.score}.png`;
    a.click();
  }

  async function handleShare() {
    setBusy("share");
    const dataUrl = await renderCard();
    setBusy(null);
    if (!dataUrl) return;

    const text = `Mon Cyber Karma Score : ${result.score}/100 — ${result.roast} 🛡️ Vérifie le toi aussi !`;

    // Web Share API (mobile) avec fichier image.
    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "leakroast.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text, title: "LeakRoast" });
          return;
        }
      } catch {
        /* fallback ci-dessous */
      }
    }

    // Fallback : WhatsApp avec lien + texte.
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  }

  async function handleCopy() {
    const text = `Mon Cyber Karma Score : ${result.score}/100 — ${result.roast} 🛡️`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="w-full"
    >
      {/* La carte image (rendue en PNG) */}
      <div
        ref={cardRef}
        className="relative w-full rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#090d16" }}
      >
        <div
          className="p-6"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(0,229,255,0.14), transparent 60%), #090d16",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <span
                className="font-black text-lg tracking-tight"
                style={{ color: "#00e5ff" }}
              >
                LEAK<span style={{ color: "#00ff9d" }}>ROAST</span>
              </span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: "#475569" }}>
              CYBERPWNED v2.0
            </span>
          </div>

          <div className="flex items-center gap-5">
            {/* Mini jauge */}
            <div
              className="relative w-24 h-24 rounded-full shrink-0 flex items-center justify-center"
              style={{
                background: `conic-gradient(${color} ${result.score * 3.6}deg, #1c2a45 0deg)`,
              }}
            >
              <div className="rounded-full bg-[#090d16] flex items-center justify-center" style={{ width: 72, height: 72 }}>
                <span className="text-3xl font-black tabular-nums" style={{ color }}>
                  {result.score}
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono tracking-[0.25em] mb-1" style={{ color }}>
                {result.mode === "email" ? "EMAIL SCAN" : "PASSWORD SCAN"}
              </p>
              <p className="text-2xl font-black" style={{ color }}>
                {result.roastEmoji}
              </p>
              <p className="text-sm text-slate-300 leading-snug mt-1 line-clamp-3">
                {result.roast}
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#1c2a45] flex items-center justify-between">
            <span className="text-[11px] font-mono" style={{ color: "#64748b" }}>
              {result.breachCount} fuite{result.breachCount > 1 ? "s" : ""} ·{" "}
              {new Date(result.checkedAt).toLocaleDateString("fr-FR")}
            </span>
            <span className="text-[11px] font-mono" style={{ color: "#64748b" }}>
              leakroast.app
            </span>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy !== null}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#101a2e] border border-[#1c2a45] text-slate-300 text-xs font-mono hover:border-[#00e5ff]/50 transition-all disabled:opacity-50"
        >
          {busy === "download" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          PNG
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={busy !== null}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#101a2e] border border-[#1c2a45] text-slate-300 text-xs font-mono hover:border-[#00ff9d]/50 transition-all disabled:opacity-50"
        >
          {busy === "share" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MessageCircle className="w-4 h-4" />
          )}
          PARTAGER
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={busy !== null}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#101a2e] border border-[#1c2a45] text-slate-300 text-xs font-mono hover:border-[#00e5ff]/50 transition-all disabled:opacity-50"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#00ff9d]" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          {copied ? "COPIÉ" : "COPIER"}
        </button>
      </div>
    </motion.div>
  );
}
