const fs = require('fs');
const path = require('path');

const root = __dirname;
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'Relic Inventory', 'relic-inventory-sanitized.json'), 'utf8').replace(/^\uFEFF/, ''));
const html = fs.readFileSync(path.join(root, 'HH Relic Guidance', 'gemstones', 'tier-list-dom-snippet.txt'), 'utf8');

const normalize = (name) => name.replaceAll("'", '').replace(/\s+/g, ' ').toLowerCase();
const tiers = {};
for (const match of html.matchAll(/<div class="tier-list-column">(SS|S|A|B|C)<\/div><div class="bespoke-tierlist-icons">([\s\S]*?)<\/div>/g)) {
  for (const image of match[2].matchAll(/<img alt="([^"]+)"/g)) tiers[normalize(image[1])] = match[1];
}

const grouped = new Map();
for (const gem of inventory.gemstones) {
  const tier = tiers[normalize(gem.name)] || 'UNMATCHED';
  const key = `${tier}|${gem.name}`;
  const row = grouped.get(key) || { tier, name: gem.name, rarity: gem.rarity, shapeId: gem.shapeId, total: 0, available: 0, socketed: 0, locations: [] };
  row.total++;
  row[gem.socketed ? 'socketed' : 'available']++;
  if (gem.socketed) row.locations.push({ gemstoneId: gem.id, ...gem.socketedIn });
  grouped.set(key, row);
}

const order = { SS: 0, S: 1, A: 2, B: 3, C: 4, UNMATCHED: 5 };
const rows = [...grouped.values()].sort((a, b) => order[a.tier] - order[b.tier] || b.available - a.available || a.name.localeCompare(b.name));
const aggregate = {};
for (const tier of Object.keys(order)) {
  const matches = rows.filter((row) => row.tier === tier);
  aggregate[tier] = {
    copies: matches.reduce((sum, row) => sum + row.total, 0),
    available: matches.reduce((sum, row) => sum + row.available, 0),
    socketed: matches.reduce((sum, row) => sum + row.socketed, 0),
    types: matches.length,
  };
}

console.log(JSON.stringify({ aggregate, rows }, null, 2));
