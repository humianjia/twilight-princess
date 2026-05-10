import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteConfigPath = path.join(root, "site.config.json");
const defaultSiteConfig = {
  siteUrl: "",
  contactEmail: "",
  shortName: "TP Chronicle",
  themeColor: "#173227",
  backgroundColor: "#f3ead8",
  adsTxtEntries: [],
};
const siteConfig = fs.existsSync(siteConfigPath)
  ? { ...defaultSiteConfig, ...JSON.parse(fs.readFileSync(siteConfigPath, "utf8")) }
  : defaultSiteConfig;
const siteUrl =
  typeof siteConfig.siteUrl === "string" && siteConfig.siteUrl.trim()
    ? siteConfig.siteUrl.trim().replace(/\/+$/, "")
    : "";
const contactEmail =
  typeof siteConfig.contactEmail === "string" ? siteConfig.contactEmail.trim() : "";
const shortName =
  typeof siteConfig.shortName === "string" && siteConfig.shortName.trim()
    ? siteConfig.shortName.trim()
    : defaultSiteConfig.shortName;
const themeColor =
  typeof siteConfig.themeColor === "string" && siteConfig.themeColor.trim()
    ? siteConfig.themeColor.trim()
    : defaultSiteConfig.themeColor;
const backgroundColor =
  typeof siteConfig.backgroundColor === "string" && siteConfig.backgroundColor.trim()
    ? siteConfig.backgroundColor.trim()
    : defaultSiteConfig.backgroundColor;
const adsTxtEntries = Array.isArray(siteConfig.adsTxtEntries)
  ? siteConfig.adsTxtEntries
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter(Boolean)
  : [];

const policyPages = [
  { slug: "about", titleEn: "About This Site", titleZh: "关于本站" },
  { slug: "privacy", titleEn: "Privacy Policy", titleZh: "隐私政策" },
  { slug: "contact", titleEn: "Contact", titleZh: "联系方式" },
  { slug: "terms", titleEn: "Terms of Use", titleZh: "使用条款" },
  { slug: "copyright", titleEn: "Copyright and Attribution", titleZh: "版权与来源说明" },
];

const footerLinksEn = [
  ["about/index.html", "About This Site"],
  ["privacy/index.html", "Privacy Policy"],
  ["contact/index.html", "Contact"],
  ["terms/index.html", "Terms of Use"],
  ["copyright/index.html", "Copyright and Attribution"],
];

const footerLinksZh = [
  ["about/index.html", "关于本站"],
  ["privacy/index.html", "隐私政策"],
  ["contact/index.html", "联系方式"],
  ["terms/index.html", "使用条款"],
  ["copyright/index.html", "版权与来源说明"],
];

