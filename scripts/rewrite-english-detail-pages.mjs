import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const posix = path.posix;

const routes = {
  intro: "intro/index.html",
  characters: "characters/index.html",
  epilogue: "epilogue/index.html",
  appendix: "appendix/index.html",
  chapters: {
    1: "chapters/chapter-1/index.html",
    2: "chapters/chapter-2/index.html",
    3: "chapters/chapter-3/index.html",
    4: "chapters/chapter-4/index.html",
    5: "chapters/chapter-5/index.html",
    6: "chapters/chapter-6/index.html",
    7: "chapters/chapter-7/index.html",
    8: "chapters/chapter-8/index.html",
    9: "chapters/chapter-9/index.html",
  },
};

const chapterMeta = {
  "chapter-1": {
    route: routes.chapters[1],
    sectionTitle: "From Ordon Village to the Forest Temple",
    overview: [
      "The first chapter covers the entire transition from quiet village life to the first true Twilight emergency. It is where Twilight Princess teaches its movement, item, and interaction basics while also establishing the personal stakes behind Link's journey.",
      "Ordon errands, the children's kidnapping, Link's first wolf sequence, the Tears of Light hunt in Faron, and the Forest Temple all belong to the same rising arc. By the end of the chapter, the game has already shown how strongly it mixes pastoral calm, danger, and melancholy.",
    ],
    flowSections: [
      {
        title: "Ordon Village and Early Tasks",
        body: "The opening village route should be read as deliberate setup rather than filler. Ordon teaches how Twilight Princess hides value inside everyday chores: rupees, the fishing rod, the slingshot, and early bottle utility all come from paying attention to villagers, rooftops, and small practical requests.",
      },
      {
        title: "The Kidnapping and Link's First Wolf Sequence",
        body: "Once the village is attacked, the rhythm changes immediately. The mounted pursuit, Link's transformation, and Midna's first guidance sequence establish the game's larger structure: normal travel is now interrupted by Twilight mechanics, and beast-form tracking becomes part of the core route.",
      },
      {
        title: "Faron Twilight and the Tears of Light",
        body: "The recovery of Faron Province is the first real progression test. The player uses map familiarity, scent, and NPC clues to restore light to the region, and that pattern becomes the model for later province-cleansing chapters.",
      },
      {
        title: "Forest Temple, Gale Boomerang, and Diababa",
        body: "The chapter ends with a clean dungeon clear built around monkey rescues, wind puzzles, and torch routing. The Gale Boomerang turns environmental utility into a combat tool, and Diababa closes the chapter with the first strong example of Twilight Princess using a new item as the center of a boss fight.",
      },
    ],
    highlights: [
      "Finish the Ordon chores so the early tutorial tasks pay off with practical tools such as the fishing rod, slingshot, and first bottle.",
      "Use the village sequence to learn how NPC requests, optional rupees, and simple traversal puzzles are presented throughout the rest of the game.",
      "Treat the wolf sections as more than a gimmick: scent tracking, digging, and Midna-assisted movement quickly become core route mechanics.",
      "The Faron twilight recovery sets the template for later Light Spirit chapters, so it is worth reading as the game's structural model.",
      "The Forest Temple marks the real start of dungeon routing, with monkey escorts, torch paths, and the first Fused Shadow reward.",
    ],
    focusTitle: "Dungeon and Item Focus",
    focusText:
      "The Gale Boomerang is the chapter's major routing tool. It solves wind switches, reaches distant targets, and stays useful long after the Forest Temple is over. Diababa, the dungeon boss, is also a good early example of Twilight Princess boss design: dramatic presentation, simple phase logic, and heavy use of the latest item.",
    notes: [
      "If you only need a fast read, focus on the transition points: Ordon, first wolf sequence, Faron restoration, and Forest Temple completion.",
      "Chapter 1 is image-heavy because the original archive documented many tutorial moments step by step.",
      "Readers comparing Wii and GameCube versions should remember that the world layout is mirrored between those releases.",
    ],
    whyItMatters:
      "Chapter 1 matters because it teaches nearly every rhythm that the rest of Twilight Princess will keep repeating: grounded village life, sudden Twilight intrusion, regional restoration, dungeon acquisition, and a dramatic item-driven boss finish.",
  },
  "chapter-2": {
    route: routes.chapters[2],
    sectionTitle: "Kakariko, Death Mountain, and the Goron Mines",
    overview: [
      "Chapter 2 moves the story from village-scale problems into a broader Hyrule conflict. The player reaches Kakariko, restores another Twilight-covered region, and finally earns the trust needed to challenge Death Mountain.",
      "This is also where the tone becomes heavier. The ruined village atmosphere, the threat around Renado and the children, and the Goron standoff all make the world feel much larger and more unstable than the Ordon opening.",
    ],
    flowSections: [
      {
        title: "Kakariko Village and the Eldin Crisis",
        body: "Kakariko is the first place that feels openly damaged by the wider conflict. The village rescue scenes, Renado's role, and the pressure around the missing children all push the story away from local adventure and into a larger campaign to stabilize Hyrule region by region.",
      },
      {
        title: "Eldin Twilight and Light Spirit Progression",
        body: "The Eldin Twilight section repeats the Tears of Light structure, but in a harsher environment with stronger enemies and a more visible sense of collapse. By this point the guide no longer feels like a tutorial; it feels like a province under occupation.",
      },
      {
        title: "Earning the Gorons' Respect",
        body: "Before the dungeon opens, the route depends on social and physical progression rather than pure exploration. Sumo, the Iron Boots, and the climb to Death Mountain all reinforce that this chapter is about meeting a culture on its own terms before the player is allowed deeper in.",
      },
      {
        title: "Goron Mines, Hero's Bow, and Fyrus",
        body: "Inside the mines, the guide shifts into hazard control and magnetic traversal. The Hero's Bow opens the dungeon's switch logic and later overworld utility, while Fyrus closes the chapter with a fight that combines range, timing, and the heavy footing introduced by the Iron Boots.",
      },
    ],
    highlights: [
      "Kakariko Village becomes an early hub for story, shops, and side progress, so it is worth reading this chapter with that hub role in mind.",
      "The Eldin Twilight section reinforces the Light Spirit pattern while broadening the map and introducing stronger enemy pressure.",
      "Winning over the Gorons is the key progression gate; the route pivots around sumo, the Iron Boots, and the climb up Death Mountain.",
      "The Goron Mines continue the chapter's theme of force and momentum, with magnetic traversal and strong environmental hazards.",
      "By the end of the dungeon, the story has clearly shifted from local rescue work to full heroic intervention across Hyrule.",
    ],
    focusTitle: "Dungeon and Item Focus",
    focusText:
      "The Iron Boots and Hero's Bow define this chapter. The boots solve the Goron problem and enable magnetic wall movement, while the bow opens up ranged switches and combat options for the rest of the game. Fyrus closes the dungeon with a straightforward but memorable bow-and-boots encounter.",
    notes: [
      "This chapter is a good place to check wallet growth and shop availability before pushing farther into the main route.",
      "The original source page treated Kakariko and the Goron Mines as one continuous climb rather than separate mini-arcs.",
      "If you are skimming, pay special attention to the order of Kakariko events before the Death Mountain ascent.",
    ],
    whyItMatters:
      "Chapter 2 is where Twilight Princess proves that its world is not just wide but politically and culturally distinct. It expands the stakes, deepens the province structure, and starts treating each region as a place with its own pressure points and leaders.",
  },
  "chapter-3": {
    route: routes.chapters[3],
    sectionTitle: "Lake Hylia, the Zora, and Lanayru Restoration",
    overview: [
      "Chapter 3 is where Twilight Princess opens up dramatically. The route leaves Eldin behind, reaches Lake Hylia and Zora territory, and turns the mystery around Hyrule's condition into a much wider regional crisis.",
      "The emotional center of this chapter is restoration. Frozen domains, drained waterways, and damaged settlements all gradually come back to life as the player restores Lanayru and prepares for the next dungeon.",
    ],
    flowSections: [
      {
        title: "Lake Hylia and the Wider World",
        body: "By the time the guide reaches Lake Hylia, Twilight Princess has stopped feeling regional and started feeling continental. The lake is not only a destination; it is a crossroads that ties together Zora waters, Lanayru's Twilight, and the larger geography of central Hyrule.",
      },
      {
        title: "The Zora Storyline and Water Restoration",
        body: "This stretch of the chapter works because it links environmental repair to character tragedy. The state of the waterways, the frozen Zora domain, and the royal storyline all make restoration feel like more than a switch puzzle; it feels like the player is repairing a damaged history.",
      },
      {
        title: "Lanayru Twilight and Regional Recovery",
        body: "The Lanayru Spirit segment is one of the clearest examples of how the game uses province cleansing as emotional payoff. The player is not only collecting Tears of Light; they are watching one of Hyrule's most important routes and identities come back online.",
      },
      {
        title: "Lakebed Temple, Clawshot, and Morpheel",
        body: "The dungeon itself is a strong escalation in spatial complexity. Water routing, multi-level navigation, and the Clawshot make the chapter more vertical and less linear than what came before, while Morpheel ends it with a set piece that feels expansive rather than technical.",
      },
    ],
    highlights: [
      "Lake Hylia serves as a transition space between overworld travel, Twilight recovery, and a much more aquatic regional story.",
      "The Zora storyline adds scale and tragedy, especially as the game explains what happened to the royal family and the surrounding waters.",
      "Lanayru's recovery is a major story beat and one of the clearest examples of the game using environmental change as narrative payoff.",
      "The run-up to the dungeon does a lot of map work, so this chapter reads best when treated as an expansion arc rather than a straight dungeon sprint.",
      "By the chapter's end, the first major three-part regional structure of the game is complete.",
    ],
    focusTitle: "Dungeon and Item Focus",
    focusText:
      "Lakebed Temple introduces the Clawshot, one of the most important movement tools in the game. The dungeon leans heavily on water flow control and vertical routing, and Morpheel ends the chapter with a large-scale encounter that feels more adventurous than technical.",
    notes: [
      "This is one of the better chapters for collectible cleanup because more of Hyrule is available than before.",
      "The chapter's images are especially useful because several route steps are spatial rather than purely textual.",
      "If you want the shortest reading path, follow the sequence from Lake Hylia to Lanayru restoration to Lakebed Temple completion.",
    ],
    whyItMatters:
      "Chapter 3 matters because it turns Hyrule from a sequence of disconnected problem zones into a coherent world. It broadens the map, sharpens the tragedy around the Zora, and gives the player one of the game's most important traversal tools.",
  },
  "chapter-4": {
    route: routes.chapters[4],
    sectionTitle: "The Desert Campaign and Arbiter's Grounds",
    overview: [
      "Chapter 4 marks a decisive shift in the story. The hunt for Fused Shadows gives way to the larger Mirror of Twilight plot, and the route begins to feel more archaeological, political, and mythic.",
      "Travel into the desert also changes the atmosphere. The chapter trades forests and villages for ruins, execution lore, undead enemies, and the history of Hyrule's old punishments.",
    ],
    flowSections: [
      {
        title: "Crossing into the Gerudo Desert",
        body: "The trip into the desert is more than a transition map. It marks the point where the guide leaves province-cleansing behind as the main narrative engine and starts moving toward ancient crimes, sealed spaces, and the history Hyrule tried to bury.",
      },
      {
        title: "Arbiter's Grounds and the Undead Ruins",
        body: "Arbiter's Grounds works best as a dungeon of tone. Sand, skeletal enemies, buried halls, and execution motifs make the route feel oppressive in a way the earlier temples do not, and the dungeon slowly reveals that the place matters to Hyrule's political memory as much as to its dungeon progression.",
      },
      {
        title: "Spinner Progression and Stallord",
        body: "Once the Spinner arrives, the route changes from cautious excavation to high-speed rail movement. That contrast is part of why Arbiter's Grounds is so memorable: it begins like a tomb crawl and ends like a momentum dungeon capped by the theatrical Stallord fight.",
      },
      {
        title: "Mirror Chamber and the New Objective",
        body: "The real payoff comes after the boss. The Mirror Chamber reveal reframes the entire campaign, turning the remaining chapters into a mirror-shard hunt and formally linking Hyrule's crisis to the Twilight Realm rather than to the Fused Shadows alone.",
      },
    ],
    highlights: [
      "Reaching the Gerudo Desert is itself part of the drama, and the transition helps sell the sense that the player is entering forbidden territory.",
      "Arbiter's Grounds is built around dust, undead, and buried mechanisms, making it one of the game's strongest tonal dungeons.",
      "The Mirror Chamber reveal reframes the rest of the main quest around scattered mirror shards and the Twilight Realm.",
      "This chapter rewards careful reading because the story exposition is as important as the dungeon path itself.",
      "The desert images remain helpful reference points because many rooms and landmarks share a similar color palette.",
    ],
    focusTitle: "Dungeon and Item Focus",
    focusText:
      "The Spinner is the signature reward here, and Arbiter's Grounds uses it for rails, momentum puzzles, and the Stallord boss fight. More importantly, the dungeon changes the direction of the campaign by making the mirror quest the new long-form objective.",
    notes: [
      "This chapter is one of the clearest dividing lines between the first and second halves of Twilight Princess.",
      "If you are reading only for story context, prioritize the desert arrival, Arbiter's Grounds ending, and Mirror Chamber scenes.",
      "The route after this point becomes more shard-focused and less region-by-region in its structure.",
    ],
    whyItMatters:
      "Chapter 4 is the hinge point of the full walkthrough. It replaces the early-game objective, introduces the mirror quest, and gives the adventure its strongest sense of buried history and irreversible escalation.",
  },
  "chapter-5": {
    route: routes.chapters[5],
    sectionTitle: "Snowpeak Ruins and the Frozen Mirror Shard",
    overview: [
      "Chapter 5 slows the pace just enough to let atmosphere do the work. Instead of another military or ruin-heavy zone, the player climbs into a stormbound mountain and enters one of the most character-driven dungeons in the game.",
      "Snowpeak is memorable because it mixes survival, domestic absurdity, and melancholy. The ruined mansion feels lived in, and Yeto and Yeta make the dungeon feel personal in a way few Zelda dungeons do.",
    ],
    flowSections: [
      {
        title: "Following the Trail to Snowpeak",
        body: "The early route into Snowpeak is built around environmental reading rather than brute force. Weather, elevation, and clue-following matter more than spectacle, and that slower buildup gives the mansion reveal more impact once the player finally reaches shelter.",
      },
      {
        title: "The Mansion Search and Household Rhythm",
        body: "Snowpeak Ruins is one of the rare Zelda dungeons that feels domestic before it feels hostile. The guide keeps circling kitchens, bedrooms, locked halls, and improvised detours, which makes the search for the mirror shard feel like an intrusion into a damaged home instead of a raid on a generic ruin.",
      },
      {
        title: "Ball and Chain Progression",
        body: "Once the Ball and Chain enters the route, the mansion shifts again. Ice walls, armored hazards, and heavy-object logic turn what looked like a meandering scavenger hunt into a much more direct break-through dungeon, and the item stays satisfying because it is so physically legible.",
      },
      {
        title: "Blizzeta and the Mirror Shard",
        body: "The chapter ends by linking its personal tone back to the larger mirror quest. Blizzeta is memorable not only because of the spectacle of the fight, but because it resolves the mansion's melancholy in a way that still feels sad even after the boss is defeated.",
      },
    ],
    highlights: [
      "The route to Snowpeak emphasizes navigation clues and environmental preparation rather than pure combat pressure.",
      "The mansion is structured like a search through a damaged household, which gives the dungeon a very different rhythm from earlier temples.",
      "The mirror shard objective ties the chapter back into the main quest while still allowing Snowpeak to stand on its own mood and story.",
      "This is one of the easiest chapters to remember visually because nearly every key image has a strong snow, wood, or ice silhouette.",
      "The chapter benefits from slower reading because the charm is in its pacing and character presence.",
    ],
    focusTitle: "Dungeon and Item Focus",
    focusText:
      "The Ball and Chain is the major reward, turning ice barriers and heavy obstacles into routeable targets. Blizzeta closes the dungeon with a fight that begins as tragedy first and spectacle second, which is part of why Snowpeak leaves such a strong impression.",
    notes: [
      "If you are revisiting the game after a long break, this chapter is a good place to re-sync with its tone before the later endgame push.",
      "The original archive saved many mansion screenshots because room identity matters more here than in several other dungeons.",
      "Keep an eye on optional recovery items before entering; the climb and mansion detours can be longer than they first appear.",
    ],
    whyItMatters:
      "Chapter 5 matters because it proves Twilight Princess can slow down without losing momentum. Snowpeak turns a mirror-shard stop into one of the most distinct and emotionally specific dungeon arcs in the entire game.",
  },
  "chapter-6": {
    route: routes.chapters[6],
    sectionTitle: "Temple of Time and Ancient Hyrule",
    overview: [
      "Chapter 6 deepens the sense that Hyrule is layered over forgotten history. The Dominion Rod storyline, the statue puzzles, and the return to a lost temple all make the chapter feel like a meeting point between present-day travel and ancient machinery.",
      "Compared with Snowpeak's personal tone, this chapter is colder and more ceremonial. It is about recovering authority, understanding relics, and moving through spaces that feel preserved rather than inhabited.",
    ],
    flowSections: [
      {
        title: "Recovering the Dominion Rod's Purpose",
        body: "The opening of Chapter 6 is about making sense of an artifact that looks useful before it becomes fully active. The guide's pacing here is intentionally archaeological: the player is reconnecting scattered clues, statues, and old roads before the temple proper even opens.",
      },
      {
        title: "Owls, Statues, and the Return Route",
        body: "Much of the chapter's identity comes from the back-and-forth between overworld setup and temple access. Moving owl statues and reopening old paths turn the route into a chain of confirmation that Hyrule's lost machinery still obeys its old logic if the player can read it correctly.",
      },
      {
        title: "Temple of Time Ascent",
        body: "Inside the temple, the route becomes more formal and mechanical. Switches, statue control, and vertical puzzle rooms replace the emotional warmth of Snowpeak with a cleaner sense of ritualized progression, as if the player is climbing through a monument built to be traversed in a very specific order.",
      },
      {
        title: "The Return Descent and Armogohma",
        body: "The return trip matters almost as much as the ascent because it proves the dungeon understands its own spatial design. Escorting the statue back down keeps the temple from feeling like a straight ladder, and Armogohma closes the chapter with a boss that continues the Dominion Rod's emphasis on controlled positioning.",
      },
    ],
    highlights: [
      "Restoring the Dominion Rod is the practical gate that drives most of the chapter's movement and puzzle logic.",
      "The route spends more time on statue interaction and long-form puzzle setup than on village drama or regional crisis.",
      "Temple of Time is structured as an ascent and a return, making it easier to follow if you read it as one long mechanical loop.",
      "This chapter is one of the clearest examples of Twilight Princess blending dungeon traversal with relic lore.",
      "The visual archive is especially useful because the temple's statue routing can be awkward to reconstruct from prose alone.",
    ],
    focusTitle: "Dungeon and Item Focus",
    focusText:
      "The Dominion Rod is both the chapter's reward and its narrative centerpiece. Temple of Time is also notable for its repeated statue escort logic and for Armogohma, a boss encounter that continues the game's habit of using newly learned mechanics immediately.",
    notes: [
      "Players returning after a break often remember the concept of this chapter before its exact routing, so the screenshots are worth keeping close.",
      "Treat the owl-statue progress chain as part of the main story rather than side filler; it is how this chapter justifies its ancient-Hyrule theme.",
      "If you are reading for structure, focus on how the chapter alternates overworld setup and temple execution.",
    ],
    whyItMatters:
      "Chapter 6 matters because it is where Twilight Princess most clearly treats Hyrule as a civilization with long memory. The route is not just about acquiring another item; it is about proving that the old kingdom still shapes the present through relics, pathways, and dormant authority.",
  },
  "chapter-7": {
    route: routes.chapters[7],
    sectionTitle: "The City in the Sky and the Final Mirror Shard",
    overview: [
      "Chapter 7 turns the mirror hunt upward. The search for the last shard leads into the Oocca storyline, and the route shifts from grounded ruins into airy, exposed, and visibly unstable architecture.",
      "The chapter feels transitional in the best way: it closes the mirror search, expands Hyrule's forgotten history one last time, and prepares the story to move directly into the Twilight Realm.",
    ],
    flowSections: [
      {
        title: "Oocca Lore and the Last Lead",
        body: "Before the dungeon proper begins, the chapter uses the Oocca to push ancient-Hyrule lore into living form. What had looked like a dead past in the Temple of Time now points upward toward a surviving sky civilization and the last missing shard.",
      },
      {
        title: "City in the Sky Traversal",
        body: "The dungeon's identity comes from exposure, distance, and unstable footing. Long bridges, wind, and open air make the route feel less like room-by-room puzzle solving and more like moving through a hazardous architectural skeleton suspended over nothing.",
      },
      {
        title: "Double Clawshots and Vertical Routing",
        body: "Once the Double Clawshots are in play, the dungeon becomes a full movement showcase. The item changes how the player reads gaps, towers, and anchor points, and it is one of the clearest late-game examples of a Zelda dungeon transforming after the signature reward arrives.",
      },
      {
        title: "Argorok and the Final Mirror Shard",
        body: "Argorok closes the mirror hunt with a fight built around pursuit and aerial positioning rather than grounded control. More importantly, the battle and its aftermath remove the last shard as an open objective and point the entire campaign toward Midna's homeland.",
      },
    ],
    highlights: [
      "The Oocca material matters because it links Temple of Time relics to a still-living sky civilization.",
      "City in the Sky is long, vertical, and traversal-heavy, so it rewards readers who want a cleaner overview of room flow.",
      "Weather, altitude, and open ledges define the chapter's visual identity more than combat does.",
      "Securing the final mirror shard is the real narrative objective, even when the route seems to wander through large mechanical spaces.",
      "The chapter's screenshots help most when you are orienting around double-hook traversal segments.",
    ],
    focusTitle: "Dungeon and Item Focus",
    focusText:
      "The Double Clawshots turn the end of the chapter into a mobility showcase. They reshape how the player reads space, and Argorok caps the dungeon with an encounter built around free movement rather than ground control.",
    notes: [
      "This is one of the longest late-game route pages, so a summary-first rewrite is more useful than a literal step-for-step recovery of the old translation.",
      "If you only need the essentials, read for the Oocca setup, dungeon traversal pattern, and final mirror completion.",
      "The last mirror shard is important because it removes the chapter-to-chapter hunt and points the story straight toward Midna's homeland.",
    ],
    whyItMatters:
      "Chapter 7 matters because it finishes the second major quest structure of the game. Once the City in the Sky is cleared, the adventure no longer needs to search for entry into the Twilight Realm; it can go there directly.",
  },
  "chapter-8": {
    route: routes.chapters[8],
    sectionTitle: "The Palace of Twilight and Zant's Collapse",
    overview: [
      "Chapter 8 is the payoff for everything the mirror quest has been building toward. The player finally enters the Twilight Realm directly, and the story stops speaking about that world in fragments and starts confronting it head on.",
      "This chapter also belongs emotionally to Midna. The farther the route pushes through the Palace of Twilight, the more clearly the conflict becomes personal rather than abstract.",
    ],
    flowSections: [
      {
        title: "Crossing into the Twilight Realm",
        body: "The entry into the Twilight Realm changes more than the scenery. Enemy behavior, environmental logic, and the emotional weight of the route all shift at once, because the player is no longer hearing about Midna's world from the outside but traveling through it directly.",
      },
      {
        title: "Palace Progression and Sol Recovery",
        body: "The Palace of Twilight is structured around reclaiming power piece by piece. Carrying the Sols back through enemy-filled spaces gives the dungeon a strong sense of retrieval and resistance, and it makes the route feel less like looting a palace than like relighting a conquered world.",
      },
      {
        title: "Zant's Chambers and the Collapse of His Persona",
        body: "The confrontation with Zant works because it strips away the image he spent the rest of the game projecting. The fight's shifting phases and borrowed imagery underline that his power is unstable, theatrical, and ultimately dependent on something outside himself.",
      },
      {
        title: "Midna's World and the Road to Endgame",
        body: "By the time the chapter ends, the campaign has narrowed dramatically. The palace is no longer only a dungeon clear; it is the point where Midna's personal story, the truth about Zant, and the final road to Ganondorf all lock into the same line of progression.",
      },
    ],
    highlights: [
      "The opening of the Twilight Realm is significant because it changes enemy language, environmental logic, and the entire emotional framing of the quest.",
      "The palace route is structured around recovering power and regaining access, so progression is tied to both combat and object handling.",
      "The chapter clarifies who Zant really is and why his rule feels unstable even when he appears dominant.",
      "Because the chapter is both a dungeon run and a story reveal sequence, the rewritten English focuses on clear story beats instead of literal mistranslated captions.",
      "Visually, this is one of the strongest galleries in the archive because the realm has a distinct palette and silhouette set.",
    ],
    focusTitle: "Dungeon and Item Focus",
    focusText:
      "The Palace of Twilight revolves around restoring strength and carrying that momentum into the confrontation with Zant. Mechanically, the chapter is about controlled routing through hostile space; narratively, it is about stripping away the false grandeur of the usurper and returning agency to Midna's side of the story.",
    notes: [
      "This is one of the best chapters to read for narrative clarity even if you are not using the walkthrough step by step.",
      "The final confrontation here is less about resources than about understanding how the story has re-centered on Midna and the Twili.",
      "The chapter also sets the tone for the endgame by narrowing the remaining conflict to its real source.",
    ],
    whyItMatters:
      "Chapter 8 matters because it resolves the mirror quest and changes the story from indirect pursuit into final confrontation. It is the point where the Twili, Zant, Midna, and the real source of Hyrule's crisis stop being separate threads.",
  },
  "chapter-9": {
    route: routes.chapters[9],
    sectionTitle: "Hyrule Castle and the Final Battle",
    overview: [
      "Chapter 9 is the final ascent through Hyrule Castle and the full closing boss sequence. Everything the route has been collecting, from dungeon items to story promises, is finally converted into a direct march on the seat of power.",
      "This chapter works best when read as a sequence of escalating confrontations rather than a single dungeon. The castle interior, the scripted fights, and the multi-phase finale each resolve a different layer of the campaign's tension.",
    ],
    flowSections: [
      {
        title: "Approaching Hyrule Castle",
        body: "The opening stretch is built to feel ceremonial, not casual. The castle is familiar ground in a political sense, but in route terms it becomes a siege target, and the player is meant to feel that every previous dungeon and province has been preparation for this one march inward.",
      },
      {
        title: "Interior Gauntlet and Final Ascent",
        body: "Inside the castle, the guide compresses late-game pressure into a tighter sequence of encounters. Rather than introducing new systems, the route asks the player to prove command over the full toolset and to treat the castle as a last exam in composure and spatial reading.",
      },
      {
        title: "The Layered Final Boss Sequence",
        body: "The ending is strongest when read in phases: the possessed-Zelda confrontation, the beast-form clash, the horseback pursuit, and the closing sword duel. Each stage resolves a different visual and thematic layer of the campaign while steadily stripping spectacle down to a final one-on-one finish.",
      },
      {
        title: "Aftermath and Closure",
        body: "Even before the separate epilogue page, the end of the chapter carries the weight of farewell. Midna, Zelda, and Ganondorf each occupy a different part of the ending's emotional logic, and the route closes by turning a huge conflict back into a small number of irreversible personal outcomes.",
      },
    ],
    highlights: [
      "The castle approach is meant to feel ceremonial and dangerous, not merely difficult; the route is about finality as much as navigation.",
      "Several late-game encounters revisit ideas from earlier chapters, but now in compressed, higher-stakes form.",
      "Princess Zelda, Ganondorf, and Midna all matter directly here, so the chapter functions as both action climax and character payoff.",
      "The long image sequence is especially valuable on this page because the ending moves through multiple distinct battle stages.",
      "By the close of the chapter, the main walkthrough has fully resolved the Twilight Princess campaign.",
    ],
    focusTitle: "Final Battle Focus",
    focusText:
      "The endgame is defined by its layered structure: castle push, possessed-Zelda phase, beast-form confrontation, horseback pursuit, and the final sword duel. Twilight Princess saves its cleanest heroic imagery for this chapter, and the mechanical demands remain readable even when the spectacle becomes large.",
    notes: [
      "If you are revisiting only one chapter, this is the most useful late-game summary because it condenses the finale without the broken translation clutter.",
      "The original source page relied on many screenshot captions to explain battle transitions; the cleaned rewrite keeps the images but replaces the narration with stable English.",
      "Read the gallery as a visual timeline of the ending rather than a caption-by-caption checklist.",
    ],
    whyItMatters:
      "Chapter 9 matters because it converts every major thread of Twilight Princess into one controlled closing sequence. It is the chapter where the political crisis, the Twilight conflict, and Link's personal journey all end on the same battlefield.",
  },
};

