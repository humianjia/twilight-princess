import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import {
  copyTwpSourceArchiveAssets,
  loadTwpSourceArchive,
  pageDefinitions,
  relativeUrl,
  rewriteArchiveMarkup,
  sourceArchiveAssetPrefix,
  sourceArchiveMeta,
  stripTags,
  summaryFromMarkup,
  toLanguagePath,
} from "./twp-source-archive.mjs";

const workspaceRoot = process.cwd();
const siteRoot = workspaceRoot;
const assetRoot = path.join(siteRoot, "assets");
const translationCachePath = path.join(
  workspaceRoot,
  "sources",
  "twp_translation_cache.json",
);
const siteConfigPath = path.join(workspaceRoot, "site.config.json");

const defaultSiteConfig = {
  siteUrl: "",
  contactEmail: "",
  shortName: "TP Chronicle",
  themeColor: "#173227",
  backgroundColor: "#f3ead8",
  adsTxtEntries: [],
};

const loadSiteConfig = async () => {
  try {
    const raw = await fs.readFile(siteConfigPath, "utf8");
    const parsed = JSON.parse(raw);
    return { ...defaultSiteConfig, ...parsed };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return defaultSiteConfig;
    }
    throw error;
  }
};

const siteConfig = await loadSiteConfig();

const archive = await loadTwpSourceArchive(workspaceRoot);
const archivePages = archive.pages;

const navItems = [
  { key: "home", en: "Home", zh: "\u9996\u9875", href: "index.html" },
  {
    key: "chapters",
    en: "Walkthrough",
    zh: "\u5267\u60c5\u6d41\u7a0b",
    href: "chapters/index.html",
  },
  {
    key: "reference",
    en: "Reference",
    zh: "\u8d44\u6599\u7d22\u5f15",
    href: "reference/index.html",
  },
  {
    key: "about",
    en: "About",
    zh: "\u5173\u4e8e",
    href: "about/index.html",
  },
  {
    key: "contact",
    en: "Contact",
    zh: "\u8054\u7cfb",
    href: "contact/index.html",
  },
];

const policyPages = [
  {
    slug: "about",
    href: "about/index.html",
    navKey: "about",
    enTitle: "About This Site",
    zhTitle: "\u5173\u4e8e\u672c\u7ad9",
    enDescription:
      "Learn what Twilight Princess Chronicle covers, how the guide is structured, and how the project is maintained.",
    zhDescription:
      "\u4e86\u89e3\u8fd9\u4e2a Twilight Princess \u653b\u7565\u7ad9\u7684\u5185\u5bb9\u7ed3\u6784\u3001\u66f4\u65b0\u65b9\u5f0f\u548c\u7ef4\u62a4\u539f\u5219\u3002",
  },
  {
    slug: "privacy",
    href: "privacy/index.html",
    navKey: null,
    enTitle: "Privacy Policy",
    zhTitle: "\u9690\u79c1\u653f\u7b56",
    enDescription:
      "Read how Twilight Princess Chronicle may handle analytics, advertising, cookies, and contact messages after launch.",
    zhDescription:
      "\u672c\u7ad9\u5173\u4e8e\u5206\u6790\u3001\u5e7f\u544a\u3001Cookie \u548c\u8054\u7cfb\u63d0\u4ea4\u7684\u9690\u79c1\u653f\u7b56\u3002",
  },
  {
    slug: "contact",
    href: "contact/index.html",
    navKey: "contact",
    enTitle: "Contact",
    zhTitle: "\u8054\u7cfb\u65b9\u5f0f",
    enDescription:
      "Use the contact page for corrections, attribution updates, rights questions, and partnership inquiries.",
    zhDescription:
      "\u7528\u4e8e\u63d0\u4ea4\u52d8\u8bef\u3001\u53cd\u9988\u3001\u6388\u6743\u95ee\u9898\u548c\u5408\u4f5c\u8bf7\u6c42\u7684\u8054\u7cfb\u65b9\u5f0f\u3002",
  },
  {
    slug: "terms",
    href: "terms/index.html",
    navKey: null,
    enTitle: "Terms of Use",
    zhTitle: "\u4f7f\u7528\u6761\u6b3e",
    enDescription:
      "Review the terms for using Twilight Princess Chronicle, its guide content, and its external links.",
    zhDescription:
      "\u89c4\u8303\u672c\u7ad9\u653b\u7565\u5185\u5bb9\u3001\u8bbf\u95ee\u884c\u4e3a\u4e0e\u5bf9\u5916\u94fe\u63a5\u4f7f\u7528\u7684\u6761\u6b3e\u3002",
  },
  {
    slug: "copyright",
    href: "copyright/index.html",
    navKey: null,
    enTitle: "Copyright and Attribution",
    zhTitle: "\u7248\u6743\u4e0e\u6765\u6e90\u8bf4\u660e",
    enDescription:
      "Find attribution, ownership, and removal-request information for screenshots, text, and referenced game material.",
    zhDescription:
      "\u672c\u7ad9\u5bf9\u6587\u5b57\u3001\u622a\u56fe\u3001\u6e38\u620f\u76f8\u5173\u7d20\u6750\u7684\u6765\u6e90\u8bf4\u660e\u4e0e\u6743\u5229\u8054\u7cfb\u65b9\u5f0f\u3002",
  },
];

const policyPageMap = new Map(policyPages.map((page) => [page.slug, page]));

const translationDictionary = new Map([
  ["\u9ece\u660e\u516c\u4e3b", "Twilight Princess"],
  ["\u9ece\u660e\u4e4b\u65f6", "Twilight Time"],
  ["\u585e\u5c14\u8fbe\u4f20\u8bf4", "The Legend of Zelda"],
  ["\u6d77\u62c9\u5c14", "Hyrule"],
  ["\u6797\u514b", "Link"],
  ["\u585e\u5c14\u8fbe", "Zelda"],
  ["\u7c73\u5fb7\u5a1c", "Midna"],
  ["\u8d5e\u7279", "Zant"],
  ["\u5965\u4e1c\u6751", "Ordon Village"],
  ["\u6cd5\u9686\u68ee\u6797", "Faron Woods"],
  ["\u5c81\u62c9\u57ce", "Hyrule Castle"],
  ["\u5361\u5361\u91cc\u79d1\u6751", "Kakariko Village"],
  ["\u6b7b\u4ea1\u5c71", "Death Mountain"],
  ["\u96ea\u5c71", "Snowpeak"],
  ["\u65f6\u4e4b\u795e\u6bbf", "Temple of Time"],
  ["\u5929\u7a7a\u4e4b\u57ce", "City in the Sky"],
  ["\u9ec4\u660f\u5bab\u6bbf", "Palace of Twilight"],
  ["\u955c\u4e4b\u53e4\u5893", "Mirror Chamber"],
  ["\u72fc", "wolf"],
  ["\u9ed1\u6697", "darkness"],
  ["\u5149\u4e4b\u7cbe\u7075", "Light Spirit"],
  ["\u5fc3\u4e4b\u788e\u7247", "Heart Piece"],
  ["\u9b3c\u9b42\u4e4b\u9b42", "Poe Soul"],
  ["\u91d1\u8272\u5c0f\u866b", "Golden Bug"],
  ["\u7a7a\u74f6\u5b50", "empty bottle"],
  ["\u76fe", "shield"],
  ["\u5251", "sword"],
  ["\u5f13\u7bad", "bow"],
  ["\u94c1\u978b", "Iron Boots"],
  ["\u56de\u65cb\u9556", "Boomerang"],
  ["\u94a9\u722a", "Clawshot"],
  ["\u65cb\u8f6c\u9640\u87ba\u4eea", "Spinner"],
  ["\u65f6\u4e4b\u6743\u6756", "Dominion Rod"],
  ["\u5927\u5730\u4e4b\u6c11", "The Children of the Mountain"],
  ["\u6700\u540e\u7684\u5f71\u4e4b\u788e\u7247", "The Final Fused Shadow"],
  ["\u6b7b\u8005\u4e4b\u6c99\u6f20", "Desert of the Dead"],
  ["\u96ea\u5c71\uff01\u517d\u4eba\uff01\u7231\uff01", "Snow! Beasts! Love!"],
  ["\u4f2a\u738b", "The False King"],
]);

const manualEnglishSummaries = {
  intro:
    "A lead-in article for the Twilight Princess walkthrough series, covering naming choices, project scope, and the tone of the adventure before the route begins.",
  characters:
    "A cast overview page describing the major characters of Twilight Princess and how they fit into the story's emotional and political arcs.",
  "chapter-1":
    "Link's everyday life in Ordon Village gives way to the first Twilight crisis, the rescue of the village children, and the opening path into the Forest Temple.",
  "chapter-2":
    "The Eldin arc pushes the route through Kakariko Village, Death Mountain, and the Goron Mines while the world grows more dangerous and more mythic.",
  "chapter-3":
    "The Zora and Lake Hylia storyline expands the world map, restores Lanayru, and carries the adventure toward the third shadow and a major turning point.",
  "chapter-4":
    "The desert campaign introduces Arbiter's Grounds, mirror lore, and the long transition from fused shadows to the Mirror of Twilight quest.",
  "chapter-5":
    "The Snowpeak storyline mixes travel, mansion exploration, and one of the game's most personal dungeon arcs as the mirror hunt continues.",
  "chapter-6":
    "The Temple of Time route and the Dominion Rod chapter pull the story deeper into ancient Hyrule and the strange machinery of its forgotten age.",
  "chapter-7":
    "The City in the Sky chapter turns the mirror search upward, linking the Oocca storyline with a wind-swept dungeon and the final mirror shard.",
  "chapter-8":
    "The Palace of Twilight chapter closes in on Midna's homeland and sets up the endgame with a direct confrontation against the powers behind the invasion.",
  "chapter-9":
    "The final Hyrule Castle chapter covers the last ascent, the closing boss sequence, and the decisive end of the Twilight Princess campaign.",
  epilogue:
    "A closing article covering the end of the story, the restored balance between worlds, and the emotional aftermath of the final battle.",
  appendix:
    "A large reference appendix for secret tips, bottles, upgrades, collectibles, maps, and side content that sit outside the main story route.",
};

const manualEnglishTitles = Object.fromEntries(
  pageDefinitions.map((page) => [page.slug, page.englishTitle]),
);

const manualEnglishLabels = Object.fromEntries(
  pageDefinitions.map((page) => [page.slug, page.englishLabel]),
);

const hasCjk = (value) => /[\u3400-\u9fff]/u.test(value);

const normalizeTerms = (text) => {
  let normalized = text;
  for (const [source, replacement] of translationDictionary.entries()) {
    normalized = normalized.replaceAll(source, replacement);
  }
  return normalized;
};

