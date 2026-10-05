/**
 * crypto.ts — Hachage SHA-1 côté client via la Web Crypto API.
 *
 * SÉCURITÉ (k-anonymity) :
 * - Le mot de passe est haché EN LOCAL dans le navigateur.
 * - Seuls les 5 premiers caractères du hash (SHA-1) sont envoyés à l'API
 *   Pwned Passwords (range lookup). Le mot de passe complet ne quitte
 *   JAMAIS le navigateur.
 */

/**
 * Calcule le hash SHA-1 hexadécimal (majuscules) d'une chaîne.
 * Utilise crypto.subtle.digest — 100% côté client.
 */
export async function sha1Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

/**
 * Vérifie si un mot de passe a été exposé via l'API Pwned Passwords
 * (k-anonymity : on n'envoie que les 5 premiers caractères du hash).
 *
 * @returns { pwned: boolean, count: number } — count = nombre d'occurrences
 *          du mot de passe dans les fuites connues (0 si jamais vu).
 */
export async function checkPassword(
  password: string
): Promise<{ pwned: boolean; count: number }> {
  const hash = await sha1Hex(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { "Add-Padding": "true" },
  });
  if (!res.ok) {
    throw new Error(`Pwned Passwords API error: ${res.status}`);
  }
  const text = await res.text();

  for (const line of text.split("\n")) {
    const [hashSuffix, countStr] = line.split(":");
    if (hashSuffix.trim().toUpperCase() === suffix) {
      const count = parseInt(countStr, 10);
      return { pwned: true, count };
    }
  }
  return { pwned: false, count: 0 };
}
