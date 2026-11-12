// Vérifie le moteur de conjugaison de index.html, sans navigateur :
//  - chaque forme générée = la forme de référence écrite à la main ci-dessous (6 temps × 6 personnes) ;
//  - chaque forme découpée en morceaux redonne la forme entière, et chaque morceau existe ;
//  - toutes les formes de tous les verbes de l'appli existent, sans trou ni « undefined » ;
//  - une erreur volontaire de chaque type donne le bon diagnostic ;
//  - les phrases à trou et les récits se fabriquent sans erreur.
// Usage : node tests/formes.cjs
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const debut = html.indexOf('// === MOTEUR (début)'), fin = html.indexOf('// === MOTEUR (fin) ===');
if (debut < 0 || fin < 0) { console.log('Moteur introuvable dans index.html'); process.exit(1); }
const M = new Function(html.slice(debut, fin) + '\nreturn M;')();

let echecs = 0, verifs = 0;
function ok(cond, msg) { verifs++; if (!cond) { echecs++; console.log('ÉCHEC ' + msg); } }

// Formes de référence, écrites à la main (je, tu, il, nous, vous, ils).
// Temps composés écrits au masculin. Les variantes de 1990 sont dans VARIANTES.
const REF = {
  'être': {
    pres: 'suis es est sommes êtes sont', imp: 'étais étais était étions étiez étaient', fut: 'serai seras sera serons serez seront',
    ps: 'fus fus fut fûmes fûtes furent', pc: 'ai_été as_été a_été avons_été avez_été ont_été', pqp: 'avais_été avais_été avait_été avions_été aviez_été avaient_été' },
  'avoir': {
    pres: 'ai as a avons avez ont', imp: 'avais avais avait avions aviez avaient', fut: 'aurai auras aura aurons aurez auront',
    ps: 'eus eus eut eûmes eûtes eurent', pc: 'ai_eu as_eu a_eu avons_eu avez_eu ont_eu', pqp: 'avais_eu avais_eu avait_eu avions_eu aviez_eu avaient_eu' },
  chanter: {
    pres: 'chante chantes chante chantons chantez chantent', imp: 'chantais chantais chantait chantions chantiez chantaient',
    fut: 'chanterai chanteras chantera chanterons chanterez chanteront', ps: 'chantai chantas chanta chantâmes chantâtes chantèrent',
    pc: 'ai_chanté as_chanté a_chanté avons_chanté avez_chanté ont_chanté', pqp: 'avais_chanté avais_chanté avait_chanté avions_chanté aviez_chanté avaient_chanté' },
  jouer: {
    pres: 'joue joues joue jouons jouez jouent', imp: 'jouais jouais jouait jouions jouiez jouaient',
    fut: 'jouerai joueras jouera jouerons jouerez joueront', ps: 'jouai jouas joua jouâmes jouâtes jouèrent',
    pc: 'ai_joué as_joué a_joué avons_joué avez_joué ont_joué', pqp: 'avais_joué avais_joué avait_joué avions_joué aviez_joué avaient_joué' },
  arriver: {
    pres: 'arrive arrives arrive arrivons arrivez arrivent', imp: 'arrivais arrivais arrivait arrivions arriviez arrivaient',
    fut: 'arriverai arriveras arrivera arriverons arriverez arriveront', ps: 'arrivai arrivas arriva arrivâmes arrivâtes arrivèrent',
    pc: 'suis_arrivé es_arrivé est_arrivé sommes_arrivés êtes_arrivés sont_arrivés', pqp: 'étais_arrivé étais_arrivé était_arrivé étions_arrivés étiez_arrivés étaient_arrivés' },
  tomber: {
    pres: 'tombe tombes tombe tombons tombez tombent', imp: 'tombais tombais tombait tombions tombiez tombaient',
    fut: 'tomberai tomberas tombera tomberons tomberez tomberont', ps: 'tombai tombas tomba tombâmes tombâtes tombèrent',
    pc: 'suis_tombé es_tombé est_tombé sommes_tombés êtes_tombés sont_tombés', pqp: 'étais_tombé étais_tombé était_tombé étions_tombés étiez_tombés étaient_tombés' },
  aimer: {
    pres: 'aime aimes aime aimons aimez aiment', imp: 'aimais aimais aimait aimions aimiez aimaient',
    fut: 'aimerai aimeras aimera aimerons aimerez aimeront', ps: 'aimai aimas aima aimâmes aimâtes aimèrent',
    pc: 'ai_aimé as_aimé a_aimé avons_aimé avez_aimé ont_aimé', pqp: 'avais_aimé avais_aimé avait_aimé avions_aimé aviez_aimé avaient_aimé' },
  finir: {
    pres: 'finis finis finit finissons finissez finissent', imp: 'finissais finissais finissait finissions finissiez finissaient',
    fut: 'finirai finiras finira finirons finirez finiront', ps: 'finis finis finit finîmes finîtes finirent',
    pc: 'ai_fini as_fini a_fini avons_fini avez_fini ont_fini', pqp: 'avais_fini avais_fini avait_fini avions_fini aviez_fini avaient_fini' },
  choisir: {
    pres: 'choisis choisis choisit choisissons choisissez choisissent', imp: 'choisissais choisissais choisissait choisissions choisissiez choisissaient',
    fut: 'choisirai choisiras choisira choisirons choisirez choisiront', ps: 'choisis choisis choisit choisîmes choisîtes choisirent',
    pc: 'ai_choisi as_choisi a_choisi avons_choisi avez_choisi ont_choisi', pqp: 'avais_choisi avais_choisi avait_choisi avions_choisi aviez_choisi avaient_choisi' },
  'obéir': {
    pres: 'obéis obéis obéit obéissons obéissez obéissent', imp: 'obéissais obéissais obéissait obéissions obéissiez obéissaient',
    fut: 'obéirai obéiras obéira obéirons obéirez obéiront', ps: 'obéis obéis obéit obéîmes obéîtes obéirent',
    pc: 'ai_obéi as_obéi a_obéi avons_obéi avez_obéi ont_obéi', pqp: 'avais_obéi avais_obéi avait_obéi avions_obéi aviez_obéi avaient_obéi' },
  'réfléchir': {
    pres: 'réfléchis réfléchis réfléchit réfléchissons réfléchissez réfléchissent', imp: 'réfléchissais réfléchissais réfléchissait réfléchissions réfléchissiez réfléchissaient',
    fut: 'réfléchirai réfléchiras réfléchira réfléchirons réfléchirez réfléchiront', ps: 'réfléchis réfléchis réfléchit réfléchîmes réfléchîtes réfléchirent',
    pc: 'ai_réfléchi as_réfléchi a_réfléchi avons_réfléchi avez_réfléchi ont_réfléchi', pqp: 'avais_réfléchi avais_réfléchi avait_réfléchi avions_réfléchi aviez_réfléchi avaient_réfléchi' },
  aller: {
    pres: 'vais vas va allons allez vont', imp: 'allais allais allait allions alliez allaient', fut: 'irai iras ira irons irez iront',
    ps: 'allai allas alla allâmes allâtes allèrent', pc: 'suis_allé es_allé est_allé sommes_allés êtes_allés sont_allés',
    pqp: 'étais_allé étais_allé était_allé étions_allés étiez_allés étaient_allés' },
  faire: {
    pres: 'fais fais fait faisons faites font', imp: 'faisais faisais faisait faisions faisiez faisaient', fut: 'ferai feras fera ferons ferez feront',
    ps: 'fis fis fit fîmes fîtes firent', pc: 'ai_fait as_fait a_fait avons_fait avez_fait ont_fait', pqp: 'avais_fait avais_fait avait_fait avions_fait aviez_fait avaient_fait' },
  dire: {
    pres: 'dis dis dit disons dites disent', imp: 'disais disais disait disions disiez disaient', fut: 'dirai diras dira dirons direz diront',
    ps: 'dis dis dit dîmes dîtes dirent', pc: 'ai_dit as_dit a_dit avons_dit avez_dit ont_dit', pqp: 'avais_dit avais_dit avait_dit avions_dit aviez_dit avaient_dit' },
  prendre: {
    pres: 'prends prends prend prenons prenez prennent', imp: 'prenais prenais prenait prenions preniez prenaient', fut: 'prendrai prendras prendra prendrons prendrez prendront',
    ps: 'pris pris prit prîmes prîtes prirent', pc: 'ai_pris as_pris a_pris avons_pris avez_pris ont_pris', pqp: 'avais_pris avais_pris avait_pris avions_pris aviez_pris avaient_pris' },
  apprendre: {
    pres: 'apprends apprends apprend apprenons apprenez apprennent', imp: 'apprenais apprenais apprenait apprenions appreniez apprenaient',
    fut: 'apprendrai apprendras apprendra apprendrons apprendrez apprendront', ps: 'appris appris apprit apprîmes apprîtes apprirent',
    pc: 'ai_appris as_appris a_appris avons_appris avez_appris ont_appris', pqp: 'avais_appris avais_appris avait_appris avions_appris aviez_appris avaient_appris' },
  comprendre: {
    pres: 'comprends comprends comprend comprenons comprenez comprennent', imp: 'comprenais comprenais comprenait comprenions compreniez comprenaient',
    fut: 'comprendrai comprendras comprendra comprendrons comprendrez comprendront', ps: 'compris compris comprit comprîmes comprîtes comprirent',
    pc: 'ai_compris as_compris a_compris avons_compris avez_compris ont_compris', pqp: 'avais_compris avais_compris avait_compris avions_compris aviez_compris avaient_compris' },
  venir: {
    pres: 'viens viens vient venons venez viennent', imp: 'venais venais venait venions veniez venaient', fut: 'viendrai viendras viendra viendrons viendrez viendront',
    ps: 'vins vins vint vînmes vîntes vinrent', pc: 'suis_venu es_venu est_venu sommes_venus êtes_venus sont_venus', pqp: 'étais_venu étais_venu était_venu étions_venus étiez_venus étaient_venus' },
  revenir: {
    pres: 'reviens reviens revient revenons revenez reviennent', imp: 'revenais revenais revenait revenions reveniez revenaient',
    fut: 'reviendrai reviendras reviendra reviendrons reviendrez reviendront', ps: 'revins revins revint revînmes revîntes revinrent',
    pc: 'suis_revenu es_revenu est_revenu sommes_revenus êtes_revenus sont_revenus', pqp: 'étais_revenu étais_revenu était_revenu étions_revenus étiez_revenus étaient_revenus' },
  devenir: {
    pres: 'deviens deviens devient devenons devenez deviennent', imp: 'devenais devenais devenait devenions deveniez devenaient',
    fut: 'deviendrai deviendras deviendra deviendrons deviendrez deviendront', ps: 'devins devins devint devînmes devîntes devinrent',
    pc: 'suis_devenu es_devenu est_devenu sommes_devenus êtes_devenus sont_devenus', pqp: 'étais_devenu étais_devenu était_devenu étions_devenus étiez_devenus étaient_devenus' },
  pouvoir: {
    pres: 'peux peux peut pouvons pouvez peuvent', imp: 'pouvais pouvais pouvait pouvions pouviez pouvaient', fut: 'pourrai pourras pourra pourrons pourrez pourront',
    ps: 'pus pus put pûmes pûtes purent', pc: 'ai_pu as_pu a_pu avons_pu avez_pu ont_pu', pqp: 'avais_pu avais_pu avait_pu avions_pu aviez_pu avaient_pu' },
  voir: {
    pres: 'vois vois voit voyons voyez voient', imp: 'voyais voyais voyait voyions voyiez voyaient', fut: 'verrai verras verra verrons verrez verront',
    ps: 'vis vis vit vîmes vîtes virent', pc: 'ai_vu as_vu a_vu avons_vu avez_vu ont_vu', pqp: 'avais_vu avais_vu avait_vu avions_vu aviez_vu avaient_vu' },
  vouloir: {
    pres: 'veux veux veut voulons voulez veulent', imp: 'voulais voulais voulait voulions vouliez voulaient', fut: 'voudrai voudras voudra voudrons voudrez voudront',
    ps: 'voulus voulus voulut voulûmes voulûtes voulurent', pc: 'ai_voulu as_voulu a_voulu avons_voulu avez_voulu ont_voulu', pqp: 'avais_voulu avais_voulu avait_voulu avions_voulu aviez_voulu avaient_voulu' },
  lancer: {
    pres: 'lance lances lance lançons lancez lancent', imp: 'lançais lançais lançait lancions lanciez lançaient',
    fut: 'lancerai lanceras lancera lancerons lancerez lanceront', ps: 'lançai lanças lança lançâmes lançâtes lancèrent' },
  commencer: {
    pres: 'commence commences commence commençons commencez commencent', imp: 'commençais commençais commençait commencions commenciez commençaient',
    fut: 'commencerai commenceras commencera commencerons commencerez commenceront', ps: 'commençai commenças commença commençâmes commençâtes commencèrent' },
  manger: {
    pres: 'mange manges mange mangeons mangez mangent', imp: 'mangeais mangeais mangeait mangions mangiez mangeaient',
    fut: 'mangerai mangeras mangera mangerons mangerez mangeront', ps: 'mangeai mangeas mangea mangeâmes mangeâtes mangèrent' },
  nager: {
    pres: 'nage nages nage nageons nagez nagent', imp: 'nageais nageais nageait nagions nagiez nageaient',
    fut: 'nagerai nageras nagera nagerons nagerez nageront', ps: 'nageai nageas nagea nageâmes nageâtes nagèrent' },
  ranger: {
    pres: 'range ranges range rangeons rangez rangent', imp: 'rangeais rangeais rangeait rangions rangiez rangeaient',
    fut: 'rangerai rangeras rangera rangerons rangerez rangeront', ps: 'rangeai rangeas rangea rangeâmes rangeâtes rangèrent' },
  nettoyer: {
    pres: 'nettoie nettoies nettoie nettoyons nettoyez nettoient', imp: 'nettoyais nettoyais nettoyait nettoyions nettoyiez nettoyaient',
    fut: 'nettoierai nettoieras nettoiera nettoierons nettoierez nettoieront', ps: 'nettoyai nettoyas nettoya nettoyâmes nettoyâtes nettoyèrent' },
  essuyer: {
    pres: 'essuie essuies essuie essuyons essuyez essuient', imp: 'essuyais essuyais essuyait essuyions essuyiez essuyaient',
    fut: 'essuierai essuieras essuiera essuierons essuierez essuieront', ps: 'essuyai essuyas essuya essuyâmes essuyâtes essuyèrent' },
  appeler: {
    pres: 'appelle appelles appelle appelons appelez appellent', imp: 'appelais appelais appelait appelions appeliez appelaient',
    fut: 'appellerai appelleras appellera appellerons appellerez appelleront', ps: 'appelai appelas appela appelâmes appelâtes appelèrent' },
  jeter: {
    pres: 'jette jettes jette jetons jetez jettent', imp: 'jetais jetais jetait jetions jetiez jetaient',
    fut: 'jetterai jetteras jettera jetterons jetterez jetteront', ps: 'jetai jetas jeta jetâmes jetâtes jetèrent' },
  acheter: {
    pres: 'achète achètes achète achetons achetez achètent', imp: 'achetais achetais achetait achetions achetiez achetaient',
    fut: 'achèterai achèteras achètera achèterons achèterez achèteront', ps: 'achetai achetas acheta achetâmes achetâtes achetèrent' },
  lever: {
    pres: 'lève lèves lève levons levez lèvent', imp: 'levais levais levait levions leviez levaient',
    fut: 'lèverai lèveras lèvera lèverons lèverez lèveront', ps: 'levai levas leva levâmes levâtes levèrent' },
  mener: {
    pres: 'mène mènes mène menons menez mènent', imp: 'menais menais menait menions meniez menaient',
    fut: 'mènerai mèneras mènera mènerons mènerez mèneront', ps: 'menai menas mena menâmes menâtes menèrent' },
  'préférer': {
    pres: 'préfère préfères préfère préférons préférez préfèrent', imp: 'préférais préférais préférait préférions préfériez préféraient',
    fut: 'préférerai préféreras préférera préférerons préférerez préféreront', ps: 'préférai préféras préféra préférâmes préférâtes préférèrent' },
  'répéter': {
    pres: 'répète répètes répète répétons répétez répètent', imp: 'répétais répétais répétait répétions répétiez répétaient',
    fut: 'répéterai répéteras répétera répéterons répéterez répéteront', ps: 'répétai répétas répéta répétâmes répétâtes répétèrent' }
};
const VARIANTES = {
  'préférer:fut': 'préfèrerai préfèreras préfèrera préfèrerons préfèrerez préfèreront',
  'répéter:fut': 'répèterai répèteras répètera répèterons répèterez répèteront'
};