const ensureDir = async (dir) => fs.mkdir(dir, { recursive: true });
const removeIfExists = async (target) =>
  fs.rm(target, { recursive: true, force: true });

const html = (strings, ...values) =>
  strings.reduce((out, part, index) => out + part + (values[index] ?? ""), "");

const listItems = (items, className = "bullet-list") =>
  `<ul class="${className}">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const normalizeSiteUrl = (value) => {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized ? normalized.replace(/\/+$/, "") : "";
};

const absoluteSiteUrl = normalizeSiteUrl(siteConfig.siteUrl);
const publicContactEmail =
  typeof siteConfig.contactEmail === "string" ? siteConfig.contactEmail.trim() : "";
const manifestShortName =
  typeof siteConfig.shortName === "string" && siteConfig.shortName.trim()
    ? siteConfig.shortName.trim()
    : defaultSiteConfig.shortName;
const manifestThemeColor =
  typeof siteConfig.themeColor === "string" && siteConfig.themeColor.trim()
    ? siteConfig.themeColor.trim()
    : defaultSiteConfig.themeColor;
const manifestBackgroundColor =
  typeof siteConfig.backgroundColor === "string" && siteConfig.backgroundColor.trim()
    ? siteConfig.backgroundColor.trim()
    : defaultSiteConfig.backgroundColor;
const adsTxtEntries = Array.isArray(siteConfig.adsTxtEntries)
  ? siteConfig.adsTxtEntries
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter(Boolean)
  : [];

const withSiteUrl = (routePath, lang) =>
  absoluteSiteUrl
    ? `${absoluteSiteUrl}/${toLanguagePath(routePath, lang).replace(/\\/g, "/")}`
    : null;

const footerPolicyLinks = (lang, currentPath) =>
  policyPages
    .map((page) => {
      const href = relativeUrl(
        toLanguagePath(currentPath, lang),
        toLanguagePath(page.href, lang),
      );
      const label = lang === "en" ? page.enTitle : page.zhTitle;
      return `<a href="${href}">${label}</a>`;
    })
    .join("");

const requestTranslation = async (text) =>
  new Promise((resolve, reject) => {
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) +
      "&langpair=zh-CN|en";

    https
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          try {
            const payload = JSON.parse(data);
            resolve(payload.responseData?.translatedText || text);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });

const translationCache = new Map();

const loadTranslationCache = async () => {
  try {
    const raw = await fs.readFile(translationCachePath, "utf8");
    const parsed = JSON.parse(raw);
    for (const [key, value] of Object.entries(parsed)) {
      translationCache.set(key, value);
    }
  } catch {
    // Cache is optional.
  }
};

const saveTranslationCache = async () => {
  await ensureDir(path.dirname(translationCachePath));
  await fs.writeFile(
    translationCachePath,
    JSON.stringify(Object.fromEntries(translationCache), null, 2),
    "utf8",
  );
};

const translateText = async (text) => {
  const trimmed = text.trim();
  if (!trimmed || !hasCjk(trimmed)) {
    return normalizeTerms(text);
  }
  if (translationCache.has(trimmed)) {
    return translationCache.get(trimmed);
  }

  let translated = trimmed;
  try {
    translated = await requestTranslation(normalizeTerms(trimmed));
  } catch {
    translated = normalizeTerms(trimmed);
  }

  translated = normalizeTerms(translated)
    .replace(/Princess Dawn/gi, "Twilight Princess")
    .replace(/Hilal/gi, "Hyrule")
    .replace(/Rusul/gi, "Rusl")
    .replace(/Odong/gi, "Ordon")
    .replace(/The\. Legend\. Of\. Zelda\./gi, "The Legend of Zelda")
    .replace(/\s+/g, " ")
    .trim();

  translationCache.set(trimmed, translated);
  return translated;
};

const translateMarkup = async (markup) => {
  const parts = markup.split(/(<[^>]+>)/g).filter(Boolean);
  const out = [];

  for (const part of parts) {
    if (part.startsWith("<")) {
      out.push(part);
      continue;
    }

    if (!hasCjk(part)) {
      out.push(normalizeTerms(part));
      continue;
    }

    const leading = part.match(/^\s*/u)?.[0] ?? "";
    const trailing = part.match(/\s*$/u)?.[0] ?? "";
    const middle = part.trim();
    if (middle.length <= 1) {
      out.push(part);
      continue;
    }
    const translated = await translateText(middle);
    out.push(`${leading}${translated}${trailing}`);
  }

  return out.join("");
};

const buildLanguageSwitch = (lang, currentRoutePath) => {
  const otherLang = lang === "en" ? "zh" : "en";
  const currentLabel = lang === "en" ? "EN" : "中文";
  const otherLabel = lang === "en" ? "中文" : "EN";
  return `<div class="lang-switch"><span class="lang-pill" aria-current="true">${currentLabel}</span><a class="lang-pill" href="${relativeUrl(
    toLanguagePath(currentRoutePath, lang),
    toLanguagePath(currentRoutePath, otherLang),
  )}">${otherLabel}</a></div>`;
};

const navMarkup = (lang, currentKey, currentPath) =>
  navItems
    .map((item) => {
      const href = relativeUrl(
        toLanguagePath(currentPath, lang),
        toLanguagePath(item.href, lang),
      );
      const label = lang === "en" ? item.en : item.zh;
      const active = item.key === currentKey ? ' aria-current="page"' : "";
      return `<a href="${href}"${active}>${label}</a>`;
    })
    .join("");

const pageShell = ({
  lang,
  currentKey,
  currentPath,
  pageTitle,
  description,
  bodyClass = "",
  content,
}) => {
  const siteTitle =
    lang === "en"
      ? sourceArchiveMeta.englishTitle
      : sourceArchiveMeta.chineseTitle;
  const siteTagline =
    lang === "en"
      ? sourceArchiveMeta.englishTagline
      : sourceArchiveMeta.chineseTagline;
  const rootStyle = relativeUrl(toLanguagePath(currentPath, lang), "assets/styles.css");
  const faviconSvgHref = relativeUrl(toLanguagePath(currentPath, lang), "favicon.svg");
  const faviconIcoHref = relativeUrl(toLanguagePath(currentPath, lang), "favicon.ico");
  const favicon32Href = relativeUrl(toLanguagePath(currentPath, lang), "favicon-32x32.png");
  const favicon48Href = relativeUrl(toLanguagePath(currentPath, lang), "favicon-48x48.png");
  const appleTouchHref = relativeUrl(
    toLanguagePath(currentPath, lang),
    "apple-touch-icon.png",
  );
  const manifestHref = relativeUrl(toLanguagePath(currentPath, lang), "site.webmanifest");
  const homeHref = relativeUrl(
    toLanguagePath(currentPath, lang),
    toLanguagePath("index.html", lang),
  );
  const canonicalHref = withSiteUrl(currentPath, lang);
  const alternateHref = absoluteSiteUrl
    ? lang === "en"
      ? withSiteUrl(currentPath, "zh")
      : withSiteUrl(currentPath, "en")
    : null;
  const xDefaultHref = absoluteSiteUrl ? withSiteUrl("index.html", "en") : null;

  return html`<!doctype html>
    <html lang="${lang === "en" ? "en" : "zh-CN"}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${pageTitle}</title>
        <meta name="description" content="${escapeHtml(description)}">
        <meta name="robots" content="index,follow,max-image-preview:large">
        <meta name="theme-color" content="${manifestThemeColor}">
        <meta name="application-name" content="${siteTitle}">
        <link rel="icon" href="${faviconIcoHref}" sizes="any">
        <link rel="icon" type="image/svg+xml" href="${faviconSvgHref}">
        <link rel="icon" type="image/png" sizes="32x32" href="${favicon32Href}">
        <link rel="icon" type="image/png" sizes="48x48" href="${favicon48Href}">
        <link rel="apple-touch-icon" href="${appleTouchHref}">
        <link rel="manifest" href="${manifestHref}">
        ${canonicalHref ? `<link rel="canonical" href="${canonicalHref}">` : ""}
        ${alternateHref ? `<link rel="alternate" hreflang="${lang === "en" ? "zh-CN" : "en"}" href="${alternateHref}">` : ""}
        ${canonicalHref ? `<link rel="alternate" hreflang="${lang === "en" ? "en" : "zh-CN"}" href="${canonicalHref}">` : ""}
        ${xDefaultHref ? `<link rel="alternate" hreflang="x-default" href="${xDefaultHref}">` : ""}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Shippori+Mincho:wght@400;500;700&family=Yuji+Syuku&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="${rootStyle}">
      </head>
      <body class="${bodyClass}">
        <div class="site-shell">
          <header class="topbar">
            <a class="brand" href="${homeHref}">
              <span class="brand-mark">TP</span>
              <span>
                <strong>${siteTitle}</strong>
                <small>${siteTagline}</small>
              </span>
            </a>
            <div class="topbar-actions">
              <nav class="nav-links">${navMarkup(lang, currentKey, currentPath)}</nav>
              ${buildLanguageSwitch(lang, currentPath)}
            </div>
          </header>
          ${content}
          <footer class="site-footer">
            <p>${lang === "en"
              ? "Twilight Princess Chronicle is an editorial guide with chapter walkthroughs, strategy notes, and reference pages for easier reading."
              : "Twilight Princess Chronicle 是一个中英双语攻略站，提供章节流程、路线提示与参考资料，方便连续阅读与查阅。"}</p>
            <div class="footer-links">${footerPolicyLinks(lang, currentPath)}</div>
            ${publicContactEmail
              ? `<p>${lang === "en"
                ? `Contact: <a href="mailto:${publicContactEmail}">${publicContactEmail}</a>`
                : `联系邮箱：<a href="mailto:${publicContactEmail}">${publicContactEmail}</a>`}</p>`
              : ""}
          </footer>
        </div>
      </body>
    </html>`;
};

const archiveLabel = (page, lang) => {
  if (lang === "en") {
    return manualEnglishLabels[page.slug];
  }
  if (page.kind === "chapter") {
    const chapterNumber = page.slug.replace("chapter-", "");
    return `\u7b2c ${chapterNumber} \u7ae0`;
  }
  if (page.slug === "intro") {
    return "\u5f15\u5b50";
  }
  if (page.slug === "characters") {
    return "\u89d2\u8272";
  }
  if (page.slug === "epilogue") {
    return "\u7ec8\u7ae0";
  }
  return "\u9644\u5f55";
};

const groupPages = (pages) => ({
  chapters: pages.filter((page) => page.section === "chapter"),
  reference: pages.filter((page) => page.section === "reference"),
});