const replacements = [
  [
    "A bilingual illustrated walkthrough built from the local mirror.",
    "A bilingual fan guide with chapter notes and reference materials.",
  ],
  [
    "An English-first Twilight Princess walkthrough site with Chinese page toggles, rebuilt from the local sources/twp mirror and its copied images.",
    "An English-first Twilight Princess guide with chapter navigation, reference pages, and locally hosted images.",
  ],
  [
    "基于 sources/twp 本地镜像重组的黎明公主攻略站，默认英文，可切换中文，并复用页内所需图片。",
    "一个默认英文、可切换中文的 Twilight Princess 攻略站，包含章节流程、参考资料与本地托管图片。",
  ],
  [
    "Bilingual Mirror Edition",
    "Bilingual Guide Edition",
  ],
  [
    "中英双语镜像版",
    "中英双语攻略版",
  ],
  [
    "This site keeps the later mirror-based version only. It turns the locally mirrored Twilight Princess pages into a cleaner, bilingual walkthrough site while preserving the image-heavy article structure.",
    "This site keeps the current Twilight Princess guide structure only. It turns the collected pages into a cleaner bilingual walkthrough site while preserving the long-form article flow and image support.",
  ],
  [
    "现在只保留你后面这套基于本地镜像的版本，把 Twilight Princess 相关页面收拢成一个更清晰的中英双语攻略站。",
    "现在只保留你目前这套 Twilight Princess 攻略结构，把各类页面整理成更清晰的中英双语攻略站，同时保留图文阅读的主要体验。",
  ],
  [
    "Open mirrored source",
    "Continue reading",
  ],
  [
    "打开原镜像页",
    "继续阅读",
  ],
  [
    "This bilingual build keeps the mirror order intact so you can move through the collected Twilight Princess material in a stable sequence.",
    "This bilingual build keeps a stable reading order so you can move through the Twilight Princess material in a consistent sequence.",
  ],
  [
    "这套双语站保持了镜像页面的先后顺序，便于你按稳定顺序阅读 Twilight Princess 资料。",
    "这套双语站保持稳定的阅读顺序，便于你按一致的节奏浏览 Twilight Princess 相关内容。",
  ],
  [
    "Twilight Princess Chronicle is a fan-made bilingual guide site with chapter walkthroughs, reference pages, and locally hosted media needed for reading.",
    "Twilight Princess Chronicle is an editorial guide site with chapter walkthroughs, strategy notes, and reference pages for easier reading.",
  ],
  [
    "Twilight Princess Chronicle 是一个非官方的中英双语攻略站，提供章节流程、参考资料与阅读所需的本地图片。",
    "Twilight Princess Chronicle 是一个中英双语攻略站，提供章节流程、路线提示与参考资料，方便连续阅读与查阅。",
  ],
  [
    "This page is generated from the project source file ",
    "This guide page is organized as a cleaned reading edition of the walkthrough material. Chapter reference: ",
  ],
  [
    "这一页由项目内的源文件 ",
    "这一页整理为更适合连续阅读的攻略版本。对应章节源文件：",
  ],
  [
    "Images and attachments used inside the article are routed to local project paths under assets/imported/twp.",
    "Supporting images used inside the article are served from local project paths to keep the guide readable and self-contained.",
  ],
  [
    "文中用到的图片和附件都走项目本地的 assets/imported/twp 路径。",
    "文中配套图片会通过站内本地路径提供，便于稳定阅读。",
  ],
  [
    "An English-first fan guide with a switchable Chinese edition.",
    "An English-first editorial guide with a switchable Chinese edition.",
  ],
  [
    "A polished Twilight Princess walkthrough with story chapters, reference guides, and locally hosted screenshots.",
    "An editorial Twilight Princess guide with walkthrough chapters, original essays, strategy notes, and reference pages.",
  ],
  [
    "This version focuses on a clean English reading experience built from the current project archive. The goal is not to mirror every original sentence, but to turn the collected material into a more readable walkthrough site with stable navigation and preserved local media.",
    "This edition focuses on readable walkthrough prose, stable navigation, and bilingual browsing. The goal is to make the main route, side references, and planning notes easier to use across the full campaign.",
  ],
  [
    "231 locally hosted assets",
    "231 supporting media items",
  ],
  [
    "4 supporting reference pages",
    "3 original feature essays",
  ],
  [
    "English root site with mirrored Chinese routes",
    "English root site plus Chinese companion routes",
  ],
  [
    "Terms governing the use of this fan guide, its content, and outbound links.",
    "Terms governing the use of this editorial guide, its content, and outbound links.",
  ],
  [
    "This site is maintained as a fan guide project. The goal is to present game information in a readable structure, make navigation easier, and improve page quality over time.",
    "This site is maintained as an editorial guide project. The goal is to present game information in a readable structure, make navigation easier, and improve page quality over time.",
  ],
  [
    "The Legend of Zelda and Twilight Princess are associated with their respective rightsholders. This site is an unofficial fan guide and is not affiliated with or endorsed by Nintendo.",
    "The Legend of Zelda and Twilight Princess are associated with their respective rightsholders. This site is an independent editorial guide and is not affiliated with or endorsed by Nintendo.",
  ],
];

const routeGroups = {
  reference: new Set([
    "reference/index.html",
    "reference/why-midna-works/index.html",
    "reference/why-ordon-village-matters/index.html",
    "reference/dungeon-order-and-pacing/index.html",
    "intro/index.html",
    "characters/index.html",
    "epilogue/index.html",
    "appendix/index.html",
  ]),
};