const legacyAppendixIds = Array.from({ length: 43 }, (_, index) =>
  `h${String(index + 1).padStart(2, "0")}`,
);

const roadmap = [
  ["Story Introduction", routes.intro],
  ["Character Guide", routes.characters],
  ["Chapter 1: The First Page of a Hero's Legend", routes.chapters[1]],
  ["Chapter 2: The Roar atop Death Mountain", routes.chapters[2]],
  ["Chapter 3: The Legend of the Deep-Sea Tribe", routes.chapters[3]],
  ["Chapter 4: Judgment in the Desert Depths", routes.chapters[4]],
  ["Chapter 5: The Sin of the Frozen Mirror", routes.chapters[5]],
  ["Chapter 6: The Rift Forgotten by Time", routes.chapters[6]],
  ["Chapter 7: Elegy of the Temple in the Heavens", routes.chapters[7]],
  ["Chapter 8: Darkness Before Dawn", routes.chapters[8]],
  ["Chapter 9: The Blade That Cleaves the Darkness", routes.chapters[9]],
  ["Epilogue: Balance in the Order of the World", routes.epilogue],
  ["Appendix", routes.appendix],
];

const fallbackCharacterImages = [
  "../assets/imported/twp/images/2011/08/zelda_tp_Link.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_Zelda.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_Midna.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_Ilia.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_Ooccoo.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_GorCoron.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_KingOrcsBulblin.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_ShadowBeing.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_Zant.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_Ganondorf.jpg",
  "../assets/imported/twp/images/2011/08/zelda_tp_TwilightPrincess-700x466.jpg",
];

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const relativeHref = (fromFile, toFile) =>
  posix.relative(posix.dirname(fromFile), toFile).replace(/\\/g, "/") || "./";