const renderArchiveCards = (pages, lang, currentPath, pageContentBySlug) =>
  pages
    .map((page) => {
      const pageContent = pageContentBySlug[page.slug][lang];
      const href = relativeUrl(
        toLanguagePath(currentPath, lang),
        toLanguagePath(page.routePath, lang),
      );
      const imagePath = relativeUrl(
        toLanguagePath(currentPath, lang),
        `${sourceArchiveAssetPrefix}/${page.heroImageRef}`,
      );
      return html`
        <article class="card archive-card">
          <div class="card-visual source-thumb">
            <img src="${imagePath}" alt="${escapeHtml(pageContent.heading)} image">
          </div>
          <div class="card-copy">
            <p class="eyebrow">${archiveLabel(page, lang)}</p>
            <h3>${pageContent.heading}</h3>
            <p>${pageContent.summary}</p>
            <a class="text-link" href="${href}">${lang === "en"
              ? page.section === "chapter"
                ? "Read chapter"
                : "Read page"
              : "\u67e5\u770b\u9875\u9762"}</a>
          </div>
        </article>
      `;
    })
    .join("");

const renderSeriesList = (pages, lang, currentPath, currentSlug, pageContentBySlug) =>
  `<ul class="archive-page-list">${pages
    .map((page) => {
      const href = relativeUrl(
        toLanguagePath(currentPath, lang),
        toLanguagePath(page.routePath, lang),
      );
      const current = page.slug === currentSlug ? ' aria-current="page"' : "";
      return `<li><a href="${href}"${current}>${pageContentBySlug[page.slug][lang].heading}</a></li>`;
    })
    .join("")}</ul>`;

const buildPageContentBySlug = async () => {
  const routeMap = {
    en: new Map(pageDefinitions.map((page) => [page.sourceFile, page.routePath])),
    zh: new Map(
      pageDefinitions.map((page) => [
        page.sourceFile,
        toLanguagePath(page.routePath, "zh"),
      ]),
    ),
  };

  const contentBySlug = {};

  for (const page of archivePages) {
    const chineseHeading = page.heading;
    const chineseTitle = page.title;
    const chineseContentHtml = rewriteArchiveMarkup(
      page.rawContentHtml,
      toLanguagePath(page.routePath, "zh"),
      routeMap.zh,
    );
    const chineseTocHtml = page.rawTocHtml
      ? rewriteArchiveMarkup(
          page.rawTocHtml,
          toLanguagePath(page.routePath, "zh"),
          routeMap.zh,
        )
      : "";
    const chineseSummary = summaryFromMarkup(chineseContentHtml, 160);

    const englishHeading = manualEnglishTitles[page.slug];
    const englishTitle = manualEnglishTitles[page.slug];
    const englishContentTranslated = await translateMarkup(page.rawContentHtml);
    const englishTocTranslated = page.rawTocHtml
      ? await translateMarkup(page.rawTocHtml)
      : "";
    const englishContentHtml = rewriteArchiveMarkup(
      englishContentTranslated,
      page.routePath,
      routeMap.en,
    );
    const englishTocHtml = englishTocTranslated
      ? rewriteArchiveMarkup(englishTocTranslated, page.routePath, routeMap.en)
      : "";
    const englishSummary = manualEnglishSummaries[page.slug]
      ?? summaryFromMarkup(englishContentHtml, 180);

    contentBySlug[page.slug] = {
      en: {
        heading: englishHeading,
        title: englishTitle,
        summary: englishSummary,
        contentHtml: englishContentHtml,
        tocHtml: englishTocHtml,
      },
      zh: {
        heading: chineseHeading,
        title: chineseTitle,
        summary: chineseSummary,
        contentHtml: chineseContentHtml,
        tocHtml: chineseTocHtml,
      },
    };
  }

  return contentBySlug;
};

const renderHomePage = (lang, grouped, pageContentBySlug) => {
  const currentPath = "index.html";
  const chapters = grouped.chapters;
  const references = grouped.reference;
  const body = html`
    <main>
      <section class="hero hero-home">
        <div class="hero-copy">
          <p class="eyebrow">${lang === "en" ? "English Guide" : "双语攻略"}</p>
          <h1>${lang === "en" ? sourceArchiveMeta.englishTitle : sourceArchiveMeta.chineseTitle}</h1>
          <p class="lede">${lang === "en" ? sourceArchiveMeta.englishDescription : sourceArchiveMeta.chineseDescription}</p>
          <div class="hero-actions">
            <a class="button" href="${relativeUrl(
              toLanguagePath(currentPath, lang),
              toLanguagePath("chapters/index.html", lang),
            )}">${lang === "en" ? "Start the walkthrough" : "\u5f00\u59cb\u6d41\u7a0b"}</a>
            <a class="button button-secondary" href="${relativeUrl(
              toLanguagePath(currentPath, lang),
              toLanguagePath("reference/index.html", lang),
            )}">${lang === "en" ? "Browse reference pages" : "\u67e5\u770b\u8d44\u6599\u9875"}</a>
          </div>
        </div>
        <div class="hero-art hero-source-art">
          <img src="${relativeUrl(
            toLanguagePath(currentPath, lang),
            `${sourceArchiveAssetPrefix}/images/2011/08/zelda_tp_cover-545x700.jpg`,
          )}" alt="Twilight Princess cover">
        </div>
      </section>
      <section class="content-grid intro-grid">
        <article class="panel prose">
          <h2>${lang === "en" ? "What This Site Covers" : "这个站点提供什么"}</h2>
          <p>${lang === "en"
            ? "This edition focuses on readable walkthrough prose, stable navigation, and bilingual browsing. The goal is to make the main route, side references, and planning notes easier to use across the full campaign."
            : "这个版本更强调清晰的攻略文字、稳定的站内导航和中英双语切换，让主线流程、补充资料与路线提示都更方便查阅。"}</p>
          <p>${lang === "en"
            ? "English is the default at the site root, and every page can switch directly to its Chinese counterpart under /zh/."
            : "\u6839\u76ee\u5f55\u9ed8\u8ba4\u5c55\u793a\u82f1\u6587\uff0c\u6bcf\u4e00\u9875\u90fd\u53ef\u4ee5\u76f4\u63a5\u5207\u6362\u5230 /zh/ \u4e0b\u7684\u4e2d\u6587\u7248\u672c\u3002"}</p>
        </article>
        <article class="panel keyline">
          <h2>${lang === "en" ? "Guide At a Glance" : "\u7ad9\u70b9\u8303\u56f4"}</h2>
          ${listItems([
            lang === "en"
              ? `${chapters.length} main-story chapters`
              : `${chapters.length} \u4e2a\u5267\u60c5\u6d41\u7a0b\u9875`,
            lang === "en"
              ? `${references.length} supporting reference pages`
              : `${references.length} \u4e2a\u8d44\u6599\u4e0e\u9644\u5f55\u9875`,
            lang === "en"
              ? `${archive.copiedRefs.length} supporting media items`
              : `${archive.copiedRefs.length} 个配套图像与媒体资源`,
            lang === "en"
              ? "English root site plus Chinese companion routes"
              : "英文根目录 + 中文 zh 对应路由",
          ])}
        </article>
      </section>
      <section class="section-head">
        <div>
          <p class="eyebrow">${lang === "en" ? "Walkthrough" : "\u5267\u60c5\u6d41\u7a0b"}</p>
          <h2>${lang === "en" ? "Main Walkthrough" : "\u4e3b\u7ebf\u653b\u7565"}</h2>
        </div>
        <a class="text-link" href="${relativeUrl(
          toLanguagePath(currentPath, lang),
          toLanguagePath("chapters/index.html", lang),
        )}">${lang === "en" ? "View all chapters" : "\u67e5\u770b\u5168\u90e8\u7ae0\u8282"}</a>
      </section>
      <section class="card-grid">
        ${renderArchiveCards(chapters.slice(0, 6), lang, currentPath, pageContentBySlug)}
      </section>
      <section class="section-head">
        <div>
          <p class="eyebrow">${lang === "en" ? "Reference" : "\u53c2\u8003\u8d44\u6599"}</p>
          <h2>${lang === "en" ? "Reference Library" : "\u89d2\u8272\u3001\u5f15\u5b50\u4e0e\u9644\u5f55"}</h2>
        </div>
        <a class="text-link" href="${relativeUrl(
          toLanguagePath(currentPath, lang),
          toLanguagePath("reference/index.html", lang),
        )}">${lang === "en" ? "View all reference pages" : "\u67e5\u770b\u5168\u90e8\u8d44\u6599\u9875"}</a>
      </section>
      <section class="card-grid">
        ${renderArchiveCards(references, lang, currentPath, pageContentBySlug)}
      </section>
    </main>
  `;

  return pageShell({
    lang,
    currentKey: "home",
    currentPath,
    pageTitle:
      lang === "en"
        ? `Twilight Princess Guide | ${sourceArchiveMeta.englishTitle}`
        : sourceArchiveMeta.chineseTitle,
    description:
      lang === "en"
        ? sourceArchiveMeta.englishDescription
        : sourceArchiveMeta.chineseDescription,
    bodyClass: "page-home",
    content: body,
  });
};

const renderSectionIndex = (lang, sectionKey, grouped, pageContentBySlug) => {
  const isChapter = sectionKey === "chapters";
  const currentPath = `${sectionKey}/index.html`;
  const pages = isChapter ? grouped.chapters : grouped.reference;
  const body = html`
    <main>
      <section class="hero hero-page" style="--accent:${isChapter ? "#6e9d75" : "#587c70"}; --accent-soft:${isChapter ? "#173227" : "#16332e"};">
        <div class="hero-copy">
          <p class="eyebrow">${lang === "en"
            ? isChapter
              ? "Story Route"
              : "Reference Pages"
            : isChapter
              ? "\u5267\u60c5\u7ae0\u8282"
              : "\u8d44\u6599\u9875"}</p>
          <h1>${lang === "en"
            ? isChapter
              ? "Walkthrough Chapters"
              : "Reference Library"
            : isChapter
              ? "\u5267\u60c5\u6d41\u7a0b\u7d22\u5f15"
              : "\u8d44\u6599\u9875\u7d22\u5f15"}</h1>
          <p class="lede">${lang === "en"
            ? isChapter
              ? "A chapter-by-chapter path from Ordon Village to the final confrontation in Hyrule Castle."
              : "The non-route pages: introduction, character notes, epilogue, and the large reference appendix."
            : isChapter
              ? "\u4ece\u5965\u4e1c\u6751\u5230\u6700\u540e\u6d77\u62c9\u5c14\u57ce\u5821\u51b3\u6218\u7684\u7ae0\u8282\u6d41\u7a0b\u3002"
              : "\u6536\u5f55\u5f15\u5b50\u3001\u89d2\u8272\u9875\u3001\u7ec8\u7ae0\u548c\u5927\u578b\u9644\u5f55\u7b49\u975e\u4e3b\u7ebf\u8d44\u6599\u9875\u3002"}</p>
        </div>
        <div class="hero-art hero-source-art">
          <img src="${relativeUrl(
            toLanguagePath(currentPath, lang),
            `${sourceArchiveAssetPrefix}/${pages[0].heroImageRef}`,
          )}" alt="Section cover">
        </div>
      </section>
      <section class="card-grid">
        ${renderArchiveCards(pages, lang, currentPath, pageContentBySlug)}
      </section>
    </main>
  `;

  return pageShell({
    lang,
    currentKey: sectionKey,
    currentPath,
    pageTitle:
      lang === "en"
        ? isChapter
          ? `Walkthrough Chapters | ${sourceArchiveMeta.englishTitle}`
          : `Reference Library | ${sourceArchiveMeta.englishTitle}`
        : isChapter
          ? "\u5267\u60c5\u6d41\u7a0b"
          : "\u8d44\u6599\u7d22\u5f15",
    description:
      lang === "en"
        ? isChapter
          ? "Browse the full Twilight Princess walkthrough chapter by chapter, from Ordon Village to the final battle at Hyrule Castle."
          : "Explore supporting Twilight Princess reference pages, including the story introduction, character guide, epilogue, and appendix."
        : isChapter
          ? "\u82f1\u6587\u4e3b\u7ad9 + \u4e2d\u6587\u5207\u6362\u7684\u5267\u60c5\u6d41\u7a0b\u7d22\u5f15\u3002"
          : "\u53ef\u4ee5\u5728\u4e2d\u82f1\u4e4b\u95f4\u5207\u6362\u7684 Twilight Princess \u8d44\u6599\u9875\u3002",
    bodyClass: "page-list",
    content: body,
  });
};

