# 🛡️ LeakRoast — CyberPwned

> Vérifie si ton **email** ou ton **mot de passe** a été exposé dans des fuites de données publiques.
> Score **Cyber Karma**, **roasts** sarcastiques, **carte de partage** — 100% privé, zéro base de données.

Une app qui surpasse HaveIBeenPwned en design, interactivité et fun. Fait pour épater tes potes.

---

## ✨ Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| 🔍 **Scan email** | Vérification via l'API **XposedOrNot** (proxy interne, validation stricte) |
| 🔑 **Scan mot de passe** | **k-anonymity** : SHA-1 haché en local, seul un fragment de 5 caractères est envoyé à Pwned Passwords |
| 🎯 **Cyber Karma Score** | Jauge circulaire animée 0-100, calculée selon le nombre et la gravité des fuites + sensibilité des données |
| 😈 **Roasts** | Verdicts humoristiques générés selon le score (machine à écrire) |
| 📊 **Cartes de fuites** | Chaque service compromis avec badge de sévérité (critique/élevé/modéré/faible) + types de données exposés |
| ✅ **Checklist interactive** | Protocole de sécurisation (2FA, mots de passe uniques, alias email…) avec progression |
| 🖼️ **Carte de partage** | Génération PNG (html-to-image) + partage WhatsApp / Web Share API + téléchargement |
| 🎉 **Confettis** | Si ton score est 100 (aucune fuite) |
| 📱 **Responsive** | Mobile-first, thème dark cyberpunk (grille néon, scanlines, glow) |

## 🛡️ Sécurité & confidentialité

1. **k-Anonymity strict** — le mot de passe est haché en SHA-1 **dans le navigateur** (Web Crypto API). Seuls les 5 premiers caractères du hash sont envoyés à l'API Pwned Passwords. Le mot de passe complet ne quitte jamais l'onglet.
2. **Aucune base de données** — rien n'est stocké. Pas de compte, pas de cookie, pas de tracking.
3. **Aucun logging** — l'email n'est jamais loggé côté serveur (validation regex stricte, réponse normalisée, email masqué).
4. **100% statique** — l'app est un site statique (aucun serveur, aucun backend). L'email part directement du navigateur vers l'API XposedOrNot (CORS `*`) ; rien n'est loggé ni stocké nulle part.

## 🛠️ Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui** + **Lucide Icons**
- **Framer Motion** (animations) + **canvas-confetti**
- **html-to-image** (carte de partage)
- APIs : [XposedOrNot](https://api.xposedornot.com) · [Pwned Passwords](https://api.pwnedpasswords.com)

## 🚀 Démarrage local

```bash
npm install
npm run dev        # http://localhost:3000
```

Build de production :

```bash
npm run build
npm start
```

## 📁 Structure

```
src/
├── app/
│   ├── page.tsx                 # Machine à états (idle/loading/success/error)
│   ├── layout.tsx               # Thème cyberpunk, scanlines, metadata
│   └── globals.css              # Grille néon, glow, laser, animations
├── components/
│   ├── Header.tsx               # Logo néon + badges privacy
│   ├── SearchBar.tsx            # Tabs email/mot de passe, bordure laser animée
│   ├── ScoreGauge.tsx           # Jauge circulaire animée
│   ├── RoastCard.tsx            # Verdict + effet machine à écrire
│   ├── BreachList.tsx           # Cartes fuites + badges sévérité
│   ├── SecurityChecklist.tsx    # Checklist interactive
│   ├── ShareCard.tsx            # Carte PNG + partage
│   ├── LoadingState.tsx         # Terminal de scan animé
│   └── ErrorState.tsx           # Erreur + retry
└── lib/
    ├── crypto.ts                # SHA-1 Web Crypto + Pwned Passwords
    ├── karma.ts                 # Score + roasts
    ├── services.ts              # Catalogue services → types/sévérité
    ├── check.ts                 # Orchestration client
    └── types.ts                 # Types partagés
```

## 📄 Licence

MIT — fais-en ce que tu veux, partage-le, épate tes potes.