const extractTitle = (html, file) => {
  const match = html.match(/<h1>([\s\S]*?)<\/h1>/);
  if (!match) {
    throw new Error(`Could not find <h1> in ${file}`);
  }
  return match[1].replace(/<[^>]+>/g, "").trim();
};

const extractArticleBlock = (html, file) => {
  const match = html.match(
    /<article class="panel source-prose">[\s\S]*?<\/article>/,
  );
  if (!match) {
    throw new Error(`Could not find source prose block in ${file}`);
  }
  return match[0];
};

const extractImages = (articleHtml) => {
  const matches = articleHtml.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g);
  const seen = new Set();
  const images = [];

  for (const match of matches) {
    const src = match[1];
    if (seen.has(src)) {
      continue;
    }
    seen.add(src);
    images.push(src);
  }

  return images;
};

const extractDownloads = (articleHtml) => {
  const matches = articleHtml.matchAll(
    /<a\b[^>]*href="([^"]+\.(?:zip|rar|7z))"[^>]*>([\s\S]*?)<\/a>/gi,
  );
  return Array.from(matches, (match) => ({
    href: match[1],
    label: match[2].replace(/<[^>]+>/g, "").trim() || path.posix.basename(match[1]),
  }));
};

const buildFigure = (src, alt, caption) => `
          <div class="figure">
            <a class="reference external image-reference" href="${src}">
              <img src="${src}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" />
            </a>
            <p class="caption">${escapeHtml(caption)}</p>
          </div>`;