const renderDetailPage = (lang, page, pageContentBySlug, grouped) => {
  const currentPath = page.routePath;
  const pageContent = pageContentBySlug[page.slug][lang];
  const currentLanguagePath = toLanguagePath(currentPath, lang);
  const heroImage = relativeUrl(
    currentLanguagePath,
    `${sourceArchiveAssetPrefix}/${page.heroImageRef}`,
  );
  const groupedPages = page.section === "chapter" ? grouped.chapters : grouped.reference;
  const pageIndex = groupedPages.findIndex((entry) => entry.slug === page.slug);
  const prev = groupedPages[pageIndex - 1];
  const next = groupedPages[pageIndex + 1];
  const visualRefCount = page.localRefs.filter((ref) => ref.startsWith("images/")).length;
  const secondaryAction = next
    ? {
        href: relativeUrl(currentLanguagePath, toLanguagePath(next.routePath, lang)),
        label:
          lang === "en"
            ? page.section === "chapter"
              ? "Next chapter"
              : "Next page"
            : page.section === "chapter"
              ? "下一章"
              : "下一页",
      }
    : prev
      ? {
          href: relativeUrl(currentLanguagePath, toLanguagePath(prev.routePath, lang)),
          label:
            lang === "en"
              ? page.section === "chapter"
                ? "Previous chapter"
                : "Previous page"
              : page.section === "chapter"
                ? "上一章"
                : "上一页",
        }
      : null;

  const body = html`
    <main>
      <section class="hero hero-page" style="--accent:#6e9d75; --accent-soft:#173227;">
        <div class="hero-copy">
          <p class="eyebrow">${archiveLabel(page, lang)}</p>
          <h1>${pageContent.heading}</h1>
          <p class="lede">${pageContent.summary}</p>
          <div class="hero-actions">
            <a class="button" href="${relativeUrl(
              currentLanguagePath,
              toLanguagePath(
                page.section === "chapter" ? "chapters/index.html" : "reference/index.html",
                lang,
              ),
            )}">${lang === "en"
              ? page.section === "chapter"
                ? "View all chapters"
                : "View all reference pages"
              : page.section === "chapter"
                ? "\u67e5\u770b\u5168\u90e8\u7ae0\u8282"
                : "\u67e5\u770b\u5168\u90e8\u8d44\u6599\u9875"}</a>
            ${secondaryAction
              ? `<a class="button button-secondary" href="${secondaryAction.href}">${secondaryAction.label}</a>`
              : ""}
          </div>
        </div>
        <div class="hero-art hero-source-art">
          <img src="${heroImage}" alt="${escapeHtml(pageContent.heading)} image">
        </div>
      </section>
      <section class="content-grid">
        <article class="panel prose">
          <h2>${lang === "en" ? "Reading Guide" : "阅读建议"}</h2>
          <p>${lang === "en"
            ? page.section === "chapter"
              ? "Use this page as a route-first guide: start with the overview, then scan later sections for dungeon reminders, key item checks, and optional cleanup notes."
              : "Use this page as a compact reference entry. Read straight through for context, or jump by section when you only need a quick reminder."
            : page.section === "chapter"
              ? "这页更适合按流程阅读：先看概要，再根据后面的段落回查迷宫提醒、关键道具和可选补完提示。"
              : "这页适合作为快速参考资料使用。你可以顺着看完整篇，也可以按标题跳到需要的部分。"}</p>
          <p>${lang === "en"
            ? "Use the sidebar to keep your place in the series order, and switch languages at any time if you want the paired Chinese or English version."
            : "你可以通过侧边栏保持章节顺序，也可以随时切换中英文版本，对照阅读同一页面。"}</p>
        </article>
        <article class="panel keyline">
          <h2>${lang === "en" ? "Page Snapshot" : "页面概览"}</h2>
          ${listItems([
            lang === "en"
              ? page.section === "chapter"
                ? `Chapter ${pageIndex + 1} of ${groupedPages.length} in the main walkthrough`
                : `Reference page ${pageIndex + 1} of ${groupedPages.length}`
              : page.section === "chapter"
                ? `主线流程第 ${pageIndex + 1} / ${groupedPages.length} 页`
                : `参考资料第 ${pageIndex + 1} / ${groupedPages.length} 页`,
            lang === "en"
              ? `${visualRefCount} visual reference images`
              : `${visualRefCount} 张配套参考图片`,
            lang === "en"
              ? page.rawTocHtml
                ? "Includes a section contents list"
                : "Continuous reading flow"
              : page.rawTocHtml
                ? "包含页内目录"
                : "连续阅读版式",
            lang === "en"
              ? "Paired Chinese or English version available"
              : "可切换对应的中英文版本",
          ])}
        </article>
      </section>
      <section class="archive-layout">
        <aside class="archive-sidebar">
          <article class="panel">
            <h2>${lang === "en" ? "Related Pages" : "\u7cfb\u5217\u9875\u9762"}</h2>
            ${renderSeriesList(groupedPages, lang, currentPath, page.slug, pageContentBySlug)}
          </article>
          ${pageContent.tocHtml ? `<article class="panel source-toc-panel"><h2>${lang === "en" ? "Contents" : "\u76ee\u5f55"}</h2>${pageContent.tocHtml}</article>` : ""}
        </aside>
        <article class="panel source-prose">
          ${pageContent.contentHtml}
        </article>
      </section>
      <section class="panel timeline-panel">
        <div class="timeline-copy">
          <h2>${lang === "en" ? "Continue Reading" : "\u9605\u8bfb\u987a\u5e8f"}</h2>
          <p>${lang === "en"
            ? "This bilingual build keeps a stable reading order so you can move through the Twilight Princess material in a consistent sequence."
            : "\u8fd9\u5957\u53cc\u8bed\u7ad9\u4fdd\u6301\u7a33\u5b9a\u7684\u9605\u8bfb\u987a\u5e8f\uff0c\u4fbf\u4e8e\u4f60\u6309\u4e00\u81f4\u7684\u8282\u594f\u6d4f\u89c8 Twilight Princess \u76f8\u5173\u5185\u5bb9\u3002"}</p>
        </div>
        <div class="pager">
          ${prev
            ? `<a class="pager-link" href="${relativeUrl(currentLanguagePath, toLanguagePath(prev.routePath, lang))}">${lang === "en" ? "Previous" : "\u4e0a\u4e00\u9875"}: ${pageContentBySlug[prev.slug][lang].heading}</a>`
            : `<span class="pager-link disabled">${lang === "en" ? "Start of section" : "\u5df2\u5230\u672c\u7ec4\u8d77\u70b9"}</span>`}
          ${next
            ? `<a class="pager-link" href="${relativeUrl(currentLanguagePath, toLanguagePath(next.routePath, lang))}">${lang === "en" ? "Next" : "\u4e0b\u4e00\u9875"}: ${pageContentBySlug[next.slug][lang].heading}</a>`
            : `<span class="pager-link disabled">${lang === "en" ? "End of section" : "\u5df2\u5230\u672c\u7ec4\u7ed3\u5c3e"}</span>`}
        </div>
      </section>
    </main>
  `;

  return pageShell({
    lang,
    currentKey: page.section === "chapter" ? "chapters" : "reference",
    currentPath,
    pageTitle: `${pageContent.title} | ${lang === "en" ? sourceArchiveMeta.englishTitle : sourceArchiveMeta.chineseTitle}`,
    description: pageContent.summary,
    bodyClass: "page-detail page-source",
    content: body,
  });
};