const policyBodies = {
  en: {
    about: {
      title: "About This Site | Twilight Princess Chronicle",
      description:
        "Learn how this Twilight Princess guide is organized, updated, and maintained for readers.",
      navKey: "about",
      mark: "TP",
      eyebrow: "Site Overview",
      heading: "About This Site",
      lede:
        "This project organizes Twilight Princess walkthrough material into a cleaner bilingual reading experience, with English at the root and Chinese as a parallel version.",
      leftTitle: "What readers can expect",
      leftHtml:
        '<ul class="bullet-list"><li>Chapter-by-chapter story guidance and reference pages.</li><li>English-first navigation with direct Chinese-language counterparts.</li><li>Local hosting for the media assets currently used by the pages.</li><li>Ongoing cleanup for clarity, consistency, and terminology.</li></ul>',
      rightTitle: "Editorial approach",
      rightHtml:
        "<p>This site is maintained as an editorial guide project. The goal is to present game information in a readable structure, make navigation easier, and improve page quality over time.</p><p>When material needs correction, replacement, or attribution updates, the site owner can revise or remove it.</p>",
    },
    privacy: {
      title: "Privacy Policy | Twilight Princess Chronicle",
      description:
        "Privacy policy covering analytics, advertising, cookies, and contact submissions for this site.",
      navKey: null,
      mark: "PR",
      eyebrow: "Privacy",
      heading: "Privacy Policy",
      lede:
        "This page explains how Twilight Princess Chronicle handles analytics, cookies, contact messages, and any advertising features that may be enabled on the live site.",
      leftTitle: "Data handling",
      leftHtml:
        "<p>The site currently operates as a static website. It does not include account registration, user dashboards, or direct public uploads.</p><p>If you contact the site owner by email, your message and email address may be retained only as long as reasonably necessary to reply, follow up, or document the request.</p><p>If analytics or measurement tools are enabled later, this page will be updated to identify the provider, describe the data involved, and explain any applicable visitor controls.</p>",
      rightTitle: "Cookies and advertising",
      rightHtml:
        "<p>Third-party services such as analytics platforms or advertising networks may use cookies or similar technologies if they are enabled on the live site.</p><p>If Google AdSense or another advertising provider is activated, this page will be updated to reflect the active provider, the live domain, and any consent or preference tools offered to visitors where required.</p>",
    },
    contact: {
      title: "Contact | Twilight Princess Chronicle",
      description:
        "Contact details for feedback, corrections, rights issues, and partnership requests.",
      navKey: "contact",
      mark: "@",
      eyebrow: "Contact",
      heading: "Contact",
      lede:
        "Use this page for corrections, rights concerns, content feedback, or collaboration requests.",
      leftTitle: "Email",
      leftHtml: `<p><a href="mailto:${contactEmail}">${contactEmail}</a></p><p>Recommended use cases:</p><ul class="bullet-list"><li>Reporting factual mistakes or broken pages.</li><li>Submitting attribution corrections or replacement requests.</li><li>Discussing licensing, reuse, or partnership questions.</li></ul>`,
      rightTitle: "Response policy",
      rightHtml:
        "<p>When reporting a rights issue, include the page URL, the asset or text in question, and the requested action. Clear requests are easier to act on quickly.</p><p>Replace this placeholder mailbox before public launch so reviewers can verify the site has a working contact path.</p>",
    },
    terms: {
      title: "Terms of Use | Twilight Princess Chronicle",
      description:
        "Terms governing the use of this editorial guide, its content, and outbound links.",
      navKey: null,
      mark: "T",
      eyebrow: "Terms",
      heading: "Terms of Use",
      lede:
        "These terms describe how readers may use the site and what to expect from a fan-maintained guide project.",
      leftTitle: "General use",
      leftHtml:
        '<ul class="bullet-list"><li>The site is provided for informational and fan-reference purposes.</li><li>Content may be edited, moved, or removed without notice while the project is being maintained.</li><li>External links are provided for reference and do not imply endorsement.</li></ul>',
      rightTitle: "Limitations",
      rightHtml:
        "<p>The site owner does not guarantee that every page is complete, error-free, or suitable for commercial reuse.</p><p>If you plan to use any site material outside normal reading and linking, request permission first.</p>",
    },
    copyright: {
      title: "Copyright and Attribution | Twilight Princess Chronicle",
      description:
        "Attribution, rights-contact, and takedown information for text, screenshots, and referenced game material.",
      navKey: null,
      mark: "C",
      eyebrow: "Rights",
      heading: "Copyright and Attribution",
      lede:
        "This page explains how the site treats game-related material, screenshots, and attribution requests.",
      leftTitle: "Ownership notice",
      leftHtml:
        "<p>The Legend of Zelda and Twilight Princess are associated with their respective rightsholders. This site is an independent editorial guide and is not affiliated with or endorsed by Nintendo.</p><p>Referenced game names, character names, and related marks remain the property of their owners.</p>",
      rightTitle: "Requests and corrections",
      rightHtml: `<p>If you believe a specific asset or passage should be credited differently, revised, or removed, send the page URL and the exact material to <a href="mailto:${contactEmail}">${contactEmail}</a>.</p><p>The site owner reviews good-faith attribution and takedown requests and may revise or remove affected material when appropriate.</p>`,
    },
  },
  zh: {
    about: {
      title: "关于本站 | Twilight Princess Chronicle",
      description: "了解这个 Twilight Princess 攻略站的内容结构、更新方式和维护原则。",
      navKey: "about",
      mark: "TP",
      eyebrow: "站点说明",
      heading: "关于本站",
      lede:
        "这个项目把 Twilight Princess 攻略内容整理为更清晰的中英双语阅读结构，根目录默认为英文，中文作为并行版本提供。",
      leftTitle: "读者可以期待的内容",
      leftHtml:
        '<ul class="bullet-list"><li>按章节整理的主线攻略与参考页。</li><li>默认英文导航，可直接切换中文对应页面。</li><li>站内当前阅读所需的图片资源已本地托管。</li><li>内容会持续进行术语、排版和可读性修整。</li></ul>',
      rightTitle: "编辑原则",
      rightHtml:
        "<p>本站以非官方攻略项目的方式维护，目标是把游戏相关信息整理得更好读、更好导航，并持续提升页面质量。</p><p>如果素材需要更正、替换或补充来源说明，站点会配合修改或移除。</p>",
    },
    privacy: {
      title: "隐私政策 | Twilight Princess Chronicle",
      description: "本站关于分析、广告、Cookie 和联系提交的隐私政策。",
      navKey: null,
      mark: "PR",
      eyebrow: "隐私",
      heading: "隐私政策",
      lede:
        "本页说明站点在部署后可能涉及的分析、广告、Cookie 与直接联系信息处理方式。",
      leftTitle: "数据处理",
      leftHtml:
        "<p>本站当前以静态网站形式运行，不包含自建账户系统或用户控制台。</p><p>如果后续加入网站分析或广告产品，本页应补充具体提供方、收集的数据类型以及在适用地区的同意管理方式。</p><p>如你通过邮箱联系站点，你的邮箱地址和信件内容可能会被仅为回复或处理请求而保留。</p>",
      rightTitle: "Cookie 与广告",
      rightHtml:
        "<p>等站点上线后，第三方分析或广告服务可能会使用 Cookie 或类似技术。</p><p>在生产环境启用个性化广告之前，请先配置真实的同意提示、站点主体信息以及最终域名内容。</p>",
    },
    contact: {
      title: "联系方式 | Twilight Princess Chronicle",
      description: "用于提交勘误、反馈、授权问题和合作请求的联系方式。",
      navKey: "contact",
      mark: "@",
      eyebrow: "联系",
      heading: "联系方式",
      lede:
        "可通过本页提交勘误、权利相关问题、内容反馈或合作请求。",
      leftTitle: "邮箱",
      leftHtml: `<p><a href="mailto:${contactEmail}">${contactEmail}</a></p><p>建议用于：</p><ul class="bullet-list"><li>报告内容错误或页面链接问题。</li><li>提交来源更正或素材替换请求。</li><li>讨论授权、内容使用或合作事项。</li></ul>`,
      rightTitle: "处理说明",
      rightHtml:
        "<p>如果是权利相关反馈，请提供对应页面 URL、相关素材或文字位置、以及你希望的处理方式。</p><p>在正式上线前，请把这里的占位邮箱替换为你真正可以接收邮件的地址。</p>",
    },
    terms: {
      title: "使用条款 | Twilight Princess Chronicle",
      description: "规范本站攻略内容、访问行为与对外链接使用的条款。",
      navKey: null,
      mark: "T",
      eyebrow: "条款",
      heading: "使用条款",
      lede:
        "本页说明读者可以如何使用本站，以及作为非官方攻略项目的基本界限。",
      leftTitle: "基本使用",
      leftHtml:
        '<ul class="bullet-list"><li>本站仅用于信息参考和非官方游戏攻略阅读。</li><li>项目维护过程中，页面内容可能被修改、移动或移除。</li><li>对外链接只作为参考，不代表对其立场或内容的背书。</li></ul>',
      rightTitle: "责任范围",
      rightHtml:
        "<p>站点维护者不保证所有页面都完全无误，也不默认授权用于商业场景再利用。</p><p>如需在普通阅读和链接之外使用站内内容，请先联系站点所有者。</p>",
    },
    copyright: {
      title: "版权与来源说明 | Twilight Princess Chronicle",
      description: "本站对文字、截图、游戏相关素材的来源说明与权利联系方式。",
      navKey: null,
      mark: "C",
      eyebrow: "权利",
      heading: "版权与来源说明",
      lede:
        "本页说明站点对游戏相关素材、截图以及来源标注请求的处理方式。",
      leftTitle: "权利归属说明",
      leftHtml:
        "<p>The Legend of Zelda 与 Twilight Princess 相关游戏名称、角色名称及商标权利归属于其各自的权利人。本站为非官方玩家攻略站，与 Nintendo 不存在隶属或背书关系。</p><p>页面中提及的游戏名称、角色命名与相关标识，仍归原权利人所有。</p>",
      rightTitle: "修改与移除请求",
      rightHtml: `<p>如果你认为某一项素材或段落需要更正来源、替换或下线，请将页面 URL 和具体内容信息发送至 <a href="mailto:${contactEmail}">${contactEmail}</a>。</p><p>正式上线前，这一页应该补全你实际保留在线的非原创图片来源说明。</p>`,
    },
  },
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "sources") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      out.push(fullPath);
    }
  }
  return out;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function relHref(fromFile, targetRoute) {
  return (
    path.relative(path.dirname(fromFile), path.join(root, targetRoute)).replace(/\\/g, "/")
    || "."
  );
}

