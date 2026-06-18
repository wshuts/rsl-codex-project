/*
 * HellHades client-side DOM extractor for Aspect of Siroth gemstones.
 *
 * Run this in the browser DevTools console after the champion's relic
 * recommendations have rendered. The extracted JSON is printed and copied
 * to the clipboard. Duplicate gemstone slots are intentionally preserved.
 */
(() => {
  const targetRelic = "Aspect of Siroth";
  const clean = (value) => value?.replace(/\s+/g, " ").trim() || null;

  const champion = clean(
    document.querySelector("h1")?.textContent ||
      document.querySelector('meta[property="og:title"]')?.content ||
      document.title
  );

  const relicCards = [...document.querySelectorAll(".raid-relic")];
  const card = relicCards.find(
    (candidate) =>
      clean(candidate.querySelector(".raid-relic-title")?.textContent) ===
      targetRelic
  );

  if (!card) {
    throw new Error(
      `${targetRelic} was not found. Confirm that the relic recommendations are visible and fully rendered.`
    );
  }

  const gemstones = [
    ...card.querySelectorAll(".raid-relic-gemstone[data-gem-id]"),
  ].map((gemstone, index) => ({
    slot: index + 1,
    id: gemstone.dataset.gemId || null,
    name: clean(gemstone.dataset.gemName || gemstone.title),
    description: clean(gemstone.dataset.gemDescription),
    image: gemstone.querySelector("img")?.src || null,
  }));

  const result = {
    champion,
    relic: targetRelic,
    page: location.href,
    extractedAt: new Date().toISOString(),
    gemstones,
  };

  const json = JSON.stringify(result, null, 2);
  console.table(gemstones);
  console.log(json);
  copy(json);
  return result;
})();
