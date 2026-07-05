import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    input: null,
    output: null,
    format: 'markdown'
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      index += 1;
      if (index >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[index];
    };

    if (arg === '--input') args.input = path.resolve(next());
    else if (arg === '--output') args.output = path.resolve(next());
    else if (arg === '--format') args.format = next();
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/parse-hh-app-hero-dom.mjs --input <html.txt> [--output <path>] [--format markdown|json]

This parser handles copied HellHades Optimizer roster DOM snippets shaped like
<app-hero>...</app-hero>. It extracts current visible build data for ChatGPT
curation: champion, level, affinity, marker, artifact sets, stats, books,
masteries, blessing asset id, optimizer build lock state, role, and Arena rating.`);
}

function textBetween(value, pattern) {
  const match = value.match(pattern);
  return match ? normalizeText(match[1]) : '';
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleAttributes(value, className) {
  const results = [];
  const pattern = new RegExp(`<img\\b(?=[^>]*class=["'][^"']*${className}[^"']*["'])(?=[^>]*title=["']([^"']+)["'])[^>]*>`, 'gi');
  let match;
  while ((match = pattern.exec(value)) !== null) results.push(normalizeText(match[1]));
  return results;
}

function classSuffix(value, classPrefix) {
  const pattern = new RegExp(`${classPrefix}([a-zA-Z0-9_-]+)`);
  const match = value.match(pattern);
  return match ? match[1] : '';
}

function heroRarity(value) {
  const match = value.match(/\bhero_(common|uncommon|rare|epic|legendary|mythical)\b/i);
  return match ? match[1].toLowerCase() : '';
}

function countClass(value, className) {
  const pattern = new RegExp(`class=["'][^"']*${className}[^"']*["']`, 'g');
  return [...value.matchAll(pattern)].length;
}

function statValue(block, label) {
  const pattern = new RegExp(`<div[^>]*>\\s*${label}\\s*</div>\\s*<div[^>]*>\\s*([^<]+)\\s*</div>`, 'i');
  return textBetween(block, pattern);
}

function parseHeroBlock(block) {
  const roleDescription = textBetween(block, /<div[^>]*class=["']role-description["'][^>]*>([\s\S]*?)<\/div>/i);
  const roleMatch = roleDescription.match(/^(.+?)\s*-\s*Arena\s*:\s*([0-9.]+)/i);
  const blessingAsset = textBetween(block, /class=["'][^"']*hero_blessing[^"']*["'][^>]*src=["'][^"']*\/([0-9]+)_small\.png["']/i);

  return {
    champion: textBetween(block, /<h3[^>]*>([\s\S]*?)<\/h3>/i),
    level: statValue(block, 'Level') || textBetween(block, /class=["']hero_level["'][^>]*>([^<]+)</i),
    affinity: classSuffix(block, 'hero_affinity_'),
    marker: textBetween(block, /class=["'][^"']*hero_marker[^"']*["'][^>]*src=["'][^"']*\/Tags\/([^."']+)/i),
    rarity: heroRarity(block),
    ascensionStars: countClass(block, 'hero_stars_ascended'),
    awakenedStars: countClass(block, 'hero_stars_awakened'),
    blessingAssetId: blessingAsset,
    artifactSets: titleAttributes(block, 'hero-artifact-icon'),
    role: roleMatch ? normalizeText(roleMatch[1]) : roleDescription,
    arenaRating: roleMatch ? roleMatch[2] : '',
    stats: {
      hp: statValue(block, 'HP'),
      atk: statValue(block, 'ATK'),
      def: statValue(block, 'DEF'),
      spd: statValue(block, 'SPD'),
      cRate: statValue(block, 'C\\.RATE'),
      cDmg: statValue(block, 'C\\.DMG'),
      res: statValue(block, 'Res'),
      acc: statValue(block, 'Acc'),
      eHp: statValue(block, 'eHP')
    },
    books: statValue(block, 'Books'),
    mastery: statValue(block, 'Mastery'),
    optimizerBuildLocked: /<mat-icon[^>]*>\s*lock\s*<\/mat-icon>/i.test(block),
    optimizerBuildLockIcon: textBetween(block, /<button[^>]*class=["'][^"']*hero_lock[^"']*["'][\s\S]*?<mat-icon[^>]*>\s*([^<]+)\s*<\/mat-icon>/i)
  };
}

function parseHeroes(html) {
  const blocks = [];
  const pattern = /<app-hero\b[\s\S]*?<\/app-hero>/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) blocks.push(match[0]);

  if (blocks.length === 0 && /<app-hero\b/i.test(html)) blocks.push(html);
  return blocks.map(parseHeroBlock);
}

function mdTable(headers, rows) {
  const escapeCell = value => String(value ?? '')
    .replaceAll('|', '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();

  return [
    `| ${headers.map(escapeCell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(escapeCell).join(' | ')} |`)
  ].join('\n');
}

function renderMarkdown(heroes) {
  return mdTable(
    ['Champion', 'Lvl', 'Affinity', 'Marker', 'Sets', 'HP', 'DEF', 'SPD', 'RES', 'ACC', 'C.RATE', 'C.DMG', 'eHP', 'Books', 'Mastery', 'Awaken', 'Blessing asset', 'Arena', 'Optimizer Build Locked'],
    heroes.map(hero => [
      hero.champion,
      hero.level,
      hero.affinity,
      hero.marker,
      hero.artifactSets.join(', '),
      hero.stats.hp,
      hero.stats.def,
      hero.stats.spd,
      hero.stats.res,
      hero.stats.acc,
      hero.stats.cRate,
      hero.stats.cDmg,
      hero.stats.eHp,
      hero.books,
      hero.mastery,
      hero.awakenedStars,
      hero.blessingAssetId,
      hero.arenaRating,
      hero.optimizerBuildLocked ? 'yes' : 'no'
    ])
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.input) throw new Error('Pass --input <html.txt>.');
  if (!['markdown', 'json'].includes(args.format)) throw new Error('--format must be markdown or json.');

  const heroes = parseHeroes(fs.readFileSync(args.input, 'utf8'));
  const output = args.format === 'json'
    ? `${JSON.stringify(heroes, null, 2)}\n`
    : `${renderMarkdown(heroes)}\n`;

  if (args.output) {
    fs.mkdirSync(path.dirname(args.output), { recursive: true });
    fs.writeFileSync(args.output, output, 'utf8');
  } else {
    process.stdout.write(output);
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
