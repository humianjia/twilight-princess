import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const englishRoutes = [
  "index.html",
  "chapters/index.html",
  "reference/index.html",
  "intro/index.html",
  "characters/index.html",
  "epilogue/index.html",
  "appendix/index.html",
  "about/index.html",
  "privacy/index.html",
  "contact/index.html",
  "terms/index.html",
  "copyright/index.html",
  ...Array.from({ length: 9 }, (_, index) => `chapters/chapter-${index + 1}/index.html`),
];

const replacements = [
  [
    '<small>A bilingual fan guide with chapter notes and reference materials.</small>',
    '<small>An English-first fan guide with a switchable Chinese edition.</small>',
  ],
  [
    "Twilight Princess Chronicle is a fan-made bilingual guide site with chapter walkthroughs, reference pages, and locally hosted media needed for reading.",
    "Twilight Princess Chronicle is a fan-made bilingual guide with chapter walkthroughs, reference material, and locally hosted screenshots for easier reading.",
  ],
  ["Open source file", "View source file"],
  ["Page Notes", "Source Notes"],
  ["Page Snapshot", "Source Snapshot"],
  ["Series Pages", "Related Pages"],
  ["Reading Order", "Continue Reading"],
  ["Includes an in-page contents block", "Includes an in-page contents list"],
  ["No in-page contents block", "No in-page contents list"],
  ["All chapters", "View all chapters"],
  ["All reference pages", "View all reference pages"],
  ['<a class="lang-pill" href="zh/index.html">涓枃</a>', '<a class="lang-pill" href="zh/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/intro/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/intro/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/characters/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/characters/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/epilogue/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/epilogue/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/appendix/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/appendix/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/reference/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/reference/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/chapters/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/chapters/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/about/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/about/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/privacy/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/privacy/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/contact/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/contact/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/terms/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/terms/index.html">中文</a>'],
  ['<a class="lang-pill" href="../zh/copyright/index.html">涓枃</a>', '<a class="lang-pill" href="../zh/copyright/index.html">中文</a>'],
  ['<a class="lang-pill" href="../../zh/chapters/chapter-1/index.html">涓枃</a>', '<a class="lang-pill" href="../../zh/chapters/chapter-1/index.html">中文</a>'],
  ['<a class="lang-pill" href="../../zh/chapters/chapter-2/index.html">涓枃</a>', '<a class="lang-pill" href="../../zh/chapters/chapter-2/index.html">中文</a>'],
  ['<a class="lang-pill" href="../../zh/chapters/chapter-3/index.html">涓枃</a>', '<a class="lang-pill" href="../../zh/chapters/chapter-3/index.html">中文</a>'],
  ['<a class="lang-pill" href="../../zh/chapters/chapter-4/index.html">涓枃</a>', '<a class="lang-pill" href="../../zh/chapters/chapter-4/index.html">中文</a>'],
  ['<a class="lang-pill" href="../../zh/chapters/chapter-5/index.html">涓枃</a>', '<a class="lang-pill" href="../../zh/chapters/chapter-5/index.html">中文</a>'],
  ['<a class="lang-pill" href="../../zh/chapters/chapter-6/index.html">涓枃</a>', '<a class="lang-pill" href="../../zh/chapters/chapter-6/index.html">中文</a>'],
  ['<a class="lang-pill" href="../../zh/chapters/chapter-7/index.html">涓枃</a>', '<a class="lang-pill" href="../../zh/chapters/chapter-7/index.html">中文</a>'],
  ['<a class="lang-pill" href="../../zh/chapters/chapter-8/index.html">涓枃</a>', '<a class="lang-pill" href="../../zh/chapters/chapter-8/index.html">中文</a>'],
  ['<a class="lang-pill" href="../../zh/chapters/chapter-9/index.html">涓枃</a>', '<a class="lang-pill" href="../../zh/chapters/chapter-9/index.html">中文</a>'],
];

const routeSpecific = [
  {
    route: "index.html",
    replacements: [
      ["Bilingual Mirror Edition", "English Guide"],
      ["Open reference pages", "Browse reference pages"],
      ["What This Version Keeps", "What This Site Covers"],
      [
        "This site keeps the current Twilight Princess guide structure only. It turns the collected pages into a cleaner bilingual walkthrough site while preserving the long-form article flow and image support.",
        "This version focuses on a clean English reading experience built from the current project archive. The goal is not to mirror every original sentence, but to turn the collected material into a more readable walkthrough site with stable navigation and preserved local media.",
      ],
      [
        "The root site defaults to English, and every page can switch directly to its Chinese counterpart under /zh/.",
        "English is the default at the site root, and every page can switch directly to its Chinese counterpart under /zh/.",
      ],
      ["Site Scope", "Guide At a Glance"],
      ["9 story-route pages", "9 main-story chapters"],
      ["4 supporting pages", "4 supporting reference pages"],
      ["231 copied local assets", "231 locally hosted assets"],
      ["English root site plus Chinese mirrored routes", "English root site with mirrored Chinese routes"],
      ["Main Story Route", "Main Walkthrough"],
      ["See all chapters", "View all chapters"],
      ["Supporting Pages", "Reference Library"],
      ["See all reference pages", "View all reference pages"],
      ["View source file", "Browse reference pages"],
      ["Read chapter", "Read chapter"],
      ["Read page", "Read page"],
    ],
  },
  {
    route: "chapters/index.html",
    replacements: [
      ["Read page", "Read chapter"],
    ],
  },
  {
    route: "reference/index.html",
    replacements: [
      ["Open page", "Read page"],
    ],
  },
];

function applyReplacements(text, pairs) {
  let next = text;
  for (const [from, to] of pairs) {
    next = next.split(from).join(to);
  }
  return next;
}

for (const route of englishRoutes) {
  const file = path.join(root, route);
  let html = await fs.readFile(file, "utf8");
  html = applyReplacements(html, replacements);
  const specific = routeSpecific.find((entry) => entry.route === route);
  if (specific) {
    html = applyReplacements(html, specific.replacements);
  }
  if (route.startsWith("chapters/chapter-")) {
    html = html.split("涓枃").join("中文");
  }
  await fs.writeFile(file, html, "utf8");
  console.log(`Refreshed ${route}`);
}