const renderPolicyPage = (lang, page) => {
  const currentPath = page.href;

  const policyBodies = {
    about: {
      en: html`
        <main>
          <section class="hero hero-page" style="--accent:#5f856b; --accent-soft:#153128;">
            <div class="hero-copy">
              <p class="eyebrow">Site Overview</p>
              <h1>About This Site</h1>
              <p class="lede">Twilight Princess Chronicle is an English-first fan guide built to make the game's main route, supporting references, and archived screenshots easier to browse in one place.</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">TP</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>What The Site Includes</h2>
              ${listItems([
                "Chapter-by-chapter walkthrough coverage for the full main story route.",
                "Reference pages for story setup, characters, ending notes, and optional cleanup material.",
                "English-first navigation with direct Chinese counterparts for the current site structure.",
                "Locally hosted screenshots and imported media used to support reading and route context.",
              ])}
            </article>
            <article class="panel keyline">
              <h2>Editorial Approach</h2>
              <p>The site is maintained as a fan reference project rather than an official publisher resource. Its purpose is to organize walkthrough material clearly, improve readability, and keep the current archive usable as a structured guide.</p>
              <p>Pages may be revised over time for wording, consistency, source attribution, or navigation. If a page needs correction or a source note needs updating, the site owner may edit or remove the affected material.</p>
            </article>
          </section>
        </main>
      `,
      zh: html`
        <main>
          <section class="hero hero-page" style="--accent:#5f856b; --accent-soft:#153128;">
            <div class="hero-copy">
              <p class="eyebrow">\u7ad9\u70b9\u8bf4\u660e</p>
              <h1>\u5173\u4e8e\u672c\u7ad9</h1>
              <p class="lede">\u8fd9\u4e2a\u9879\u76ee\u628a Twilight Princess \u653b\u7565\u5185\u5bb9\u6574\u7406\u4e3a\u66f4\u6e05\u6670\u7684\u4e2d\u82f1\u53cc\u8bed\u9605\u8bfb\u7ed3\u6784\uff0c\u6839\u76ee\u5f55\u9ed8\u8ba4\u4e3a\u82f1\u6587\uff0c\u4e2d\u6587\u4f5c\u4e3a\u5e76\u884c\u7248\u672c\u63d0\u4f9b\u3002</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">TP</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>\u8bfb\u8005\u53ef\u4ee5\u671f\u5f85\u7684\u5185\u5bb9</h2>
              ${listItems([
                "\u6309\u7ae0\u8282\u6574\u7406\u7684\u4e3b\u7ebf\u653b\u7565\u4e0e\u53c2\u8003\u9875\u3002",
                "\u9ed8\u8ba4\u82f1\u6587\u5bfc\u822a\uff0c\u53ef\u76f4\u63a5\u5207\u6362\u4e2d\u6587\u5bf9\u5e94\u9875\u9762\u3002",
                "\u7ad9\u5185\u5f53\u524d\u9605\u8bfb\u6240\u9700\u7684\u56fe\u7247\u8d44\u6e90\u5df2\u672c\u5730\u6258\u7ba1\u3002",
                "\u5185\u5bb9\u4f1a\u6301\u7eed\u8fdb\u884c\u672f\u8bed\u3001\u6392\u7248\u548c\u53ef\u8bfb\u6027\u4fee\u6574\u3002",
              ])}
            </article>
            <article class="panel keyline">
              <h2>\u7f16\u8f91\u539f\u5219</h2>
              <p>\u672c\u7ad9\u4ee5\u975e\u5b98\u65b9\u653b\u7565\u9879\u76ee\u7684\u65b9\u5f0f\u7ef4\u62a4\uff0c\u76ee\u6807\u662f\u628a\u6e38\u620f\u76f8\u5173\u4fe1\u606f\u6574\u7406\u5f97\u66f4\u597d\u8bfb\u3001\u66f4\u597d\u5bfc\u822a\uff0c\u5e76\u6301\u7eed\u63d0\u5347\u9875\u9762\u8d28\u91cf\u3002</p>
              <p>\u5982\u679c\u7d20\u6750\u9700\u8981\u66f4\u6b63\u3001\u66ff\u6362\u6216\u8865\u5145\u6765\u6e90\u8bf4\u660e\uff0c\u7ad9\u70b9\u4f1a\u914d\u5408\u4fee\u6539\u6216\u79fb\u9664\u3002</p>
            </article>
          </section>
        </main>
      `,
    },
    privacy: {
      en: html`
        <main>
          <section class="hero hero-page" style="--accent:#617f66; --accent-soft:#173227;">
            <div class="hero-copy">
              <p class="eyebrow">Privacy</p>
              <h1>Privacy Policy</h1>
              <p class="lede">This policy explains how Twilight Princess Chronicle may handle analytics, cookies, advertising, and direct messages once the site is publicly deployed.</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">PR</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>Information We Handle</h2>
              <p>The current site is a static guide and does not provide account registration, user dashboards, or direct public uploads. Most visitors can browse the site without actively submitting personal information.</p>
              <p>If you contact the site owner by email, your email address and the contents of your message may be retained only as long as reasonably necessary to respond, follow up, or document the request.</p>
              <p>If analytics, search tools, or advertising services are added later, this policy should be updated to identify the provider, explain what data is collected, and note any visitor controls or consent tools used on the live site.</p>
            </article>
            <article class="panel keyline">
              <h2>Cookies And Advertising</h2>
              <p>Third-party services such as analytics platforms or advertising networks may use cookies or similar technologies if they are enabled after launch.</p>
              <p>If the production site runs advertising, this page should reflect the final ad provider, the live domain, and any consent or preference tools offered to visitors in applicable regions.</p>
            </article>
          </section>
        </main>
      `,
      zh: html`
        <main>
          <section class="hero hero-page" style="--accent:#617f66; --accent-soft:#173227;">
            <div class="hero-copy">
              <p class="eyebrow">\u9690\u79c1</p>
              <h1>\u9690\u79c1\u653f\u7b56</h1>
              <p class="lede">\u672c\u9875\u8bf4\u660e\u7ad9\u70b9\u5728\u90e8\u7f72\u540e\u53ef\u80fd\u6d89\u53ca\u7684\u5206\u6790\u3001\u5e7f\u544a\u3001Cookie \u4e0e\u76f4\u63a5\u8054\u7cfb\u4fe1\u606f\u5904\u7406\u65b9\u5f0f\u3002</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">PR</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>\u6570\u636e\u5904\u7406</h2>
              <p>\u672c\u7ad9\u5f53\u524d\u4ee5\u9759\u6001\u7f51\u7ad9\u5f62\u5f0f\u8fd0\u884c\uff0c\u4e0d\u5305\u542b\u81ea\u5efa\u8d26\u6237\u7cfb\u7edf\u6216\u7528\u6237\u63a7\u5236\u53f0\u3002</p>
              <p>\u5982\u679c\u540e\u7eed\u52a0\u5165\u7f51\u7ad9\u5206\u6790\u6216\u5e7f\u544a\u4ea7\u54c1\uff0c\u672c\u9875\u5e94\u8865\u5145\u5177\u4f53\u63d0\u4f9b\u65b9\u3001\u6536\u96c6\u7684\u6570\u636e\u7c7b\u578b\u4ee5\u53ca\u5728\u9002\u7528\u5730\u533a\u7684\u540c\u610f\u7ba1\u7406\u65b9\u5f0f\u3002</p>
              <p>\u5982\u4f60\u901a\u8fc7\u90ae\u7bb1\u8054\u7cfb\u7ad9\u70b9\uff0c\u4f60\u7684\u90ae\u7bb1\u5730\u5740\u548c\u4fe1\u4ef6\u5185\u5bb9\u53ef\u80fd\u4f1a\u88ab\u4ec5\u4e3a\u56de\u590d\u6216\u5904\u7406\u8bf7\u6c42\u800c\u4fdd\u7559\u3002</p>
            </article>
            <article class="panel keyline">
              <h2>Cookie \u4e0e\u5e7f\u544a</h2>
              <p>\u7b49\u7ad9\u70b9\u4e0a\u7ebf\u540e\uff0c\u7b2c\u4e09\u65b9\u5206\u6790\u6216\u5e7f\u544a\u670d\u52a1\u53ef\u80fd\u4f1a\u4f7f\u7528 Cookie \u6216\u7c7b\u4f3c\u6280\u672f\u3002</p>
              <p>\u5728\u751f\u4ea7\u73af\u5883\u542f\u7528\u4e2a\u6027\u5316\u5e7f\u544a\u4e4b\u524d\uff0c\u8bf7\u5148\u914d\u7f6e\u771f\u5b9e\u7684\u540c\u610f\u63d0\u793a\u3001\u7ad9\u70b9\u4e3b\u4f53\u4fe1\u606f\u4ee5\u53ca\u6700\u7ec8\u57df\u540d\u5185\u5bb9\u3002</p>
            </article>
          </section>
        </main>
      `,
    },
    contact: {
      en: html`
        <main>
          <section class="hero hero-page" style="--accent:#5a7864; --accent-soft:#163029;">
            <div class="hero-copy">
              <p class="eyebrow">Contact</p>
              <h1>Contact</h1>
              <p class="lede">Use this page to report corrections, request attribution updates, raise rights questions, or get in touch about the project.</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">@</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>Contact Email</h2>
              <p><a href="mailto:${publicContactEmail}">${publicContactEmail}</a></p>
              <p>Common reasons to get in touch:</p>
              ${listItems([
                "Reporting factual errors, broken links, or page formatting problems.",
                "Requesting attribution updates, clarifications, or media replacement.",
                "Asking about licensing, reuse, collaboration, or related project questions.",
              ])}
            </article>
            <article class="panel keyline">
              <h2>How To Reach Out</h2>
              <p>When reporting a rights or attribution issue, include the page URL, the specific text or image involved, and the action you want reviewed. Clear requests are much easier to verify and handle quickly.</p>
              <p>If the site is launched publicly, replace the placeholder address with a monitored production mailbox so visitors and reviewers can confirm that the project has a working contact path.</p>
            </article>
          </section>
        </main>
      `,
      zh: html`
        <main>
          <section class="hero hero-page" style="--accent:#5a7864; --accent-soft:#163029;">
            <div class="hero-copy">
              <p class="eyebrow">\u8054\u7cfb</p>
              <h1>\u8054\u7cfb\u65b9\u5f0f</h1>
              <p class="lede">\u53ef\u901a\u8fc7\u672c\u9875\u63d0\u4ea4\u52d8\u8bef\u3001\u6743\u5229\u76f8\u5173\u95ee\u9898\u3001\u5185\u5bb9\u53cd\u9988\u6216\u5408\u4f5c\u8bf7\u6c42\u3002</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">@</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>\u90ae\u7bb1</h2>
              <p><a href="mailto:${publicContactEmail}">${publicContactEmail}</a></p>
              <p>\u5efa\u8bae\u7528\u4e8e\uff1a</p>
              ${listItems([
                "\u62a5\u544a\u5185\u5bb9\u9519\u8bef\u6216\u9875\u9762\u94fe\u63a5\u95ee\u9898\u3002",
                "\u63d0\u4ea4\u6765\u6e90\u66f4\u6b63\u6216\u7d20\u6750\u66ff\u6362\u8bf7\u6c42\u3002",
                "\u8ba8\u8bba\u6388\u6743\u3001\u5185\u5bb9\u4f7f\u7528\u6216\u5408\u4f5c\u4e8b\u9879\u3002",
              ])}
            </article>
            <article class="panel keyline">
              <h2>\u5904\u7406\u8bf4\u660e</h2>
              <p>\u5982\u679c\u662f\u6743\u5229\u76f8\u5173\u53cd\u9988\uff0c\u8bf7\u63d0\u4f9b\u5bf9\u5e94\u9875\u9762 URL\u3001\u76f8\u5173\u7d20\u6750\u6216\u6587\u5b57\u4f4d\u7f6e\u3001\u4ee5\u53ca\u4f60\u5e0c\u671b\u7684\u5904\u7406\u65b9\u5f0f\u3002</p>
              <p>\u5728\u6b63\u5f0f\u4e0a\u7ebf\u524d\uff0c\u8bf7\u628a\u8fd9\u91cc\u7684\u5360\u4f4d\u90ae\u7bb1\u66ff\u6362\u4e3a\u4f60\u771f\u6b63\u53ef\u4ee5\u63a5\u6536\u90ae\u4ef6\u7684\u5730\u5740\u3002</p>
            </article>
          </section>
        </main>
      `,
    },
    terms: {
      en: html`
        <main>
          <section class="hero hero-page" style="--accent:#638169; --accent-soft:#153128;">
            <div class="hero-copy">
              <p class="eyebrow">Terms</p>
              <h1>Terms of Use</h1>
              <p class="lede">These terms explain how visitors may use the site and what to expect from an unofficial, fan-maintained walkthrough project.</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">T</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>Acceptable Use</h2>
              ${listItems([
                "The site is provided for informational, archival, and fan-reference use.",
                "Content may be edited, reorganized, or removed as the project continues to be maintained.",
                "External links are offered for reference only and do not imply endorsement of third-party sites.",
              ])}
            </article>
            <article class="panel keyline">
              <h2>Limitations And Rights</h2>
              <p>The site owner does not guarantee that every page is complete, error-free, or suitable for commercial reuse. Visitors should treat the guide as a maintained fan resource rather than an official publication.</p>
              <p>If you want to reuse site material beyond ordinary reading, citation, or linking, request permission first and verify that any third-party rights are properly respected.</p>
            </article>
          </section>
        </main>
      `,
      zh: html`
        <main>
          <section class="hero hero-page" style="--accent:#638169; --accent-soft:#153128;">
            <div class="hero-copy">
              <p class="eyebrow">\u6761\u6b3e</p>
              <h1>\u4f7f\u7528\u6761\u6b3e</h1>
              <p class="lede">\u672c\u9875\u8bf4\u660e\u8bfb\u8005\u53ef\u4ee5\u5982\u4f55\u4f7f\u7528\u672c\u7ad9\uff0c\u4ee5\u53ca\u4f5c\u4e3a\u975e\u5b98\u65b9\u653b\u7565\u9879\u76ee\u7684\u57fa\u672c\u754c\u9650\u3002</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">T</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>\u57fa\u672c\u4f7f\u7528</h2>
              ${listItems([
                "\u672c\u7ad9\u4ec5\u7528\u4e8e\u4fe1\u606f\u53c2\u8003\u548c\u975e\u5b98\u65b9\u6e38\u620f\u653b\u7565\u9605\u8bfb\u3002",
                "\u9879\u76ee\u7ef4\u62a4\u8fc7\u7a0b\u4e2d\uff0c\u9875\u9762\u5185\u5bb9\u53ef\u80fd\u88ab\u4fee\u6539\u3001\u79fb\u52a8\u6216\u79fb\u9664\u3002",
                "\u5bf9\u5916\u94fe\u63a5\u53ea\u4f5c\u4e3a\u53c2\u8003\uff0c\u4e0d\u4ee3\u8868\u5bf9\u5176\u7acb\u573a\u6216\u5185\u5bb9\u7684\u80cc\u4e66\u3002",
              ])}
            </article>
            <article class="panel keyline">
              <h2>\u8d23\u4efb\u8303\u56f4</h2>
              <p>\u7ad9\u70b9\u7ef4\u62a4\u8005\u4e0d\u4fdd\u8bc1\u6240\u6709\u9875\u9762\u90fd\u5b8c\u5168\u65e0\u8bef\uff0c\u4e5f\u4e0d\u9ed8\u8ba4\u6388\u6743\u7528\u4e8e\u5546\u4e1a\u573a\u666f\u518d\u5229\u7528\u3002</p>
              <p>\u5982\u9700\u5728\u666e\u901a\u9605\u8bfb\u548c\u94fe\u63a5\u4e4b\u5916\u4f7f\u7528\u7ad9\u5185\u5185\u5bb9\uff0c\u8bf7\u5148\u8054\u7cfb\u7ad9\u70b9\u6240\u6709\u8005\u3002</p>
            </article>
          </section>
        </main>
      `,
    },
    copyright: {
      en: html`
        <main>
          <section class="hero hero-page" style="--accent:#64816e; --accent-soft:#173227;">
            <div class="hero-copy">
              <p class="eyebrow">Rights</p>
              <h1>Copyright and Attribution</h1>
              <p class="lede">This page explains how Twilight Princess Chronicle handles ownership notices, attribution, and review requests for game-related references and supporting media.</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">C</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>Ownership Notice</h2>
              <p>The Legend of Zelda, Twilight Princess, related character names, and associated marks remain the property of their respective rightsholders.</p>
              <p>Original site writing, layout, and editorial notes created for this project remain protected by their respective authors unless otherwise stated.</p>
            </article>
            <article class="panel keyline">
              <h2>Attribution Requests</h2>
              <p>This site is an independent editorial guide and is not affiliated with or endorsed by Nintendo.</p>
              <p>If you believe a specific image, passage, or reference note should be credited differently, revised, or removed, send the page URL and the exact material in question to <a href="mailto:${publicContactEmail}">${publicContactEmail}</a>.</p>
            </article>
          </section>
        </main>
      `,
      zh: html`
        <main>
          <section class="hero hero-page" style="--accent:#64816e; --accent-soft:#173227;">
            <div class="hero-copy">
              <p class="eyebrow">\u6743\u5229</p>
              <h1>\u7248\u6743\u4e0e\u6765\u6e90\u8bf4\u660e</h1>
              <p class="lede">\u672c\u9875\u8bf4\u660e\u7ad9\u70b9\u5bf9\u6e38\u620f\u76f8\u5173\u7d20\u6750\u3001\u622a\u56fe\u4ee5\u53ca\u6765\u6e90\u6807\u6ce8\u8bf7\u6c42\u7684\u5904\u7406\u65b9\u5f0f\u3002</p>
            </div>
            <div class="hero-art policy-art">
              <div class="policy-mark">C</div>
            </div>
          </section>
          <section class="content-grid">
            <article class="panel prose">
              <h2>\u6743\u5229\u5f52\u5c5e\u8bf4\u660e</h2>
              <p>The Legend of Zelda \u4e0e Twilight Princess \u76f8\u5173\u6e38\u620f\u540d\u79f0\u3001\u89d2\u8272\u540d\u79f0\u53ca\u5546\u6807\u6743\u5229\u5f52\u5c5e\u4e8e\u5176\u5404\u81ea\u7684\u6743\u5229\u4eba\u3002\u672c\u7ad9\u4e3a\u975e\u5b98\u65b9\u73a9\u5bb6\u653b\u7565\u7ad9\uff0c\u4e0e Nintendo \u4e0d\u5b58\u5728\u96b6\u5c5e\u6216\u80cc\u4e66\u5173\u7cfb\u3002</p>
              <p>\u9875\u9762\u4e2d\u63d0\u53ca\u7684\u6e38\u620f\u540d\u79f0\u3001\u89d2\u8272\u547d\u540d\u4e0e\u76f8\u5173\u6807\u8bc6\uff0c\u4ecd\u5f52\u539f\u6743\u5229\u4eba\u6240\u6709\u3002</p>
            </article>
            <article class="panel keyline">
              <h2>\u4fee\u6539\u4e0e\u79fb\u9664\u8bf7\u6c42</h2>
              <p>\u5982\u679c\u4f60\u8ba4\u4e3a\u67d0\u4e00\u9879\u7d20\u6750\u6216\u6bb5\u843d\u9700\u8981\u66f4\u6b63\u6765\u6e90\uff0c\u66ff\u6362\u6216\u4e0b\u7ebf\uff0c\u8bf7\u5c06\u9875\u9762 URL \u548c\u5177\u4f53\u5185\u5bb9\u4fe1\u606f\u53d1\u9001\u81f3 <a href="mailto:${publicContactEmail}">${publicContactEmail}</a>\u3002</p>
              <p>\u6b63\u5f0f\u4e0a\u7ebf\u524d\uff0c\u8fd9\u4e00\u9875\u5e94\u8be5\u8865\u5168\u4f60\u5b9e\u9645\u4fdd\u7559\u5728\u7ebf\u7684\u975e\u539f\u521b\u56fe\u7247\u6765\u6e90\u8bf4\u660e\u3002</p>
            </article>
          </section>
        </main>
      `,
    },
  };

  return pageShell({
    lang,
    currentKey: page.navKey,
    currentPath,
    pageTitle: `${lang === "en" ? page.enTitle : page.zhTitle} | ${lang === "en" ? sourceArchiveMeta.englishTitle : sourceArchiveMeta.chineseTitle}`,
    description: lang === "en" ? page.enDescription : page.zhDescription,
    bodyClass: "page-policy",
    content: policyBodies[page.slug][lang],
  });
};