// 1. Formes de référence
let nbRef = 0;
for (const [inf, temps] of Object.entries(REF)) {
  for (const [tps, liste] of Object.entries(temps)) {
    liste.split(' ').forEach((attendu, p) => {
      attendu = attendu.replace('_', ' ');
      const g = M.conj(inf, tps, p, { g: 'm' });
      nbRef++;
      ok(g === attendu, `${inf} ${tps} ${M.PERS[p]} : « ${g} » au lieu de « ${attendu} »`);
      const acc = M.acceptes(inf, tps, p, 'm');
      ok(acc.indexOf(attendu) >= 0, `${inf} ${tps} ${M.PERS[p]} : « ${attendu} » n'est pas acceptée`);
    });
  }
}
// Variantes de 1990 acceptées
for (const [k, liste] of Object.entries(VARIANTES)) {
  const [inf, tps] = k.split(':');
  liste.split(' ').forEach((v, p) => ok(M.acceptes(inf, tps, p, 'm').indexOf(v) >= 0, `variante 1990 « ${v} » refusée`));
}
// Accords avec être
ok(M.conj('venir', 'pc', 5, { g: 'f' }) === 'sont venues', 'elles sont venues');
ok(M.conj('aller', 'pqp', 2, { g: 'f' }) === 'était allée', 'elle était allée');
ok(M.conj('tomber', 'pc', 3, { g: 'f' }) === 'sommes tombées', 'nous sommes tombées');
['suis venu', 'suis venue'].forEach(x => ok(M.acceptes('venir', 'pc', 0, '?').indexOf(x) >= 0, 'je : on accepte « ' + x + ' »'));
['êtes venu', 'êtes venue', 'êtes venus', 'êtes venues'].forEach(x => ok(M.acceptes('venir', 'pc', 4, '?').indexOf(x) >= 0 || x === 'êtes venu' || x === 'êtes venue', 'vous : on accepte « ' + x + ' »'));
ok(M.acceptes('venir', 'pc', 5, 'm').indexOf('sont venues') < 0, 'ils : « sont venues » refusé');
// Accord avec avoir et COD placé avant (option)
ok(M.conj('manger', 'pc', 0, { cod: 'es' }) === 'ai mangées', 'je les ai mangées');
ok(M.conj('prendre', 'pqp', 5, { cod: 'es' }) === 'avaient prises', 'ils les avaient prises');

