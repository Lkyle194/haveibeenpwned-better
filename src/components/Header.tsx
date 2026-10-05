"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Lock } from "lucide-react";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto px-4 pt-10 pb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-[#0d1322] border border-[#1c2a45] box-glow-cyan flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#00e5ff]" />
            </div>
            <Zap className="w-4 h-4 text-[#00ff9d] absolute -bottom-1 -right-1" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight neon-flicker">
              <span className="text-[#00e5ff] glow-cyan">LEAK</span>
              <span className="text-[#00ff9d] glow-green">ROAST</span>
            </h1>
            <p className="text-[11px] font-mono text-slate-400 tracking-widest uppercase">
              {"// cyberpwned terminal v2.0"}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <Lock className="w-3.5 h-3.5 text-[#00ff9d]" />
          <span>100% PRIVÉ</span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
            k-ANONYMITY
          </span>
        </div>
      </div>
    </motion.header>
  );
}