function routeFromFile(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function isZhRoute(route) {
  return route.startsWith("zh/");
}

function currentLanguage(route) {
  return isZhRoute(route) ? "zh" : "en";
}

function counterpartRoute(route) {
  return isZhRoute(route) ? route.replace(/^zh\//, "") : `zh/${route}`;
}

function currentKeyForRoute(route) {
  const normalized = route.replace(/^zh\//, "");
  if (normalized === "index.html") {
    return "home";
  }
  if (normalized === "chapters/index.html" || normalized.startsWith("chapters/chapter-")) {
    return "chapters";
  }
  if (routeGroups.reference.has(normalized)) {
    return "reference";
  }
  if (normalized === "about/index.html") {
    return "about";
  }
  if (normalized === "contact/index.html") {
    return "contact";
  }
  return null;
}

function navMarkup(file, route) {
  const lang = currentLanguage(route);
  const currentKey = currentKeyForRoute(route);
  const entries = [
    {
      key: "home",
      label: lang === "en" ? "Home" : "首页",
      href: lang === "en" ? "index.html" : "zh/index.html",
    },
    {
      key: "chapters",
      label: lang === "en" ? "Walkthrough" : "剧情流程",
      href: lang === "en" ? "chapters/index.html" : "zh/chapters/index.html",
    },
    {
      key: "reference",
      label: lang === "en" ? "Reference" : "资料索引",
      href: lang === "en" ? "reference/index.html" : "zh/reference/index.html",
    },
    {
      key: "about",
      label: lang === "en" ? "About" : "关于",
      href: lang === "en" ? "about/index.html" : "zh/about/index.html",
    },
    {
      key: "contact",
      label: lang === "en" ? "Contact" : "联系",
      href: lang === "en" ? "contact/index.html" : "zh/contact/index.html",
    },
  ];
  return entries
    .map((entry) => {
      const current = entry.key === currentKey ? ' aria-current="page"' : "";
      return `<a href="${relHref(file, entry.href)}"${current}>${entry.label}</a>`;
    })
    .join("");
}

function languageSwitchMarkup(file, route) {
  const lang = currentLanguage(route);
  if (lang === "en") {
    return `<div class="lang-switch"><span class="lang-pill" aria-current="true">EN</span><a class="lang-pill" href="${relHref(file, counterpartRoute(route))}">中文</a></div>`;
  }
  return `<div class="lang-switch"><span class="lang-pill" aria-current="true">中文</span><a class="lang-pill" href="${relHref(file, counterpartRoute(route))}">EN</a></div>`;
}

function footerMarkup(file, route) {
  const lang = currentLanguage(route);
  const links = (lang === "en" ? footerLinksEn : footerLinksZh)
    .map(([href, label]) => {
      const target = lang === "en" ? href : `zh/${href}`;
      return `<a href="${relHref(file, target)}">${label}</a>`;
    })
    .join("");
  const description =
    lang === "en"
      ? "Twilight Princess Chronicle is an editorial guide site with chapter walkthroughs, strategy notes, and reference pages for easier reading."
      : "Twilight Princess Chronicle 是一个中英双语攻略站，提供章节流程、路线提示与参考资料，方便连续阅读与查阅。";
  const contactLine = contactEmail
    ? lang === "en"
      ? `Contact: <a href="mailto:${contactEmail}">${contactEmail}</a>`
      : `联系邮箱：<a href="mailto:${contactEmail}">${contactEmail}</a>`
    : "";
  return `<footer class="site-footer">
            <p>${description}</p>
            <div class="footer-links">${links}</div>
            ${contactLine ? `<p>${contactLine}</p>` : ""}
          </footer>`;
}

function injectMetaRobots(html) {
  if (html.includes('name="robots"')) {
    return html;
  }
  return html.replace(
    /(\s*<meta name="description" content="[^"]*">)/,
    '\n        <meta name="robots" content="index,follow,max-image-preview:large">$1',
  );
}

function rewriteRobotsForRoute(html, route) {
  const robotsContent = isZhRoute(route)
    ? "noindex,follow,max-image-preview:large"
    : "index,follow,max-image-preview:large";
  if (html.includes('name="robots"')) {
    return html.replace(
      /<meta name="robots" content="[^"]*">/i,
      `<meta name="robots" content="${robotsContent}">`,
    );
  }
  return html.replace(
    /(<meta name="description" content="[^"]*">)/,
    `<meta name="robots" content="${robotsContent}">$1`,
  );
}

function injectCanonicalLinks(html, route) {
  if (!siteUrl) {
    return html
      .replace(/\s*<link rel="canonical" href="[^"]*">\n?/g, "")
      .replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?/g, "");
  }
  if (html.includes('rel="canonical"')) {
    const canonical = `${siteUrl}/${route}`;
    const alternate = `${siteUrl}/${counterpartRoute(route)}`;
    const lang = currentLanguage(route);
    return html
      .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canonical}">`)
      .replace(
        /<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?\s*<link rel="alternate" hreflang="x-default" href="[^"]*">/,
        `<link rel="alternate" hreflang="${lang === "en" ? "zh-CN" : "en"}" href="${alternate}">\n        <link rel="alternate" hreflang="${lang === "en" ? "en" : "zh-CN"}" href="${canonical}">\n        <link rel="alternate" hreflang="x-default" href="${siteUrl}/index.html">`,
      );
  }
  const canonical = `${siteUrl}/${route}`;
  const alternate = `${siteUrl}/${counterpartRoute(route)}`;
  const lang = currentLanguage(route);
  return html.replace(
    /(<meta name="robots" content="index,follow,max-image-preview:large">)/,
    `$1\n        <link rel="canonical" href="${canonical}">\n        <link rel="alternate" hreflang="${lang === "en" ? "zh-CN" : "en"}" href="${alternate}">\n        <link rel="alternate" hreflang="${lang === "en" ? "en" : "zh-CN"}" href="${canonical}">\n        <link rel="alternate" hreflang="x-default" href="${siteUrl}/index.html">`,
  );
}

