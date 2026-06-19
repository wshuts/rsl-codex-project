await (async () => {
  const viewport = document.querySelector("cdk-virtual-scroll-viewport");

  if (!viewport) {
    throw new Error("Virtual relic viewport was not found.");
  }

  const wait = milliseconds =>
    new Promise(resolve => setTimeout(resolve, milliseconds));

  const clean = value => value?.replace(/\s+/g, " ").trim() || null;

  const fileId = source => {
    if (!source) return null;
    const match = new URL(source).pathname.match(/\/([^/]+)\.png$/i);
    return match ? match[1] : null;
  };

  const originalScrollTop = viewport.scrollTop;
  viewport.scrollTop = 0;
  viewport.dispatchEvent(new Event("scroll"));
  await wait(500);

  const initialRows = [...viewport.querySelectorAll(".relic_row")];
  if (initialRows.length < 2) {
    throw new Error("Not enough relic rows to determine row spacing.");
  }

  const initialTops = initialRows
    .map(row => row.getBoundingClientRect().top)
    .sort((a, b) => a - b);

  const pitches = initialTops
    .slice(1)
    .map((top, index) => top - initialTops[index])
    .filter(value => value > 20);

  const rowPitch =
    pitches.reduce((sum, value) => sum + value, 0) / pitches.length;

  const viewportRect = viewport.getBoundingClientRect();
  const baseline = Math.min(
    ...initialRows.map(
      row =>
        viewport.scrollTop +
        row.getBoundingClientRect().top -
        viewportRect.top
    )
  );

  const parseRow = row => {
    const relic = row.querySelector(".relic");
    const levelText = clean(row.querySelector(".relic_level")?.textContent);
    const levelMatch = levelText?.match(/^(.*?)\s*-\s*Level\s+(\d+)$/i);
    const rarityClass = relic
      ? [...relic.classList].find(name =>
          /^relic_(rare|epic|legendary|mythical)$/i.test(name)
        )
      : null;

    const relicImage = row.querySelector("img.relic_image");
    const wearerImage = row.querySelector("img.relic_used_by");
    const absoluteTop =
      viewport.scrollTop +
      row.getBoundingClientRect().top -
      viewport.getBoundingClientRect().top;

    return {
      index: Math.round((absoluteTop - baseline) / rowPitch),
      name: levelMatch ? levelMatch[1] : null,
      relicTypeId: fileId(relicImage?.src),
      rarity: rarityClass ? rarityClass.replace("relic_", "") : null,
      rank: row.querySelectorAll(".relic_stars_normal").length,
      level: levelMatch ? Number(levelMatch[2]) : null,
      description: clean(
        row.querySelector(".relic_description")?.textContent
      ),
      stats: [...row.querySelectorAll(".relic_stat_row")].map(
        statRow => ({
          name: clean(statRow.children[0]?.textContent),
          value: clean(statRow.children[1]?.textContent)
        })
      ),
      gemstones: [
        ...row.querySelectorAll("img.relic_gemstone_icon")
      ].map((image, slot) => {
        const id = fileId(image.src);
        return {
          slot: slot + 1,
          id,
          empty: id?.startsWith("empty_") || false,
          name: image.alt || null,
          description: image.title || null
        };
      }),
      equipped: Boolean(wearerImage),
      wearerId: fileId(wearerImage?.src),
      wearerImage: wearerImage?.src || null
    };
  };

  const isComplete = record =>
    Number.isInteger(record.index) &&
    record.index >= 0 &&
    Boolean(record.name) &&
    Boolean(record.relicTypeId) &&
    Boolean(record.rarity) &&
    record.rank > 0 &&
    Number.isInteger(record.level) &&
    record.stats.length > 0;

  const visibleSignature = () => {
    const completeRecords = [
      ...viewport.querySelectorAll(".relic_row")
    ]
      .map(parseRow)
      .filter(isComplete)
      .sort((a, b) => a.index - b.index);

    return {
      count: completeRecords.length,
      signature: completeRecords
        .map(
          record =>
            `${record.index}:${record.relicTypeId}:` +
            `${record.rarity}:${record.rank}:${record.level}:` +
            `${record.name}`
        )
        .join("|")
    };
  };

  const waitForStableRows = async () => {
    let previous = null;
    let stableChecks = 0;
    const deadline = performance.now() + 5000;

    while (performance.now() < deadline) {
      await wait(100);
      const current = visibleSignature();

      if (
        current.count > 0 &&
        previous &&
        current.signature === previous.signature
      ) {
        stableChecks += 1;
        if (stableChecks >= 2) return;
      } else {
        stableChecks = 0;
      }

      previous = current;
    }

    console.warn(
      "Some buffered rows did not stabilize; collecting the complete rows " +
        "and continuing."
    );
  };

  const records = new Map();
  const conflicts = [];

  const collectVisible = () => {
    for (const row of viewport.querySelectorAll(".relic_row")) {
      const record = parseRow(row);
      if (!isComplete(record)) continue;

      const previous = records.get(record.index);
      if (
        previous &&
        JSON.stringify(previous) !== JSON.stringify(record)
      ) {
        conflicts.push({
          index: record.index,
          previous,
          replacement: record
        });
        continue;
      }

      records.set(record.index, record);
    }
  };

  const maximumScroll = viewport.scrollHeight - viewport.clientHeight;
  const step = Math.max(200, Math.floor(viewport.clientHeight * 0.65));
  const positions = [];

  for (let position = 0; position < maximumScroll; position += step) {
    positions.push(position);
  }
  positions.push(maximumScroll);

  console.log(
    `Collecting relics across ${positions.length} scroll positions...`
  );

  for (let index = 0; index < positions.length; index++) {
    viewport.scrollTop = positions[index];
    viewport.dispatchEvent(new Event("scroll"));
    await waitForStableRows();
    collectVisible();

    if (index % 5 === 0 || index === positions.length - 1) {
      console.log(
        `Progress: ${index + 1}/${positions.length}; ` +
          `${records.size} relic rows captured`
      );
    }
  }

  viewport.scrollTop = originalScrollTop;
  viewport.dispatchEvent(new Event("scroll"));

  const relics = [...records.values()].sort((a, b) => a.index - b.index);
  const lastIndex = relics.at(-1)?.index ?? -1;
  const missingIndices = Array.from(
    { length: lastIndex + 1 },
    (_, index) => index
  ).filter(index => !records.has(index));

  const report = {
    capturedAt: new Date().toISOString(),
    page: location.href,
    filtersWarning:
      "This inventory reflects the filters and sorting active during capture.",
    viewport: {
      scrollHeight: viewport.scrollHeight,
      clientHeight: viewport.clientHeight,
      rowPitch,
      baseline,
      positionsVisited: positions.length
    },
    result: {
      relicCount: relics.length,
      firstIndex: relics[0]?.index ?? null,
      lastIndex,
      missingIndices,
      conflicts: conflicts.length
    },
    conflictDetails: conflicts,
    relics
  };

  const output = JSON.stringify(report, null, 2);
  const blob = new Blob([output], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  link.href = url;
  link.download = `hellhades-relic-inventory-${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);

  console.log(report);
  console.log(`Downloaded ${relics.length} relic records as JSON.`);

  return report;
})();
