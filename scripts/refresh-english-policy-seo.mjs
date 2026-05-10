import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const siteConfigPath = path.join(root, "site.config.json");
const defaultSiteConfig = {
  contactEmail: "",
};

let siteConfig = defaultSiteConfig;

try {
  const parsedSiteConfig = JSON.parse(await fs.readFile(siteConfigPath, "utf8"));
  siteConfig = {
    ...defaultSiteConfig,
    ...parsedSiteConfig,
  };
} catch {
  siteConfig = defaultSiteConfig;
}

const contactEmail =
  typeof siteConfig.contactEmail === "string" ? siteConfig.contactEmail.trim() : "";
const contactLink = contactEmail
  ? `<a href="mailto:${contactEmail}">${contactEmail}</a>`
  : `<a href="mailto:contact@example.com">contact@example.com</a>`;

const files = [
  "index.html",
  "chapters/index.html",
  "reference/index.html",
  "about/index.html",
  "privacy/index.html",
  "contact/index.html",
  "terms/index.html",
  "copyright/index.html",
];

const replacements = new Map([
  [
    'content="An English-first Twilight Princess walkthrough with chapter guides, reference pages, and locally hosted screenshots."',
    'content="A polished Twilight Princess walkthrough with story chapters, reference guides, and locally hosted screenshots."',
  ],
  [
    "<title>Twilight Princess Walkthrough Chapters</title>",
    "<title>Walkthrough Chapters | Twilight Princess Chronicle</title>",
  ],
  [
    'content="Chapter-by-chapter Twilight Princess walkthrough covering the full story route from Ordon Village to Hyrule Castle."',
    'content="Browse the full Twilight Princess walkthrough chapter by chapter, from Ordon Village to the final battle at Hyrule Castle."',
  ],
  [
    "<title>Twilight Princess Reference Library</title>",
    "<title>Reference Library | Twilight Princess Chronicle</title>",
  ],
  [
    'content="Reference pages for Twilight Princess, including the story intro, character guide, epilogue, and appendix."',
    'content="Explore supporting Twilight Princess reference pages, including the story introduction, character guide, epilogue, and appendix."',
  ],
  [
    "<title>About Twilight Princess Chronicle</title>",
    "<title>About This Site | Twilight Princess Chronicle</title>",
  ],
  [
    'content="Learn how this Twilight Princess guide is organized, updated, and maintained for readers."',
    'content="Learn what Twilight Princess Chronicle covers, how the guide is structured, and how the project is maintained."',
  ],
  [
    "This project organizes Twilight Princess walkthrough material into a cleaner bilingual reading experience, with English at the root and Chinese as a parallel version.",
    "Twilight Princess Chronicle is an English-first fan guide built to make the game's main route, supporting references, and archived screenshots easier to browse in one place.",
  ],
  [
    "<h2>What readers can expect</h2>",
    "<h2>What The Site Includes</h2>",
  ],
  [
    "Chapter-by-chapter story guidance and reference pages.",
    "Chapter-by-chapter walkthrough coverage for the full main story route.",
  ],
  [
    "English-first navigation with direct Chinese-language counterparts.",
    "English-first navigation with direct Chinese counterparts for the current site structure.",
  ],
  [
    "Local hosting for the media assets currently used by the pages.",
    "Locally hosted screenshots and imported media used to support reading and route context.",
  ],
  [
    "Ongoing cleanup for clarity, consistency, and terminology.",
    "Reference pages for story setup, characters, ending notes, and optional cleanup material.",
  ],
  [
    "<h2>Editorial approach</h2>",
    "<h2>Editorial Approach</h2>",
  ],
  [
    "This site is maintained as a fan guide project. The goal is to present game information in a readable structure, make navigation easier, and improve page quality over time.",
    "The site is maintained as a fan reference project rather than an official publisher resource. Its purpose is to organize walkthrough material clearly, improve readability, and keep the current archive usable as a structured guide.",
  ],
  [
    "When material needs correction, replacement, or attribution updates, the site owner can revise or remove it.",
    "Pages may be revised over time for wording, consistency, source attribution, or navigation. If a page needs correction or a source note needs updating, the site owner may edit or remove the affected material.",
  ],
  [
    'content="Privacy policy covering analytics, advertising, cookies, and contact submissions for this site."',
    'content="Read how Twilight Princess Chronicle may handle analytics, advertising, cookies, and contact messages after launch."',
  ],
  [
    "This page explains how the site may handle analytics, advertising, cookies, and direct contact messages after deployment.",
    "This policy explains how Twilight Princess Chronicle may handle analytics, cookies, advertising, and direct messages once the site is publicly deployed.",
  ],
  [
    "<h2>Data handling</h2>",
    "<h2>Information We Handle</h2>",
  ],
  [
    "The site currently operates as a static website. It does not include a custom account system or user dashboard.",
    "The current site is a static guide and does not provide account registration, user dashboards, or direct public uploads. Most visitors can browse the site without actively submitting personal information.",
  ],
  [
    "If analytics or advertising products are added later, this page should be updated to disclose the provider, the data collected, and how users can manage consent where required.",
    "If analytics, search tools, or advertising services are added later, this policy should be updated to identify the provider, explain what data is collected, and note any visitor controls or consent tools used on the live site.",
  ],
  [
    "If you contact the site owner by email, your message and email address may be retained only as long as needed to reply or handle the request.",
    "If you contact the site owner by email, your email address and the contents of your message may be retained only as long as reasonably necessary to respond, follow up, or document the request.",
  ],
  [
    "<h2>Cookies and advertising</h2>",
    "<h2>Cookies And Advertising</h2>",
  ],
  [
    "Third-party services such as analytics platforms or advertising networks may use cookies or similar technologies after launch.",
    "Third-party services such as analytics platforms or advertising networks may use cookies or similar technologies if they are enabled after launch.",
  ],
  [
    "Before enabling personalized ads in a production environment, add a real consent solution, a real publisher identity, and your final domain details to this page.",
    "If the production site runs advertising, this page should reflect the final ad provider, the live domain, and any consent or preference tools offered to visitors in applicable regions.",
  ],
  [
    'content="Contact details for feedback, corrections, rights issues, and partnership requests."',
    'content="Use the contact page for corrections, attribution updates, rights questions, and partnership inquiries."',
  ],
  [
    "Use this page for corrections, rights concerns, content feedback, or collaboration requests.",
    "Use this page to report corrections, request attribution updates, raise rights questions, or get in touch about the project.",
  ],
  [
    "<h2>Email</h2>",
    "<h2>Contact Email</h2>",
  ],
  [
    "<p>Recommended use cases:</p>",
    "<p>Common reasons to get in touch:</p>",
  ],
  [
    "Reporting factual mistakes or broken pages.",
    "Reporting factual errors, broken links, or page formatting problems.",
  ],
  [
    "Submitting attribution corrections or replacement requests.",
    "Requesting attribution updates, clarifications, or media replacement.",
  ],
  [
    "Discussing licensing, reuse, or partnership questions.",
    "Asking about licensing, reuse, collaboration, or related project questions.",
  ],
  [
    "<h2>Response policy</h2>",
    "<h2>How To Reach Out</h2>",
  ],
  [
    "When reporting a rights issue, include the page URL, the asset or text in question, and the requested action. Clear requests are easier to act on quickly.",
    "When reporting a rights or attribution issue, include the page URL, the specific text or image involved, and the action you want reviewed. Clear requests are much easier to verify and handle quickly.",
  ],
  [
    "Replace this placeholder mailbox before public launch so reviewers can verify the site has a working contact path.",
    "If the site is launched publicly, replace the placeholder address with a monitored production mailbox so visitors and reviewers can confirm that the project has a working contact path.",
  ],
  [
    'content="Terms governing the use of this fan guide, its content, and outbound links."',
    'content="Review the terms for using Twilight Princess Chronicle, its guide content, and its external links."',
  ],
  [
    "These terms describe how readers may use the site and what to expect from a fan-maintained guide project.",
    "These terms explain how visitors may use the site and what to expect from an unofficial, fan-maintained walkthrough project.",
  ],
  [
    "<h2>General use</h2>",
    "<h2>Acceptable Use</h2>",
  ],
  [
    "The site is provided for informational and fan-reference purposes.",
    "The site is provided for informational, archival, and fan-reference use.",
  ],
  [
    "Content may be edited, moved, or removed without notice while the project is being maintained.",
    "Content may be edited, reorganized, or removed as the project continues to be maintained.",
  ],
  [
    "External links are provided for reference and do not imply endorsement.",
    "External links are offered for reference only and do not imply endorsement of third-party sites.",
  ],
  [
    "<h2>Limitations</h2>",
    "<h2>Limitations And Rights</h2>",
  ],
  [
    "The site owner does not guarantee that every page is complete, error-free, or suitable for commercial reuse.",
    "The site owner does not guarantee that every page is complete, error-free, or suitable for commercial reuse. Visitors should treat the guide as a maintained fan resource rather than an official publication.",
  ],
  [
    "If you plan to use any site material outside normal reading and linking, request permission first.",
    "If you want to reuse site material beyond ordinary reading, citation, or linking, request permission first and verify that any third-party rights are properly respected.",
  ],
  [
    'content="Attribution, rights-contact, and takedown information for text, screenshots, and referenced game material."',
    'content="Find attribution, ownership, and removal-request information for screenshots, text, and referenced game material."',
  ],
  [
    "This page explains how the site treats game-related material, screenshots, and attribution requests.",
    "This page explains how Twilight Princess Chronicle handles ownership notices, attribution, and requests related to imported game material and screenshots.",
  ],
  [
    "<h2>Ownership notice</h2>",
    "<h2>Ownership Notice</h2>",
  ],
  [
    "The Legend of Zelda and Twilight Princess are associated with their respective rightsholders. This site is an unofficial fan guide and is not affiliated with or endorsed by Nintendo.",
    "The Legend of Zelda, Twilight Princess, related character names, and associated marks remain the property of their respective rightsholders. Twilight Princess Chronicle is an unofficial fan guide and is not affiliated with or endorsed by Nintendo.",
  ],
  [
    "Referenced game names, character names, and related marks remain the property of their owners.",
    "Where the site references game material, screenshots, or imported archival elements, ownership of the underlying original material remains with the relevant rightsholder unless otherwise stated.",
  ],
  [
    "<h2>Requests and corrections</h2>",
    "<h2>Attribution Requests</h2>",
  ],
  [
    "If you believe a specific asset or passage should be credited differently, replaced, or removed, send the page URL and the exact material to <a href=\"mailto:contact@example.com\">contact@example.com</a>.",
    `If you believe a specific image, passage, or reference note should be credited differently, replaced, or removed, send the page URL and the exact material in question to ${contactLink}.`,
  ],
  [
    "For a production launch, this page should reflect the final provenance of every non-original image you keep online.",
    "Before a full production launch, this page should reflect the final provenance and attribution approach for any non-original media that remains published on the live site.",
  ],
]);

for (const rel of files) {
  const file = path.join(root, rel);
  let html = await fs.readFile(file, "utf8");
  for (const [from, to] of replacements) {
    html = html.split(from).join(to);
  }
  await fs.writeFile(file, html, "utf8");
  console.log(`Updated ${rel}`);
}
