import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const SNAPSHOT_PATTERN = /^account-response-(\d{2})-private\.json$/;
const CURRENT_MARKER = 'current-account-snapshot.txt';

function parseArgs(argv) {
  const args = {
    timeoutMs: 300000,
    headless: false,
    browserChannel: 'chrome',
    snapshotDir: path.resolve('data-account-specific-dynamic/snapshots'),
    profileDir: path.resolve('data-account-specific-dynamic/browser-profile')
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = () => {
      index += 1;
      if (index >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[index];
    };

    if (arg === '--start-url') args.startUrl = next();
    else if (arg === '--start-url-file') args.startUrlFile = path.resolve(next());
    else if (arg === '--snapshot-dir') args.snapshotDir = path.resolve(next());
    else if (arg === '--profile-dir') args.profileDir = path.resolve(next());
    else if (arg === '--output') args.output = path.resolve(next());
    else if (arg === '--url-pattern') args.urlPattern = next();
    else if (arg === '--browser-channel') args.browserChannel = next();
    else if (arg === '--timeout-ms') args.timeoutMs = Number(next());
    else if (arg === '--timeout-seconds') args.timeoutMs = Number(next()) * 1000;
    else if (arg === '--headless') args.headless = true;
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/capture-account-snapshot.mjs --start-url <url> [options]
  node scripts/capture-account-snapshot.mjs --start-url-file <path> [options]

Options:
  --start-url-file <path>    Read the start URL from a local text file.
  --url-pattern <regex>       Only inspect responses whose URL matches the regex.
  --browser-channel <name>    Browser channel to use; defaults to chrome.
  --timeout-seconds <number>  Seconds to wait for the account snapshot response.
  --snapshot-dir <path>       Directory for numbered account-response snapshots.
  --profile-dir <path>        Persistent Chromium profile directory.
  --output <path>             Save to an explicit JSON path instead of next number.
  --headless                  Run Chromium headlessly.

The browser profile is persistent. Log in once, then subsequent runs can reuse
the saved session as long as the site keeps it valid.`);
}

function getNextSnapshotPath(snapshotDir) {
  fs.mkdirSync(snapshotDir, { recursive: true });
  const records = fs.readdirSync(snapshotDir)
    .map(name => {
      const match = name.match(SNAPSHOT_PATTERN);
      if (!match) return null;
      const filePath = path.join(snapshotDir, name);
      return {
        name,
        filePath,
        number: Number(match[1]),
        modifiedMs: fs.statSync(filePath).mtimeMs
      };
    })
    .filter(Boolean)
    .filter(record => record.number >= 0 && record.number <= 99);

  const usedNumbers = new Set(records.map(record => record.number));
  let nextNumber;

  if (usedNumbers.size < 100) {
    const highestNumber = records.reduce(
      (max, record) => Math.max(max, record.number),
      -1
    );
    for (let offset = 1; offset <= 100; offset += 1) {
      const candidate = (highestNumber + offset) % 100;
      if (!usedNumbers.has(candidate)) {
        nextNumber = candidate;
        break;
      }
    }
  } else {
    const oldest = records
      .toSorted((left, right) => left.modifiedMs - right.modifiedMs)
      .at(0);
    nextNumber = oldest.number;
  }

  return path.join(
    snapshotDir,
    `account-response-${String(nextNumber).padStart(2, '0')}-private.json`
  );
}

function writeCurrentMarker(snapshotPath) {
  const snapshotName = path.basename(snapshotPath);
  if (!SNAPSHOT_PATTERN.test(snapshotName)) return;

  const markerPath = path.join(path.dirname(snapshotPath), CURRENT_MARKER);
  fs.writeFileSync(markerPath, `${snapshotName}\n`, 'utf8');
}

function looksLikeAccountSnapshot(value) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    Array.isArray(value.artifacts) &&
    Array.isArray(value.heroes) &&
    Array.isArray(value.heroTypes) &&
    (Array.isArray(value.relics) || Array.isArray(value.relicStones)) &&
    (Object.hasOwn(value, 'userId') || Object.hasOwn(value, 'name'))
  );
}

function withoutSensitiveUrl(message, startUrl) {
  if (!startUrl) return message;
  return message.split(startUrl).join('[start URL redacted]');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.startUrlFile) {
    args.startUrl = fs.readFileSync(args.startUrlFile, 'utf8').trim();
  }
  if (!args.startUrl) {
    throw new Error('Pass --start-url or --start-url-file with the account/optimizer page to open.');
  }
  if (!Number.isFinite(args.timeoutMs) || args.timeoutMs <= 0) {
    throw new Error('--timeout-ms/--timeout-seconds must be a positive number.');
  }

  let playwright;
  try {
    playwright = require('playwright');
  } catch (error) {
    throw new Error(
      `Could not load Playwright (${error.code || error.message}). ` +
      'Install it for this repo or run through scripts/update-account-snapshot.ps1, ' +
      'which can use the Codex bundled Node module path.'
    );
  }

  const urlPattern = args.urlPattern ? new RegExp(args.urlPattern) : null;
  const outputPath = args.output || getNextSnapshotPath(args.snapshotDir);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(args.profileDir, { recursive: true });

  const context = await playwright.chromium.launchPersistentContext(args.profileDir, {
    channel: args.browserChannel || undefined,
    headless: args.headless,
    viewport: { width: 1440, height: 1000 }
  });

  let settled = false;
  let captureError = null;
  let stopCapture = () => {};

  const close = async () => {
    try {
      await context.close();
    } catch {
      // Browser may already be closed by the user.
    }
  };

  const capture = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timed out after ${Math.round(args.timeoutMs / 1000)} seconds waiting for an account snapshot response.`));
    }, args.timeoutMs);
    stopCapture = () => {
      settled = true;
      clearTimeout(timer);
    };

    context.on('response', async response => {
      if (settled) return;
      const responseUrl = response.url();
      if (urlPattern && !urlPattern.test(responseUrl)) return;

      const contentType = response.headers()['content-type'] || '';
      if (!contentType.includes('json') && !urlPattern) return;

      try {
        const payload = await response.json();
        if (!looksLikeAccountSnapshot(payload)) return;

        settled = true;
        clearTimeout(timer);
        fs.writeFileSync(outputPath, `${JSON.stringify(payload)}\n`, 'utf8');
        writeCurrentMarker(outputPath);
        console.log('Captured account snapshot response.');
        console.log(`SNAPSHOT_PATH=${outputPath}`);
        resolve(outputPath);
      } catch (error) {
        captureError = error;
      }
    });
  });

  try {
    const page = context.pages()[0] || await context.newPage();
    console.log('Opening start URL.');
    try {
      await page.goto(args.startUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (error) {
      throw new Error(`Failed to open start URL: ${withoutSensitiveUrl(error.message, args.startUrl)}`);
    }
    console.log('Waiting for an account-shaped JSON response. If login is required, complete it in the opened browser.');
    await capture;
  } finally {
    stopCapture();
    await close();
  }

  if (captureError && !settled) {
    console.warn(`Last response parse error before exit: ${captureError.message}`);
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
