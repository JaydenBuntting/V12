/* PAST PAPERS — standalone; does not touch script.js. Creates its own container, so no extra HTML is needed beyond the card.
   To add a paper: add an entry to PAPERS (same shape as '2024'),
   add a .pp-card in 91164.html with data-paper="<year>", and drop the PDFs in papers/<year>/. */
(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LES = ['Lewis Structures','Molecular Shapes','Polarity','Heat Calculations and Diagrams','Types of Solids and their Properties'];
const CODE = ['NØ','N1','N2','A3','A4','M5','M6','E7','E8'];

/* ---------- model-answer drawings ---------- */
const pr = (x, y, d) => { const o = {u:[0,-17],d:[0,17],l:[-17,0],r:[17,0]}[d], X = x+o[0], Y = y+o[1];
  return 'ud'.includes(d) ? `<circle cx="${X-4}" cy="${Y}" r="2"/><circle cx="${X+4}" cy="${Y}" r="2"/>` : `<circle cx="${X}" cy="${Y-4}" r="2"/><circle cx="${X}" cy="${Y+4}" r="2"/>`; };
const at = (x, y, s) => `<text x="${x}" y="${y+7}" text-anchor="middle">${s}</text>`;
const LS = '<g stroke="currentColor" stroke-width="2">';
const SVG_CS2 = `<svg viewBox="0 0 200 76" fill="currentColor" font-size="20">${at(30,38,'S')}${at(100,38,'C')}${at(170,38,'S')}${LS}<line x1="46" y1="35" x2="84" y2="35"/><line x1="46" y1="41" x2="84" y2="41"/><line x1="116" y1="35" x2="154" y2="35"/><line x1="116" y1="41" x2="154" y2="41"/></g>${pr(30,38,'u')}${pr(30,38,'d')}${pr(170,38,'u')}${pr(170,38,'d')}</svg>`;
const SVG_NI3 = `<svg viewBox="0 0 200 130" fill="currentColor" font-size="20">${at(100,36,'N')}${at(40,96,'I')}${at(100,106,'I')}${at(160,96,'I')}${LS}<line x1="91" y1="46" x2="52" y2="84"/><line x1="100" y1="50" x2="100" y2="92"/><line x1="109" y1="46" x2="148" y2="84"/></g>${pr(100,36,'u')}${pr(40,96,'l')}${pr(40,96,'d')}${pr(40,96,'r')}${pr(100,106,'l')}${pr(100,106,'r')}${pr(100,106,'d')}${pr(160,96,'l')}${pr(160,96,'d')}${pr(160,96,'r')}</svg>`;
const H2S_IMAGE = `
    <img
        class="pp-given-image"
        src="H2S-2024-PP.png"
        alt="H₂S shown as a bent molecule with a 109.5° bond angle"
    >
`;
const dg = p => `<svg class="pp-bg" viewBox="0 0 240 150" fill="none" stroke="currentColor"><path d="M14 8V135H236" stroke-width="1.5"/><path d="${p}" stroke-width="2.5"/><text x="20" y="20" font-size="11" fill="currentColor" stroke="none">Energy</text><text x="150" y="148" font-size="11" fill="currentColor" stroke="none">Reaction proceeds</text></svg>`;
const DG = [dg('M24 40H90L150 110H225'), dg('M24 110H90L150 40H225')];

/* ---------- 2024 paper ---------- */
const PAPERS = { '2024': { title: '2024 Paper', year: '2024', mins: 40, Q: [
{ n: 1, topic: 'Lewis structures, shape, polarity and enthalpy', lead: '', parts: [
{
    id: '1a',
    lab: '(a)',
    cmd: 'Draw',
    q: 'Draw the Lewis structure for each of the two blank molecules, and name their shapes. <i>H₂S is shown for you: bent, 109.5°.</i>',
    given: H2S_IMAGE,
    boxes: [
        { k: 'NI₃ (nitrogen triiodide) — 109.5°', re: 'pyramid' },
        { k: 'CS₂ (carbon disulfide) — 180°', re: 'linear' }
    ],
    kw: [],
    model: `<div>${SVG_NI3}${SVG_CS2}</div>NI₃: <b>trigonal pyramid(al)</b> · CS₂: <b>linear</b>`
}, { id: '1b', lab: '(b)', cmd: 'Compare and contrast', q: 'Compare and contrast the shapes and bond angles of silicon tetrahydride, SiH₄, and azanone, HNO.<div class="pp-eq">SiH₄: H–Si(–H)(–H)–H &nbsp;|&nbsp; HNO: H–N̈=Ö</div>',
   texts: [{ ph: 'Write your answer here…', rows: 10 }],
   kw: [['Names both molecules (SiH₄ and HNO)', 'sih4|silicon tetrahydride', 'hno|azanone'],['Four regions of electron density around Si','(four|4)\\s*(regions|areas|electron|bond)'],['Three regions of electron density around N','(three|3)\\s*(regions|areas|electron|bond)'],['Regions repel → maximum separation / minimum repulsion','repel|max[a-z]* separation|minimi[sz]e|minimum repulsion|furthest|far apart'],['Tetrahedral and 109.5°','tetrahedral','109'],['Trigonal planar arrangement and 120° for HNO','trigonal planar','120'],['Lone pair / non-bonding region on N','lone pair|non-?\\s?bonding'],['HNO shape is bent','bent'],['Explicitly contrasts the two','whereas|in contrast|unlike|compared|however|different']],
   model: 'Si has <b>four</b> regions of electron density, all bonding. They repel to maximum separation (minimum repulsion): 109.5°, tetrahedral arrangement <b>and</b> shape. HNO has <b>three</b> regions around N → trigonal planar arrangement, 120°. Two regions are bonding and one is a lone pair, so the final shape is <b>bent</b>: different from the arrangement because of the lone pair.' },
 { id: '1c', lab: '(c)', cmd: 'Justify', q: 'Hydrogen sulfide, H₂S, and hydrogen cyanide, HCN, have different shapes but the same polarity.<div class="pp-eq">H–S̈–H &nbsp;&nbsp;&nbsp; H–C≡N:</div>(i) Choose the polarity of both H₂S and HCN.<br>(ii) Justify your choice by explaining the links between the bonding and structure of each substance, and relating this to how the polarity of a molecule is determined.',
   choice: { opts: ['Polar', 'Non-polar'], ans: 'Polar' }, texts: [{ ph: '(ii) Justify your choice…', rows: 9 }],
   kw: [['Electronegativity difference between atoms in the bonds','electronegativ'],['Polar bonds / bond dipoles','polar bond|dipole|polar covalent'],['H₂S is bent / asymmetrical','bent|asymmetric|not symmetric'],['H₂S dipoles do not cancel','not cancel|do not cancel|don.?t cancel|net dipole|reinforce'],['HCN is linear / symmetrical shape','linear'],['HCN dipoles are unequal (C–H vs C≡N) so cannot cancel','unequal|not equal|different|reinforce|net dipole|do not cancel|not cancel'],['Both molecules polar','polar']],
   model: 'Both are <b>polar</b>. Both contain polar bonds (electronegativity differences). H₂S has two polar bonds and two lone pairs → bent, so the dipoles are asymmetric and do not cancel. HCN is linear and symmetrical, <b>but</b> the C–H and C≡N bond dipoles are not equal, so they cannot cancel: the dipole reinforces and the molecule is polar.' },
 { id: '1d1', lab: '(d)(i)', cmd: 'Calculate', q: 'Methanamine, CH₃NH₂, can be made from HCN:<div class="pp-eq">HCN(g) + 2H₂(g) → CH₃NH₂(g) &nbsp; Δ<sub>r</sub>H = –158 kJ mol⁻¹</div>Calculate the mass of methanamine formed when 1890 kJ of energy is released. <i>M</i>(CH₃NH₂) = 31.0 g mol⁻¹.',
   calc: { rows: [{ lab: 'm(CH₃NH₂) =', v: 370.82, tol: .005, u: 'g' }] },
   model: 'n = 1890 ÷ 158 = 11.962 mol<br>m = n × M = 11.962 × 31.0 = 370.82 g = <b>371 g</b> (3 s.f.)' },
 { id: '1d2', lab: '(d)(ii)', cmd: 'Choose and label', q: 'Choose the correct energy diagram for this reaction and label it with the information in the equation (reactants, products, Δ<sub>r</sub>H position and value).', dg: 0,
   model: 'The <b>left</b> diagram (exothermic). Label HCN(g) + 2H₂(g) at the top level, CH₃NH₂(g) at the lower level, and an arrow downward between them labelled Δ<sub>r</sub>H = –158 kJ.' } ],
 crit: [['a','(a) Two Lewis structures OR two shapes',0],['a','(b) Identifies bonding / lone pairs, OR max separation, OR a correct bond angle for ONE molecule',1],['m','(b) Links total regions of electron density to arrangement and bond angle for ONE molecule using repulsion',1],['e','(b) Explains shapes and angles of BOTH molecules using regions, repulsion, bonding AND non-bonding areas',1],['a','(c) Correctly identifies polarity',2],['a','(c) Identifies an electronegativity difference between atoms in the bonds',2],['m','(c) Links asymmetry of H₂S to non-cancelling dipoles',2],['m','(c) Links unequal bond polarity in HCN to non-cancelling dipoles despite symmetry',2],['e','(c) Justifies polarity of BOTH using electronegativity, bond polarity and dipole symmetry',2],['a','(d)(i) One step correct',3],['a','(d)(ii) Diagram identified with partial correct labelling (Δ<sub>r</sub>H position OR reactants/products)',3],['m','(d) Correct answer for (i) OR (ii)',3],['e','(d) Correct answer for (i) AND (ii) (Δ<sub>r</sub>H position and value)',3]] },
{ n: 2, topic: 'Types of solids, melting point and solubility', parts: [
 { id: '2a', lab: '(a)', cmd: 'Complete', q: 'Complete the table for each substance in its solid state.',
   table: { cols: ['Solid', 'Type of solid', 'Type of particle', 'Attractive forces between particles'], rows: [
     ['SiO₂(s) — 1700 °C', 'network|covalent', 'atom', 'covalent', '3D covalent network', 'atoms', 'covalent bonds'],
     ['SiCl₄(s) — –69 °C', 'molecular', 'molecule', 'intermolecular|weak|dispersion|london|van der waals', 'molecular', 'molecules', 'weak intermolecular forces'],
     ['CuCl₂(s) — 620 °C', 'ionic', 'ion', 'ionic|electrostatic', 'ionic', 'ions', 'ionic bonds'],
     ['Al(s) — 660 °C', 'metallic', 'atom|cation|ion', 'metallic', 'metallic', 'metal atoms / cations + delocalised electrons', 'metallic bonds']] },
   model: 'See the answers shown in the table above.' },
 { id: '2b', lab: '(b)', cmd: 'Explain', q: 'Both SiO₂ and SiCl₄ contain silicon, but SiCl₄ has a considerably lower melting point. Explain why there is a difference in melting point for these substances.',
   texts: [{ ph: 'Write your answer here…', rows: 10 }],
   kw: [['SiO₂ is a 3D covalent network of atoms','network|giant covalent|extended covalent'],['Strong covalent bonds throughout SiO₂','strong covalent'],['SiCl₄ is molecular / discrete molecules','molecular|discrete|molecules'],['Only weak intermolecular forces between SiCl₄ molecules','weak.{0,30}(intermolecular|forces)|intermolecular'],['Energy needed to break / overcome the forces','energy'],['Large energy for SiO₂ vs small for SiCl₄','large|lot of|high.{0,20}energy|small|less energy|little energy'],['Links to melting point','melting point']],
   model: 'SiO₂ is a 3D covalent network solid: atoms joined by strong covalent bonds. A large amount of energy is needed to overcome them, so its melting point is high. SiCl₄ is molecular: strong covalent bonds <i>within</i> molecules but only weak intermolecular forces <i>between</i> them. Little energy is needed to overcome these, so the melting point is far lower. The difference is the strength of the attractive forces between particles.' },
 { id: '2c', lab: '(c)', cmd: 'Explain', q: 'Explain why SiCl₄ does not dissolve in water, but CuCl₂ does. In your answer: link to their structure and bonding; include the type of solvent SiCl₄ will dissolve in, and why; include a diagram to support your answer for CuCl₂.',
   boxes: [{ k: 'Diagram to show CuCl₂ dissolving in water' }], texts: [{ ph: 'Write your answer here…', rows: 12 }],
   kw: [['SiCl₄ is non-polar (symmetrical, polar bonds cancel)','non-?\\s?polar'],['Water is polar (δ+ H, δ– O)','polar.{0,40}water|water.{0,40}polar|δ|partial'],['Attractions between SiCl₄ and water are too weak to overcome existing forces','not.{0,30}(strong|sufficient)|too weak|weaker|insufficient|not able|cannot overcome|unable'],['SiCl₄ dissolves in a NON-POLAR solvent','non-?\\s?polar (solvent|liquid)|dissolve.{0,40}non-?\\s?polar'],['Similar attractive forces so they can replace each other','similar|replace'],['CuCl₂ is ionic: Cu²⁺ and Cl⁻ ions','ionic|cu2|cu²|cl-|cl⁻'],['δ– O attracts Cu²⁺; δ+ H attracts Cl⁻','attract'],['Strong enough to overcome ionic bonds and water–water forces','overcome|strong enough|sufficient|break']],
   model: 'SiCl₄: polar Si–Cl bonds arranged symmetrically → non-polar molecule. Water is polar, with strong attractions between its molecules. The attractions between SiCl₄ and water are not strong enough to overcome those existing forces, so it does not dissolve. SiCl₄ would dissolve in a <b>non-polar solvent</b>, because attractions between solute and solvent molecules are similar to those they replace. CuCl₂ is ionic: the δ– O of water attracts Cu²⁺ and the δ+ H attracts Cl⁻. These attractions are strong enough to overcome the ionic lattice and the attractions between water molecules, so it dissolves. Your diagram should show water molecules surrounding each ion with the correct orientation.' } ],
 crit: [['a','(a) Two rows OR two columns correct',0],['m','(a) Whole table correct',0],['a','(b) Identifies melting point is related to strength of attractive forces, OR forces must be broken to melt',1],['a','(b) Describes the structure of either substance',1],['m','(b) Links strength of forces to the energy needed to melt, for ONE substance',1],['e','(b) Links structure and bonding in EACH substance to the difference in melting point',1],['a','(c) Identifies SiCl₄ non-polar / water polar, OR SiCl₄ dissolves in a non-polar solvent',2],['a','(c) Identifies attractions are required between water and solute to dissolve',2],['m','(c) Links relative strength of solute–solvent attractions to solubility for ONE solute',2],['m','(c) Links polarity to solubility for ONE solute',2],['e','(c) Justifies SiCl₄ solubility (polarity, relative strengths, overcoming existing forces) AND why it dissolves in a non-polar solvent',2],['e','(c) Explains CuCl₂ solubility the same way AND uses a diagram',2]] },
{ n: 3, topic: 'Energy calculations, bond enthalpy and metals', parts: [
 { id: '3a', lab: '(a)', cmd: 'Calculate', q: 'Bottled gas in New Zealand is a 60% propane, C₃H₈, 40% butane, C₄H₁₀, mix. Show by calculation how much more energy is released per 1.00 kg of propane compared to 1.00 kg of butane.<div class="pp-eq">C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(g) &nbsp; Δ<sub>r</sub>H = –2044 kJ mol⁻¹ &nbsp; M = 44.1 g mol⁻¹<br>2C₄H₁₀(g) + 13O₂(g) → 8CO₂(g) + 10H₂O(g) &nbsp; Δ<sub>r</sub>H = –2877 kJ mol⁻¹ &nbsp; M = 58.1 g mol⁻¹</div>',
   calc: { rows: [{ lab: '(i) Energy from 1.00 kg propane =', v: 46349, tol: .005, u: 'kJ' }, { lab: '(ii) Energy from 1.00 kg butane =', v: 24759, tol: .005, u: 'kJ' }, { lab: '(iii) Difference =', v: 21590, tol: .01, u: 'kJ' }] },
   model: '(i) n = 1000 ÷ 44.1 = 22.676 mol; energy = 22.676 × 2044 = 46 349 kJ ≈ <b>46 300 kJ</b><br>(ii) n = 1000 ÷ 58.1 = 17.212 mol; the equation is for <b>2</b> mol butane, so energy = 17.212 × 2877 ÷ 2 = 24 759 kJ ≈ <b>24 800 kJ</b><br>(iii) 46 300 – 24 800 = <b>21 500 kJ</b> more from propane (21 600 kJ using unrounded values).<small>Common error: forgetting that Δ<sub>r</sub>H is per mole of <i>reaction</i> and butane has a coefficient of 2.</small>' },
 { id: '3b', lab: '(b)', cmd: 'Calculate', q: 'Hydrogen fuel cell: <div class="pp-eq">2H₂(g) + O₂(g) → 2H₂O(g) &nbsp; Δ<sub>r</sub>H = –484 kJ mol⁻¹<br>Bond energies: H–H 436 · O=O 498 (kJ mol⁻¹)</div>Use the bond energies and Δ<sub>r</sub>H to calculate the average bond energy of the O–H bond.',
   calc: { rows: [{ lab: 'E(O–H) =', v: 463.5, tol: .003, u: 'kjmol' }] },
   model: 'Broken: 2 × 436 + 498 = 1370. Formed: 4 × O–H = 4<i>x</i> (two H₂O, two O–H each).<br>–484 = 1370 – 4<i>x</i> → 4<i>x</i> = 1854 → <i>x</i> = 463.5 = <b>464 kJ mol⁻¹</b> (3 s.f.)' },
 { id: '3c1', lab: '(c)(i)', cmd: 'State', q: '‘Galvorn’ is a newly developed form of carbon that is strong, light, and conducts electricity like graphite. What requirement must Galvorn have to allow it to conduct electricity?',
   texts: [{ ph: 'Your answer…', rows: 3 }], kw: [['Free / mobile','free|mobile|move'],['Charged particles (electrons or ions)','charged|electrons|ions']],
   model: 'It must contain <b>free-moving charged particles</b>.' },
 { id: '3c2', lab: '(c)(ii)', cmd: 'Explain', q: 'Aluminium, Al, is a good conductor of electricity and is malleable. These properties enable use in overhead power lines and in components and shells of smartphones and laptops. Explain why Al has these properties and link them to the uses stated. Refer to its structure and bonding.',
   texts: [{ k: 'Conducts electricity:', ph: 'Conducts electricity…', rows: 5 }, { k: 'Malleable:', ph: 'Malleable…', rows: 5 }],
   kw: [['Describes metallic structure (cations / atoms in a lattice)','lattice|cations|positive (metal )?ions|metal atoms'],['Delocalised valence electrons','delocalis|delocaliz'],['Delocalised electrons are free-moving AND charged → conduct','free|mobile|move'],['Conductivity linked to power lines / electronics','power line|electrical|cable|wire|device|electronic'],['Layers slide over each other','layer|slide'],['Non-directional metallic bonds','non-?\\s?directional'],['Reshaped without breaking bonds','without breaking|not break|doesn.?t break|remain|stays'],['Malleability linked to phone / laptop shells','shell|case|casing|shap|phone|laptop']],
   model: 'Al is a metallic solid: a 3D lattice of Al atoms/cations held by strong, non-directional metallic bonds with <b>delocalised valence electrons</b>. Those electrons are both free-moving and charged, so Al conducts, ideal for power lines and electrical components. Layers of cations can slide over one another when force is applied because metallic bonding is non-directional; bonding is not broken, so Al can be reshaped (malleable), ideal for shaping protective shells for phones and laptops.' } ],
 crit: [['a','(a) One step of the process correct',0],['m','(a) Either (i) OR (ii) correct',0],['e','(a) Calculates how much more energy propane gives, correct process and units throughout',0],['a','(b) Total bonds broken (1370) OR bonds formed (4x) correct',1],['m','(b) Correct process with a minor error',1],['e','(b) Correct answer with units and 3 s.f.',1],['a','(c)(i) Correct definition (free-moving charged particles)',2],['a','(c)(ii) Describes the structure of a metallic solid',2],['a','(c)(ii) Identifies non-directional bonds needed for malleability',2],['m','(c)(ii) Links conductivity to delocalised valence electrons',2],['m','(c)(ii) Links malleability to non-directional bonds letting particles move without breaking bonds',2],['e','(c)(ii) Comprehensively explains both properties AND links them to the stated uses',2]] }
] } };
const TOPIC_LESSON = { 1: { 0: 0, 1: 1, 2: 2, 3: 3 }, 2: { 0: 4, 1: 4, 2: 4 }, 3: { 0: 3, 1: 3, 2: 4 } };

/* ---------- state ---------- */
let paper = null, key = '', S = {};
const save = () => { try { localStorage.setItem(key, JSON.stringify(S)); } catch (e) {} };
const A = (k, v) => { if (v === undefined) return S.a[k] == null ? '' : S.a[k]; S.a[k] = v; save(); };
const num = s => { const n = parseFloat(String(s).replace(/[,\s]/g, '').replace(/[−–]/g, '-')); return isNaN(n) ? null : Math.abs(n); };
const unitOk = (u, want) => want === 'g' ? /^(g|grams?)$/i.test(u.trim()) : want === 'kJ' ? /^kj$/i.test(u.trim()) : /^kj\s*(mol(\^?-1|⁻¹)|\/\s*mol)$/i.test(u.trim().replace(/\s+/g, ' '));

/* ---------- canvas ---------- */
function canvas(wrap) {
  const cv = $('canvas', wrap), k = cv.dataset.k, ctx = cv.getContext('2d');
  let st = (S.d[k] || []).slice(), cur = null, col = '#161616';
  const R = () => cv.getBoundingClientRect();
  function draw() { const r = R(); ctx.clearRect(0, 0, r.width, r.height); ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = 2.5;
    st.concat(cur ? [cur] : []).forEach(s => { ctx.strokeStyle = s.c; ctx.beginPath(); s.p.forEach((p, i) => i ? ctx.lineTo(p[0] * r.width, p[1] * r.height) : ctx.moveTo(p[0] * r.width, p[1] * r.height)); if (s.p.length === 1) ctx.lineTo(s.p[0][0] * r.width + .1, s.p[0][1] * r.height); ctx.stroke(); }); }
  function fit() { const r = R(), d = devicePixelRatio || 1; if (!r.width) return; cv.width = r.width * d; cv.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); draw(); }
  const pt = e => { const r = R(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  cv.onpointerdown = e => { cv.setPointerCapture(e.pointerId); cur = { c: col, p: [pt(e)] }; draw(); };
  cv.onpointermove = e => { if (cur) { cur.p.push(pt(e)); draw(); } };
  cv.onpointerup = cv.onpointercancel = () => { if (cur) { st.push(cur); cur = null; S.d[k] = st; save(); draw(); } };
  $$('.sw', wrap).forEach(b => b.onclick = () => { col = b.dataset.c; $$('.sw', wrap).forEach(x => x.classList.toggle('on', x === b)); });
  $('.undo', wrap).onclick = () => { st.pop(); S.d[k] = st; save(); draw(); };
  $('.clr', wrap).onclick = () => { st = []; S.d[k] = st; save(); draw(); };
  if (window.ResizeObserver) new ResizeObserver(fit).observe(cv); fit();
}
const cvHtml = (k, bg) => `<div class="pp-cvw"><div class="pp-cvi">${bg || ''}<canvas class="pp-cv" data-k="${k}"></canvas></div><div class="pp-tools"><button class="sw on" data-c="#161616" style="background:#161616"></button><button class="sw" data-c="#173683" style="background:#173683"></button><button class="undo" type="button">Undo</button><button class="clr" type="button">Clear</button></div></div>`;

/* ---------- render ---------- */
function partHtml(p) {
  let h = `<section class="pp-sheet" id="p${p.id}"><span class="pp-lab">${p.lab} · ${p.cmd}</span><h4>${p.q}</h4>`;
if (p.given) {
    h += `
        <div class="pp-given">
            <div class="pp-given-structure">
                ${p.given}
            </div>

            <div class="pp-given-text">
                <span class="pp-given-label">Shown for you</span>
                <strong>H₂S — hydrogen sulfide</strong>
                <span>Bent · 109.5°</span>
            </div>
        </div>
    `;
}
if (p.boxes) h += `<div class="pp-boxes">${p.boxes.map((b, i) => `
    <div class="pp-answer-box">
        <span class="pp-answer-label">${b.k}</span>
        ${cvHtml(p.id + ':b' + i)}
        ${b.re ? `<input type="text" data-k="${p.id}:n${i}" placeholder="Name of shape" value="${esc(A(p.id + ':n' + i))}" style="margin-top:.4rem">` : ''}
    </div>
`).join('')}</div>`;  if (p.table) h += `<div style="overflow-x:auto"><table class="pp-tbl"><tr>${p.table.cols.map(c => `<th>${c}</th>`).join('')}</tr>${p.table.rows.map((r, i) => `<tr><td>${r[0]}</td>${[0, 1, 2].map(c => `<td><input type="text" data-k="${p.id}:t${i}${c}" value="${esc(A(p.id + ':t' + i + c))}"></td>`).join('')}</tr>`).join('')}</table></div>`;
  if (p.dg !== undefined) h += `<div class="pp-dgs">${DG.map((s, i) => `<div class="pp-dg">${cvHtml(p.id + ':g' + i, s)}<button type="button" class="pp-opt${A(p.id + ':g') === String(i) ? ' on' : ''}" data-k="${p.id}:g" data-v="${i}">This is the correct diagram</button></div>`).join('')}</div>`;
  if (p.choice) h += `<span class="pp-lab">(i) Polarity of both molecules</span><div class="pp-opts">${p.choice.opts.map(o => `<button type="button" class="pp-opt${A(p.id + ':c') === o ? ' on' : ''}" data-k="${p.id}:c" data-v="${o}">${o}</button>`).join('')}</div>`;
  (p.texts || []).forEach((t, i) => h += `${t.k ? `<span class="pp-lab">${t.k}</span>` : '<span class="pp-lab">Your answer</span>'}<textarea data-k="${p.id}:t${i}" rows="${t.rows}" placeholder="${t.ph}">${esc(A(p.id + ':t' + i))}</textarea>`);
  if (p.calc) { h += `<span class="pp-lab">Working</span><textarea data-k="${p.id}:w" rows="7" placeholder="Show your working line by line…">${esc(A(p.id + ':w'))}</textarea>`;
    p.calc.rows.forEach((r, i) => h += `<div class="pp-row"><span>${r.lab}</span><input type="text" inputmode="decimal" data-k="${p.id}:v${i}" value="${esc(A(p.id + ':v' + i))}" aria-label="value"><input type="text" data-k="${p.id}:u${i}" placeholder="unit" value="${esc(A(p.id + ':u' + i))}" aria-label="unit"></div>`); }
  return h + `</section>`;
}
const li = (ok, t) => `<li class="${ok ? 'ok' : 'no'}">${t}</li>`;
const nl = s => esc(s).replace(/\n/g, '<br>');
function echo(p) { const t = [];
  (p.texts || []).forEach((x, i) => { const v = A(p.id + ':t' + i); if (v) t.push((x.k ? `<b>${x.k}</b> ` : '') + nl(v)); });
  if (p.calc) { const w = A(p.id + ':w'); if (w) t.push('<b>Working</b><br>' + nl(w)); }
  return t.length ? `<h5>What you wrote</h5><div class="mdl you">${t.join('<br><br>')}</div>` : ''; }
function fbHtml(p) {
  let o = '', auto = '';
  if (p.boxes && p.boxes[0].re) auto += p.boxes.map((b, i) => li(new RegExp(b.re, 'i').test(A(p.id + ':n' + i)), `${b.k.split(' ')[0]} shape name: you wrote “${esc(A(p.id + ':n' + i)) || '—'}”`)).join('') + '<li class="no">Compare your drawn Lewis structures with the model below: check every lone pair and the total electron count.</li>';
  if (p.choice) auto += li(A(p.id + ':c') === p.choice.ans, `Polarity: you chose “${A(p.id + ':c') || '—'}” (correct: ${p.choice.ans})`);
  if (p.dg !== undefined) auto += li(A(p.id + ':g') === '0', `Diagram: you chose ${A(p.id + ':g') === '' ? 'none' : (A(p.id + ':g') === '0' ? 'the left one' : 'the right one')} (correct: left, products lower = exothermic)`) + '<li class="no">Check your labels: both energy levels named with their substances, a Δ<sub>r</sub>H arrow in the right place, and the value –158 kJ.</li>';
  if (p.table) { let n = 0; auto += p.table.rows.map((r, i) => { const res = [0, 1, 2].map(c => new RegExp(r[1 + c], 'i').test(A(p.id + ':t' + i + c))); n += res.filter(Boolean).length; return li(res.every(Boolean), `${r[0].split(' —')[0]}: ${res.filter(Boolean).length}/3 cells matched. Expected: ${r[4]} · ${r[5]} · ${r[6]}`); }).join('') + li(n === 12, `${n}/12 cells matched (the automatic check accepts common wordings; confirm against the expected answers)`); }
  if (p.calc) p.calc.rows.forEach((r, i) => { const v = num(A(p.id + ':v' + i)), u = A(p.id + ':u' + i), ok = v !== null && Math.abs(v - r.v) / r.v <= r.tol, uo = unitOk(u, r.u);
    auto += li(ok && uo, `${r.lab} you wrote ${esc(A(p.id + ':v' + i)) || '—'} ${esc(u)} — ${ok ? 'value correct' : 'value does not match the schedule'}${uo ? '' : '; unit missing or wrong (units are required for the mark)'}`); });
  if (auto) o += `<h5>Marked for you</h5><ul>${auto}</ul>`;
  if (p.kw && p.kw.length) { const txt = Object.keys(S.a).filter(k => k.indexOf(p.id + ':') === 0).map(k => S.a[k]).join(' ').toLowerCase();
    o += `<h5>Key ideas: found in your answer?</h5><ul>${p.kw.map(k => li(k.slice(1).every(re => new RegExp(re, 'i').test(txt)), k[0])).join('')}</ul><small>A rough keyword gauge. It cannot judge whether your reasoning is correct, so use the criteria below to mark yourself honestly.</small>`; }
  return `<div class="pp-fb"><span class="pp-lab">${p.lab} · ${p.cmd}</span>${echo(p)}${o}<h5>Exemplar answer (based on the NZQA schedule)</h5><div class="mdl">${p.model}</div></div>`;
}
function score(q) { const t = i => S.tick[q.n + ':' + i], n = { a: 0, m: 0, e: 0 }; q.crit.forEach((x, i) => t(i) && n[x[0]]++); const a = n.a + n.m + n.e;
  return n.e >= 3 ? 8 : n.e >= 2 ? 7 : n.m >= 4 ? 6 : n.m >= 3 ? 5 : a >= 4 ? 4 : a >= 3 ? 3 : a >= 2 ? 2 : a >= 1 ? 1 : 0; }
const band = t => t >= 19 ? 'Excellence' : t >= 14 ? 'Merit' : t >= 8 ? 'Achieved' : 'Not Achieved';
function markHtml(q) { const L = { a: 'Achievement', m: 'Merit', e: 'Excellence' };
  return `<div class="pp-mark"><h3>Mark yourself against the NZQA schedule</h3><p>Tick only what is actually written in your answer. Ticking what you <i>meant</i> hides exactly what you need to fix.</p>${['a', 'm', 'e'].map(l => `<div class="lv">${L[l]}</div>${q.crit.map((x, i) => x[0] === l ? `<label><input type="checkbox" data-t="${q.n}:${i}" ${S.tick[q.n + ':' + i] ? 'checked' : ''}><span>${x[1]}</span></label>` : '').join('')}`).join('')}<div class="pp-score">Question ${q.n}: <span id="sc${q.n}">${CODE[score(q)]}</span> <small>(${score(q)}/8)</small></div></div>`; }
const markSection = q => `<section class="pp-sheet pp-marking"><span class="pp-lab">Marking · Question ${q.n}</span><h3>Your answers against the schedule</h3>${q.parts.map(fbHtml).join('')}${markHtml(q)}</section>`;

function introHtml() { const P = paper, tot = P.mins * 3;
  return `<div class="pp-head"><span class="pp-lab">NCEA Level 2 Chemistry · 91164 · 5 credits</span><h2>${P.title}</h2><p>Demonstrate understanding of bonding, structure, properties and energy changes. Sit it the way you would in the exam hall, then mark it properly.</p></div>
<section class="pp-sheet"><div class="pp-facts"><div><b>3</b>questions, all compulsory</div><div><b>24</b>marks: up to 8 per question</div><div><b>~${tot} min</b>suggested: about ${P.mins} min per question</div><div><b>Resource booklet</b>periodic table and formulae. <a href="https://www.nzqa.govt.nz/nqfdocs/ncea-resource/exams/2024/91164-exm-2024.pdf" target="_blank" rel="noopener">Open it</a> in a new tab</div></div>
<small class="pp-fine">The suggested time is a pacing guide, not the official limit. Check your exam timetable for your session length.</small></section>
<section class="pp-sheet"><span class="pp-lab">How this works</span><ol class="pp-steps"><li><b>One slide per question.</b> Answer each part in its box: draw Lewis structures and diagrams on the canvas, type explanations, and show working for calculations.</li><li><b>Nothing is checked while you work.</b> Hints and answers only appear when you submit at the end of the question.</li><li><b>Submit to mark.</b> Numbers and units are marked automatically, long answers get a keyword check, and you see the exemplar answer from the NZQA schedule.</li><li><b>Mark yourself.</b> Tick the real Achievement, Merit and Excellence criteria that your answer meets to get a score out of 8.</li><li><b>Results.</b> Your total and a revision list linked to the lessons that fix what you missed.</li></ol></section>
<section class="pp-sheet"><span class="pp-lab">Exam habits that cost marks</span><ul class="pp-steps"><li>Always show your working.</li><li>Include units on every numerical answer.</li><li>Be specific to the substance in the question.</li><li>Avoid early rounding and give final answers to 3 significant figures.</li></ul><table class="pp-tbl pp-bands"><tr><th>Not Achieved</th><th>Achieved</th><th>Merit</th><th>Excellence</th></tr><tr><td>0–7</td><td>8–13</td><td>14–18</td><td>19–24</td></tr></table></section>
<button class="pp-btn" data-go="1" type="button">Begin Question 1 →</button>`; }
function qHtml(q) { const sub = S.sub[q.n];
  return `<div class="pp-head"><span class="pp-lab">Question ${q.n} of 3 · up to 8 marks</span><h2>${q.topic}</h2></div>${q.parts.map(partHtml).join('')}<div class="pp-submit"><p>${sub ? 'Submitted. Your marking is below. You can edit your answers above and refresh it.' : 'Finished every part? Submit to see your marking, keyword checks and the exemplar answers for this question.'}</p><button class="pp-btn" id="subQ" type="button">${sub ? 'Refresh marking' : 'Submit question ' + q.n + ' for marking'}</button></div><div id="markSlot">${sub ? markSection(q) : ''}</div>`; }
function resHtml() { const Q = paper.Q, sc = Q.map(q => S.sub[q.n] ? score(q) : null), done = sc.filter(x => x !== null).length, tot = sc.reduce((a, b) => a + (b || 0), 0);
  const miss = {}; Q.forEach(q => S.sub[q.n] && q.crit.forEach((x, i) => { if (!S.tick[q.n + ':' + i]) { const l = TOPIC_LESSON[q.n][x[2]]; (miss[l] = miss[l] || []).push(x); } }));
  return `<div class="pp-head"><span class="pp-lab">Results</span><h2>${done ? tot + ' / 24 · ' + band(tot) : 'Nothing submitted yet'}</h2><p>${done < 3 ? 'Submit all three questions for the full picture. ' : ''}This is an estimate from your own marking, using the 2024 cut scores (Achieved 8, Merit 14, Excellence 19).</p></div><div class="pp-sum">${Q.map((q, i) => `<div class="pp-sheet"><span class="pp-lab">Question ${q.n}</span><b>${sc[i] === null ? '—' : CODE[sc[i]]}</b>${q.topic}</div>`).join('')}</div><section class="pp-sheet"><span class="pp-lab">Where to go next</span><h4>Criteria you did not tick, grouped by lesson</h4>${Object.keys(miss).length ? Object.keys(miss).map(l => `<div class="pp-rev"><div><b>${LES[l]}</b><br><small>${miss[l].length} missed: ${miss[l].slice(0, 3).map(x => x[1].replace(/<[^>]+>/g, '')).join('; ')}${miss[l].length > 3 ? '…' : ''}</small></div><button class="pp-btn ghost" data-les="${l}" type="button">Open lesson</button></div>`).join('') : '<p>Submit and self-mark a question to build your revision list.</p>'}</section><button class="pp-btn ghost" type="button" onclick="window.print()">Print answers and marking</button>`; }

/* ---------- slides ---------- */
const SL = ['intro', 1, 2, 3, 'res'];
let root;
const tabName = k => k === 'intro' ? 'Intro' : k === 'res' ? 'Results' : 'Q' + k;
function refreshTabs() { $$('.pp-tab', root).forEach((t, i) => { const k = SL[i]; t.textContent = tabName(k) + (typeof k === 'number' && S.sub[k] ? ' ✓' : ''); }); }
function show(i) { S.i = i; save(); const k = SL[i], q = paper.Q.find(x => x.n === k), body = $('.pp-body', root);
  $$('.pp-tab', root).forEach((t, j) => t.classList.toggle('on', j === i));
  body.innerHTML = `<div class="pp-in">${k === 'intro' ? introHtml() : q ? qHtml(q) : resHtml()}</div>`; body.scrollTop = 0;
  $('#ppPrev').disabled = i === 0; $('#ppNext').style.visibility = i === SL.length - 1 ? 'hidden' : ''; $('#ppCount').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(SL.length).padStart(2, '0'); wire(q); }
function ticks(q) { $$('[data-t]', root).forEach(c => c.onchange = () => { S.tick[c.dataset.t] = c.checked; save(); $('#sc' + q.n).textContent = CODE[score(q)]; $('.pp-score small', root).textContent = '(' + score(q) + '/8)'; }); }
function wire(q) { const b = $('.pp-body', root);
  $$('input[data-k],textarea[data-k]', b).forEach(el => el.oninput = () => A(el.dataset.k, el.value));
  $$('button[data-k]', b).forEach(el => el.onclick = () => { A(el.dataset.k, el.dataset.v); $$('button[data-k="' + el.dataset.k + '"]', b).forEach(x => x.classList.toggle('on', x === el)); });
  $$('.pp-cvw', b).forEach(canvas);
  $$('[data-go]', b).forEach(x => x.onclick = () => show(+x.dataset.go));
  $$('[data-les]', b).forEach(x => x.onclick = () => { close(); const c = $('.lesson-card[data-lesson="' + x.dataset.les + '"]'); c && c.click(); });
  const s = $('#subQ', b);
  if (s) s.onclick = () => { S.sub[q.n] = 1; save(); $('#markSlot').innerHTML = markSection(q); ticks(q); s.textContent = 'Refresh marking'; refreshTabs(); $('#markSlot').scrollIntoView({ behavior: 'smooth' }); };
  if (q) ticks(q); }

/* ---------- open / close ---------- */
function open(year) { paper = PAPERS[year]; if (!paper) return; key = 'af91164-paper-' + year;
  try { S = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { S = {}; } S.a = S.a || {}; S.d = S.d || {}; S.sub = S.sub || {}; S.tick = S.tick || {}; S.i = S.i || 0;
  root.innerHTML = `<div class="pp-bar"><button class="pp-btn ghost" id="ppBack" type="button">← 91164</button><b>${paper.title}</b><div class="pp-tabs">${SL.map((k, i) => `<button class="pp-tab" type="button">${tabName(k)}</button>`).join('')}</div><span class="pp-barlinks"><a href="https://www.nzqa.govt.nz/nqfdocs/ncea-resource/exams/2024/91164-res-2024.pdf" target="_blank" rel="noopener">Resource booklet</a><button class="pp-link" id="ppReset" type="button">Reset</button></span></div><div class="pp-body"></div><div class="pp-controls"><button class="pp-btn ghost" id="ppPrev" type="button">← Previous</button><span id="ppCount"></span><button class="pp-btn" id="ppNext" type="button">Next →</button></div>`;
  $('#ppBack').onclick = close; $('#ppPrev').onclick = () => show(S.i - 1); $('#ppNext').onclick = () => show(S.i + 1);
  $('#ppReset').onclick = () => { if (confirm('Clear all your answers and marking for this paper?')) { localStorage.removeItem(key); open(year); } };
  $$('.pp-tab', root).forEach((t, i) => t.onclick = () => show(i));
  root.classList.add('active'); root.setAttribute('aria-hidden', 'false'); document.body.classList.add('pp-open'); refreshTabs(); show(Math.min(S.i, SL.length - 1)); }
function close() { root.classList.remove('active'); root.setAttribute('aria-hidden', 'true'); document.body.classList.remove('pp-open'); }
function init() { root = document.createElement('section'); root.id = 'ppMode'; root.className = 'pp-mode'; root.setAttribute('aria-hidden', 'true'); document.body.appendChild(root);
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('.pp-go'); if (b) open(b.dataset.paper); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('active')) close(); }); }
if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();