const buildGallery = (images, pageTitle, lead) => {
  if (!images.length) {
    return "";
  }

  const figures = images
    .map((src, index) =>
      buildFigure(
        src,
        `${pageTitle} archive screenshot ${String(index + 1).padStart(2, "0")}`,
        `${pageTitle} archive screenshot ${String(index + 1).padStart(2, "0")}`,
      ),
    )
    .join("\n");

  return `
        <div class="section" id="local-gallery">
          <h2>Local Screenshot Archive</h2>
          <p>${escapeHtml(lead)}</p>
${figures}
        </div>`;
};

const buildBulletList = (items) => `
          <ul class="simple">
${items.map((item) => `            <li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>`;

const buildFlowSections = (sections = []) =>
  sections
    .map(
      ({ title, body }) => `
          <div class="section">
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(body)}</p>
          </div>`,
    )
    .join("\n");

const replaceSourceProse = (html, inner, file) => {
  const replacement = `        <article class="panel source-prose">\n${inner}\n        </article>`;
  const next = html.replace(
    /<article class="panel source-prose">[\s\S]*?<\/article>/,
    replacement,
  );

  if (next === html) {
    throw new Error(`Failed to replace source prose in ${file}`);
  }

  return next;
};

const replaceTocPanel = (html, inner, file) => {
  const hasToc = /<article class="panel source-toc-panel">[\s\S]*?<\/article>/.test(
    html,
  );
  if (!hasToc) {
    return html;
  }

  const replacement = `          <article class="panel source-toc-panel">${inner}</article>`;
  const next = html.replace(
    /<article class="panel source-toc-panel">[\s\S]*?<\/article>/,
    replacement,
  );

  if (next === html) {
    throw new Error(`Failed to replace TOC panel in ${file}`);
  }

  return next;
};

const buildIntroArticle = (file, pageTitle, images, downloads) => {
  const figures = images
    .slice(0, 2)
    .map((src, index) =>
      buildFigure(
        src,
        index === 0 ? `${pageTitle} logo` : `${pageTitle} cover art`,
        index === 0
          ? "Twilight Princess logo used in the archived intro page."
          : "Cover artwork preserved from the local intro archive.",
      ),
    )
    .join("\n");

  const roadmapItems = roadmap
    .map(
      ([label, route]) =>
        `            <li><a class="reference external" href="${relativeHref(file, route)}">${escapeHtml(label)}</a></li>`,
    )
    .join("\n");

  const downloadList = downloads.length
    ? `
        <div class="section" id="downloads">
          <h2>Archived Downloads</h2>
          <p>The intro page also carried a small local attachment archive. It is preserved below exactly as a project file rather than translated line by line.</p>
          <ul class="simple">