function patchPageNotes(html) {
  return html
    .replace(
      /This page comes from the local mirror file ([^.]+)\. Images and attachments used inside the article are rewritten to project-owned paths under assets\/imported\/twp\./g,
      "This page is generated from the project source file $1. Images and attachments used inside the article are routed to local project paths under assets/imported/twp.",
    )
    .replace(
      /This page comes from the local mirror file /g,
      "This page is generated from the project source file ",
    )
    .replace(
      /Images and attachments used inside the article are rewritten to project-owned paths under assets\/imported\/twp\./g,
      "Images and attachments used inside the article are routed to local project paths under assets/imported/twp.",
    )
    .replace(
      /这一页来自本地镜像文件 ([^。]+)。文中用到的图片和附件都已重写到项目自己的 assets\/imported\/twp 路径下。/g,
      "这一页由项目内的源文件 $1 生成。文中用到的图片和附件都走项目本地的 assets/imported/twp 路径。",
    )
    .replace(
      /这一页来自本地镜像文件 /g,
      "这一页由项目内的源文件 ",
    )
    .replace(
      /文中用到的图片和附件都已重写到项目自己的 assets\/imported\/twp 路径下。/g,
      "文中用到的图片和附件都走项目本地的 assets/imported/twp 路径。",
    );
}

