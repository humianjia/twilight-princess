import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const chapterConfigs = {
  "chapters/chapter-1/index.html": {
    count: 5,
    intro:
      "These milestone screenshots keep the chapter visually grounded without recreating the full step-by-step image dump.",
    images: [
      [
        "tp_ch01_01.jpg",
        "Ordon Village establishes the domestic routine that makes the first Twilight disruption matter.",
      ],
      [
        "tp_ch01_04.jpg",
        "The early chase sequence turns local rescue into the chapter's first real emergency.",
      ],
      [
        "tp_ch01_08.jpg",
        "Wolf-form traversal reframes the route and introduces Midna's practical role immediately.",
      ],
      [
        "tp_ch01_14.jpg",
        "The Forest Temple locks the chapter into its first proper dungeon rhythm of escorts, switches, and wind paths.",
      ],
      [
        "tp_ch01_19.jpg",
        "Diababa closes the opening chapter with the first strong item-centered boss payoff.",
      ],
    ],
  },
  "chapters/chapter-2/index.html": {
    count: 5,
    intro:
      "These screenshots mark the chapter's major shifts: settlement pressure, Goron escalation, dungeon routing, and the first true bow-focused payoff.",
    images: [
      [
        "tp_ch02_01.jpg",
        "Kakariko widens the stakes from village rescue to a region already living under strain.",
      ],
      [
        "tp_ch02_03.jpg",
        "The Goron trial sequence makes access feel earned rather than automatic.",
      ],
      [
        "tp_ch02_06.jpg",
        "Death Mountain and the mines push the route into harsher terrain and more industrial visual language.",
      ],
      [
        "tp_ch02_10.jpg",
        "The Hero's Bow becomes the chapter's major utility shift and changes how later threats are read.",
      ],
      [
        "tp_ch02_13.jpg",
        "The dungeon finish reinforces how regional politics and item progression stay tied together.",
      ],
    ],
  },
  "chapters/chapter-3/index.html": {
    count: 5,
    intro:
      "This shorter visual set follows the chapter from flooded crisis to Lanayru restoration and the Lakebed Temple finish.",
    images: [
      [
        "tp_ch03_01.jpg",
        "Lake Hylia opens the map outward and immediately changes the scale of the journey.",
      ],
      [
        "tp_ch03_04.jpg",
        "The Zora storyline turns restoration into both a political and environmental problem.",
      ],
      [
        "tp_ch03_07.jpg",
        "Lanayru's recovery is one of the clearest moments where Twilight Princess links navigation with atmosphere.",
      ],
      [
        "tp_ch03_10.jpg",
        "Lakebed Temple shifts the route into a denser, water-driven dungeon structure.",
      ],
      [
        "tp_ch03_12.jpg",
        "By the end of the chapter, the adventure feels fully expanded beyond its opening village logic.",
      ],
    ],
  },
  "chapters/chapter-4/index.html": {
    count: 5,
    intro:
      "These visuals concentrate on the desert transition, Arbiter's Grounds, and the first major mirror-era change in tone.",
    images: [
      [
        "tp_ch04_01.jpg",
        "The move into the desert instantly changes the campaign from provincial recovery to expedition.",
      ],
      [
        "tp_ch04_05.jpg",
        "The Bulblin camp material makes the route feel occupied rather than merely dangerous.",
      ],
      [
        "tp_ch04_10.jpg",
        "Arbiter's Grounds leans into haunted space, sand, and rotational movement more than any earlier dungeon.",
      ],
      [
        "tp_ch04_18.jpg",
        "The Spinner section marks the chapter's biggest mechanical identity shift.",
      ],
      [
        "tp_ch04_24.jpg",
        "The mirror-era reveal at the end changes what the full quest is really about.",
      ],
    ],
  },
  "chapters/chapter-5/index.html": {
    count: 5,
    intro:
      "This gallery keeps only the images that best represent the Snowpeak travel arc, the mansion's character, and the mirror-shard payoff.",
    images: [
      [
        "tp_ch05_01.jpg",
        "Snowpeak begins as a travel chapter first, using weather and distance to reset the campaign's mood.",
      ],
      [
        "tp_ch05_04.jpg",
        "The ruins feel memorable because they behave more like a strange home than a neutral dungeon shell.",
      ],
      [
        "tp_ch05_08.jpg",
        "The mansion route turns key hunting and room identity into the chapter's main navigational language.",
      ],
      [
        "tp_ch05_13.jpg",
        "The Ball and Chain payoff gives the dungeon one of the strongest item reveals in the game.",
      ],
      [
        "tp_ch05_20.jpg",
        "The chapter ends by folding its personal character story back into the larger mirror quest.",
      ],
    ],
  },
  "chapters/chapter-6/index.html": {
    count: 5,
    intro:
      "These screenshots focus on the Temple of Time's identity as an ancient-space chapter rather than a full room-by-room image log.",
    images: [
      [
        "tp_ch06_01.jpg",
        "The return to older Hyrule history gives this chapter a very different tone from the mirror hunt before it.",
      ],
      [
        "tp_ch06_04.jpg",
        "Temple of Time spaces feel ceremonial, which changes how even simple traversal reads.",
      ],
      [
        "tp_ch06_08.jpg",
        "The Dominion Rod turns the chapter from temple exploration into statue-based route control.",
      ],
      [
        "tp_ch06_12.jpg",
        "The return path with the statue is the real chapter identity test, not just the climb up.",
      ],
      [
        "tp_ch06_16.jpg",
        "By the finish, the adventure feels deeper in ancient Hyrule than anywhere before it.",
      ],
    ],
  },
  "chapters/chapter-7/index.html": {
    count: 5,
    intro:
      "This reduced set preserves only the moments that best convey the scale jump, sky travel, and late-game dungeon complexity of the chapter.",
    images: [
      [
        "tp_ch07_01.jpg",
        "The transition into the sky marks one of the route's biggest scale changes.",
      ],
      [
        "tp_ch07_06.jpg",
        "The Oocca material pushes the game further into inherited systems and forgotten architecture.",
      ],
      [
        "tp_ch07_12.jpg",
        "Double Clawshots redefine traversal and make the dungeon feel more aerial than any earlier zone.",
      ],
      [
        "tp_ch07_20.jpg",
        "City in the Sky works best when read as a sustained movement exam rather than a puzzle checklist.",
      ],
      [
        "tp_ch07_30.jpg",
        "The final mirror-shard reward gives the whole sky detour a clear endgame purpose.",
      ],
    ],
  },
  "chapters/chapter-8/index.html": {
    count: 5,
    intro:
      "These images keep the Palace of Twilight readable as a late-game escalation without reproducing its full screenshot archive.",
    images: [
      [
        "tp_ch08_01.jpg",
        "The arrival in the Twilight Realm finally lets the campaign confront Midna's world directly.",
      ],
      [
        "tp_ch08_04.jpg",
        "The palace spaces feel intentionally stripped and hostile, which helps the late-game tension land.",
      ],
      [
        "tp_ch08_08.jpg",
        "The Sol-carry structure turns dungeon routing into a pressure test rather than pure exploration.",
      ],
      [
        "tp_ch08_12.jpg",
        "Zant's collapse matters because the chapter has already exposed how unstable his authority really is.",
      ],
      [
        "tp_ch08_18.jpg",
        "By the exit, the game is no longer preparing for an ending in theory but pushing directly into it.",
      ],
    ],
  },
  "chapters/chapter-9/index.html": {
    count: 5,
    intro:
      "The final chapter only needs a handful of visuals to mark its real milestones: ascent, confrontation, escalation, and the closing duel.",
    images: [
      [
        "tp_ch09_01.jpg",
        "The Hyrule Castle approach immediately frames the finale as a concentrated endgame push.",
      ],
      [
        "tp_ch09_04.jpg",
        "The interior ascent keeps the pressure on by treating the castle as a sequence of controlled confrontations.",
      ],
      [
        "tp_ch09_08.jpg",
        "The late boss sequence matters more as staged escalation than as a single encounter.",
      ],
      [
        "tp_ch09_12.jpg",
        "The horseback phase turns the finale outward again before the last personal duel.",
      ],
      [
        "tp_ch09_18.jpg",
        "The closing sword confrontation gives the campaign its final mythic image.",
      ],
    ],
  },
};