const css = `
:root {
  --paper: #f6ecd2;
  --paper-warm: #dfe4c2;
  --paper-deep: #b8c398;
  --paper-shadow: #8ea070;
  --ink: #261b13;
  --ink-soft: #4f5d46;
  --crimson: #8a3f31;
  --indigo: #2f5f58;
  --indigo-soft: #78a08b;
  --gold: #9f8a45;
  --forest: #5b7b5f;
  --line: rgba(55, 71, 46, 0.18);
  --frame: rgba(97, 118, 76, 0.28);
  --shadow: 0 18px 42px rgba(44, 56, 32, 0.14);
  --shadow-soft: 0 12px 24px rgba(44, 56, 32, 0.11);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  color: var(--ink);
  background:
    radial-gradient(circle at 16% 6%, rgba(90, 123, 95, 0.13), transparent 20%),
    radial-gradient(circle at 84% 10%, rgba(47, 95, 88, 0.12), transparent 18%),
    linear-gradient(180deg, rgba(243, 238, 216, 0.98), rgba(214, 224, 184, 0.98));
  font-family: "Shippori Mincho", "Times New Roman", serif;
  position: relative;
}

body::before,
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
}

body::before {
  opacity: 0.34;
  background:
    linear-gradient(90deg, transparent 0, transparent 19px, rgba(94, 120, 72, 0.04) 19px, rgba(94, 120, 72, 0.04) 20px, transparent 20px),
    linear-gradient(180deg, transparent 0, transparent 19px, rgba(94, 120, 72, 0.025) 19px, rgba(94, 120, 72, 0.025) 20px, transparent 20px),
    repeating-radial-gradient(circle at 16% 100%, rgba(47, 95, 88, 0.05) 0 7px, transparent 7px 24px),
    repeating-radial-gradient(circle at 84% 100%, rgba(47, 95, 88, 0.036) 0 8px, transparent 8px 26px);
  background-size: 20px 20px, 20px 20px, auto, auto;
}

body::after {
  inset: 12px;
  border: 1px solid rgba(109, 127, 83, 0.15);
  box-shadow:
    inset 0 0 0 7px rgba(165, 181, 118, 0.06),
    inset 0 0 0 20px rgba(255, 247, 229, 0.12);
}

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
code {
  font-family: "IBM Plex Mono", Consolas, monospace;
  font-size: 0.92em;
  color: var(--crimson);
  background: rgba(90, 123, 95, 0.1);
  padding: 0.12rem 0.35rem;
  border-radius: 999px;
}

.site-shell {
  width: min(1220px, calc(100% - 32px));
  margin: 0 auto;
  padding: 22px 0 54px;
  position: relative;
  z-index: 1;
}

.site-shell::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 14px;
  right: 14px;
  border-left: 1px solid rgba(126, 148, 96, 0.08);
  border-right: 1px solid rgba(126, 148, 96, 0.08);
  pointer-events: none;
}

.topbar {
  position: sticky;
  top: 12px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(105, 127, 82, 0.22);
  border-radius: 10px;
  background:
    linear-gradient(180deg, rgba(246, 243, 227, 0.98), rgba(220, 229, 195, 0.96));
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow);
}

.topbar::before {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(123, 151, 94, 0.16);
  pointer-events: none;
}

.topbar::after {
  content: "";
  position: absolute;
  left: 24px;
  right: 24px;
  top: 8px;
  bottom: 8px;
  background:
    linear-gradient(180deg, rgba(123, 151, 94, 0.16), rgba(123, 151, 94, 0.16)) top / 100% 1px no-repeat,
    linear-gradient(180deg, rgba(123, 151, 94, 0.16), rgba(123, 151, 94, 0.16)) bottom / 100% 1px no-repeat;
  pointer-events: none;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.brand strong,
.nav-links a,
h1, h2, h3 {
  font-family: "Yuji Syuku", "Shippori Mincho", serif;
}

.brand strong {
  display: block;
  font-size: 1.12rem;
}

.brand small {
  display: block;
  color: var(--ink-soft);
  font-size: 0.8rem;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 52px;
  aspect-ratio: 1;
  border-radius: 6px;
  background:
    linear-gradient(180deg, rgba(71, 118, 84, 0.96), rgba(41, 77, 61, 0.96));
  border: 1px solid rgba(39, 73, 59, 0.45);
  color: #edf2d7;
  font-family: "IBM Plex Mono", monospace;
  letter-spacing: 0.12em;
  box-shadow: inset 0 0 0 1px rgba(255, 243, 222, 0.16);
}

.nav-links,
.lang-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.nav-links a,
.lang-pill {
  padding: 10px 14px;
  border-radius: 6px;
  color: var(--ink-soft);
  transition: 180ms ease;
  border: 1px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.82rem;
}

.nav-links a[aria-current="page"],
.nav-links a:hover,
.lang-pill[aria-current="true"],
.lang-pill:hover {
  color: var(--ink);
  background: rgba(90, 123, 95, 0.1);
  border-color: rgba(90, 123, 95, 0.14);
}

.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 28px;
  align-items: center;
  padding: 20px;
  border: 1px solid rgba(103, 124, 82, 0.24);
  border-radius: 10px;
  background:
    linear-gradient(180deg, rgba(246, 242, 225, 0.96), rgba(219, 229, 190, 0.98));
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(138, 158, 102, 0.14);
  pointer-events: none;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(93, 118, 71, 0.88), rgba(65, 90, 56, 0.92)) top 10px left 26px / calc(100% - 52px) 7px no-repeat,
    linear-gradient(180deg, rgba(93, 118, 71, 0.88), rgba(65, 90, 56, 0.92)) bottom 10px left 26px / calc(100% - 52px) 8px no-repeat,
    radial-gradient(circle at 82% 18%, rgba(90, 123, 95, 0.12), transparent 18%),
    linear-gradient(90deg, rgba(159, 121, 60, 0.08), transparent 18%, transparent 82%, rgba(159, 121, 60, 0.08));
  pointer-events: none;
}

.hero-page {
  background:
    radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 16%),
    linear-gradient(180deg, rgba(246, 242, 225, 0.94), color-mix(in srgb, var(--accent-soft) 14%, #dbe4be 86%));
}

.hero-home {
  min-height: 456px;
}

.hero-copy,
.hero-art,
.card-visual {
  position: relative;
  z-index: 1;
}

.hero-copy {
  padding: 34px 34px 30px;
  border: 1px solid rgba(112, 135, 88, 0.16);
  border-radius: 10px 10px 28px 10px;
  background:
    linear-gradient(180deg, rgba(250, 246, 231, 0.92), rgba(228, 236, 204, 0.9));
  box-shadow: inset 0 0 0 1px rgba(255, 247, 230, 0.3);
}

.hero-copy::before {
  content: "";
  position: absolute;
  inset: 10px;
  border-left: 4px solid rgba(71, 118, 84, 0.2);
  border-top: 1px solid rgba(145, 165, 108, 0.12);
  border-right: 1px solid rgba(145, 165, 108, 0.08);
  border-bottom: 1px solid rgba(145, 165, 108, 0.08);
  border-radius: 6px 6px 22px 6px;
  pointer-events: none;
}

.hero-copy::after {
  content: "";
  position: absolute;
  right: 22px;
  top: 18px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid rgba(71, 118, 84, 0.15);
  box-shadow: inset 0 0 0 6px rgba(71, 118, 84, 0.03);
  pointer-events: none;
}

.hero-copy h1 {
  margin: 0 0 14px;
  font-size: clamp(2.5rem, 6vw, 4.8rem);
  line-height: 0.96;
  color: var(--ink);
  max-width: 14ch;
}

.hero-copy .lede {
  max-width: 62ch;
  margin: 0;
  color: var(--ink-soft);
  font-size: 1.08rem;
  line-height: 1.7;
}

.hero-art {
  display: flex;
  justify-content: flex-end;
  padding: 22px 22px 28px;
  border-radius: 10px;
  background:
    linear-gradient(180deg, rgba(248, 244, 228, 0.95), rgba(219, 229, 196, 0.9));
  border: 1px solid rgba(111, 133, 88, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255, 247, 229, 0.3);
}

.hero-art::before,
.hero-art::after,
.card-visual::before,
.card-visual::after {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  border-radius: 999px;
  background: linear-gradient(180deg, #5c7b52, #3e5a3b);
  box-shadow: inset 0 1px 0 rgba(255, 236, 203, 0.14);
}

.hero-art::before,
.card-visual::before {
  top: 10px;
  height: 7px;
}

.hero-art::after,
.card-visual::after {
  bottom: 10px;
  height: 9px;
}

.hero-art img,
.card-visual img {
  width: 100%;
  border-radius: 6px;
  border: 1px solid rgba(104, 73, 39, 0.22);
  box-shadow: var(--shadow-soft);
  background: #f7ecd0;
}

.hero-source-art img,
.source-thumb img {
  aspect-ratio: 4 / 3;
  object-fit: cover;
  object-position: center;
}

.eyebrow {
  display: inline-flex;
  margin: 0 0 14px;
  color: var(--indigo);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  font-family: "IBM Plex Mono", monospace;
  padding: 4px 10px;
  border: 1px solid rgba(71, 118, 84, 0.14);
  border-radius: 999px;
  background: rgba(255, 248, 235, 0.7);
}

.hero-actions,
.section-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}

.hero-actions {
  margin-top: 24px;
  flex-wrap: wrap;
}

.button,
.button-secondary,
.text-link,
.pager-link {
  transition: 180ms ease;
}

.button,
.button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 6px;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.88rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.button {
  background: linear-gradient(135deg, #476d57, #315241);
  color: #edf2d7;
  box-shadow: inset 0 0 0 1px rgba(255, 237, 211, 0.12);
  border: 1px solid rgba(44, 77, 60, 0.44);
}

.button-secondary {
  border: 1px solid rgba(111, 133, 88, 0.22);
  color: var(--ink);
  background: rgba(255, 248, 232, 0.56);
}

.button:hover,
.button-secondary:hover,
.text-link:hover,
.pager-link:hover {
  transform: translateY(-1px);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 22px;
}

.intro-grid {
  margin-top: 28px;
}

.panel {
  padding: 28px 26px 24px;
  border: 1px solid rgba(111, 133, 88, 0.18);
  border-radius: 10px;
  background:
    linear-gradient(180deg, rgba(248, 243, 227, 0.94), rgba(223, 232, 198, 0.94));
  box-shadow: var(--shadow);
  position: relative;
}

.panel::before {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(141, 167, 113, 0.08);
  border-radius: 4px;
  pointer-events: none;
}

.panel::after {
  content: "";
  position: absolute;
  right: 16px;
  top: 14px;
  width: 26px;
  height: 26px;
  border: 1.5px solid rgba(71, 118, 84, 0.14);
  border-radius: 50%;
  box-shadow: inset 0 0 0 5px rgba(71, 118, 84, 0.03);
  pointer-events: none;
}

.panel h2 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.35rem;
  color: var(--ink);
}

.panel p,
.panel li {
  color: var(--ink-soft);
  line-height: 1.74;
  font-size: 1rem;
}

.keyline {
  background:
    linear-gradient(180deg, rgba(236, 231, 206, 0.97), rgba(214, 224, 186, 0.98));
  border-left: 6px solid rgba(103, 131, 88, 0.45);
}

.bullet-list {
  margin: 0;
  padding-left: 1.2rem;
}

.bullet-list li + li {
  margin-top: 12px;
}

.section-head {
  margin-top: 34px;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(145, 165, 108, 0.18);
}

.section-head h2 {
  margin: 4px 0 0;
  font-size: 2rem;
}

.text-link {
  color: var(--indigo);
  font-family: "IBM Plex Mono", monospace;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.84rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.card {
  display: grid;
  grid-template-columns: 0.98fr 1.02fr;
  gap: 18px;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid rgba(111, 133, 88, 0.18);
  background:
    linear-gradient(180deg, rgba(245, 241, 223, 0.95), rgba(220, 229, 195, 0.96));
  box-shadow: var(--shadow);
  position: relative;
}

.card::before {
  content: "";
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(141, 167, 113, 0.07);
  border-radius: 4px;
  pointer-events: none;
}

.card::after {
  content: "";
  position: absolute;
  top: 18px;
  bottom: 18px;
  left: calc(48% + 6px);
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(103, 131, 88, 0.24), transparent);
  pointer-events: none;
}

.card-visual {
  padding: 18px 18px 24px;
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgba(247, 243, 226, 0.92), rgba(219, 229, 196, 0.88));
  border: 1px solid rgba(111, 133, 88, 0.16);
  align-self: stretch;
}

.card-copy {
  position: relative;
  padding-left: 8px;
}

.card-copy::before {
  content: "";
  position: absolute;
  left: -4px;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: linear-gradient(180deg, rgba(71, 118, 84, 0.34), rgba(47, 95, 88, 0.14));
  border-radius: 999px;
}

.card-copy h3 {
  margin: 0 0 10px;
  font-size: 1.35rem;
  color: var(--ink);
  line-height: 1.25;
}

.card-copy p {
  margin-top: 0;
  color: var(--ink-soft);
  line-height: 1.65;
}

.archive-layout {
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: 20px;
  margin-top: 22px;
  align-items: start;
}

.archive-sidebar {
  display: grid;
  gap: 20px;
  align-content: start;
}

.archive-page-list {
  margin: 0;
  padding-left: 1.15rem;
}

.archive-page-list li + li {
  margin-top: 10px;
}

.archive-page-list a {
  color: var(--ink-soft);
}

.archive-page-list a[aria-current="page"] {
  color: var(--ink);
  font-weight: 700;
}

.source-toc-panel nav,
.source-toc-panel .toc {
  position: relative;
  z-index: 1;
}

.source-toc-panel h4,
.source-toc-panel .topic-title {
  margin-top: 0;
  color: var(--ink);
}

.source-toc-panel ul {
  margin: 0;
  padding-left: 1.15rem;
}

.source-toc-panel li + li {
  margin-top: 8px;
}

.source-prose {
  overflow: hidden;
}

.source-prose > * {
  position: relative;
  z-index: 1;
}

.source-prose a {
  color: var(--indigo);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.16em;
}

.source-prose h2,
.source-prose h3,
.source-prose h4 {
  scroll-margin-top: 7rem;
  color: var(--ink);
}

.source-prose h2 {
  margin-top: 0;
  font-size: 1.7rem;
}

.source-prose h3 {
  margin-top: 2rem;
  margin-bottom: 0.85rem;
  font-size: 1.32rem;
}

.source-prose h4 {
  margin-top: 1.5rem;
  margin-bottom: 0.7rem;
  font-size: 1.08rem;
}

.source-prose p,
.source-prose li {
  font-size: 1rem;
  line-height: 1.84;
  color: var(--ink-soft);
}

.source-prose ul,
.source-prose ol {
  padding-left: 1.4rem;
}

.source-prose hr {
  border: 0;
  border-top: 1px solid rgba(123, 151, 94, 0.2);
  margin: 1.6rem 0;
}

.source-prose .figure {
  margin: 1.5rem 0 1.75rem;
  padding: 16px 16px 20px;
  border-radius: 8px;
  border: 1px solid rgba(111, 133, 88, 0.18);
  background: linear-gradient(180deg, rgba(247, 243, 226, 0.94), rgba(222, 231, 197, 0.92));
}

.source-prose .figure img {
  width: 100%;
  max-width: min(100%, 760px);
  margin: 0 auto;
  border-radius: 6px;
  border: 1px solid rgba(104, 73, 39, 0.18);
  box-shadow: var(--shadow-soft);
  background: #f7ecd0;
}

.source-prose .caption {
  margin: 14px 0 0;
  text-align: center;
  color: var(--ink-soft);
  font-size: 0.94rem;
}

.timeline-panel {
  margin-top: 22px;
}

.pager {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.pager-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid rgba(111, 133, 88, 0.22);
  background: rgba(255, 247, 229, 0.66);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.82rem;
}

.pager-link.disabled {
  color: rgba(67, 50, 33, 0.42);
}

.site-footer {
  margin-top: 28px;
  padding: 22px 12px 8px;
  color: var(--ink-soft);
  font-size: 0.94rem;
  border-top: 1px solid rgba(145, 165, 108, 0.16);
}

.site-footer p {
  margin: 6px 0;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 10px 0;
}

.footer-links a {
  color: var(--indigo);
  text-decoration: underline;
  text-underline-offset: 0.14em;
}

.policy-art {
  align-items: center;
  justify-content: center;
}

.policy-mark {
  display: grid;
  place-items: center;
  width: min(220px, 58vw);
  aspect-ratio: 1;
  border-radius: 24px;
  border: 1px solid rgba(92, 123, 82, 0.24);
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 247, 229, 0.75), transparent 30%),
    linear-gradient(180deg, rgba(92, 123, 82, 0.9), rgba(53, 81, 57, 0.94));
  color: #f4edd7;
  font-family: "Yuji Syuku", "Shippori Mincho", serif;
  font-size: clamp(3rem, 9vw, 5.8rem);
  letter-spacing: 0.08em;
  box-shadow: var(--shadow-soft);
}

@media (max-width: 980px) {
  .topbar,
  .topbar-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 940px) {
  .hero,
  .card,
  .content-grid,
  .card-grid,
  .archive-layout {
    grid-template-columns: 1fr;
  }

  .hero,
  .section-head {
    align-items: flex-start;
  }

  .section-head {
    flex-direction: column;
  }

  .hero {
    padding: 24px;
  }

  .card::after {
    display: none;
  }
}

@media (max-width: 640px) {
  .site-shell {
    width: min(100% - 18px, 1220px);
    padding-top: 10px;
  }

  .topbar {
    border-radius: 18px;
    padding: 14px;
  }

  .hero,
  .panel,
  .card {
    border-radius: 10px;
  }
}
`;

