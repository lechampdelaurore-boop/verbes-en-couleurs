# Verbes en couleurs

Une appli pour apprendre la **conjugaison du CM2** sur téléphone ou tablette, 5 à 10 minutes par jour.

👉 **[Ouvrir l'appli](https://lechampdelaurore-boop.github.io/verbes-en-couleurs/)**

- Le verbe en **3 morceaux de couleur**, toujours les mêmes : radical (bleu ciel), marque de temps (lilas), marque de personne (rose).
- Les 6 temps du programme : présent, imparfait, futur, passé composé, **passé simple** et **plus-que-parfait** (nouveaux au CM2), pour être, avoir, les 1er et 2e groupes et 8 verbes irréguliers.
- Une **séance du jour** : des révisions espacées (boîtes de Leitner) et une seule nouveauté ; les temps appris se mélangent tout seuls.
- La correction dit **quel morceau est faux** (radical, marque de temps, marque de personne, auxiliaire, participe, accord).
- Un atelier « le son /é/ » (-é, -er, -ez, -ait), des petits récits au passé simple, un « Je me teste » et un carnet du parent.

Tout reste sur l'appareil (rien n'est envoyé sur Internet). L'appli marche hors ligne et s'installe sur l'écran d'accueil.

## Technique

- Un seul `index.html` (HTML, CSS, JavaScript sans librairie ni build), polices Fredoka et Nunito dans `fonts/` (licence OFL).
- `sw.js` garde l'appli hors ligne : changer `CACHE` à chaque mise à jour.
- `tests/formes.cjs` vérifie toutes les formes conjuguées, leur découpage et le diagnostic des erreurs (`node tests/formes.cjs`).
- `tests/telephone.cjs` teste le site en ligne aux 7 tailles de téléphone après chaque mise en ligne (GitHub Actions, « Test téléphone »).
