import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('./glyph-dashboard.html', import.meta.url), 'utf8');
const dataScript = fs.readFileSync(new URL('./generated/glyph-dashboard-data.js', import.meta.url), 'utf8');
const context = { window: {} };
vm.createContext(context);
new vm.Script(dataScript, { filename: 'glyph-dashboard-data.js' }).runInContext(context);

const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
if (inlineScripts.length !== 1) throw new Error(`Expected one inline application script, found ${inlineScripts.length}`);
new vm.Script(inlineScripts[0], { filename: 'glyph-dashboard-inline.js' });

const requiredIds = ['search', 'status', 'missing', 'substat', 'slot', 'rank', 'rarity', 'sort', 'reset', 'results', 'drawer', 'detail'];
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) throw new Error(`Missing control #${id}`);
}
if (!html.includes('const SLOT_ORDER=[5,1,6,3,2,4,7,8,9]')) throw new Error('In-game gear slot order changed');
if (!html.includes("const SUBSTAT_FILTERS=['HP','HP%','ATK','ATK%','DEF','DEF%','SPD','RES','ACC','C.RATE','C.DMG']")) {
  throw new Error('Substat filter list is missing or changed');
}
if (!html.includes("function statName(s){return s.kind>=1&&s.kind<=3&&!s.absolute?STATS[s.kind]+'%':STATS[s.kind]}")) {
  throw new Error('Flat/percent sub-stat labels are not distinguished');
}
if (!html.includes("state.substat==='all'||p.substats.some(s=>statName(s)===state.substat)")) {
  throw new Error('Substat filter is not applied to dashboard results');
}
if (!html.includes('HP, ATK, and DEF percent rolls are marked with %')) {
  throw new Error('Sub-stat audit text does not explain percent-roll labels');
}

const payload = context.window.GLYPH_DATA;
const pieces = payload.pieces;
const expectedSpeedTunedHeroIds = [14940, 16279, 18270, 19828, 10289];
const isEligible = stat => stat.kind !== 7 && stat.kind !== 8;
const isProtectedSpeed = (piece, stat) => piece.speedTuned && stat.kind === 4;
const isMissing = (piece, stat) => isEligible(stat) && !isProtectedSpeed(piece, stat) && !(stat.enhancement > 0);
const needs = pieces.filter(piece => piece.substats.some(stat => isMissing(piece, stat)));
const missing = pieces.reduce((sum, piece) => sum + piece.substats.filter(stat => isMissing(piece, stat)).length, 0);
const protectedSpeed = pieces.reduce((sum, piece) => sum + piece.substats.filter(stat => isProtectedSpeed(piece, stat)).length, 0);
const artifactIds = new Set(pieces.map(piece => piece.artifactId));

if (pieces.length === 0) throw new Error('Dashboard contains no equipped pieces');
if (needs.length > pieces.length) throw new Error('Incomplete-piece count exceeds total pieces');
if (missing < needs.length) throw new Error('Missing-glyph count is inconsistent with incomplete pieces');
if (JSON.stringify(payload.speedTunedHeroIds) !== JSON.stringify(expectedSpeedTunedHeroIds)) throw new Error('Speed-tuned hero IDs changed');
for (const heroId of expectedSpeedTunedHeroIds) {
  if (!pieces.some(piece => piece.heroId === heroId && piece.speedTuned)) throw new Error(`Speed-tuned hero ${heroId} is missing`);
}
if (artifactIds.size !== pieces.length) throw new Error('Artifact IDs are not unique');
if (pieces.some(piece => piece.substats.length !== 4)) throw new Error('A piece does not have exactly four sub-stats');

console.log(JSON.stringify({
  javascript: 'valid',
  controls: requiredIds.length,
  pieces: pieces.length,
  needsGlyphs: needs.length,
  complete: pieces.length - needs.length,
  missingEligibleGlyphs: missing,
  protectedSpeedSubstats: protectedSpeed,
  uniqueArtifactIds: artifactIds.size
}, null, 2));