${downloads
  .map(
    ({ href, label }) =>
      `            <li><a class="reference external" href="${href}">${escapeHtml(label)}</a></li>`,
  )
  .join("\n")}
          </ul>
        </div>`
    : "";

  return `
        <div class="section" id="overview">
          <h2>Overview</h2>
          <p>This introduction is the front door to the walkthrough. It explains what the guide covers, how the chapter flow is organized, and what kind of adventure Twilight Princess becomes once it expands beyond Ordon Village and into the wider crisis across Hyrule.</p>
          <p>The goal is to give first-time readers a stable starting point before the route branches into chapter guides, character notes, and optional reference material. English is the default presentation layer for this build, while the archived Chinese version remains available through the language switch.</p>
        </div>
        <div class="section" id="how-to-read">
          <h2>How to Use This Walkthrough</h2>
          <p>The main route is organized into nine story chapters, with separate pages for the cast, the ending, and the broader reference material that sits outside the mandatory path. Readers who want a cleaner first playthrough can move chapter by chapter, while returning players can jump directly into the appendix for cleanup targets and side systems.</p>
          <p>The structure is meant to support both styles of reading. If you are progressing through the story, follow the chapter order. If you are revisiting the game for completion, treat the appendix and character guide as supporting references to use whenever a collectible, side quest, or story detail needs context.</p>
        </div>
        <div class="section" id="story-premise">
          <h2>Story Premise</h2>
          <p>Twilight Princess begins with village routines, ranch work, and local relationships, then gradually opens into a darker campaign involving cursed provinces, ancient relics, political collapse, and the Twilight Realm. That slow expansion is part of the game's identity: the opening calm makes the later loss of order feel heavier, and the personal ties in Ordon give the larger quest a grounded reason to matter.</p>
          <p>The full route moves through three broad phases. First comes the recovery of the early provinces and the Fused Shadow hunt. Then the Mirror of Twilight quest reframes the story around buried history and Midna's world. Finally, the Palace of Twilight and Hyrule Castle turn the adventure into a direct endgame push.</p>
${figures}
        </div>
        <div class="section" id="version-notes">
          <h2>Version and Platform Notes</h2>
          <p>One practical warning matters for anyone comparing screenshots, memory, or older fan notes: the Wii and GameCube releases mirror the world layout horizontally. The route logic stays largely the same, but left-right geography can appear reversed when you move between versions or compare archived images from different releases.</p>
          <p>For that reason, this site treats the walkthrough as a progression guide first and a strict directional map second. Use the screenshots and chapter flow to confirm objectives, but keep the platform mirroring in mind whenever exact orientation seems inconsistent.</p>
        </div>
        <div class="section" id="reading-roadmap">
          <h2>Reading Roadmap</h2>
          <p>Use the sequence below if you want the full English reading order, starting with context and moving through the campaign from opening setup to final cleanup.</p>
          <ul class="simple">
${roadmapItems}
          </ul>
        </div>${downloadList}`;
};

const buildCharactersToc = () => `
<h2>Contents</h2><nav>
        <h4>Contents</h4>
        <div class="toc" id="">
<p class="topic-title">Contents</p>
<ul class="simple">
<li><a class="reference internal" href="#link">Link</a></li>
<li><a class="reference internal" href="#zelda">Zelda</a></li>
<li><a class="reference internal" href="#midna">Midna</a></li>
<li><a class="reference internal" href="#ilia">Ilia</a></li>
<li><a class="reference internal" href="#ooccoo-ooccoo-jr">Ooccoo and Ooccoo Jr.</a></li>
<li><a class="reference internal" href="#gor-coron">Gor Coron</a></li>
<li><a class="reference internal" href="#king-orcs-bulblin">King Bulblin</a></li>
<li><a class="reference internal" href="#shadow-being">Shadow Beasts</a></li>
<li><a class="reference internal" href="#zant">Zant</a></li>
<li><a class="reference internal" href="#ganondorf">Ganondorf</a></li>
<li><a class="reference internal" href="#twilight-princess">The Twilight Princess</a></li>
</ul>
</div>
        </nav>`;

const buildCharacterSection = ({
  id,
  alias,
  title,
  body,
  paragraphs,
  caption,
  image,
}) => {
  const paragraphList = Array.isArray(paragraphs)
    ? paragraphs
    : body
      ? [body]
      : [];

  return `
        <div class="section" id="${id}">
${alias ? `          <span id="${alias}"></span>\n` : ""}          <h2>${escapeHtml(title)}</h2>
${paragraphList
  .map((paragraph) => `          <p>${escapeHtml(paragraph)}</p>`)
  .join("\n")}
