# MISSION : Développement de l'application Web "LeakRoast / CyberPwned"

## 🎯 OBJECTIF
Créer une application web moderne, ultra-rapide, amusante et 100% sécurisée pour vérifier si un email ou un mot de passe a été exposé dans des fuites de données publiques. L'application doit surpasser HaveIBeenPwned en termes de design, d'interactivité et de fonctionnalités sociales (score, roasts humoristiques, carte de partage).

---

## 🛠️ STACK TECHNIQUE
- Framework : Next.js 14 (App Router, TypeScript)
- Style : Tailwind CSS + shadcn/ui + Lucide Icons
- Animations : Framer Motion + canvas-confetti
- Image Generation : html-to-image (pour la carte de partage)
- APIs externes :
  - XposedOrNot API (`https://api.xposedornot.com/v1/check-email/{email}`)
  - HIBP Passwords API (`https://api.pwnedpasswords.com/range/{first_5_hash_chars}`)

---

## 🛡️ RÈGLES DE SÉCURITÉ & CONFIDENTIALITÉ
1. k-Anonymity Strict : Pour la vérification des mots de passe, hacher la valeur en SHA-1 dans le navigateur via standard Web Crypto API. Envoyer uniquement les 5 premiers caractères à l'API.
2. Aucune base de données, aucun logging des emails ou requêtes saisies.
3. Assainir et valider les entrées utilisateurs (regex email strict).

---

## 🚀 ÉTAPES DE DÉVELOPPEMENT (TO-DO LIST)

### PHASE 1 : Setup & UI Shell
- [ ] Initialiser un projet Next.js 14 avec TypeScript et Tailwind CSS.
- [ ] Configurer un thème Dark Cyberpunk (fonds sombres `#090d16`, accents néons vert/cyan/rouge `#00ff9d`, `#00e5ff`, `#ff0055`).
- [ ] Créer le Header (Logo glowing, badge "100% Private & Free").
- [ ] Créer la barre de recherche centrale avec animation de scan (effet laser / pulsing border).

### PHASE 2 : Moteur de Sécurité & Intégration API
- [ ] Créer un service utilitaire `crypto.ts` pour gérer le hachage SHA-1 côté client.
- [ ] Développer la route d'API interne pour interroger XposedOrNot sans exposer de requêtes directes inutiles.
- [ ] Gérer l'analyse de gravité du résultat :
  - Compter le nombre de leaks.
  - Extraire les types de données compromises (Passwords, IPs, Emails, Phones).

### PHASE 3 : Algorithme de Score & Roasts
- [ ] Implémenter le calcul du `Cyber Karma Score` (100 = 0 fuite, déduction de points selon le nombre et la gravité des fuites).
- [ ] Créer un générateur de roasts/verdicts humoristiques selon le score :
  - 90-100 : "Infiltré de la NSA / Fantôme du Web 🥷"
  - 60-89 : "Utilisateur lambda à haut risque ⚠️"
  - 30-59 : "Cible préférée des brouteurs 🧟"
  - 0-29 : "Passoire en pass-through, change tout de suite 🧀"

### PHASE 4 : Composants d'Affichage & Restitution
- [ ] Carte de résumé du score avec jauge circulaire animée (Framer Motion).
- [ ] Liste déroulante/cartes des fuites avec badges de sévérité (Rouge/Jaune/Vert) et logo/date du service impacté.
- [ ] Checklist interactive "Que faire maintenant ?" pré-remplie selon les fuites détectées.

### PHASE 5 : Mode Flex / Generateur de Carte WhatsApp
- [ ] Créer un composant stencil stylisé pour le résultat (Score, avatar généré, petit roast).
- [ ] Ajouter un bouton "Exporter la carte / Copier pour WhatsApp" convertissant le composant en image via `html-to-image`.
- [ ] Ajouter un effet de confettis (`canvas-confetti`) si le score est égal à 100.

### PHASE 6 : Polissage, Responsive & Performance
- [ ] Optimiser la vitesse de rendu et les transitions d'états (Loading, Empty, Success, Error).
- [ ] Valider la compatibilité mobile (responsive parfait sur smartphone).
- [ ] Livrer le code source prêt à être déployé sur Vercel.

---

## 🏁 LIVRABLE ATTENDU
Le code source complet du projet avec un fichier `README.md` expliquant les commandes d'installation (`npm install`, `npm run dev`) et le guide de déploiement en 1 clic.