const writePage = async (relativePath, contents) => {
  const fullPath = path.join(siteRoot, relativePath);
  await ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, contents, "utf8");
};

const sitemapDocument = (routes) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${absoluteSiteUrl}/${route.replace(/\\/g, "/")}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const grouped = groupPages(archivePages);
await loadTranslationCache();
const pageContentBySlug = await buildPageContentBySlug();

await removeIfExists(path.join(siteRoot, "assets"));
await removeIfExists(path.join(siteRoot, "chapters"));
await removeIfExists(path.join(siteRoot, "reference"));
await removeIfExists(path.join(siteRoot, "intro"));
await removeIfExists(path.join(siteRoot, "characters"));
await removeIfExists(path.join(siteRoot, "epilogue"));
await removeIfExists(path.join(siteRoot, "appendix"));
await removeIfExists(path.join(siteRoot, "about"));
await removeIfExists(path.join(siteRoot, "privacy"));
await removeIfExists(path.join(siteRoot, "contact"));
await removeIfExists(path.join(siteRoot, "terms"));
await removeIfExists(path.join(siteRoot, "copyright"));
await removeIfExists(path.join(siteRoot, "archive"));
await removeIfExists(path.join(siteRoot, "guides"));
await removeIfExists(path.join(siteRoot, "zh"));
await removeIfExists(path.join(siteRoot, "index.html"));
await removeIfExists(path.join(siteRoot, "asset-manifest.json"));
await removeIfExists(path.join(siteRoot, "robots.txt"));
await removeIfExists(path.join(siteRoot, "ads.txt"));
await removeIfExists(path.join(siteRoot, "sitemap.xml"));
await removeIfExists(path.join(siteRoot, "site.webmanifest"));