function injectIconsAndManifest(html, route) {
  const depth = route.split("/").length - 1;
  const prefix = depth === 0 ? "" : "../".repeat(depth);
  const iconBlock = [
    `        <meta name="theme-color" content="${themeColor}">`,
    `        <meta name="application-name" content="Twilight Princess Chronicle">`,
    `        <link rel="icon" href="${prefix}favicon.ico" sizes="any">`,
    `        <link rel="icon" type="image/svg+xml" href="${prefix}favicon.svg">`,
    `        <link rel="icon" type="image/png" sizes="32x32" href="${prefix}favicon-32x32.png">`,
    `        <link rel="icon" type="image/png" sizes="48x48" href="${prefix}favicon-48x48.png">`,
    `        <link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png">`,
    `        <link rel="manifest" href="${prefix}site.webmanifest">`,
  ].join("\n");

  html = html
    .replace(/\s*<meta name="theme-color" content="[^"]*">\n?/g, "")
    .replace(/\s*<meta name="application-name" content="[^"]*">\n?/g, "")
    .replace(/\s*<link rel="icon"[^>]*>\n?/g, "")
    .replace(/\s*<link rel="apple-touch-icon"[^>]*>\n?/g, "")
    .replace(/\s*<link rel="manifest"[^>]*>\n?/g, "");

  return html.replace(
    /(<meta name="robots" content="index,follow,max-image-preview:large">)/,
    `$1\n${iconBlock}`,
  );
}

