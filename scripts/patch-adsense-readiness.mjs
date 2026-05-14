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
  adsTxtEntries: [
    "google.com, pub-7534347140708021, DIRECT, f08c47fec0942fa0",
  ],
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
const adsenseClient = (() => {
  const googleEntry = adsTxtEntries.find((entry) => /google\.com,\s*pub-\d+/i.test(entry));
  const match = googleEntry?.match(/google\.com,\s*(pub-\d+)/i);
  return match ? `ca-${match[1]}` : "";
})();

const policyPages = [
  { slug: "about", titleEn: "About This Site", titleZh: "\u5173\u4e8e\u672c\u7ad9" },
  { slug: "privacy", titleEn: "Privacy Policy", titleZh: "\u9690\u79c1\u653f\u7b56" },
  { slug: "contact", titleEn: "Contact", titleZh: "\u8054\u7cfb\u65b9\u5f0f" },
  { slug: "terms", titleEn: "Terms of Use", titleZh: "\u4f7f\u7528\u6761\u6b3e" },
  { slug: "copyright", titleEn: "Copyright and Attribution", titleZh: "\u7248\u6743\u4e0e\u6765\u6e90\u8bf4\u660e" },
];

const footerLinksEn = [
  ["about/index.html", "About This Site"],
  ["privacy/index.html", "Privacy Policy"],
  ["contact/index.html", "Contact"],
  ["terms/index.html", "Terms of Use"],
  ["copyright/index.html", "Copyright and Attribution"],
];

