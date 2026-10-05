import { checkPassword } from "./crypto";
import { buildResult } from "./karma";
import { enrichBreaches } from "./services";
import type { Breach, CheckResult, CheckMode } from "./types";

/**
 * check.ts — Orchestration des vérifications (côté client).
 *
 * - Email : appel direct à l'API XposedOrNot (CORS `*` vérifié).
 *   L'app est 100% statique : aucun serveur, aucun logging, aucun
 *   stockage. L'email part directement du navigateur vers l'API.
 * - Mot de passe : hachage SHA-1 100% local (k-anonymity), puis
 *   range lookup Pwned Passwords. Le mot de passe ne quitte jamais
 *   le navigateur.
 */

/** Regex email stricte (côté client, miroir du serveur). */
export const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length <= 254 && EMAIL_RE.test(v);
}

/** Masque un email pour l'affichage : j***@domaine.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.trim().split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 1);
  return `${visible}${"•".repeat(Math.max(2, Math.min(local.length - 1, 8)))}@${domain}`;
}

/**
 * Vérifie un email via l'API XposedOrNot (appel direct, CORS `*`).
 */
export async function checkEmail(email: string): Promise<CheckResult> {
  let res: Response;
  try {
    res = await fetch(
      `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      }
    );
  } catch {
    throw new Error("Impossible de contacter la base de fuites. Vérifie ta connexion.");
  }

  if (!res.ok) {
    throw new Error("Impossible de contacter la base de fuites. Réessaie.");
  }

  const data = await res.json();
  const serviceNames: string[] = Array.isArray(data?.breaches) ? data.breaches : [];
  const breaches: Breach[] = enrichBreaches(serviceNames);

  const dataTypes = new Set<string>();
  for (const b of breaches) for (const t of b.dataTypes) dataTypes.add(t);

  return buildResult("email", maskEmail(email), breaches, Array.from(dataTypes));
}

/**
 * Vérifie un mot de passe (k-anonymity : SHA-1 local, 5 premiers
 * caractères envoyés à Pwned Passwords).
 */
export async function checkPasswordFlow(
  password: string
): Promise<CheckResult> {
  const { pwned, count } = await checkPassword(password);

  const breaches: Breach[] = pwned
    ? [
        {
          service: "Pwned Passwords (HIBP)",
          severity: count >= 100_000 ? "critical" : count >= 1_000 ? "high" : "medium",
          dataTypes: ["Passwords (hashed)"],
        },
      ]
    : [];

  const dataTypes = pwned ? ["Passwords (hashed)"] : [];
  return buildResult("password", "••••••••", breaches, dataTypes, count);
}

/** Point d'entrée unique. */
export async function runCheck(
  mode: CheckMode,
  value: string
): Promise<CheckResult> {
  if (mode === "email") return checkEmail(value);
  return checkPasswordFlow(value);
}
