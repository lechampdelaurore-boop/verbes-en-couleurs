// Vérifie le site EN LIGNE (ou une adresse donnée) dans Chrome au format téléphone :
//  - aucune erreur dans la console ;
//  - chaque sorte d'écran de question tient sans défiler, clavier compris, aux 7 tailles de téléphone ;
//  - des séances du jour complètes jouées (via window.__verbes), avec au moins une question de chaque type ;
//  - Leitner : une carte réussie revient au bon jour quand on avance la date ;
//  - une erreur volontaire de chaque type donne le bon diagnostic ;
//  - l'appli marche hors ligne après une première visite ;
//  - l'appli apparaît sur « Mes applis ».
// Usage : node tests/telephone.cjs [url]   (captures dans captures/)
const { chromium } = require('playwright');
const fs = require('fs');

const URL = process.argv[2] || 'https://lechampdelaurore-boop.github.io/verbes-en-couleurs/';
const LIVE = !process.argv[2];
const SIZES = [[320, 568], [360, 640], [375, 667], [390, 664], [390, 844], [412, 780], [430, 932]];
const expectedCache = (fs.readFileSync('sw.js', 'utf8').match(/verbes-en-couleurs-v\d+/) || [])[0];
const PREFS = JSON.stringify({ son: false, anim: false, vibre: false, lecon0: true });
// Écrans les plus chargés : { id de carte, type, personne, verbe }
const ECRANS = [
  { id: 'venir:pqp', type: 'construire', p: 5, inf: 'venir' },
  { id: 'g1:fut', type: 'ecrire', p: 3, inf: 'demander' },
  { id: 'rad:ps', type: 'trou', p: 5 },
  { id: 'g2:pc', type: 'trou', p: 2 },
  { id: 'prendre:ps', type: 'reconnaitre', p: 5, inf: 'prendre' },
  { id: 'son:ppe', type: 'son' },
  { id: 'son:imp', type: 'son' }
];
// Une erreur volontaire de chaque type : [type attendu, carte, type de question, personne, verbe, réponse fausse]
const ERREURS = [
  ['accent', 'g1:pc', 2, 'manger', 'a mange'],
  ['temps', 'prendre:ps', 5, 'prendre', 'prenaient'],
  ['personne', 'g1:ps', 5, 'chanter', 'chanta'],
  ['auxiliaire', 'venir:pc', 2, 'venir', 'a venu'],
  ['auxTemps', 'g2:pqp', 2, 'finir', 'a fini'],
  ['participe', 'prendre:pc', 2, 'prendre', 'a prit'],
  ['accord', 'venir:pc', 5, 'venir', 'sont venu'],
  ['radical', 'cg:pres', 3, 'manger', 'mangons'],
  ['marqueTemps', 'g1:ps', 3, 'chanter', 'chantimes'],
  ['marquePersonne', 'g1:ps', 5, 'chanter', 'chantère']
];

const lignes = [];
let echec = false;
function note(ok, texte) { if (!ok) echec = true; lignes.push(`| ${ok ? '✅' : '❌'} | ${texte} |`); console.log((ok ? 'OK   ' : 'ÉCHEC ') + texte); }

async function nouvellePage(browser, w, h, erreurs) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  page.on('pageerror', e => erreurs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()); });
  await page.addInitScript(p => { if (!localStorage.getItem('marc.verbes.prefs')) localStorage.setItem('marc.verbes.prefs', p); }, PREFS);
  await page.goto(URL + '?nocache=' + Date.now());
  await page.waitForFunction(() => window.__verbes);
  return page;
}
const etat = page => page.evaluate(() => __verbes.etat());
// Combien l'écran déborde : la page entière, puis la carte de la question
async function debord(page) {
  return page.evaluate(() => { const z = document.querySelector('#jZone'); return Math.max(document.documentElement.scrollHeight - innerHeight, z && !z.hidden ? z.scrollHeight - z.clientHeight - 2 : 0); });
}
// Joue l'écran en cours jusqu'à la question suivante, en répondant juste
async function jouerUn(page) {
  await page.evaluate(() => __verbes.juste());
  const e = await etat(page);
  if (e.vue === 'vJeu' && (e.q.phase === 'bon' || e.q.phase === 'fini')) await page.evaluate(() => __verbes.suivant());
}

