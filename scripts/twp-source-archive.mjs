import fs from "node:fs/promises";
import path from "node:path";

const sourceRootParts = ["sources", "twp", "blog.gocalf.com"];
const outputAssetPrefix = "assets/imported/twp";

export const pageDefinitions = [
  {
    sourceFile: "zelda-tp-intro.html",
    slug: "intro",
    routePath: "intro/index.html",
    kind: "overview",
    section: "reference",
    order: 0,
    englishTitle: "Story Introduction",
    englishLabel: "Introduction",
  },
  {
    sourceFile: "zelda-tp-characters.html",
    slug: "characters",
    routePath: "characters/index.html",
    kind: "reference",
    section: "reference",
    order: 1,
    englishTitle: "Character Guide",
    englishLabel: "Characters",
  },
  {
    sourceFile: "zelda-tp-ch1.html",
    slug: "chapter-1",
    routePath: "chapters/chapter-1/index.html",
    kind: "chapter",
    section: "chapter",
    order: 2,
    englishTitle: "Chapter 1: The First Page of a Hero's Legend",
    englishLabel: "Chapter 1",
  },
  {
    sourceFile: "zelda-tp-ch2.html",
    slug: "chapter-2",
    routePath: "chapters/chapter-2/index.html",
    kind: "chapter",
    section: "chapter",
    order: 3,
    englishTitle: "Chapter 2: The Roar atop Death Mountain",
    englishLabel: "Chapter 2",
  },
  {
    sourceFile: "zelda-tp-ch3.html",
    slug: "chapter-3",
    routePath: "chapters/chapter-3/index.html",
    kind: "chapter",
    section: "chapter",
    order: 4,
    englishTitle: "Chapter 3: The Legend of the Deep-Sea Tribe",
    englishLabel: "Chapter 3",
  },
  {
    sourceFile: "zelda-tp-ch4.html",
    slug: "chapter-4",
    routePath: "chapters/chapter-4/index.html",
    kind: "chapter",
    section: "chapter",
    order: 5,
    englishTitle: "Chapter 4: Judgment in the Desert Depths",
    englishLabel: "Chapter 4",
  },
  {
    sourceFile: "zelda-tp-ch5.html",
    slug: "chapter-5",
    routePath: "chapters/chapter-5/index.html",
    kind: "chapter",
    section: "chapter",
    order: 6,
    englishTitle: "Chapter 5: The Sin of the Frozen Mirror",
    englishLabel: "Chapter 5",
  },
  {
    sourceFile: "zelda-tp-ch6.html",
    slug: "chapter-6",
    routePath: "chapters/chapter-6/index.html",
    kind: "chapter",
    section: "chapter",
    order: 7,
    englishTitle: "Chapter 6: The Rift Forgotten by Time",
    englishLabel: "Chapter 6",
  },
  {
    sourceFile: "zelda-tp-ch7.html",
    slug: "chapter-7",
    routePath: "chapters/chapter-7/index.html",
    kind: "chapter",
    section: "chapter",
    order: 8,
    englishTitle: "Chapter 7: Elegy of the Temple in the Heavens",
    englishLabel: "Chapter 7",
  },
  {
    sourceFile: "zelda-tp-ch8.html",
    slug: "chapter-8",
    routePath: "chapters/chapter-8/index.html",
    kind: "chapter",
    section: "chapter",
    order: 9,
    englishTitle: "Chapter 8: Darkness Before Dawn",
    englishLabel: "Chapter 8",
  },
  {
    sourceFile: "zelda-tp-ch9.html",
    slug: "chapter-9",
    routePath: "chapters/chapter-9/index.html",
    kind: "chapter",
    section: "chapter",
    order: 10,
    englishTitle: "Chapter 9: The Blade That Cleaves the Darkness",
    englishLabel: "Chapter 9",
  },
  {
    sourceFile: "zelda-tp-epilogue.html",
    slug: "epilogue",
    routePath: "epilogue/index.html",
    kind: "epilogue",
    section: "reference",
    order: 11,
    englishTitle: "Epilogue: Balance in the Order of the World",
    englishLabel: "Epilogue",
  },
  {
    sourceFile: "zelda-tp-appendix.html",
    slug: "appendix",
    routePath: "appendix/index.html",
    kind: "reference",
    section: "reference",
    order: 12,
    englishTitle: "Appendix",
    englishLabel: "Appendix",
  },
];