${buildFigure(image, `${title} portrait`, caption)}
        </div>`;
};

const buildCharactersArticle = (images) => {
  const resolvedImages =
    images.length >= 11 ? images : fallbackCharacterImages;

  const sections = [
    {
      id: "link",
      title: "Link",
      paragraphs: [
        "Link begins Twilight Princess as a ranch hand from Ordon Village, and that ordinary starting point matters. The game builds him as a capable local protector first, so when the crisis expands into a war touching multiple provinces and eventually the Twilight Realm, the player can still feel the weight of the home he is trying to defend.",
        "As a guide character, Link is defined less by spoken personality than by consistency under pressure. Every major route shift in the walkthrough, from wolf-form tracking to dungeon item mastery and the final castle ascent, depends on his ability to adapt without losing the quiet sense of duty that defines the opening chapters.",
      ],
      caption: "Character portrait: Link.",
      image: resolvedImages[0],
    },
    {
      id: "zelda",
      title: "Zelda",
      paragraphs: [
        "Princess Zelda has less screen time than some players expect, but she remains one of the clearest moral anchors in the game. Her role is not to dominate the route moment by moment; it is to represent the dignity, sacrifice, and political burden of Hyrule once the kingdom has already been pushed into crisis.",
        "That restraint is part of why the later ending material carries weight. Zelda's decisions frame the larger conflict as more than a monster problem or a dungeon sequence, reminding the player that the fall of Hyrule is also a collapse of order, responsibility, and royal stewardship.",
      ],
      caption: "Character portrait: Zelda.",
      image: resolvedImages[1],
    },
    {
      id: "midna",
      title: "Midna",
      paragraphs: [
        "Midna enters the story as an opportunistic guide who appears amused by Link's misfortune and interested mainly in her own goals. That first impression is useful because Twilight Princess spends much of its runtime slowly replacing distance with trust, making her transformation feel earned rather than automatic.",
        "By the middle and late game she has become the emotional center of the full campaign. The mirror-shard hunt, the Palace of Twilight, and the ending itself all matter more because Midna is not just a companion or quest-giver; she is the person through whom the game explains what the Twilight invasion has cost and what restoration might actually mean.",
      ],
      caption: "Character portrait: Midna.",
      image: resolvedImages[2],
    },
    {
      id: "ilia",
      title: "Ilia",
      paragraphs: [
        "Ilia is central to the early emotional logic of the story because she ties Link to Ordon as a lived place rather than as a tutorial map. Her presence gives the kidnapping, memory-loss, and rescue threads a personal texture that keeps the first half of the game grounded even as the mythology grows larger.",
        "She is not written as the driver of the grand political plot, and that is precisely why she works. In walkthrough terms, Ilia is one of the clearest reminders that the campaign is not only about relics, shadow realms, and final bosses; it is also about recovering the small human relationships that the invasion disrupted first.",
      ],
      caption: "Character portrait: Ilia.",
      image: resolvedImages[3],
    },
    {
      id: "ooccoo-ooccoo-jr",
      alias: "ooccoo",
      title: "Ooccoo and Ooccoo Jr.",
      paragraphs: [
        "Ooccoo and Ooccoo Jr. look eccentric even by Zelda standards, but their real value is structural. They connect the player to ancient Hyrule not as a dead legend but as a surviving lineage tied to the Temple of Time, the sky civilization, and the machinery of a much older world.",
        "In practical guide terms, they also mark the point where Twilight Princess becomes more openly concerned with forgotten infrastructure and inherited authority. Once the route reaches their material, the adventure is no longer only about regional rescue; it is about tracing who built Hyrule's great systems and who still remembers how they work.",
      ],
      caption: "Character portrait: Ooccoo and Ooccoo Jr.",
      image: resolvedImages[4],
    },
    {
      id: "gor-coron",
      alias: "gorcoron",
      title: "Gor Coron",
      paragraphs: [
        "Gor Coron stands at the center of the Goron chapter because he represents both regional authority and cultural resistance. Link cannot simply arrive at Death Mountain and claim passage; he has to prove himself within the Gorons' own logic of strength, endurance, and earned respect.",
        "That makes Gor Coron more than a local gatekeeper. He helps define one of the game's best recurring ideas: each province has its own leadership, traditions, and thresholds, and the walkthrough becomes more satisfying when those local structures are treated as part of the world rather than as obstacles on the way to a dungeon.",
      ],
      caption: "Character portrait: Gor Coron.",
      image: resolvedImages[5],
    },
    {
      id: "king-orcs-bulblin",
      alias: "kingorcsbulblin",
      title: "King Bulblin",
      paragraphs: [
        "King Bulblin functions as the route's most visible recurring field commander. He is not written as the deepest political figure in the cast, but his repeated appearances matter because they keep the road through Hyrule feeling occupied, contested, and dangerous even outside the major dungeons.",
        "That persistence gives the main quest momentum. Instead of treating each region as a sealed episode, King Bulblin helps the game feel like a continuous campaign in which Link is being pursued, tested, and forced to answer the same hostile power in more than one form.",
      ],
      caption: "Character portrait: King Bulblin.",
      image: resolvedImages[6],
    },
    {
      id: "shadow-being",
      alias: "shadowbeing",
      title: "Shadow Beasts",
      paragraphs: [
        "The Shadow Beasts are the clearest visual signature of the Twilight invasion. They matter less as individually memorable enemies than as a state change in the world: when they appear, ordinary village life, road safety, and provincial stability have all been interrupted by outside force.",
        "Because of that, their role in the guide is symbolic as much as mechanical. They announce that a region has crossed into Twilight logic, where cleansing the province and restoring the Light Spirit become the only meaningful way to move forward.",
      ],
      caption: "Enemy profile: Shadow Beasts.",
      image: resolvedImages[7],
    },
    {
      id: "zant",
      title: "Zant",
      paragraphs: [
        "Zant first appears as a cold and overwhelming conqueror, the figure who turns Twilight from rumor into direct occupation. For much of the game he is the face of the enemy, and that is important because his composure makes the fall of both Hyrule and the Twilight Realm feel deliberate rather than chaotic.",
        "Later chapters complicate that image by revealing how unstable his authority really is. That shift is one of the better villain turns in the game: Zant remains dangerous, but he becomes even more useful as a character once the player understands how much of his power is borrowed, theatrical, and bound up with Midna's own history.",
      ],
      caption: "Character portrait: Zant.",
      image: resolvedImages[8],
    },
    {
      id: "ganondorf",
      title: "Ganondorf",
      paragraphs: [
        "Ganondorf arrives later than the earlier villains and dungeon structures might suggest, but that late reveal is part of his narrative function. Once he enters the frame, the conflict stops being only a provincial emergency or a usurper's coup and becomes a larger struggle over Hyrule's fate, legitimacy, and survival.",
        "He is also the reason the finale feels mythic rather than merely conclusive. Zant can occupy the middle and late game as an active threat, but Ganondorf is the force that turns the end of the walkthrough into a final reckoning with the source of corruption behind the entire campaign.",
      ],
      caption: "Character portrait: Ganondorf.",
      image: resolvedImages[9],
    },
    {
      id: "twilight-princess",
      alias: "twilightprincess",
      title: "The Twilight Princess",
      paragraphs: [
        "The title 'Twilight Princess' identifies more than a character reveal. It points to the game's real center of gravity: the collision between two worlds, the cost of exile and occupation, and the burden carried by the rightful ruler of the Twilight Realm.",
        "Read that way, the title becomes a guide to the whole campaign. The main route may begin with Ordon, pass through Hyrule's provinces, and end in Hyrule Castle, but the story's deepest emotional stakes are tied to whether Midna can reclaim dignity, sovereignty, and separation on her own terms.",
      ],
      caption: "Story motif portrait: the Twilight Princess.",
      image: resolvedImages[10],
    },
  ];

  const sectionMarkup = sections.map((section) => buildCharacterSection(section)).join("\n");

  return `
        <div class="section" id="overview">
          <h2>Overview</h2>
          <p>This character guide is meant to sit beside the main walkthrough, not repeat it. Instead of treating the cast as a spoiler-free glossary, it explains how the major figures shape the game's emotional arc, regional politics, and late-game revelations.</p>
          <p>The entries below focus on characters and enemy forces that materially change the route. Some profiles lean into endgame context, so readers who want to remain mostly spoiler-light should return after clearing the early dungeon arc.</p>
        </div>
${sectionMarkup}
        <div class="section" id="reading-notes">
          <h2>Reading Notes</h2>
          <p>Use this page as a cast reference between chapters rather than as a one-time read. It works best when you want a quick reminder of who a person is, why they matter to the route, and how their role grows as Twilight Princess moves from village rescue to world-scale conflict.</p>
        </div>`;
};

const buildAppendixToc = () => `
<h2>Contents</h2><nav>
        <h4>Contents</h4>
        <div class="toc" id="">
