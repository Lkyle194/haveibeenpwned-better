# 🚀 Guide de déploiement — LeakRoast / CyberPwned

Le site est **100% statique** (aucun backend, aucun secret) : il se déploie n'importe où.
Deux options testées et fonctionnelles :

---

## Option A — Vercel (recommandé, URL la plus propre)

**URL actuelle : https://haveibeenpwned-better.vercel.app**

### 1. Prérequis (une seule fois)

```bash
npm install -g vercel
```

### 2. Se connecter

```bash
vercel login
```

→ Ouvre un navigateur, tu autorises le compte Vercel.
(Alternative sans navigateur : créer un token sur https://vercel.com/account/tokens
et utiliser `vercel --token <TOKEN>` à la place.)

### 3. Déployer en production

Depis la racine du projet :

```bash
vercel --prod --yes
```

→ En ~30 secondes, Vercel build et publie. L'URL de production s'affiche.

### 4. Redéploiement après un changement de code

```bash
git push   # si le repo est connecté à Vercel (vercel git connect)
# ou à la main :
vercel --prod --yes
```

---

## Option B — GitHub Pages (gratuit, sans compte Vercel)

**URL actuelle : https://lkyle194.github.io/haveibeenpwned-better/**

### 1. Build statique avec base path

```bash
BASE_PATH=/haveibeenpwned-better STATIC_EXPORT=1 npm run build
```

→ Génère le dossier `out/`.

### 2. Publier sur la branche `gh-pages`

```bash
git checkout --orphan gh-pages
git rm -rq .
cp -R out/. .
touch .nojekyll          # OBLIGATOIRE : sinon Jekyll supprime _next/
printf 'out/\nnode_modules/\n.next/\n' > .gitignore
git add -A
git rm -rq --cached out/ 2>/dev/null || true   # ne pas dupliquer out/
git commit -m "Build statique"
git push --force origin gh-pages
git checkout main
```

### 3. Activer Pages (une seule fois, via l'API ou l'interface)

Sur https://github.com/Lkyle194/haveibeenpwned-better/settings/pages :
- **Source** : "Deploy from a branch"
- **Branch** : `gh-pages`, dossier `/`

Le site est en ligne en ~1-2 minutes.

---

## ⚠️ Pièges connus (déjà corrigés)

| Piège | Symptôme | Solution |
|---|---|---|
| Jekyll sur GitHub Pages | Assets `_next/` en 404 | Fichier `.nojekyll` à la racine |
| `basePath` oublié | Assets en 404 sur Pages | `BASE_PATH=/haveibeenpwned-better` au build |
| `out/` dupliqué dans la branche | Build Pages "errored" | `.gitignore` + `git rm --cached out/` |
| `breaches` imbriqués (XposedOrNot) | `i.trim is not a function` | `flatMap` + filtre string dans `check.ts` |

---

## ✅ Vérification post-déploiement

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://haveibeenpwned-better.vercel.app/
# → 200
```

Puis tester une adresse email connue (ex. `david@gmail.com`) : le score, les
fuites et la carte de partage doivent s'afficher.