function stripSourceExposure(html, route) {
  const lang = currentLanguage(route);
  const continueHref = (() => {
    if (route.includes("chapter-")) {
      if (route.includes("chapter-9")) {
        return "../index.html";
      }
      return route.match(/^zh\//)
        ? `../chapter-${Number(route.match(/chapter-(\d+)/)?.[1] || 0) + 1}/index.html`
        : `../chapter-${Number(route.match(/chapter-(\d+)/)?.[1] || 0) + 1}/index.html`;
    }
    return route.startsWith("zh/") ? "../index.html" : "../index.html";
  })();
  html = html.replace(
    /<a class="button button-secondary" href="[^"]*sources\/[^"]*">[^<]*<\/a>/g,
    lang === "en"
      ? `<a class="button button-secondary" href="${continueHref}">Continue reading</a>`
      : `<a class="button button-secondary" href="${continueHref}">继续阅读</a>`,
  );

  html = html
    .replace(/<h2>Source Notes<\/h2>/g, "<h2>Reading Guide</h2>")
    .replace(/<h2>Source Snapshot<\/h2>/g, "<h2>Page Snapshot</h2>")
    .replace(/<h2>页面说明<\/h2>/g, "<h2>阅读建议</h2>")
    .replace(/<h2>页面概览<\/h2>/g, "<h2>页面概览</h2>")
    .replace(
      /<p>This page is generated from the project source file ([^<]+)<\/p>/g,
      '<p>Use this guide page as a route-first reading edition of the walkthrough. Chapter reference: $1</p>',
    )
    .replace(
      /<p>Original publish time: [^<]+<\/p>/g,
      "<p>Use the sidebar to keep your place in the series order, and switch languages at any time if you want the paired Chinese or English version.</p>",
    )
    .replace(
      /<p>这一页由项目内的源文件 ([^<]+)<\/p>/g,
      "<p>这页整理为更适合连续阅读的攻略版本。对应章节源文件：$1</p>",
    )
    .replace(
      /<p>原文发布时间：[^<]+<\/p>/g,
      "<p>你可以通过侧边栏保持章节顺序，也可以随时切换中英文版本，对照阅读同一页面。</p>",
    );

  html = html
    .replace(/Source chapter:/g, "Chapter reference:")
    .replace(
      /Supporting images used inside the article are served from local project paths for stable reading\./g,
      "Supporting images used inside the article are served from local project paths to keep the guide readable and self-contained.",
    )
    .replace(
      /The original imported page used a long screenshot sequence with unstable translated captions\. The local image archive is preserved below as a numbered source gallery, while the main English walkthrough above has been rewritten into cleaner guide prose\./g,
      "The image sequence below supports the written guide with visual checkpoints from the route.",
    )
    .replace(
      /The preserved screenshot gallery below is best read as a visual closing sequence rather than as a raw dump of archived images\./g,
      "The screenshot gallery below is best read as a visual closing sequence for the ending.",
    )
    .replace(
      /These local ending screenshots are preserved as a visual timeline of the finale, its farewell, and the return to peace after the last battle\./g,
      "These ending screenshots work as a visual timeline of the finale, the farewell, and the return to peace after the last battle.",
    )
    .replace(
      /The legacy anchors from the imported archive are intentionally retained so older internal links continue to land on valid sections inside this page\./g,
      "Existing section anchors are retained so reference links inside the guide continue to land on the intended sections.",
    )
    .replace(
      /The intro page also carried a small local attachment archive\. It is preserved below exactly as a project file rather than translated line by line\./g,
      "An older supplementary download is listed below for reference.",
    )
    .replace(
      /while the archived Chinese version remains available through the language switch\./g,
      "while a Chinese companion version remains available through the language switch.",
    )
    .replace(/archive screenshot/gi, "guide screenshot")
    .replace(/Local Screenshot Archive/g, "Screenshot Highlights")
    .replace(/1 local attachments/gi, "1 download")
    .replace(/0 local attachments/gi, "0 downloads")
    .replace(/local attachments/gi, "downloads")
    .replace(/1 downloads/gi, "1 download");

  return html;
}

function replaceAllPairs(html) {
  let next = html;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  return next;
}

function patchExistingPage(file) {
  const route = routeFromFile(file);
  let html = fs.readFileSync(file, "utf8");

  html = injectMetaRobots(html);
  html = rewriteRobotsForRoute(html, route);
  html = injectCanonicalLinks(html, route);
  html = injectIconsAndManifest(html, route);
  html = replaceAllPairs(html);
  html = patchPageNotes(html);
  html = stripSourceExposure(html, route);

  html = html.replace(
    /<nav class="nav-links">[\s\S]*?<\/nav>/,
    `<nav class="nav-links">${navMarkup(file, route)}</nav>`,
  );
  html = html.replace(
    /<div class="lang-switch">[\s\S]*?<\/div>/,
    languageSwitchMarkup(file, route),
  );
  html = html.replace(
    /<footer class="site-footer">[\s\S]*?<\/footer>/,
    footerMarkup(file, route),
  );

  fs.writeFileSync(file, html, "utf8");
}

function pageShell({ lang, route, title, description, navKey, body }) {
  const filePath = path.join(root, lang === "en" ? route : `zh/${route}`);
  const homeHref = relHref(filePath, lang === "en" ? "index.html" : "zh/index.html");
  const styleHref = relHref(filePath, "assets/styles.css");
  const navRoute = lang === "en" ? route : `zh/${route}`;

  return `<!doctype html>
    <html lang="${lang === "en" ? "en" : "zh-CN"}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
        <meta name="robots" content="${lang === "en" ? "index,follow,max-image-preview:large" : "noindex,follow,max-image-preview:large"}">
        <meta name="description" content="${description}">
        <meta name="theme-color" content="${themeColor}">
        <meta name="application-name" content="Twilight Princess Chronicle">
        <link rel="icon" href="${relHref(filePath, "favicon.ico")}" sizes="any">
        <link rel="icon" type="image/svg+xml" href="${relHref(filePath, "favicon.svg")}">
        <link rel="icon" type="image/png" sizes="32x32" href="${relHref(filePath, "favicon-32x32.png")}">
        <link rel="icon" type="image/png" sizes="48x48" href="${relHref(filePath, "favicon-48x48.png")}">
        <link rel="apple-touch-icon" href="${relHref(filePath, "apple-touch-icon.png")}">
        <link rel="manifest" href="${relHref(filePath, "site.webmanifest")}">
        ${siteUrl ? `<link rel="canonical" href="${siteUrl}/${lang === "en" ? route : `zh/${route}`}">` : ""}
        ${siteUrl ? `<link rel="alternate" hreflang="${lang === "en" ? "zh-CN" : "en"}" href="${siteUrl}/${lang === "en" ? `zh/${route}` : route}">` : ""}
        ${siteUrl ? `<link rel="alternate" hreflang="${lang === "en" ? "en" : "zh-CN"}" href="${siteUrl}/${lang === "en" ? route : `zh/${route}`}">` : ""}
        ${siteUrl ? `<link rel="alternate" hreflang="x-default" href="${siteUrl}/index.html">` : ""}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Shippori+Mincho:wght@400;500;700&family=Yuji+Syuku&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="${styleHref}">
      </head>
      <body class="page-policy">
        <div class="site-shell">
          <header class="topbar">
            <a class="brand" href="${homeHref}">
              <span class="brand-mark">TP</span>
              <span>
                <strong>Twilight Princess Chronicle</strong>
                <small>${lang === "en" ? "An editorial guide with chapter notes, strategy highlights, and reference materials." : "以中英双语结构整理的 Twilight Princess 攻略与参考站点。"}</small>
              </span>
            </a>
            <div class="topbar-actions">
              <nav class="nav-links">${navMarkup(filePath, navRoute)}</nav>
              ${languageSwitchMarkup(filePath, navRoute)}
            </div>
          </header>
          ${body}
          ${footerMarkup(filePath, navRoute)}
        </div>
      </body>
    </html>`;
}

function renderPolicyBody(data) {
  return `<main>
      <section class="hero hero-page" style="--accent:#5f856b; --accent-soft:#153128;">
        <div class="hero-copy">
          <p class="eyebrow">${data.eyebrow}</p>
          <h1>${data.heading}</h1>
          <p class="lede">${data.lede}</p>
        </div>
        <div class="hero-art policy-art">
          <div class="policy-mark">${data.mark}</div>
        </div>
      </section>
      <section class="content-grid">
        <article class="panel prose">
          <h2>${data.leftTitle}</h2>
          ${data.leftHtml}
        </article>
        <article class="panel keyline">
          <h2>${data.rightTitle}</h2>
          ${data.rightHtml}
        </article>
      </section>
    </main>`;
}

function writePolicyPages() {
  for (const page of policyPages) {
    for (const lang of ["en", "zh"]) {
      const route = `${page.slug}/index.html`;
      const outputPath = path.join(root, lang === "en" ? route : `zh/${route}`);
      const data = policyBodies[lang][page.slug];
      ensureDir(path.dirname(outputPath));
      fs.writeFileSync(
        outputPath,
        pageShell({
          lang,
          route,
          title: data.title,
          description: data.description,
          navKey: data.navKey,
          body: renderPolicyBody(data),
        }),
        "utf8",
      );
    }
  }
}

function writeSupportFiles() {
  for (const staleFile of ["ads.txt", "sitemap.xml"]) {
    const stalePath = path.join(root, staleFile);
    if (fs.existsSync(stalePath)) {
      fs.rmSync(stalePath, { force: true });
    }
  }
  const baseRoutes = [
    "index.html",
    "chapters/index.html",
    "reference/index.html",
    "reference/why-midna-works/index.html",
    "reference/why-ordon-village-matters/index.html",
    "reference/dungeon-order-and-pacing/index.html",
    "intro/index.html",
    "characters/index.html",
    "epilogue/index.html",
    "appendix/index.html",
    ...policyPages.map((page) => `${page.slug}/index.html`),
    ...Array.from({ length: 9 }, (_, index) => `chapters/chapter-${index + 1}/index.html`),
  ];
  const zhRoutes = baseRoutes.map((route) => `zh/${route}`);
  const allRoutes = [...baseRoutes, ...zhRoutes];
  const sitemapRoutes = [...baseRoutes];

  fs.writeFileSync(
    path.join(root, "robots.txt"),
    `${[
      "User-agent: *",
      "Allow: /",
      ...(siteUrl ? ["", `Sitemap: ${siteUrl}/sitemap.xml`] : []),
    ].join("\n")}\n`,
    "utf8",
  );
  if (adsTxtEntries.length > 0) {
    fs.writeFileSync(
      path.join(root, "ads.txt"),
      `${adsTxtEntries.join("\n")}\n`,
      "utf8",
    );
  } else if (fs.existsSync(path.join(root, "ads.txt"))) {
    fs.rmSync(path.join(root, "ads.txt"), { force: true });
  }
  if (siteUrl) {
    fs.writeFileSync(
      path.join(root, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route) => `  <url>\n    <loc>${siteUrl}/${route}</loc>\n  </url>`).join("\n")}\n</urlset>\n`,
      "utf8",
    );
  } else if (fs.existsSync(path.join(root, "sitemap.xml"))) {
    fs.rmSync(path.join(root, "sitemap.xml"), { force: true });
  }
  fs.writeFileSync(
    path.join(root, "site.webmanifest"),
    `${JSON.stringify(
      {
        name: "Twilight Princess Chronicle",
        short_name: shortName,
        description:
          "An editorial Twilight Princess guide with chapter walkthroughs, strategy notes, and reference pages.",
        lang: "en",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: themeColor,
        background_color: backgroundColor,
        ...(siteUrl ? { id: `${siteUrl}/` } : {}),
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
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const manifestPath = path.join(root, "asset-manifest.json");
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    manifest.pageCount = allRoutes.length;
    manifest.pageRoutes = allRoutes;
    manifest.sitemapRoutes = sitemapRoutes;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  }
}

function main() {
  const htmlFiles = walk(root);
  for (const file of htmlFiles) {
    patchExistingPage(file);
  }
  writePolicyPages();
  writeSupportFiles();
  console.log(`Patched ${htmlFiles.length} HTML files and generated compliance pages.`);
}

main();