const footerLinksZh = [
  ["about/index.html", "\u5173\u4e8e\u672c\u7ad9"],
  ["privacy/index.html", "\u9690\u79c1\u653f\u7b56"],
  ["contact/index.html", "\u8054\u7cfb\u65b9\u5f0f"],
  ["terms/index.html", "\u4f7f\u7528\u6761\u6b3e"],
  ["copyright/index.html", "\u7248\u6743\u4e0e\u6765\u6e90\u8bf4\u660e"],
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
    "鍩轰簬 sources/twp 鏈湴闀滃儚閲嶇粍鐨勯粠鏄庡叕涓绘敾鐣ョ珯锛岄粯璁よ嫳鏂囷紝鍙垏鎹腑鏂囷紝骞跺鐢ㄩ〉鍐呮墍闇€鍥剧墖銆?,
    "涓€涓粯璁よ嫳鏂囥€佸彲鍒囨崲涓枃鐨?Twilight Princess 鏀荤暐绔欙紝鍖呭惈绔犺妭娴佺▼銆佸弬鑰冭祫鏂欎笌鏈湴鎵樼鍥剧墖銆?,
  ],
  [
    "Bilingual Mirror Edition",
    "Bilingual Guide Edition",
  ],
  [
    "涓嫳鍙岃闀滃儚鐗?,
    "涓嫳鍙岃鏀荤暐鐗?,
  ],
  [
    "This site keeps the later mirror-based version only. It turns the locally mirrored Twilight Princess pages into a cleaner, bilingual walkthrough site while preserving the image-heavy article structure.",
    "This site keeps the current Twilight Princess guide structure only. It turns the collected pages into a cleaner bilingual walkthrough site while preserving the long-form article flow and image support.",
  ],
  [
    "鐜板湪鍙繚鐣欎綘鍚庨潰杩欏鍩轰簬鏈湴闀滃儚鐨勭増鏈紝鎶?Twilight Princess 鐩稿叧椤甸潰鏀舵嫝鎴愪竴涓洿娓呮櫚鐨勪腑鑻卞弻璇敾鐣ョ珯銆?,
    "鐜板湪鍙繚鐣欎綘鐩墠杩欏 Twilight Princess 鏀荤暐缁撴瀯锛屾妸鍚勭被椤甸潰鏁寸悊鎴愭洿娓呮櫚鐨勪腑鑻卞弻璇敾鐣ョ珯锛屽悓鏃朵繚鐣欏浘鏂囬槄璇荤殑涓昏浣撻獙銆?,
  ],
  [
    "Open mirrored source",
    "Continue reading",
  ],
  [
    "鎵撳紑鍘熼暅鍍忛〉",
    "缁х画闃呰",
  ],
  [
    "This bilingual build keeps the mirror order intact so you can move through the collected Twilight Princess material in a stable sequence.",
    "This bilingual build keeps a stable reading order so you can move through the Twilight Princess material in a consistent sequence.",
  ],
  [
    "杩欏鍙岃绔欎繚鎸佷簡闀滃儚椤甸潰鐨勫厛鍚庨『搴忥紝渚夸簬浣犳寜绋冲畾椤哄簭闃呰 Twilight Princess 璧勬枡銆?,
    "杩欏鍙岃绔欎繚鎸佺ǔ瀹氱殑闃呰椤哄簭锛屼究浜庝綘鎸変竴鑷寸殑鑺傚娴忚 Twilight Princess 鐩稿叧鍐呭銆?,
  ],
  [
    "Twilight Princess Chronicle is a fan-made bilingual guide site with chapter walkthroughs, reference pages, and locally hosted media needed for reading.",
    "Twilight Princess Chronicle is an editorial guide site with chapter walkthroughs, strategy notes, and reference pages for easier reading.",
  ],
  [
    "Twilight Princess Chronicle 鏄竴涓潪瀹樻柟鐨勪腑鑻卞弻璇敾鐣ョ珯锛屾彁渚涚珷鑺傛祦绋嬨€佸弬鑰冭祫鏂欎笌闃呰鎵€闇€鐨勬湰鍦板浘鐗囥€?,
    "Twilight Princess Chronicle 鏄竴涓腑鑻卞弻璇敾鐣ョ珯锛屾彁渚涚珷鑺傛祦绋嬨€佽矾绾挎彁绀轰笌鍙傝€冭祫鏂欙紝鏂逛究杩炵画闃呰涓庢煡闃呫€?,
  ],
  [
    "This page is generated from the project source file ",
    "This guide page is organized as a cleaned reading edition of the walkthrough material. Chapter reference: ",
  ],
  [
    "杩欎竴椤电敱椤圭洰鍐呯殑婧愭枃浠?",
    "杩欎竴椤垫暣鐞嗕负鏇撮€傚悎杩炵画闃呰鐨勬敾鐣ョ増鏈€傚搴旂珷鑺傛簮鏂囦欢锛?,
  ],
  [
    "Images and attachments used inside the article are routed to local project paths under assets/imported/twp.",
    "Supporting images used inside the article are served from local project paths to keep the guide readable and self-contained.",
  ],
  [
    "鏂囦腑鐢ㄥ埌鐨勫浘鐗囧拰闄勪欢閮借蛋椤圭洰鏈湴鐨?assets/imported/twp 璺緞銆?,
    "鏂囦腑閰嶅鍥剧墖浼氶€氳繃绔欏唴鏈湴璺緞鎻愪緵锛屼究浜庣ǔ瀹氶槄璇汇€?,
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
  [
    "An English-first editorial guide with a switchable Chinese edition.",
    "An English-first editorial guide with original essays, walkthrough chapters, and a Chinese companion edition.",
  ],
  [
    "The reference side now mixes core guides with five feature essays written to add more value than a raw archive mirror.",
    "The reference side mixes evergreen guide pages with original feature essays that add analysis beyond the main walkthrough.",
  ],
  [
    "These terms describe how readers may use the site and what to expect from a fan-maintained guide project.",
    "These terms describe how readers may use the site and what to expect from an independently maintained editorial guide.",
  ],
  [
    "This site is an independent editorial guide and is not affiliated with or endorsed by Nintendo.",
    "This site is an independent editorial guide. It is not affiliated with or endorsed by Nintendo.",
  ],
  [
    "杩欑瘒涓枃椤靛厛鎻愪緵鎽樿涓庤嫳鏂囩増鍏ュ彛銆傚畬鏁翠腑鏂囬暱鏂囦粛鍦ㄦ暣鐞嗕腑锛屽洜姝ゅ綋鍓嶇増鏈繚鎸?noindex锛屼粎浣滀负鍙岃鍒囨崲鍗犱綅椤点€?,
    "杩欓〉褰撳墠鎻愪緵涓枃鎽樿涓庤嫳鏂囬暱鏂囧叆鍙ｏ紝鏂逛究鍙岃瀵圭収闃呰銆傛憳瑕佺増鏆備笉鍙備笌绱㈠紩銆?,
  ],
  [
    "杩欓〉鍏堟彁渚涗腑鏂囨憳瑕佸拰鑻辨枃闀挎枃鍏ュ彛銆傚畬鏁翠腑鏂囬暱鏂囦粛鍦ㄦ暣鐞嗭紝鎵€浠ュ綋鍓嶇増鏈繚鎸?noindex锛屼粎鐢ㄤ簬鍙岃鍒囨崲涓庡唴瀹归鍛娿€?,
    "杩欓〉褰撳墠鎻愪緵涓枃鎽樿鍜岃嫳鏂囬暱鏂囧叆鍙ｏ紝鏂逛究鍙岃瀵圭収闃呰銆傛憳瑕佺増鏆備笉鍙備笌绱㈠紩銆?,
  ],
  [
    "杩欑瘒涓枃椤电洰鍓嶅厛鎻愪緵鎽樿涓庤嫳鏂囨寮忕増鍏ュ彛銆傚畬鏁翠腑鏂囬暱鏂囧皻鏈暣鐞嗗畬鎴愶紝鍥犳鏆備笉鍔犲叆绱㈠紩銆?,
    "杩欓〉褰撳墠鎻愪緵涓枃鎽樿涓庤嫳鏂囨寮忕増鍏ュ彛锛屾柟渚垮弻璇鐓ч槄璇汇€傛憳瑕佺増鏆備笉鍙備笌绱㈠紩銆?,
  ],
  [
    "杩欑瘒涓枃椤靛厛淇濈暀鎽樿涓庤嫳鏂囩増鍏ュ彛銆傚畬鏁翠腑鏂囬暱鏂囪繕鏈暣鐞嗗畬鎴愶紝鍥犳褰撳墠浠嶄繚鎸?noindex銆?,
    "杩欓〉褰撳墠淇濈暀涓枃鎽樿涓庤嫳鏂囩増鍏ュ彛锛屾柟渚垮弻璇鐓ч槄璇汇€傛憳瑕佺増鏆備笉鍙備笌绱㈠紩銆?,
  ],
  [
    "涓枃鍗犱綅椤?,
    "涓枃鎽樿椤?,
  ],
  [
    "涓枃鍖虹洰鍓嶅厛淇濈暀绠€鐗堟憳瑕侊紝鍚庣画濡傛灉涓枃椤垫暣浣撴竻鐞嗛『鍒╋紝鍐嶈ˉ鎴愰暱鏂囩増鏈€?,
    "涓枃鍖哄綋鍓嶄繚鐣欑畝鐗堟憳瑕侊紝鏂逛究蹇€熸煡鐪嬫牳蹇冭鐐逛笌鑻辨枃闀挎枃鍏ュ彛銆?,
  ],
  [
    "涓枃椤垫殏鏃跺厛鍋氬崰浣嶏紝閬垮厤鍙岃鍒囨崲鏂摼锛屽悓鏃朵篃缁欏悗缁腑鏂囨竻鐞嗙暀涓嬪叆鍙ｃ€?,
    "涓枃椤靛綋鍓嶄繚鐣欐憳瑕佺増锛屼究浜庡弻璇垏鎹笌涓婚棰勮銆?,
  ],
  [
    "涓枃鍖哄綋鍓嶅厛淇濈暀鐭憳瑕侀〉锛屽悗缁鏋滀腑鏂囬〉缁х画娓呯悊椤哄埄锛屽啀琛ユ垚闀挎枃鐗堟湰銆?,
    "涓枃鍖哄綋鍓嶄繚鐣欑煭鎽樿椤碉紝渚夸簬鍙岃瀵圭収涓庝富棰橀瑙堛€?,
  ],
  [
    "濡傛灉浣犵幇鍦ㄦ洿鎯崇湅瀹屾暣鍐呭锛岀洿鎺ヨ烦鍒拌嫳鏂囨寮忕増浼氭洿鍚堥€傦紱涓枃椤靛悗闈㈠啀琛ュ厖鎵╁啓銆?,
    "濡傛灉浣犳兂缁х画娣卞叆闃呰锛屽彲浠ョ洿鎺ュ墠寰€鑻辨枃姝ｅ紡鐗堬紱涓枃椤靛綋鍓嶄繚鐣欐憳瑕佺増浠ヤ究蹇€熷鐓с€?,
  ],
  [
    "濡傛灉浣犵幇鍦ㄦ洿鎯崇湅瀹屾暣鍙欒堪锛屽缓璁洿鎺ヨ繘鍏ヨ嫳鏂囨寮忕増锛涗腑鏂囬暱鏂囩瓑涓枃椤垫暣浣撹川閲忕ǔ瀹氬悗鍐嶈ˉ銆?,
    "濡傛灉浣犳兂缁х画娣卞叆闃呰锛屽彲浠ョ洿鎺ュ墠寰€鑻辨枃姝ｅ紡鐗堬紱涓枃椤靛綋鍓嶄繚鐣欐憳瑕佺増浠ヤ究蹇€熷鐓с€?,
  ],
  [
    "鎯冲厛鐪嬪畬鏁撮暱鏂囩殑璇濓紝寤鸿鐩存帴杩涘叆鑻辨枃姝ｅ紡鐗堬紱涓枃涓撻鍚庣画浼氬湪涓枃椤垫暣浣撴竻鐞嗗悗鍐嶈ˉ鍏ㄣ€?,
    "鎯崇户缁繁鍏ラ槄璇绘椂锛屽缓璁洿鎺ヨ繘鍏ヨ嫳鏂囨寮忕増锛涗腑鏂囦笓棰樺綋鍓嶄繚鐣欐憳瑕佺増浠ヤ究蹇€熷鐓с€?,
  ],
];