<p class="topic-title">Contents</p>
<ul class="simple">
<li><a class="reference internal" href="#secret">General Secrets and Route Advice</a></li>
<li><a class="reference internal" href="#heartpiece">Heart Pieces</a></li>
<li><a class="reference internal" href="#item">Optional Items and Upgrades</a></li>
<li><a class="reference internal" href="#bottle">Bottles</a></li>
<li><a class="reference internal" href="#mistery">Hidden Skills</a></li>
<li><a class="reference internal" href="#goldenbug">Golden Bugs</a></li>
<li><a class="reference internal" href="#ghostsoul">Poe Souls</a></li>
<li><a class="reference internal" href="#fishing">Fishing</a></li>
<li><a class="reference internal" href="#trialscave">Cave of Ordeals</a></li>
</ul>
</div>
        </nav>`;

const buildAppendixArticle = (pageTitle, images) => {
  const legacyAnchors = legacyAppendixIds
    .map((id) => `<span id="${id}"></span>`)
    .join("");

  return `
        <div class="section" id="overview">
          <h2>Overview</h2>
          <p>This appendix is the practical reference guide for everything that sits around the main story route. Instead of reading like a spillover page for leftover notes, it is organized as a cleanup and planning reference for players who want stronger preparation, cleaner progression, or fuller completion coverage.</p>
          <p>Most of the subjects here become more valuable on return visits than on a blind first pass. Heart Pieces, bugs, bottles, combat techniques, and endurance content all benefit from timing, and the purpose of this page is to help you decide what to chase early, what to leave for a natural revisit, and what to save for a near-endgame sweep.</p>
          <p>The legacy anchors from the imported archive are intentionally retained so older internal links continue to land on valid sections inside this page.</p>
          <div aria-hidden="true">${legacyAnchors}</div>
        </div>
        <div class="section" id="secret">
          <h2>General Secrets and Route Advice</h2>
          <p>Twilight Princess is generous with optional support, but it rewards timing more than blind scavenging. The best optional finds are the ones that reduce friction across multiple chapters: bottles, wallet growth, extra bomb storage, improved combat options, and steady collectible progress in regions you are already visiting anyway.</p>
          <p>As a rule, do the obvious low-cost side tasks when the story naturally presents them, especially in hubs such as Ordon, Kakariko, Castle Town, and Lake Hylia. Save the heavier cleanup loops for the middle and late game, once traversal tools have opened enough of the map to make detours efficient instead of repetitive.</p>
          ${buildBulletList([
            "Early priority: bottles, wallet growth, and any reward that improves recovery or resource capacity.",
            "Midgame priority: Heart Pieces, bugs, and side upgrades that become easier once Clawshot, Spinner, or Dominion Rod access expands the map.",
            "Late-game priority: Poe cleanup, Hidden Skill completion, and the Cave of Ordeals once your inventory is broad enough to support mistakes.",
          ])}
        </div>
        <div class="section" id="heartpiece">
          <h2>Heart Pieces</h2>
          <p>Heart Pieces are the backbone of safe completion routing because they steadily turn hard fights and longer dungeon stretches into more forgiving territory. They are scattered across towns, ledges, minigames, caves, and return-route spaces, so the cleanest way to track them is by region rather than by strict story chapter.</p>
          <p>Many of the easiest misses happen because a location looks familiar before the correct traversal tool is in hand. Once the Clawshot, Spinner, Ball and Chain, or Dominion Rod opens older spaces in a new way, revisit the main hub regions with health cleanup in mind.</p>
          ${buildBulletList([
            "Check Ordon, Kakariko, Castle Town, and Lake Hylia whenever a new traversal item expands the map.",
            "Do not assume the obvious health upgrades are all in dungeons; some of the easiest misses are tied to optional minigames and casual return visits.",
            "A cleanup pass after each major mirror shard is usually more efficient than postponing all health collection until after the final story push.",
          ])}
        </div>
        <div class="section" id="item">
          <h2>Optional Items and Upgrades</h2>
          <p>Optional upgrades in Twilight Princess matter because they remove friction from the exact places where the main route starts stretching out: longer overworld loops, repeat shop visits, ranged encounters, and endurance-heavy side content. Larger quivers, bomb bags, stronger wallets, and armor options all help the late game feel more controlled.</p>
          <p>These are best treated as efficiency rewards rather than pure completion badges. If you want the main quest to move with fewer interruptions, invest in storage and economy upgrades first, then add specialty gear once the story begins pushing you across wider portions of Hyrule.</p>
          ${buildBulletList([
            "Prioritize storage upgrades before cosmetic or novelty purchases.",
            "Late-game convenience often comes from side content that looked minor when it first appeared.",
            "If you dislike backtracking, collect upgrades when the story naturally sends you close to their regions instead of forcing a separate trip later.",
          ])}
        </div>
        <div class="section" id="bottle">
          <h2>Bottles</h2>
          <p>Bottles are among the highest-value optional rewards in the entire game because they turn freeform exploration into flexible support. A bottle can hold recovery, lantern fuel, quest items, insects, or situational utility, which means every new bottle reduces how often the player needs to interrupt momentum to resupply.</p>
          <p>The first bottle meaningfully changes the early game, and the later bottles are even more important for side content. Poe hunting, Cave of Ordeals attempts, and long cleanup sessions all feel less brittle once multiple bottle slots are available.</p>
          ${buildBulletList([
            "Milk and potions are the obvious uses, but bottles also matter for insects, lantern oil, and several side-quest interactions.",
            "If you only plan to pursue a small number of optional rewards, bottles should still be near the top of the list.",
          ])}
        </div>
        <div class="section" id="mistery">
          <h2>Hidden Skills</h2>
          <p>The Hidden Skills are best understood as quality-of-combat upgrades. They are not mandatory in a literal progression sense, but they make repeated enemy encounters cleaner, shorten certain fights, and give the final chapters a sharper sense of mastery than simple button repetition would allow.</p>
          <p>Because they arrive over time, they are easy to neglect. That is usually a mistake. Even players who never use every technique in every encounter benefit from having a broader answer set once armored enemies, shielded opponents, or high-pressure late-game rooms begin stacking threats together.</p>
          ${buildBulletList([
            "Treat the Hero's Shade meetings as long-term combat upgrades, not optional flavor scenes.",
            "Even partial mastery helps; Back Slice, Helm Splitter, and Mortal Draw are especially useful once late-game enemies start defending more aggressively.",
            "Because unlock timing is progression-based, revisit the training chain whenever the story gives you a natural pause.",
          ])}
        </div>
        <div class="section" id="goldenbug">
          <h2>Golden Bugs</h2>
          <p>The Golden Bug hunt is one of the most efficient side systems in the game because it combines exploration, rupee support, and wallet growth in a single loop. It rewards players who pay attention to small environmental tells and who are willing to revisit earlier regions once new movement options make broad overworld sweeps easier.</p>
          <p>It is rarely worth forcing bug collection one specimen at a time. The cleaner approach is to gather them in pairs, fold them into Heart Piece cleanup, and cash them in during natural Castle Town visits so the reward chain supports the rest of the route.</p>
          ${buildBulletList([
            "Collect bugs in pairs whenever possible to reduce unnecessary return trips.",
            "This side content pairs especially well with Heart Piece cleanup because both reward broad overworld coverage and repeated hub travel.",
          ])}
        </div>
        <div class="section" id="ghostsoul">
          <h2>Poe Souls</h2>
          <p>Poe Souls are one of the least forgiving collectibles to track casually because the story often passes their locations quickly and does not always encourage an immediate detour. The best strategy is to treat them as a regional checklist and clear them in clusters once your route naturally loops back through a province.</p>
          <p>Lantern fuel, wolf senses, and time-of-day awareness all matter here, and that makes Poe cleanup better suited to deliberate sweeps than to improvised searching. If a province still feels only partly cleared after a chapter, make a note and come back with intent rather than relying on memory alone.</p>
          ${buildBulletList([
            "Night visibility, Lantern management, and wolf senses all matter for efficient Poe cleanup.",
            "Several Poes are easier to confirm from preserved screenshots than from text alone, which is why the local archive maps remain useful here.",
          ])}
        </div>
        <div class="section" id="fishing">
          <h2>Fishing</h2>
          <p>Fishing begins as a quiet early-game lesson in item use and local interaction, then gradually opens into a larger optional system with its own pace and appeal. Some players will treat it as atmosphere, while others will use it as a genuine side pursuit between heavier story pushes.</p>
          <p>Either way, it works best when separated mentally from the main combat-and-dungeon rhythm. The rod helps the opening hours feel grounded, but the later lure-fishing material is most satisfying when approached as intentional downtime rather than squeezed awkwardly into a busy story route.</p>
          ${buildBulletList([
            "The early rod matters because it teaches item use and supports one of the opening village side tasks.",
            "Later lure fishing is best treated as dedicated side content rather than something to rush through in the middle of a chapter objective.",
          ])}
        </div>
        <div class="section" id="trialscave">
          <h2>Cave of Ordeals</h2>
          <p>The Cave of Ordeals is not a puzzle dungeon and not a story chapter. It is a sustained endurance check built to test inventory depth, composure, and practical command of the wider combat toolset. Players who enter it too early often experience it as attrition; players who wait until their preparation is mature usually find it a satisfying proof-of-mastery challenge.</p>
          <p>That timing is the key recommendation. This is late-game or near-completion content, and it should be approached only after bottles, recovery plans, Hidden Skills, and major item options are all in place. Think of it as the final exam for your optional preparation rather than as a box to tick the moment it becomes available.</p>
          ${buildBulletList([
            "Attempt it after building a healthier inventory, not as soon as it becomes technically available.",
            "Bottles, armor options, Hidden Skills, and recovery planning matter here more than in most single dungeons.",
            "Use it as a late-game mastery check, not as a mandatory pacing step inside the story route.",
          ])}
        </div>${buildGallery(
          images,
          pageTitle,
          "The original appendix relied heavily on maps and reference images. They remain below as a local gallery so route planning and collectible cleanup still have visual support even though the broken imported captions were removed.",
        )}`;
};

const buildEpilogueArticle = (pageTitle, images) => `
        <div class="section" id="overview">
          <h2>Overview</h2>
          <p>The epilogue exists to do what the battle-heavy final chapter cannot fully pause to do: account for the cost of victory. Twilight Princess ends with the immediate threat broken and the order of both worlds restored, but it does not pretend that restoration means everything can remain as it was.</p>
          <p>That restraint is what gives the ending its staying power. The final scenes are about political recovery, personal farewell, and the recognition that some of the game's most important bonds only become fully visible at the moment they have to be released.</p>
        </div>
        <div class="section" id="what-the-ending-resolves">
          <h2>What the Ending Resolves</h2>
          ${buildBulletList([
            "The occupation of Hyrule is broken and the visible Twilight corruption recedes from the world of light.",
            "Midna's story resolves on the level that matters most: she is no longer a displaced survivor acting through others, but the ruler who decides the future of her own realm.",
            "The ending restores peace without erasing consequence, allowing the final images to feel earned instead of merely triumphant.",
          ])}
        </div>
        <div class="section" id="character-payoff">
          <h2>Character Payoff</h2>
          <p>The finale works because it resolves different character arcs in different registers. Link's journey closes in action, Zelda's in endurance and sacrifice, and Midna's in sovereignty and separation. Those three threads overlap in the final sequence, but they do not collapse into the same emotional note.</p>
          <p>That separation is worth emphasizing in a guide context. The last chapter may be remembered for boss phases and castle pressure, yet the epilogue is where Twilight Princess clarifies what those battles were for and why the victory feels bittersweet instead of purely celebratory.</p>
        </div>
        <div class="section" id="why-it-lands">
          <h2>Why the Ending Endures</h2>
          <p>Twilight Princess leaves a strong afterimage because its finale is both mythic and intimate. The castle collapse, Ganondorf's defeat, and the restoration of order all matter, but the emotional center of the ending is quieter: two worlds survive, yet they do so by accepting a necessary distance between them.</p>
          <p>The preserved screenshot gallery below is best read as a visual closing sequence rather than as a raw dump of archived images. Move through it as the aftermath of the last battle: restoration, farewell, and the return of ordinary light after a long stretch of Twilight.</p>
        </div>${buildGallery(
          images,
          pageTitle,
          "These local ending screenshots are preserved as a visual timeline of the finale, its farewell, and the return to peace after the last battle.",
        )}`;

const buildChapterArticle = (pageTitle, images, meta) => `
        <div class="section" id="overview">
          <h2>${escapeHtml(meta.sectionTitle)}</h2>
          <p>${escapeHtml(meta.overview[0])}</p>
          <p>${escapeHtml(meta.overview[1])}</p>
        </div>
        <div class="section" id="story-flow">
          <h2>Story and Route Flow</h2>
          <p>This chapter reads best as a sequence of progression beats rather than as isolated screenshot captions. The breakdown below follows the route in the order a player would experience it.</p>