export const sourceArchiveMeta = {
  englishTitle: "Twilight Princess Chronicle",
  englishTagline: "An English-first fan guide with a switchable Chinese edition.",
  englishDescription:
    "A polished Twilight Princess walkthrough with story chapters, reference guides, and locally hosted screenshots.",
  chineseTitle: "\u9ece\u660e\u516c\u4e3b\u653b\u7565\u7ad9",
  chineseTagline: "\u4ee5\u4e2d\u82f1\u53cc\u8bed\u7ed3\u6784\u6574\u7406\u7684 Twilight Princess \u56fe\u6587\u653b\u7565\u3002",
  chineseDescription:
    "\u4e00\u4e2a\u9ed8\u8ba4\u82f1\u6587\u3001\u53ef\u5207\u6362\u4e2d\u6587\u7684 Twilight Princess \u653b\u7565\u7ad9\uff0c\u5305\u542b\u7ae0\u8282\u6d41\u7a0b\u3001\u53c2\u8003\u8d44\u6599\u4e0e\u672c\u5730\u6258\u7ba1\u56fe\u7247\u3002",
};

const extractRequired = (html, pattern, label, sourceFile) => {
  const match = html.match(pattern);
  if (!match) {
    throw new Error(`Could not extract ${label} from ${sourceFile}`);
  }
  return match[1].trim();
};

const stripBlogSuffix = (title) =>
  title
    .replace(/\s*[|·/-]\s*GoCalf Blog\s*$/u, "")
    .replace(/\s+$/u, "")
    .trim();

export const stripTags = (markup) =>
  markup
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

const normalizeContent = (html) =>
  html
    .replace(/<!-- more -->/gi, "")
    .replace(/<p id="post-share-links">[\s\S]*?<\/p>/gi, "")
    .replace(/\s+$/g, "")
    .trim();