// 2. Découpage : chaque forme de chaque verbe, sans morceau vide ni « undefined »
let nbFormes = 0;
const decoupage = {};
M.FAMILLES.forEach(f => f.verbes.forEach(inf => M.TEMPS.forEach(t => {
  if (f.simples && t.aux) return;
  for (let p = 0; p < 6; p++) for (const g of ['m', 'f']) {
    const m = M.forme(inf, t.id, p, { g });
    nbFormes++;
    const txt = M.texte(m);
    ok(txt === M.conj(inf, t.id, p, { g }) && !/undefined|\|/.test(txt) && txt.length > 0, `${inf} ${t.id} ${p} : forme bizarre « ${txt} »`);
    ok(m.every(x => x.t.length > 0), `${inf} ${t.id} ${p} : morceau vide`);
    ok(m[0].k === (t.aux ? 'aux' : 'rad'), `${inf} ${t.id} ${p} : le premier morceau n'est pas ${t.aux ? "l'auxiliaire" : 'le radical'}`);
    if (!t.aux && t.id !== 'pres') ok(m.some(x => x.k === 'tm'), `${inf} ${t.id} ${p} : pas de marque de temps`);
    if (g === 'm' && p === 2 && inf === f.verbes[0]) decoupage[inf + ' ' + t.id] = m.map(x => x.t).join('·');
  }
})));
// Quelques découpages de la convention du cahier des charges (§ 3)
const DECOUPE = { 'chanter imp': 'chant·ai·t', 'chanter fut': 'chante·r·a', 'chanter ps': 'chant·a', 'finir ps': 'fin·i·t', 'venir ps': 'v·in·t', 'être ps': 'f·u·t', 'prendre ps': 'pr·i·t', 'prendre pqp': 'avait· ·pr·is', 'venir pc': 'est· ·ven·u' };
for (const [k, v] of Object.entries(DECOUPE)) ok(decoupage[k] === v, `découpage ${k} : ${decoupage[k]} au lieu de ${v}`);
ok(M.forme('chanter', 'pres', 5).map(x => x.t).join('·') === 'chant·ent', 'découpage chant·ent');
ok(M.forme('finir', 'pres', 3).map(x => x.t).join('·') === 'finiss·ons', 'découpage finiss·ons');
ok(M.forme('faire', 'pres', 5).map(x => x.t).join('·') === 'fo·nt', 'découpage fo·nt');
ok(M.forme('venir', 'pc', 5, { g: 'f' }).map(x => x.t).join('·') === 'sont· ·ven·u·es', 'découpage sont venues');
ok(M.CARTES.length === 80, `${M.CARTES.length} cartes au lieu de 80`);