const galleryRegex =
  /<div class="section" id="local-gallery">[\s\S]*?<\/div>\s*<\/article>/;
const countRegex =
  /(<ul class="bullet-list"><li>)(\d+)( local images<\/li><li>)(\d+ downloads?)(<\/li><li>[^<]+<\/li><\/ul>)/;

function renderFigure(chapterRoute, imageName, caption, index) {
  const imageHref = `../../assets/imported/twp/images/${chapterRoute}/${imageName}`;
  const label = String(index + 1).padStart(2, "0");
  return `          <div class="figure">
            <a class="reference external image-reference" href="${imageHref}">
              <img src="${imageHref}" alt="${caption}" loading="lazy" decoding="async" />
            </a>
            <p class="caption">Key moment ${label}: ${caption}</p>
          </div>`;
}

for (const [relPath, config] of Object.entries(chapterConfigs)) {
  const fullPath = path.join(root, relPath);
  let html = await fs.readFile(fullPath, "utf8");

  const chapterFolderMatch = html.match(/assets\/imported\/twp\/images\/(\d{4}\/\d{2})\//);
  if (!chapterFolderMatch) {
    throw new Error(`Could not infer image folder for ${relPath}`);
  }
  const chapterFolder = chapterFolderMatch[1];

  const figures = config.images
    .map(([imageName, caption], index) => renderFigure(chapterFolder, imageName, caption, index))
    .join("\n\n");

  const replacement = `        <div class="section" id="local-gallery">
          <h2>Screenshot Highlights</h2>
          <p>${config.intro}</p>

${figures}
        </div>
        </article>`;

  html = html.replace(galleryRegex, replacement);
  html = html.replace(countRegex, `$1${config.count}$3$4$5`);

  await fs.writeFile(fullPath, html, "utf8");
  console.log(`Trimmed ${relPath}`);
}