await ensureDir(assetRoot);
await fs.writeFile(path.join(assetRoot, "styles.css"), css, "utf8");
await copyTwpSourceArchiveAssets(workspaceRoot, archive.copiedRefs);

await writePage("index.html", renderHomePage("en", grouped, pageContentBySlug));
await writePage("zh/index.html", renderHomePage("zh", grouped, pageContentBySlug));
await writePage(
  "chapters/index.html",
  renderSectionIndex("en", "chapters", grouped, pageContentBySlug),
);
await writePage(
  "zh/chapters/index.html",
  renderSectionIndex("zh", "chapters", grouped, pageContentBySlug),
);
await writePage(
  "reference/index.html",
  renderSectionIndex("en", "reference", grouped, pageContentBySlug),
);
await writePage(
  "zh/reference/index.html",
  renderSectionIndex("zh", "reference", grouped, pageContentBySlug),
);

for (const policyPage of policyPages) {
  await writePage(policyPage.href, renderPolicyPage("en", policyPage));
  await writePage(
    toLanguagePath(policyPage.href, "zh"),
    renderPolicyPage("zh", policyPage),
  );
}

for (const page of archivePages) {
  await writePage(page.routePath, renderDetailPage("en", page, pageContentBySlug, grouped));
  await writePage(
    toLanguagePath(page.routePath, "zh"),
    renderDetailPage("zh", page, pageContentBySlug, grouped),
  );
}

const baseRoutes = [
  "index.html",
  "chapters/index.html",
  "reference/index.html",
  ...policyPages.map((page) => page.href),
];
const zhBaseRoutes = baseRoutes.map((route) => toLanguagePath(route, "zh"));
const pageRoutes = [
  ...baseRoutes,
  ...zhBaseRoutes,
  ...archivePages.flatMap((page) => [page.routePath, page.paths.zh]),
];

await fs.writeFile(
  path.join(siteRoot, "robots.txt"),
  `${[
    "User-agent: *",
    "Allow: /",
    ...(absoluteSiteUrl ? ["", `Sitemap: ${absoluteSiteUrl}/sitemap.xml`] : []),
  ].join("\n")}\n`,
  "utf8",
);
if (adsTxtEntries.length > 0) {
  await fs.writeFile(
    path.join(siteRoot, "ads.txt"),
    `${adsTxtEntries.join("\n")}\n`,
    "utf8",
  );
}
if (absoluteSiteUrl) {
  await fs.writeFile(
    path.join(siteRoot, "sitemap.xml"),
    sitemapDocument(pageRoutes),
    "utf8",
  );
}
const webManifest = {
  name: sourceArchiveMeta.englishTitle,
  short_name: manifestShortName,
  description: sourceArchiveMeta.englishDescription,
  lang: "en",
  start_url: "/",
  scope: "/",
  display: "standalone",
  theme_color: manifestThemeColor,
  background_color: manifestBackgroundColor,
  icons: [
    {
      src: "android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};
if (absoluteSiteUrl) {
  webManifest.id = `${absoluteSiteUrl}/`;
}
await fs.writeFile(
  path.join(siteRoot, "site.webmanifest"),
  `${JSON.stringify(webManifest, null, 2)}\n`,
  "utf8",
);

const assetManifest = {
  generatedAt: new Date().toISOString(),
  defaultLanguage: "en",
  alternateLanguageRoot: "zh/",
  pageCount: pageRoutes.length,
  importedAssetFiles: archive.copiedRefs.map(
    (ref) => `${sourceArchiveAssetPrefix}/${ref}`,
  ),
  pageRoutes,
};

await fs.writeFile(
  path.join(siteRoot, "asset-manifest.json"),
  JSON.stringify(assetManifest, null, 2),
  "utf8",
);
await saveTranslationCache();

console.log(`Generated bilingual site at ${siteRoot}`);
console.log(`Pages: ${assetManifest.pageCount}`);
console.log(`Imported archive assets: ${archive.copiedRefs.length}`);
