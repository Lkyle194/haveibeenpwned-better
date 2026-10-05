import type { Breach, CheckResult, Severity } from "./types";

/**
 * karma.ts — Algorithme du Cyber Karma Score + générateur de roasts.
 *
 * Score 100 = aucune fuite. Déduction selon le nombre et la gravité
 * des fuites, plus la sensibilité des types de données compromises.
 */

/**
 * Poids de sensibilité par type de données (catégories HIBP).
 * 4 = très sensible (finances, identité, biométrie, santé)
 * 3 = sensible (auth, questions de sécurité, clés)
 * 2 = modéré (téléphone, adresse, historique)
 * 1 = faible (email, IP, pseudo)
 */
const SENSITIVE_KEYWORDS: [RegExp, number][] = [
  [/credit|bank|payment|billing|ssn|social security|passport|driver|national id|government id/i, 4],
  [/biometric|fingerprint|face|iris|voice|genetic|dna|medical|health|criminal|court|warrant/i, 4],
  [/password|security question|security answer|api key|private key|token|login/i, 3],
  [/phone|address|postal|zip|date of birth|dob|location|gps|sms|email content|message|purchase|order|call log/i, 2],
  [/email|ip|username|name|city|country|device|cookie|browsing|search|profile|account|friend|follow/i, 1],
];

/** Poids de sensibilité d'un type de données (défaut 1). */
export function dataTypeWeight(type: string): number {
  for (const [re, weight] of SENSITIVE_KEYWORDS) {
    if (re.test(type)) return weight;
  }
  return 1;
}

/** Poids de gravité par niveau. */
const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 12,
  high: 8,
  medium: 5,
  low: 2,
  safe: 0,
};

/**
 * Calcule le Cyber Karma Score (0-100).
 * 100 = aucune fuite. Chaque fuite déduit des points selon sa gravité
 * et la sensibilité des données compromises. Diminution des rendements
 * pour éviter d'écraser à 0 dès 3 fuites.
 */
export function computeScore(breaches: Breach[]): number {
  if (breaches.length === 0) return 100;

  let penalty = 0;
  for (const b of breaches) {
    const maxDataWeight = Math.max(
      1,
      ...b.dataTypes.map((t) => dataTypeWeight(t))
    );
    penalty += SEVERITY_WEIGHT[b.severity] + maxDataWeight;
  }

  const diminishing = Math.min(1, 12 / Math.max(1, breaches.length));
  const score = Math.max(0, Math.round(100 - penalty * diminishing));
  return score;
}

/** Détermine la sévérité globale à partir du score. */
export function severityFromScore(score: number): Severity {
  if (score >= 90) return "safe";
  if (score >= 60) return "low";
  if (score >= 30) return "medium";
  return "critical";
}

/**
 * Générateur de roasts / verdicts humoristiques selon le score.
 * Chaque tranche a plusieurs variantes, tirées aléatoirement.
 */
export function generateRoast(score: number): { roast: string; emoji: string } {
  if (score >= 90) {
    const options = [
      { roast: "Infiltré de la NSA. Fantôme du Web. Les hackers te cherchent encore.", emoji: "🥷" },
      { roast: "Ton empreinte numérique est plus discrète qu'un chat sur un clavier.", emoji: "👻" },
      { roast: "Zéro trace. Tu es le fantôme que les scripts de scraping n'osent pas nommer.", emoji: "🕶️" },
      { roast: "Si les data brokers te voient, c'est qu'ils ont des problèmes de vue.", emoji: "🎯" },
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  if (score >= 60) {
    const options = [
      { roast: "Utilisateur lambda à haut risque. Tu navigues en pyjama sur Internet.", emoji: "⚠️" },
      { roast: "Pas catastrophique, mais ton email a fait quelques soirées mémorables.", emoji: "🍺" },
      { roast: "Tu es le genre de profil que les spammers gardent dans leurs favoris.", emoji: "📬" },
      { roast: "Risque modéré. Change tes mots de passe avant qu'ils ne deviennent des mèmes.", emoji: "🔑" },
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  if (score >= 30) {
    const options = [
      { roast: "Cible préférée des brouteurs. Ton email est un buffet à volonté.", emoji: "🧟" },
      { roast: "Les hackers ont ton email, ton IP, et probablement ton petit-déjeuner.", emoji: "🍳" },
      { roast: "Tu es le canard dans la rivière des fuites. Tout le monde te pêche.", emoji: "🦆" },
      { roast: "Ton profil est plus exposé qu'un chat sur un toit en plein orage.", emoji: "⛈️" },
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  const options = [
    { roast: "Passoire en pass-through. Change TOUT. Tout. Maintenant.", emoji: "🧀" },
    { roast: "Ton email a été pwné plus de fois qu'un boss final. Réinitialise ta vie numérique.", emoji: "💀" },
    { roast: "Les data brokers t'ont un dossier plus épais que ton CV. C'est grave.", emoji: "📁" },
    { roast: "Tu es le GIGN des fuites de données : tout le monde veut te pwner.", emoji: "🚨" },
  ];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Construit le résultat final agrégé.
 */
export function buildResult(
  mode: "email" | "password",
  target: string,
  breaches: Breach[],
  dataTypes: string[],
  passwordCount?: number
): CheckResult {
  const score = computeScore(breaches);
  const { roast, emoji } = generateRoast(score);
  return {
    mode,
    target,
    breachCount: breaches.length,
    breaches,
    dataTypes,
    score,
    roast,
    roastEmoji: emoji,
    severity: severityFromScore(score),
    passwordCount,
    checkedAt: new Date().toISOString(),
  };
}