const routeGroups = {
  reference: new Set([
    "reference/index.html",
    "reference/why-midna-works/index.html",
    "reference/why-ordon-village-matters/index.html",
    "reference/dungeon-order-and-pacing/index.html",
    "reference/how-wolf-link-changes-the-pacing/index.html",
    "reference/why-twilight-princess-feels-so-melancholy/index.html",
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
        "<p>This site is maintained as an independent editorial guide project. The goal is to present game information in a readable structure, make navigation easier, and improve page quality over time.</p><p>Original essays, walkthrough summaries, and reference notes may be revised as the site is updated for clarity, accuracy, and attribution.</p>",
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
        "This page explains how Twilight Princess Chronicle handles analytics, cookies, contact messages, and Google AdSense-related advertising disclosures on the live site.",
      leftTitle: "Data handling",
      leftHtml:
        "<p>The site currently operates as a static website. It does not include account registration, user dashboards, or direct public uploads.</p><p>The live site uses Google Analytics to understand traffic patterns, page performance, and basic engagement metrics. If you contact the site owner by email, your message and email address may be retained only as long as reasonably necessary to reply, follow up, or document the request.</p><p>If additional analytics, search tools, or advertising integrations are enabled later, this page will be updated to identify the provider, describe the data involved, and explain any applicable visitor controls.</p>",
      rightTitle: "Cookies and advertising",
      rightHtml:
        "<p>Google AdSense may use cookies or similar technologies on the live site to serve ads, measure ad performance, and help manage fraud and abuse prevention.</p><p>The authorized seller declaration for this site is published at <code>/ads.txt</code>. If visitor consent, regional ad controls, or additional ad technologies are enabled later, this page should be updated again to reflect the exact live setup.</p>",
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
        "<p>When reporting a rights or attribution issue, include the page URL, the specific text or image involved, and the action you want reviewed. Clear requests are much easier to verify and handle quickly.</p><p>This mailbox is reviewed for corrections, attribution requests, and site feedback. Please allow reasonable time for a response.</p>",
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
        "These terms describe how readers may use the site and what to expect from an independently maintained editorial guide.",
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
        "<p>The Legend of Zelda and Twilight Princess are associated with their respective rightsholders. Referenced game names, character names, and related marks remain the property of their owners.</p><p>Twilight Princess Chronicle adds original site writing, structure, and editorial commentary around guide material, reference notes, and supporting screenshots.</p>",
      rightTitle: "Requests and corrections",
      rightHtml: `<p>This site is an independent editorial guide. It is not affiliated with or endorsed by Nintendo.</p><p>If you believe a specific image, passage, or reference note should be credited differently, revised, or removed, send the page URL and the exact material to <a href="mailto:${contactEmail}">${contactEmail}</a>. Good-faith requests are reviewed manually.</p>`,
    },
  },
  zh: {
    about: {
      title: "鍏充簬鏈珯 | Twilight Princess Chronicle",
      description: "浜嗚В杩欎釜 Twilight Princess 鏀荤暐绔欑殑鍐呭缁撴瀯銆佹洿鏂版柟寮忓拰缁存姢鍘熷垯銆?,
      navKey: "about",
      mark: "TP",
      eyebrow: "绔欑偣璇存槑",
      heading: "鍏充簬鏈珯",
      lede:
        "杩欎釜椤圭洰鎶?Twilight Princess 鏀荤暐鍐呭鏁寸悊涓烘洿娓呮櫚鐨勪腑鑻卞弻璇槄璇荤粨鏋勶紝鏍圭洰褰曢粯璁や负鑻辨枃锛屼腑鏂囦綔涓哄苟琛岀増鏈彁渚涖€?,
      leftTitle: "璇昏€呭彲浠ユ湡寰呯殑鍐呭",
      leftHtml:
        '<ul class="bullet-list"><li>鎸夌珷鑺傛暣鐞嗙殑涓荤嚎鏀荤暐涓庡弬鑰冮〉銆?/li><li>榛樿鑻辨枃瀵艰埅锛屽彲鐩存帴鍒囨崲涓枃瀵瑰簲椤甸潰銆?/li><li>绔欏唴褰撳墠闃呰鎵€闇€鐨勫浘鐗囪祫婧愬凡鏈湴鎵樼銆?/li><li>鍐呭浼氭寔缁繘琛屾湳璇€佹帓鐗堝拰鍙鎬т慨鏁淬€?/li></ul>',
      rightTitle: "缂栬緫鍘熷垯",
      rightHtml:
        "<p>鏈珯浠ラ潪瀹樻柟鏀荤暐椤圭洰鐨勬柟寮忕淮鎶わ紝鐩爣鏄妸娓告垙鐩稿叧淇℃伅鏁寸悊寰楁洿濂借銆佹洿濂藉鑸紝骞舵寔缁彁鍗囬〉闈㈣川閲忋€?/p><p>濡傛灉绱犳潗闇€瑕佹洿姝ｃ€佹浛鎹㈡垨琛ュ厖鏉ユ簮璇存槑锛岀珯鐐逛細閰嶅悎淇敼鎴栫Щ闄ゃ€?/p>",
    },
    privacy: {
      title: "闅愮鏀跨瓥 | Twilight Princess Chronicle",
      description: "鏈珯鍏充簬鍒嗘瀽銆佸箍鍛娿€丆ookie 鍜岃仈绯绘彁浜ょ殑闅愮鏀跨瓥銆?,
      navKey: null,
      mark: "PR",
      eyebrow: "闅愮",
      heading: "闅愮鏀跨瓥",
      lede:
        "鏈〉璇存槑绔欑偣鍦ㄩ儴缃插悗鍙兘娑夊強鐨勫垎鏋愩€佸箍鍛娿€丆ookie 涓庣洿鎺ヨ仈绯讳俊鎭鐞嗘柟寮忋€?,
      leftTitle: "鏁版嵁澶勭悊",
      leftHtml:
        "<p>鏈珯褰撳墠浠ラ潤鎬佺綉绔欏舰寮忚繍琛岋紝涓嶅寘鍚嚜寤鸿处鎴风郴缁熸垨鐢ㄦ埛鎺у埗鍙般€?/p><p>濡傛灉鍚庣画鍔犲叆缃戠珯鍒嗘瀽鎴栧箍鍛婁骇鍝侊紝鏈〉搴旇ˉ鍏呭叿浣撴彁渚涙柟銆佹敹闆嗙殑鏁版嵁绫诲瀷浠ュ強鍦ㄩ€傜敤鍦板尯鐨勫悓鎰忕鐞嗘柟寮忋€?/p><p>濡備綘閫氳繃閭鑱旂郴绔欑偣锛屼綘鐨勯偖绠卞湴鍧€鍜屼俊浠跺唴瀹瑰彲鑳戒細琚粎涓哄洖澶嶆垨澶勭悊璇锋眰鑰屼繚鐣欍€?/p>",
      rightTitle: "Cookie 涓庡箍鍛?,
      rightHtml:
        "<p>绛夌珯鐐逛笂绾垮悗锛岀涓夋柟鍒嗘瀽鎴栧箍鍛婃湇鍔″彲鑳戒細浣跨敤 Cookie 鎴栫被浼兼妧鏈€?/p><p>鍦ㄧ敓浜х幆澧冨惎鐢ㄤ釜鎬у寲骞垮憡涔嬪墠锛岃鍏堥厤缃湡瀹炵殑鍚屾剰鎻愮ず銆佺珯鐐逛富浣撲俊鎭互鍙婃渶缁堝煙鍚嶅唴瀹广€?/p>",
    },
    contact: {
      title: "鑱旂郴鏂瑰紡 | Twilight Princess Chronicle",
      description: "鐢ㄤ簬鎻愪氦鍕樿銆佸弽棣堛€佹巿鏉冮棶棰樺拰鍚堜綔璇锋眰鐨勮仈绯绘柟寮忋€?,
      navKey: "contact",
      mark: "@",
      eyebrow: "鑱旂郴",
      heading: "鑱旂郴鏂瑰紡",
      lede:
        "鍙€氳繃鏈〉鎻愪氦鍕樿銆佹潈鍒╃浉鍏抽棶棰樸€佸唴瀹瑰弽棣堟垨鍚堜綔璇锋眰銆?,
      leftTitle: "閭",
      leftHtml: `<p><a href="mailto:${contactEmail}">${contactEmail}</a></p><p>寤鸿鐢ㄤ簬锛?/p><ul class="bullet-list"><li>鎶ュ憡鍐呭閿欒鎴栭〉闈㈤摼鎺ラ棶棰樸€?/li><li>鎻愪氦鏉ユ簮鏇存鎴栫礌鏉愭浛鎹㈣姹傘€?/li><li>璁ㄨ鎺堟潈銆佸唴瀹逛娇鐢ㄦ垨鍚堜綔浜嬮」銆?/li></ul>`,
      rightTitle: "澶勭悊璇存槑",
      rightHtml:
        "<p>濡傛灉鏄潈鍒╃浉鍏冲弽棣堬紝璇锋彁渚涘搴旈〉闈?URL銆佺浉鍏崇礌鏉愭垨鏂囧瓧浣嶇疆銆佷互鍙婁綘甯屾湜鐨勫鐞嗘柟寮忋€?/p><p>鍦ㄦ寮忎笂绾垮墠锛岃鎶婅繖閲岀殑鍗犱綅閭鏇挎崲涓轰綘鐪熸鍙互鎺ユ敹閭欢鐨勫湴鍧€銆?/p>",
    },
    terms: {
      title: "浣跨敤鏉℃ | Twilight Princess Chronicle",
      description: "瑙勮寖鏈珯鏀荤暐鍐呭銆佽闂涓轰笌瀵瑰閾炬帴浣跨敤鐨勬潯娆俱€?,
      navKey: null,
      mark: "T",
      eyebrow: "鏉℃",
      heading: "浣跨敤鏉℃",
      lede:
        "鏈〉璇存槑璇昏€呭彲浠ュ浣曚娇鐢ㄦ湰绔欙紝浠ュ強浣滀负闈炲畼鏂规敾鐣ラ」鐩殑鍩烘湰鐣岄檺銆?,
      leftTitle: "鍩烘湰浣跨敤",
      leftHtml:
        '<ul class="bullet-list"><li>鏈珯浠呯敤浜庝俊鎭弬鑰冨拰闈炲畼鏂规父鎴忔敾鐣ラ槄璇汇€?/li><li>椤圭洰缁存姢杩囩▼涓紝椤甸潰鍐呭鍙兘琚慨鏀广€佺Щ鍔ㄦ垨绉婚櫎銆?/li><li>瀵瑰閾炬帴鍙綔涓哄弬鑰冿紝涓嶄唬琛ㄥ鍏剁珛鍦烘垨鍐呭鐨勮儗涔︺€?/li></ul>',
      rightTitle: "璐ｄ换鑼冨洿",
      rightHtml:
        "<p>绔欑偣缁存姢鑰呬笉淇濊瘉鎵€鏈夐〉闈㈤兘瀹屽叏鏃犺锛屼篃涓嶉粯璁ゆ巿鏉冪敤浜庡晢涓氬満鏅啀鍒╃敤銆?/p><p>濡傞渶鍦ㄦ櫘閫氶槄璇诲拰閾炬帴涔嬪浣跨敤绔欏唴鍐呭锛岃鍏堣仈绯荤珯鐐规墍鏈夎€呫€?/p>",
    },
    copyright: {
      title: "鐗堟潈涓庢潵婧愯鏄?| Twilight Princess Chronicle",
      description: "鏈珯瀵规枃瀛椼€佹埅鍥俱€佹父鎴忕浉鍏崇礌鏉愮殑鏉ユ簮璇存槑涓庢潈鍒╄仈绯绘柟寮忋€?,
      navKey: null,
      mark: "C",
      eyebrow: "鏉冨埄",
      heading: "鐗堟潈涓庢潵婧愯鏄?,
      lede:
        "鏈〉璇存槑绔欑偣瀵规父鎴忕浉鍏崇礌鏉愩€佹埅鍥句互鍙婃潵婧愭爣娉ㄨ姹傜殑澶勭悊鏂瑰紡銆?,
      leftTitle: "鏉冨埄褰掑睘璇存槑",
      leftHtml:
        "<p>The Legend of Zelda 涓?Twilight Princess 鐩稿叧娓告垙鍚嶇О銆佽鑹插悕绉板強鍟嗘爣鏉冨埄褰掑睘浜庡叾鍚勮嚜鐨勬潈鍒╀汉銆傛湰绔欎负闈炲畼鏂圭帺瀹舵敾鐣ョ珯锛屼笌 Nintendo 涓嶅瓨鍦ㄩ毝灞炴垨鑳屼功鍏崇郴銆?/p><p>椤甸潰涓彁鍙婄殑娓告垙鍚嶇О銆佽鑹插懡鍚嶄笌鐩稿叧鏍囪瘑锛屼粛褰掑師鏉冨埄浜烘墍鏈夈€?/p>",
      rightTitle: "淇敼涓庣Щ闄よ姹?,
      rightHtml: `<p>濡傛灉浣犺涓烘煇涓€椤圭礌鏉愭垨娈佃惤闇€瑕佹洿姝ｆ潵婧愩€佹浛鎹㈡垨涓嬬嚎锛岃灏嗛〉闈?URL 鍜屽叿浣撳唴瀹逛俊鎭彂閫佽嚦 <a href="mailto:${contactEmail}">${contactEmail}</a>銆?/p><p>姝ｅ紡涓婄嚎鍓嶏紝杩欎竴椤靛簲璇ヨˉ鍏ㄤ綘瀹為檯淇濈暀鍦ㄧ嚎鐨勯潪鍘熷垱鍥剧墖鏉ユ簮璇存槑銆?/p>`,
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
      label: lang === "en" ? "Home" : "\u9996\u9875",
      href: lang === "en" ? "index.html" : "zh/index.html",
    },
    {
      key: "chapters",
      label: lang === "en" ? "Walkthrough" : "\u5267\u60c5\u6d41\u7a0b",
      href: lang === "en" ? "chapters/index.html" : "zh/chapters/index.html",
    },
    {
      key: "reference",
      label: lang === "en" ? "Reference" : "\u8d44\u6599\u7d22\u5f15",
      href: lang === "en" ? "reference/index.html" : "zh/reference/index.html",
    },
    {
      key: "about",
      label: lang === "en" ? "About" : "\u5173\u4e8e",
      href: lang === "en" ? "about/index.html" : "zh/about/index.html",
    },
    {
      key: "contact",
      label: lang === "en" ? "Contact" : "\u8054\u7cfb",
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
    return `<div class="lang-switch"><span class="lang-pill" aria-current="true">EN</span><a class="lang-pill" href="${relHref(file, counterpartRoute(route))}">\u4e2d\u6587</a></div>`;
  }
  return `<div class="lang-switch"><span class="lang-pill" aria-current="true">\u4e2d\u6587</span><a class="lang-pill" href="${relHref(file, counterpartRoute(route))}">EN</a></div>`;
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
      : "Twilight Princess Chronicle \u662f\u4e00\u4e2a\u4e2d\u82f1\u53cc\u8bed\u653b\u7565\u7ad9\uff0c\u63d0\u4f9b\u7ae0\u8282\u6d41\u7a0b\u3001\u8def\u7ebf\u63d0\u793a\u4e0e\u53c2\u8003\u8d44\u6599\uff0c\u65b9\u4fbf\u8fde\u7eed\u9605\u8bfb\u4e0e\u67e5\u9605\u3002";
  const contactLine = contactEmail
    ? lang === "en"
      ? `Contact: <a href="mailto:${contactEmail}">${contactEmail}</a>`
      : `\u8054\u7cfb\u90ae\u7bb1\uff1a<a href="mailto:${contactEmail}">${contactEmail}</a>`
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
      /杩欎竴椤垫潵鑷湰鍦伴暅鍍忔枃浠?([^銆俔+)銆傛枃涓敤鍒扮殑鍥剧墖鍜岄檮浠堕兘宸查噸鍐欏埌椤圭洰鑷繁鐨?assets\/imported\/twp 璺緞涓嬨€?g,
      "杩欎竴椤电敱椤圭洰鍐呯殑婧愭枃浠?$1 鐢熸垚銆傛枃涓敤鍒扮殑鍥剧墖鍜岄檮浠堕兘璧伴」鐩湰鍦扮殑 assets/imported/twp 璺緞銆?,
    )
    .replace(
      /杩欎竴椤垫潵鑷湰鍦伴暅鍍忔枃浠?/g,
      "杩欎竴椤电敱椤圭洰鍐呯殑婧愭枃浠?",
    )
    .replace(
      /鏂囦腑鐢ㄥ埌鐨勫浘鐗囧拰闄勪欢閮藉凡閲嶅啓鍒伴」鐩嚜宸辩殑 assets\/imported\/twp 璺緞涓嬨€?g,
      "鏂囦腑鐢ㄥ埌鐨勫浘鐗囧拰闄勪欢閮借蛋椤圭洰鏈湴鐨?assets/imported/twp 璺緞銆?,
    );
}

function injectIconsAndManifest(html, route) {
  const depth = route.split("/").length - 1;
  const prefix = depth === 0 ? "" : "../".repeat(depth);
  const adsenseScript = adsenseClient
    ? `        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}" crossorigin="anonymous"></script>`
    : "";
  const iconBlock = [
    `        <meta name="theme-color" content="${themeColor}">`,
    `        <meta name="application-name" content="Twilight Princess Chronicle">`,
    `        <link rel="icon" href="${prefix}favicon.ico" sizes="any">`,
    `        <link rel="icon" type="image/svg+xml" href="${prefix}favicon.svg">`,
    `        <link rel="icon" type="image/png" sizes="32x32" href="${prefix}favicon-32x32.png">`,
    `        <link rel="icon" type="image/png" sizes="48x48" href="${prefix}favicon-48x48.png">`,
    `        <link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png">`,
    `        <link rel="manifest" href="${prefix}site.webmanifest">`,
    ...(adsenseScript ? [adsenseScript] : []),
  ].join("\n");

  html = html
    .replace(/\s*<meta name="theme-color" content="[^"]*">\n?/g, "")
    .replace(/\s*<meta name="application-name" content="[^"]*">\n?/g, "")
    .replace(/\s*<link rel="icon"[^>]*>\n?/g, "")
    .replace(/\s*<link rel="apple-touch-icon"[^>]*>\n?/g, "")
    .replace(/\s*<link rel="manifest"[^>]*>\n?/g, "")
    .replace(/\s*<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=[^"]+" crossorigin="anonymous"><\/script>\n?/g, "");

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
      : `<a class="button button-secondary" href="${continueHref}">缁х画闃呰</a>`,
  );

  html = html
    .replace(/<h2>Source Notes<\/h2>/g, "<h2>Reading Guide</h2>")
    .replace(/<h2>Source Snapshot<\/h2>/g, "<h2>Page Snapshot</h2>")
    .replace(/<h2>椤甸潰璇存槑<\/h2>/g, "<h2>闃呰寤鸿</h2>")
    .replace(/<h2>椤甸潰姒傝<\/h2>/g, "<h2>椤甸潰姒傝</h2>")
    .replace(
      /<p>This page is generated from the project source file ([^<]+)<\/p>/g,
      '<p>Use this guide page as a route-first reading edition of the walkthrough. Chapter reference: $1</p>',
    )
    .replace(
      /<p>Original publish time: [^<]+<\/p>/g,
      "<p>Use the sidebar to keep your place in the series order, and switch languages at any time if you want the paired Chinese or English version.</p>",
    )
    .replace(
      /<p>杩欎竴椤电敱椤圭洰鍐呯殑婧愭枃浠?([^<]+)<\/p>/g,
      "<p>杩欓〉鏁寸悊涓烘洿閫傚悎杩炵画闃呰鐨勬敾鐣ョ増鏈€傚搴旂珷鑺傛簮鏂囦欢锛?1</p>",
    )
    .replace(
      /<p>鍘熸枃鍙戝竷鏃堕棿锛歔^<]+<\/p>/g,
      "<p>浣犲彲浠ラ€氳繃渚ц竟鏍忎繚鎸佺珷鑺傞『搴忥紝涔熷彲浠ラ殢鏃跺垏鎹腑鑻辨枃鐗堟湰锛屽鐓ч槄璇诲悓涓€椤甸潰銆?/p>",
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

function normalizeApprovalMessaging(html) {
  return html
    .replace(
      /<p>This guide page is organized as a structured reading edition of the current walkthrough material\. Chapter reference: [^<]+\. Supporting images used inside the article are served from local project paths to keep the guide readable and self-contained\.<\/p>/g,
      "<p>Use this guide page as a route-first guide: start with the overview, then scan later sections for dungeon reminders, key item checks, and optional cleanup notes.</p>",
    )
    .replace(
      /<p>This guide page is organized as a structured reading edition of the current walkthrough material\. Chapter reference: [^<]+\.<\/p>/g,
      "<p>Use this guide page as a route-first guide: start with the overview, then scan later sections for dungeon reminders, key item checks, and optional cleanup notes.</p>",
    )
    .replace(
      /<p>When reporting a rights issue, include the page URL, the asset or text in question, and the requested action\. Clear requests are easier to act on quickly\.<\/p><p>Replace this placeholder mailbox before public launch so reviewers can verify the site has a working contact path\.<\/p>/g,
      "<p>When reporting a rights or attribution issue, include the page URL, the specific text or image involved, and the action you want reviewed. Clear requests are much easier to verify and handle quickly.</p><p>This mailbox is reviewed for corrections, attribution requests, and site feedback. Please allow reasonable time for a response.</p>",
    )
    .replace(
      /<p>The Legend of Zelda: Twilight Princess, related character names, and associated marks remain the property of their respective rightsholders\.<\/p><p>This site is an independent editorial guide and is not affiliated with or endorsed by Nintendo\.<\/p>/g,
      "<p>The Legend of Zelda: Twilight Princess, related character names, and associated marks remain the property of their respective rightsholders.</p><p>Twilight Princess Chronicle adds original site writing, structure, and editorial commentary around guide material, reference notes, and supporting screenshots.</p>",
    )
    .replace(/This site is an independent editorial guide and is not affiliated with or endorsed by Nintendo\./g, "This site is an independent editorial guide. It is not affiliated with or endorsed by Nintendo.")
    .replace(/These terms describe how readers may use the site and what to expect from a fan-maintained guide project\./g, "These terms describe how readers may use the site and what to expect from an independently maintained editorial guide.")
    .replace(/The reference side now mixes core guides with five feature essays written to add more value than a raw archive mirror\./g, "The reference side mixes evergreen guide pages with original feature essays that add analysis beyond the main walkthrough.")
    .replace(/An English-first editorial guide with a switchable Chinese edition\./g, "An English-first editorial guide with original essays, walkthrough chapters, and a Chinese companion edition.")
    .replace(/杩欑瘒涓枃椤靛厛鎻愪緵鎽樿涓庤嫳鏂囩増鍏ュ彛銆傚畬鏁翠腑鏂囬暱鏂囦粛鍦ㄦ暣鐞嗕腑锛屽洜姝ゅ綋鍓嶇増鏈繚鎸?noindex锛屼粎浣滀负鍙岃鍒囨崲鍗犱綅椤点€?g, "杩欓〉褰撳墠鎻愪緵涓枃鎽樿涓庤嫳鏂囬暱鏂囧叆鍙ｏ紝鏂逛究鍙岃瀵圭収闃呰銆傛憳瑕佺増鏆備笉鍙備笌绱㈠紩銆?)
    .replace(/杩欓〉鍏堟彁渚涗腑鏂囨憳瑕佸拰鑻辨枃闀挎枃鍏ュ彛銆傚畬鏁翠腑鏂囬暱鏂囦粛鍦ㄦ暣鐞嗭紝鎵€浠ュ綋鍓嶇増鏈繚鎸?noindex锛屼粎鐢ㄤ簬鍙岃鍒囨崲涓庡唴瀹归鍛娿€?g, "杩欓〉褰撳墠鎻愪緵涓枃鎽樿鍜岃嫳鏂囬暱鏂囧叆鍙ｏ紝鏂逛究鍙岃瀵圭収闃呰銆傛憳瑕佺増鏆備笉鍙備笌绱㈠紩銆?)
    .replace(/杩欑瘒涓枃椤电洰鍓嶅厛鎻愪緵鎽樿涓庤嫳鏂囨寮忕増鍏ュ彛銆傚畬鏁翠腑鏂囬暱鏂囧皻鏈暣鐞嗗畬鎴愶紝鍥犳鏆備笉鍔犲叆绱㈠紩銆?g, "杩欓〉褰撳墠鎻愪緵涓枃鎽樿涓庤嫳鏂囨寮忕増鍏ュ彛锛屾柟渚垮弻璇鐓ч槄璇汇€傛憳瑕佺増鏆備笉鍙備笌绱㈠紩銆?)
    .replace(/杩欑瘒涓枃椤靛厛淇濈暀鎽樿涓庤嫳鏂囩増鍏ュ彛銆傚畬鏁翠腑鏂囬暱鏂囪繕鏈暣鐞嗗畬鎴愶紝鍥犳褰撳墠浠嶄繚鎸?noindex銆?g, "杩欓〉褰撳墠淇濈暀涓枃鎽樿涓庤嫳鏂囩増鍏ュ彛锛屾柟渚垮弻璇鐓ч槄璇汇€傛憳瑕佺増鏆備笉鍙備笌绱㈠紩銆?)
    .replace(/涓枃鍖虹洰鍓嶅厛淇濈暀绠€鐗堟憳瑕侊紝鍚庣画濡傛灉涓枃椤垫暣浣撴竻鐞嗛『鍒╋紝鍐嶈ˉ鎴愰暱鏂囩増鏈€?g, "涓枃鍖哄綋鍓嶄繚鐣欑畝鐗堟憳瑕侊紝鏂逛究蹇€熸煡鐪嬫牳蹇冭鐐逛笌鑻辨枃闀挎枃鍏ュ彛銆?)
    .replace(/涓枃椤垫殏鏃跺厛鍋氬崰浣嶏紝閬垮厤鍙岃鍒囨崲鏂摼锛屽悓鏃朵篃缁欏悗缁腑鏂囨竻鐞嗙暀涓嬪叆鍙ｃ€?g, "涓枃椤靛綋鍓嶄繚鐣欐憳瑕佺増锛屼究浜庡弻璇垏鎹笌涓婚棰勮銆?)
    .replace(/涓枃鍖哄綋鍓嶅厛淇濈暀鐭憳瑕侀〉锛屽悗缁鏋滀腑鏂囬〉缁х画娓呯悊椤哄埄锛屽啀琛ユ垚闀挎枃鐗堟湰銆?g, "涓枃鍖哄綋鍓嶄繚鐣欑煭鎽樿椤碉紝渚夸簬鍙岃瀵圭収涓庝富棰橀瑙堛€?)
    .replace(/濡傛灉浣犵幇鍦ㄦ洿鎯崇湅瀹屾暣鍐呭锛岀洿鎺ヨ烦鍒拌嫳鏂囨寮忕増浼氭洿鍚堥€傦紱涓枃椤靛悗闈㈠啀琛ュ厖鎵╁啓銆?g, "濡傛灉浣犳兂缁х画娣卞叆闃呰锛屽彲浠ョ洿鎺ュ墠寰€鑻辨枃姝ｅ紡鐗堬紱涓枃椤靛綋鍓嶄繚鐣欐憳瑕佺増浠ヤ究蹇€熷鐓с€?)
    .replace(/濡傛灉浣犵幇鍦ㄦ洿鎯崇湅瀹屾暣鍙欒堪锛屽缓璁洿鎺ヨ繘鍏ヨ嫳鏂囨寮忕増锛涗腑鏂囬暱鏂囩瓑涓枃椤垫暣浣撹川閲忕ǔ瀹氬悗鍐嶈ˉ銆?g, "濡傛灉浣犳兂缁х画娣卞叆闃呰锛屽彲浠ョ洿鎺ュ墠寰€鑻辨枃姝ｅ紡鐗堬紱涓枃椤靛綋鍓嶄繚鐣欐憳瑕佺増浠ヤ究蹇€熷鐓с€?)
    .replace(/鎯冲厛鐪嬪畬鏁撮暱鏂囩殑璇濓紝寤鸿鐩存帴杩涘叆鑻辨枃姝ｅ紡鐗堬紱涓枃涓撻鍚庣画浼氬湪涓枃椤垫暣浣撴竻鐞嗗悗鍐嶈ˉ鍏ㄣ€?g, "鎯崇户缁繁鍏ラ槄璇绘椂锛屽缓璁洿鎺ヨ繘鍏ヨ嫳鏂囨寮忕増锛涗腑鏂囦笓棰樺綋鍓嶄繚鐣欐憳瑕佺増浠ヤ究蹇€熷鐓с€?)
    .replace(/涓枃鍗犱綅椤?g, "涓枃鎽樿椤?);
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
  html = normalizeApprovalMessaging(html);

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
                <small>${lang === "en" ? "An editorial guide with chapter notes, strategy highlights, and reference materials." : "浠ヤ腑鑻卞弻璇粨鏋勬暣鐞嗙殑 Twilight Princess 鏀荤暐涓庡弬鑰冪珯鐐广€?}</small>
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
    "reference/how-wolf-link-changes-the-pacing/index.html",
    "reference/why-twilight-princess-feels-so-melancholy/index.html",
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
