# Verbes en couleurs

Apprendre la **conjugaison du CM2**, un peu chaque jour (5 à 10 minutes), sur téléphone ou tablette. Pour les enfants de CM2 (10 ans) : les 6 temps du programme, pour être, avoir, les 1er et 2e groupes et 8 verbes irréguliers.

- **Jouer en ligne :** https://lechampdelaurore-boop.github.io/verbes-en-couleurs/
- **Pour les parents :** [guide des parents](docs/guide-parents.md)
- **Pourquoi l'appli est faite comme ça :** [méthode et sources](docs/methode-et-sources.md)
- Fait partie de [Mes applis](https://lechampdelaurore-boop.github.io/), la page qui regroupe toutes les applis (thème « Écrire sans fautes »).

## Le principe

- **Le verbe en 3 morceaux de couleur**, toujours les mêmes : le **radical** en bleu ciel (quel verbe), la **marque de temps** en lilas (quand), la **marque de personne** en rose (qui). Exemple : *nous chant·i·ons*, *ils chante·r·ont*. Aux temps composés : l'**auxiliaire** (qui porte le temps) et le **participe passé**.
- **Une forme à la fois.** L'infinitif, le temps et le sujet sont toujours affichés. Jamais de tableau entier à réciter.
- **Construire, puis écrire de mémoire, puis dans une phrase.** On assemble d'abord la forme avec des étiquettes, puis on l'écrit sans aide avec un clavier sans correcteur, puis on l'emploie dans une phrase.
- **Un temps à la fois, puis on mélange.** Le jour où l'on découvre un verbe à un temps, on ne travaille que ce temps. Dès le lendemain, l'appli le mélange aux temps déjà appris.
- **On espace.** Chaque verbe à chaque temps est une carte qui revient à J+1, J+2, J+4, J+8, J+16, puis tous les 30 jours quand elle est sue (boîtes de Leitner).
- **La correction dit quel morceau est faux** : radical, marque de temps, marque de personne, auxiliaire, accord, ou un autre temps que celui demandé.
- **Une routine de vérification**, toujours la même, pour les finales qui se prononcent /é/ (*-é, -er, -ez, -ait*).
- **Pas d'échec, pas de chrono, pas de verrou.** Tout est ouvert ; un « 👉 Conseillé » montre par où continuer.

## Ce qui est travaillé

| Temps | Au CM2 | Marque de temps |
|---|---|---|
| ⏺️ Présent | révision | aucune |
| 🌙 Imparfait | révision | **ai** / **i** (*chant·ai·s, chant·i·ons*) |
| 🚀 Futur | révision | **r** (*chante·r·a*) |
| ✅ Passé composé | révision | auxiliaire au présent + participe |
| 📜 Passé simple | **nouveau** | une voyelle : **a, i, u, in** (*chant·a, f·i·t, v·in·t*) |
| 🕰️ Plus-que-parfait | **nouveau** | auxiliaire à l'imparfait + participe |

Les verbes : *être*, *avoir* ; 1er groupe (*chanter, parler, jouer…* et *arriver, tomber, rentrer* avec *être*) ; 2e groupe (*finir, choisir, grandir…*) ; *aller, faire, dire, prendre, venir, pouvoir, voir, vouloir* (avec *apprendre, comprendre, revenir, devenir* dans les phrases) ; les verbes en *-cer / -ger* (*lancer, manger…*) et ceux dont le radical change (*nettoyer, appeler, jeter, acheter, lever, préférer…*). Soit 80 cartes « verbe × temps ».

Pas de conditionnel ni d'impératif : ils sont au programme de 6e.

## Les écrans

- **L'accueil** : un seul gros bouton bleu, **« Ma séance du jour »** (« 8 révisions + 1 nouveau »). En dessous, les 6 temps en tuiles (marque du temps, barre de progrès, badge « Nouveau au CM2 »), puis « Mon tableau des verbes », « 🔎 Le son /é/ », « 📜 Petits récits », « ✏️ Je me teste » et, en bas, le « Carnet du parent ».
- **La page d'un temps** : un rappel avec un exemple coloré, « Revoir la leçon », la liste des verbes avec leur état (pas vu, en cours, su ⭐, à revoir 🔔), et « M'entraîner sur ce temps ». Pour les 4 temps déjà vus en CM1, un **petit bilan** évite de refaire ce qui est su.
- **La leçon d'un temps** : 4 ou 5 petits écrans (à quoi il sert, sa marque, les personnes une par une, le piège).
- **Les questions** : Construire (étiquettes à toucher), Écrire (de mémoire), Phrase à trou, Reconnaître (« À quel temps est *ils prirent* ? »), Le son /é/, et les trous des récits.
- **Mon tableau des verbes** : une grille verbes × temps (gris : pas vu ; couleur : en cours ; ⭐ : su). Une colonne entière sue donne un trophée.
- **Petits récits** : 8 courtes histoires originales au passé simple et à l'imparfait (et au plus-que-parfait pour les dernières), une phrase à la fois.
- **Je me teste** : 12 questions sans aide sur les temps commencés, avec le score par temps.

## Ma séance du jour

1. D'abord les **révisions dues** (8 au plus pour une séance de 12 questions), mélangées entre les temps : jamais deux fois de suite le même temps quand c'est possible, et les temps qui se confondent (imparfait et passé simple, passé composé et plus-que-parfait…) se retrouvent dans la même séance.
2. Puis **une nouveauté** (deux s'il y a peu de révisions). Si c'est le premier verbe d'un temps, la leçon passe avant.
3. Le reste jusqu'à 12 questions : le son /é/, un petit récit ou des cartes récentes.

Seul le premier essai de la journée compte : réussi, la carte s'éloigne ; raté, elle recule d'une boîte et revient le lendemain.

## Réglages ⚙

Sons, animations, vibrations, voix (lire les phrases à voix haute, voix lente), étiquettes « Construire » (automatique, toujours, jamais), longueur de la séance (8, 12 ou 16 questions), accord du participe passé avec *avoir* (désactivé au départ) et « Revoir le verbe en 3 morceaux ». Les animations respectent aussi le réglage « réduire les animations » du téléphone.

Les progrès restent dans le navigateur de l'appareil : aucun compte, et rien n'est envoyé sur internet. L'appli ne se sert pas du micro.

## Fichiers

- `index.html` : toute l'appli (HTML, CSS et JavaScript, sans bibliothèque), verbes, phrases, récits et personnages compris. Les données des verbes sont en haut du script, déjà découpées (`"chant|ai|s"`). Le haut du style reprend la charte commune des applis.
- `sw.js` et `manifest.webmanifest` : mode hors ligne et installation. Après une modification des fichiers de l'appli, changer la valeur de `CACHE` dans `sw.js`.
- `icons/` : icône de l'appli ; `fonts/` : polices Fredoka et Nunito (licence SIL Open Font License, voir les fichiers `OFL-*.txt`).
- `docs/` : le [guide des parents](docs/guide-parents.md) et la [méthode et les sources](docs/methode-et-sources.md).
- `tests/formes.cjs` : vérifie toutes les formes conjuguées, leur découpage en morceaux et le diagnostic des erreurs (`node tests/formes.cjs`).
- `tests/telephone.cjs` et `.github/workflows/test-telephone.yml` : après chaque mise en ligne, GitHub ouvre le site publié dans Chrome au format téléphone (7 tailles d'écran), joue des séances, vérifie les révisions espacées, les messages d'erreur, le mode hors ligne, l'absence de débordement et d'erreur dans la console. Résultat et captures dans l'onglet Actions. Lancement local : `npm install --no-save playwright && node tests/telephone.cjs`.

## Plus tard

- Le conditionnel présent et l'impératif (programme de 6e).
- D'autres verbes du 3e groupe (*partir, mettre, savoir, devoir…*) et les verbes pronominaux.
- Choisir soi-même le temps dans un récit (imparfait ou passé simple selon le sens).
- Des dictées de phrases.
