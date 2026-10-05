/** Types partagés de l'application LeakRoast / CyberPwned. */

export type CheckMode = "email" | "password";

export type Severity = "critical" | "high" | "medium" | "low" | "safe";

/** Une fuite de données (service compromis). */
export interface Breach {
  service: string;
  severity: Severity;
  /** Types de données compromises détectés pour ce service. */
  dataTypes: string[];
}

/** Résultat agrégé d'une vérification. */
export interface CheckResult {
  mode: CheckMode;
  /** Email vérifié (masqué) ou "••••••" pour un mot de passe. */
  target: string;
  /** Nombre total de fuites. */
  breachCount: number;
  /** Liste des services compromis (triés par sévérité). */
  breaches: Breach[];
  /** Types de données compromises (union dédupliquée). */
  dataTypes: string[];
  /** Score Cyber Karma 0-100. */
  score: number;
  /** Verdict / roast humoristique. */
  roast: string;
  /** Emoji du verdict. */
  roastEmoji: string;
  /** Niveau de gravité global. */
  severity: Severity;
  /** Pour le mode mot de passe : nombre d'occurrences dans les fuites. */
  passwordCount?: number;
  /** Horodatage de la vérification. */
  checkedAt: string;
}

/** État global de la machine à états de l'UI. */
export type UiState =
  | { status: "idle" }
  | { status: "loading"; mode: CheckMode; target: string }
  | { status: "success"; result: CheckResult }
  | { status: "error"; message: string };