${buildFlowSections(meta.flowSections)}
        </div>
        <div class="section" id="focus">
          <h2>${escapeHtml(meta.focusTitle)}</h2>
          <p>${escapeHtml(meta.focusText)}</p>
        </div>
        <div class="section" id="route-highlights">
          <h2>What to Prioritize</h2>
${buildBulletList(meta.highlights)}
        </div>
        <div class="section" id="why-it-matters">
          <h2>Why This Chapter Matters</h2>
          <p>${escapeHtml(meta.whyItMatters)}</p>
        </div>
        <div class="section" id="reading-notes">
          <h2>Preparation and Reading Notes</h2>
${buildBulletList(meta.notes)}
        </div>${buildGallery(
          images,
          pageTitle,
          "The original imported page used a long screenshot sequence with unstable translated captions. The local image archive is preserved below as a numbered source gallery, while the main English walkthrough above has been rewritten into cleaner guide prose.",
        )}`;

const writePage = async (relativePath, contents) => {
  const fullPath = path.join(cwd, relativePath);
  await fs.writeFile(fullPath, contents, "utf8");
};

const rewritePage = async (relativePath, options) => {
  const fullPath = path.join(cwd, relativePath);
  const original = await fs.readFile(fullPath, "utf8");
  const pageTitle = extractTitle(original, relativePath);
  const articleBlock = extractArticleBlock(original, relativePath);
  const images = extractImages(articleBlock);
  const downloads = extractDownloads(articleBlock);

  let next = original;
  let articleHtml = "";
  let tocHtml = null;

  if (options.kind === "intro") {
    articleHtml = buildIntroArticle(relativePath, pageTitle, images, downloads);
  } else if (options.kind === "characters") {
    articleHtml = buildCharactersArticle(images);
    tocHtml = buildCharactersToc();
  } else if (options.kind === "appendix") {
    articleHtml = buildAppendixArticle(pageTitle, images);
    tocHtml = buildAppendixToc();
  } else if (options.kind === "epilogue") {
    articleHtml = buildEpilogueArticle(pageTitle, images);
  } else if (options.kind === "chapter") {
    articleHtml = buildChapterArticle(pageTitle, images, options.meta);
  } else {
    throw new Error(`Unsupported rewrite kind for ${relativePath}`);
  }

  next = replaceSourceProse(next, articleHtml, relativePath);
  if (tocHtml) {
    next = replaceTocPanel(next, tocHtml, relativePath);
  }

  await writePage(relativePath, next);
  return { relativePath, images: images.length };
};

const targets = [
  { file: routes.intro, kind: "intro" },
  { file: routes.characters, kind: "characters" },
  { file: routes.epilogue, kind: "epilogue" },
  { file: routes.appendix, kind: "appendix" },
  ...Object.entries(chapterMeta).map(([slug, meta]) => ({
    file: meta.route,
    kind: "chapter",
    meta,
    slug,
  })),
];

const results = [];
for (const target of targets) {
  results.push(await rewritePage(target.file, target));
}

for (const result of results) {
  console.log(`Rewrote ${result.relativePath} (${result.images} images kept)`);
}