const extractLocalRefs = (html) => {
  const refs = new Set();
  const pattern = /\b(?:src|href)="([^"]+)"/gi;

  for (const match of html.matchAll(pattern)) {
    const ref = match[1];
    if (/^(?:https?:|mailto:|#|javascript:)/i.test(ref)) {
      continue;
    }
    if (/^(?:images|assets)\//i.test(ref)) {
      refs.add(ref);
    }
  }

  return [...refs].sort();
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const relativeUrl = (fromPagePath, targetPath) => {
  const fromDir = path.posix.dirname(fromPagePath.replace(/\\/g, "/"));
  return path.posix.relative(fromDir, targetPath.replace(/\\/g, "/")) || ".";
};

export const toLanguagePath = (routePath, lang) =>
  lang === "zh" ? `zh/${routePath}` : routePath;

export const rewriteArchiveMarkup = (
  markup,
  currentPath,
  pagePathBySourceFile,
) => {
  let rewritten = markup;

  for (const [sourceFile, routePath] of pagePathBySourceFile.entries()) {
    const pattern = new RegExp(
      `(["'])${escapeRegExp(sourceFile)}(?:(#[^"']+))?\\1`,
      "g",
    );
    rewritten = rewritten.replace(pattern, (_, quote, hash = "") => {
      const href = relativeUrl(currentPath, routePath) + hash;
      return `${quote}${href}${quote}`;
    });
  }

  rewritten = rewritten.replace(
    /\b(src|href)="((?:images|assets)\/[^"]+)"/gi,
    (_, attr, ref) =>
      `${attr}="${relativeUrl(currentPath, `${outputAssetPrefix}/${ref}`)}"`,
  );

  rewritten = rewritten.replace(/<img\b([^>]*?)\s*\/?>/gi, (match, attrs) => {
    let clean = attrs.replace(/\s+$/, "");
    if (!/\bloading=/.test(clean)) {
      clean += ' loading="lazy"';
    }
    if (!/\bdecoding=/.test(clean)) {
      clean += ' decoding="async"';
    }
    return `<img${clean} />`;
  });

  rewritten = rewritten.replace(
    /<a\b([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/gi,
    (match, before, href, after) => {
      const hasTarget = /\btarget=/.test(match);
      const hasRel = /\brel=/.test(match);
      const target = hasTarget ? "" : ' target="_blank"';
      const rel = hasRel ? "" : ' rel="noreferrer noopener"';
      return `<a${before}href="${href}"${after}${target}${rel}>`;
    },
  );

  return rewritten;
};

export const summaryFromMarkup = (markup, maxLength = 200) => {
  const paragraphMatch = markup.match(/<p>([\s\S]*?)<\/p>/i);
  const summary = stripTags(paragraphMatch ? paragraphMatch[1] : markup);
  return summary.slice(0, maxLength);
};

export const loadTwpSourceArchive = async (workspaceRoot) => {
  const sourceRoot = path.join(workspaceRoot, ...sourceRootParts);
  const pages = [];
  const copiedRefs = new Set();

  for (const definition of pageDefinitions) {
    const sourcePath = path.join(sourceRoot, definition.sourceFile);
    const html = await fs.readFile(sourcePath, "utf8");

    const title = stripBlogSuffix(
      extractRequired(
        html,
        /<title>([\s\S]*?)<\/title>/i,
        "title",
        definition.sourceFile,
      ),
    );
    const heading = stripTags(
      extractRequired(
        html,
        /<header class="page-header[\s\S]*?<h1>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h1>/i,
        "heading",
        definition.sourceFile,
      ),
    );
    const publishedAt = html.match(
      /<meta property="og:article:published_time" content="([^"]+)"/i,
    )?.[1] ?? "";

    const rawTocHtml =
      html.match(
        /<div class="span2 table-of-content">([\s\S]*?)<\/div>\s*<div class="span8 article-content">/i,
      )?.[1]?.trim() ?? "";

    const rawContentHtml = normalizeContent(
      extractRequired(
        html,
        /<div class="span8(?:\s+offset2)? article-content">([\s\S]*?)<p id="post-share-links">/i,
        "article content",
        definition.sourceFile,
      ),
    );

    const localRefs = extractLocalRefs(`${rawTocHtml}\n${rawContentHtml}`);
    for (const ref of localRefs) {
      copiedRefs.add(ref);
    }

    const heroImageRef =
      localRefs.find((ref) => ref.startsWith("images/")) || localRefs[0] || "";

    pages.push({
      ...definition,
      title,
      heading,
      publishedAt,
      sourcePath,
      rawTocHtml,
      rawContentHtml,
      localRefs,
      heroImageRef,
      paths: {
        en: definition.routePath,
        zh: toLanguagePath(definition.routePath, "zh"),
      },
    });
  }

  return {
    sourceRoot,
    pages,
    copiedRefs: [...copiedRefs].sort(),
  };
};

export const copyTwpSourceArchiveAssets = async (
  workspaceRoot,
  assetRefs,
) => {
  const sourceRoot = path.join(workspaceRoot, ...sourceRootParts);

  for (const ref of assetRefs) {
    const sourcePath = path.join(sourceRoot, ...ref.split("/"));
    const targetPath = path.join(
      workspaceRoot,
      outputAssetPrefix,
      ...ref.split("/"),
    );
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
  }
};

export const sourceArchiveAssetPrefix = outputAssetPrefix;