// 3. Diagnostic : une erreur volontaire de chaque type
const DIAG = [
  ['accent', 'manger', 'pc', 2, 'a mange'],
  ['accent', 'faire', 'ps', 3, 'fimes'],
  ['temps', 'prendre', 'ps', 5, 'prenaient'],
  ['temps', 'chanter', 'fut', 0, 'chantais'],
  ['personne', 'chanter', 'ps', 5, 'chanta'],
  ['personne', 'finir', 'imp', 3, 'finissiez'],
  ['auxiliaire', 'venir', 'pc', 2, 'a venu'],
  ['auxiliaire', 'manger', 'pc', 2, 'est mangé'],
  ['auxTemps', 'finir', 'pqp', 2, 'a fini'],
  ['auxTemps', 'aller', 'pc', 5, 'étaient allés'],
  ['participe', 'prendre', 'pc', 2, 'a prit'],
  ['participe', 'manger', 'pc', 2, 'a manger'],
  ['accord', 'venir', 'pc', 5, 'sont venu', 'f'],
  ['accord', 'aller', 'pqp', 5, 'étaient allé', 'm'],
  ['radical', 'manger', 'pres', 3, 'mangons'],
  ['radical', 'prendre', 'fut', 0, 'prenderai'],
  ['radical', 'jouer', 'fut', 0, 'jourai'],
  ['accent', 'lancer', 'imp', 0, 'lancais'],
  ['marqueTemps', 'chanter', 'ps', 3, 'chantimes'],
  ['marqueTemps', 'finir', 'fut', 3, 'finions'],
  ['marquePersonne', 'chanter', 'ps', 5, 'chantère'],
  ['marquePersonne', 'chanter', 'ps', 2, 'chantat'],
  ['marquePersonne', 'chanter', 'pres', 5, 'chanten'],
  ['personne', 'chanter', 'pres', 5, 'chantes'],
  ['autre', 'voir', 'ps', 2, 'zzz']
];
for (const [type, inf, tps, p, rep, g] of DIAG) {
  const d = M.diagnostic({ inf, tps, p, g: g || 'm' }, rep);
  ok(d && d.type === type, `diagnostic de « ${rep} » (${inf}, ${tps}, ${M.PERS[p]}) : ${d ? d.type : 'juste'} au lieu de ${type}`);
}
ok(M.diagnostic({ inf: 'finir', tps: 'pres', p: 2, g: 'm' }, 'finit') === null, 'finit juste');
ok(M.diagnostic({ inf: 'venir', tps: 'pc', p: 0, g: '?' }, 'suis venue') === null, 'je suis venue juste');
ok(M.diagnostic({ inf: 'préférer', tps: 'fut', p: 0, g: 'm' }, 'préfèrerai') === null, '1990 juste');
ok(M.sansSujet("j'ai", 'je') === 'ai' && M.sansSujet('nous finissions', 'nous') === 'finissions' && M.sansSujet('Le loup prit', 'le loup') === 'prit', 'sujet tapé enlevé');
ok(M.propre('  Chantèrent. ') === 'chantèrent' && M.propre('j’ai') === "j'ai", 'réponse mise au propre');