(async () => {
  fs.mkdirSync('captures', { recursive: true });
  if (LIVE) {
    for (let i = 0; ; i++) {
      const live = await fetch(URL + 'sw.js?nocache=' + Date.now()).then(r => r.text()).catch(() => '');
      if (live.includes(expectedCache)) { console.log('Version en ligne : ' + expectedCache); break; }
      if (i >= 18) { console.log('Version en ligne différente de ' + expectedCache + ' après 3 min'); process.exit(1); }
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  const browser = await chromium.launch();

  // 1. Les 7 tailles : aucun écran de question ne défile, même avec une astuce
  for (const [w, h] of SIZES) {
    const erreurs = [];
    const page = await nouvellePage(browser, w, h, erreurs);
    let pire = 0, pireEcran = '';
    const mesure = async (et) => { const d = await debord(page); if (d > pire) { pire = d; pireEcran = et; } };
    for (const x of ECRANS) {
      await page.evaluate(o => __verbes.lancer('type', o), x);
      await page.waitForTimeout(60);
      const e = await etat(page);
      await mesure(x.type + ' ' + x.id);
      if (w === 320 || w === 390) await page.screenshot({ path: `captures/${w}x${h}-${x.type}-${x.id.replace(':', '-')}.png` });
      if (x.type === 'son' && e.q.etapeBulle) { await page.click(`[data-bulle="${e.q.bulle}"]`); await mesure('son, bulle touchée'); }
      // une erreur, puis une deuxième (forme à recopier)
      await page.evaluate(() => __verbes.faux()); await page.waitForTimeout(60); await mesure(x.type + ' astuce');
      if (w === 320 || w === 390) await page.screenshot({ path: `captures/${w}x${h}-${x.type}-${x.id.replace(':', '-')}-astuce.png` });
      await page.evaluate(() => __verbes.faux()); await page.waitForTimeout(60); await mesure(x.type + ' recopier');
    }
    // une erreur de temps (deux formes côte à côte + astuce) dans une phrase
    await page.evaluate(() => __verbes.lancer('type', { id: 'venir:pqp', type: 'trou', p: 5 }));
    const q = (await etat(page)).q;
    await page.evaluate(r => __verbes.repondre(r), q.ok[0].replace(/^(étaient|étions|étiez|étais|était)/, m => ({ 'étaient': 'sont', 'étions': 'sommes', 'étiez': 'êtes', 'étais': 'es', 'était': 'est' }[m])));
    await mesure('phrase, erreur de temps');
    // un petit récit
    await page.evaluate(() => __verbes.lancer('recit', 2));
    await mesure('récit'); await page.evaluate(() => __verbes.faux()); await mesure('récit astuce');
    if (w === 320) await page.screenshot({ path: `captures/${w}x${h}-recit.png` });
    note(pire <= 0 && !erreurs.length, `${w}×${h} : ${pire > 0 ? 'dépasse de ' + pire + ' px (' + pireEcran + ')' : 'tout tient sans défiler'}${erreurs.length ? ', erreurs : ' + erreurs.join(' / ') : ''}`);
    await page.close();
  }

  // 2. Des séances du jour complètes, jour après jour, jusqu'à avoir vu chaque type de question
  {
    const erreurs = [];
    const page = await nouvellePage(browser, 390, 844, erreurs);
    const vus = {};
    let jour = 0, nbQ = 0, premiereOk = false;
    for (; jour < 45 && !(vus.construire && vus.ecrire && vus.trou && vus.reconnaitre && vus.son && vus.recit); jour++) {
      await page.evaluate(j => __verbes.jours(j), jour);
      await page.evaluate(() => __verbes.seance());
      for (let n = 0; n < 250; n++) {
        const e = await etat(page);
        if (!e.seance) break;
        if (e.vue === 'vJeu') { vus[e.q.type] = (vus[e.q.type] || 0) + 1; nbQ++; }
        await jouerUn(page);
      }
      const fin = await page.evaluate(() => document.querySelector('#vFin:not([hidden]) h2') ? document.querySelector('#vFin h2').textContent : '');
      if (jour === 0) { premiereOk = /aujourd'hui/.test(fin); await page.screenshot({ path: 'captures/fin-de-seance.png' }); }
    }
    note(premiereOk, 'Première séance du jour jouée jusqu\'à l\'écran de fin');
    const types = ['construire', 'ecrire', 'trou', 'reconnaitre', 'son', 'recit'];
    note(types.every(t => vus[t]), `${jour} séances du jour jouées (${nbQ} questions) : ` + types.map(t => t + ' ' + (vus[t] || 0)).join(', '));
    const cartes = await page.evaluate(() => __verbes.cartes());
    note(Object.values(cartes).some(c => c.b >= 3), 'Des cartes montent de boîte au fil des jours');
    note(!erreurs.length, 'Console sans erreur pendant les séances' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.evaluate(() => __verbes.accueil());
    await page.screenshot({ path: 'captures/accueil-apres.png', fullPage: true });
    await page.evaluate(() => __verbes.aller('parent'));
    await page.screenshot({ path: 'captures/carnet-parent.png', fullPage: true });
    await page.close();
  }

  // 3. Leitner : une carte découverte revient le lendemain, puis 2 jours après une réussite
  {
    const erreurs = [];
    const page = await nouvellePage(browser, 390, 844, erreurs);
    await page.evaluate(() => { localStorage.setItem('marc.verbes.bilans', JSON.stringify({ pres: '2000-01-01', imp: '2000-01-01', fut: '2000-01-01', pc: '2000-01-01' })); });
    await page.reload(); await page.waitForFunction(() => window.__verbes);
    await page.evaluate(() => __verbes.lancer('carte', 'g1:ps'));
    for (let n = 0; n < 30 && (await etat(page)).seance; n++) await jouerUn(page);
    const c1 = (await page.evaluate(() => __verbes.cartes()))['g1:ps'];
    await page.evaluate(() => __verbes.jours(1));
    const plan1 = await page.evaluate(() => __verbes.plan());
    await page.evaluate(() => __verbes.seance());
    for (let n = 0; n < 200 && (await etat(page)).seance; n++) await jouerUn(page);
    const c2 = (await page.evaluate(() => __verbes.cartes()))['g1:ps'];
    await page.evaluate(() => __verbes.jours(2));
    const plan2 = await page.evaluate(() => __verbes.plan());
    await page.evaluate(() => __verbes.jours(3));
    const plan3 = await page.evaluate(() => __verbes.plan());
    const d = n => { const x = new Date(); x.setDate(x.getDate() + n); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
    note(c1 && c1.b === 1 && c1.d === d(1), `Découverte : boîte ${c1 && c1.b}, revue le ${c1 && c1.d}`);
    note(plan1.rev.includes('g1:ps') && c2.b === 2 && c2.d === d(3), `Le lendemain : la carte est dans la séance, réussie → boîte ${c2.b}, revue le ${c2.d}`);
    note(!plan2.rev.includes('g1:ps') && plan3.rev.includes('g1:ps'), 'Elle n\'est pas revue à J+2, elle revient à J+3');
    note(!erreurs.length, 'Console sans erreur (Leitner)' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
  }

  // 4. Chaque type d'erreur donne le bon diagnostic
  {
    const erreurs = [];
    const page = await nouvellePage(browser, 390, 844, erreurs);
    for (const [type, id, p, inf, rep] of ERREURS) {
      await page.evaluate(o => __verbes.lancer('type', o), { id, type: 'ecrire', p, inf });
      const q = (await etat(page)).q;
      // le sujet tiré au hasard peut être elle / elles : on prend le genre de la question
      let r = rep;
      if (type === 'accord' && /^elle/.test(await page.evaluate(() => document.querySelector('.pastille.suj').textContent))) r = 'sont venue';
      await page.evaluate(x => __verbes.repondre(x), r);
      const e = await etat(page);
      note(e.q.diag === type && e.q.phase === 'faux', `Erreur « ${r} » (${inf}) → ${e.q.diag}`);
      if (type === 'temps') await page.screenshot({ path: 'captures/erreur-temps.png' });
    }
    note(!erreurs.length, 'Console sans erreur (erreurs volontaires)' + (erreurs.length ? ' : ' + erreurs.join(' / ') : ''));
    await page.close();
  }

  // 5. Hors ligne après une première visite
  if (URL.startsWith('https:') || URL.includes('localhost')) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(URL);
    await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready);
    await page.waitForTimeout(1500);
    await ctx.setOffline(true);
    let ok = false;
    try { await page.reload(); ok = await page.evaluate(() => !!window.__verbes && document.title === 'Verbes en couleurs'); } catch (e) { /* hors ligne raté */ }
    note(ok, 'Fonctionne hors ligne après une première visite');
    await ctx.close();
  }

  // 6. L'appli apparaît sur « Mes applis »
  if (LIVE) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('https://lechampdelaurore-boop.github.io/?nocache=' + Date.now());
    let ok = false;
    try { await page.waitForSelector('a[href*="verbes-en-couleurs"]', { timeout: 30000 }); ok = true; } catch (e) { /* pas trouvée */ }
    await page.screenshot({ path: 'captures/mes-applis.png', fullPage: true });
    note(ok, 'L\'appli apparaît sur « Mes applis »');
    await page.close();
  }

  await browser.close();
  const rapport = '| | Vérification |\n|---|---|\n' + lignes.join('\n');
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Test téléphone (site en ligne)\n\n' + rapport + '\n');
  process.exit(echec ? 1 : 0);
})();