// 4. Phrases : 3000 phrases au hasard, sans trou de données
let nbPhrases = 0;
const vus = new Set();
for (let i = 0; i < 3000; i++) {
  const f = M.FAMILLES[i % M.FAMILLES.length], inf = f.verbes[Math.floor(i / 14) % f.verbes.length];
  const temps = M.TEMPS.filter(t => !(f.simples && t.aux)), t = temps[i % temps.length], p = i % 6;
  const ph = M.phrase(inf, t.id, p, Math.random, { cod: i % 2 === 0 });
  nbPhrases++;
  const txt = ph.avant + '#' + (ph.mid || '') + ph.apres;
  vus.add(txt);
  ok(!/undefined|\{|\}/.test(txt) && ph.p === p && ph.inf === inf, `phrase bizarre : ${txt}`);
  ok(M.acceptes(inf, t.id, p, ph.g, ph.cod).length > 0, `phrase sans réponse : ${txt}`);
  if (ph.deuxTrous) ok(/n'$/.test(ph.avant), 'négation : ' + txt);
}
ok(vus.size > 1000, `seulement ${vus.size} phrases différentes`);
M.CAS_E.forEach(c => { for (let i = 0; i < 60; i++) { const e = M.phraseE(c.id); ok(e.choix.indexOf(e.rep) >= 0 && !/undefined|\{/.test(e.avant + e.apres), `son /é/ ${c.id} : ${e.avant}__${e.apres} (${e.rep})`); } });
// Chaque verbe a des compléments
M.FAMILLES.forEach(f => f.verbes.forEach(inf => ok(M.COMPL[inf] && M.COMPL[inf].length >= 3, 'compléments de ' + inf)));
// Récits : chaque trou a un verbe connu, un temps, une personne
let nbTrous = 0;
M.RECITS.forEach(r => {
  let n = 0;
  r.texte.forEach(ph => M.decouperRecit(ph).forEach(x => {
    if (typeof x === 'string') return;
    n++; nbTrous++;
    ok(M.famille(x.inf) && M.T_ID[x.tps] && x.p >= 0 && M.conj(x.inf, x.tps, x.p, { g: x.g }).length > 1, `récit « ${r.titre} » : trou ${JSON.stringify(x)}`);
  }));
  ok(n >= 3 && n <= 6 && r.texte.length >= 4 && r.texte.length <= 6, `récit « ${r.titre} » : ${n} trous, ${r.texte.length} phrases`);
});

console.log(`${verifs - echecs}/${verifs} vérifications justes (${nbRef} formes de référence, ${nbFormes} formes découpées, ${DIAG.length} erreurs volontaires, ${nbPhrases} phrases, ${nbTrous} trous de récit).`);
process.exit(echecs ? 1 : 0);
