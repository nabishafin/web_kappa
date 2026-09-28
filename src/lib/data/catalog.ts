import type { ContinueWatchingItem, Creator, Episode, FaqItem, Genre, NotificationItem, Plan, Title } from "@/lib/types";

const img = (p: string) => `/images/${p}`;

/* ------------------------------------------------------------------ */
/* Creators                                                            */
/* ------------------------------------------------------------------ */
export const creators: Creator[] = [
  { id: "rokey-mahmud", name: "Rokey Mahmud", handle: "@rokey", avatar: img("people/rokey.webp"), headline: "Certified Visionary Creator", verified: true, animations: 42, followers: 18400 },
  { id: "astra-studio", name: "Astra Studio", handle: "@astra_studio", avatar: img("people/astra-studio.webp"), headline: "Independent sci-fi studio", animations: 31, followers: 92100 },
  { id: "luna-void", name: "Luna Void", handle: "@lunavoid", avatar: img("people/luna-void.webp"), headline: "Cyber-noir animator", animations: 17, followers: 40300 },
  { id: "pixel-rebel", name: "Pixel Rebel", handle: "@pixel_rebel", avatar: img("people/pixel-rebel.webp"), headline: "2D experimental collective", animations: 58, followers: 27600 },
  { id: "nebula-studios", name: "Nebula Studios", handle: "@nebula_studios", avatar: img("people/nebula-studios.webp"), headline: "3D feature animation", verified: true, animations: 12, followers: 210000 },
  { id: "code-walker", name: "Code Walker", handle: "@codewalker", avatar: img("people/code-walker.webp"), headline: "Documentary storyteller", animations: 9, followers: 15800 },
  { id: "vivid-void", name: "Vivid Void", handle: "@vividvoid", avatar: img("people/vivid-void.webp"), headline: "Art-film director", animations: 23, followers: 64000 },
  { id: "mira", name: "MIRA", handle: "@mira", avatar: img("people/creator-3.webp"), headline: "Spotlight Artist", verified: true, animations: 14, followers: 88200 },
  { id: "solaris-studios", name: "Solaris Studios", handle: "@solaris", avatar: img("people/user-photo.webp"), headline: "Space-opera shorts", animations: 36, followers: 51000 },
];

/** Community creators shown on the profile “Follow creator” tab */
export const communityCreators: Creator[] = [
  { id: "sarah-games", name: "Sarah Games", handle: "@sarah_games", avatar: img("people/creator-1.webp"), animations: 439, followers: 1234 },
  { id: "kofi-frames", name: "Kofi Frames", handle: "@kofi_frames", avatar: img("people/creator-2.webp"), animations: 212, followers: 5402 },
  { id: "dani-motion", name: "Dani Motion", handle: "@dani_motion", avatar: img("people/creator-2.webp"), animations: 97, followers: 877 },
  { id: "lena-inks", name: "Lena Inks", handle: "@lena.inks", avatar: img("people/creator-3.webp"), animations: 318, followers: 12650 },
  { id: "milo-cels", name: "Milo Cels", handle: "@milo_cels", avatar: img("people/creator-4.webp"), animations: 64, followers: 2310 },
  { id: "ruby-rig", name: "Ruby Rig", handle: "@ruby_rig", avatar: img("people/creator-3.webp"), animations: 145, followers: 3981 },
  { id: "ivy-keyframe", name: "Ivy Keyframe", handle: "@ivy_keyframe", avatar: img("people/creator-3.webp"), animations: 51, followers: 760 },
  { id: "theo-tween", name: "Theo Tween", handle: "@theo_tween", avatar: img("people/creator-4.webp"), animations: 229, followers: 8804 },
  { id: "nora-loop", name: "Nora Loop", handle: "@nora_loop", avatar: img("people/creator-3.webp"), animations: 88, followers: 1542 },
];

/* ------------------------------------------------------------------ */
/* Genres                                                              */
/* ------------------------------------------------------------------ */
export const genres: Genre[] = [
  { slug: "action", name: "Action", description: "High-octane chases, duels and daring escapes.", cover: img("categories/action.webp"), collage: [img("thumbs/watchlist-1.webp"), img("thumbs/trending-1.webp"), img("thumbs/cyber-shell.webp"), img("thumbs/watchlist-4.webp")] },
  { slug: "adventure", name: "Adventure", description: "Journeys to strange lands and impossible places.", cover: img("categories/adventure.webp"), collage: [img("thumbs/continue-1.webp"), img("thumbs/trending-2.webp"), img("thumbs/glitch-horizon.webp"), img("thumbs/watchlist-2.webp")] },
  { slug: "comedy", name: "Comedy", description: "Laugh-out-loud shorts and sharp satire.", cover: img("categories/comedy.webp"), collage: [img("thumbs/cyber-shell.webp"), img("thumbs/trending-3.webp"), img("thumbs/great-void.webp"), img("thumbs/watchlist-3.webp")] },
  { slug: "drama", name: "Drama", description: "Stories that stay with you long after the credits.", cover: img("categories/drama.webp"), collage: [img("thumbs/watchlist-4.webp"), img("thumbs/visions-of-cobalt.webp"), img("thumbs/data-stream-dreams.webp"), img("thumbs/trending-1.webp")] },
  { slug: "fantasy", name: "Fantasy", description: "Magic, myths and worlds beyond our own.", collage: [img("titles/nebula-void.webp"), img("thumbs/continue-1.webp"), img("thumbs/watchlist-2.webp"), img("thumbs/watchlist-4.webp")] },
  { slug: "sci-fi", name: "Sci-Fi", description: "Futures, machines and the stars between.", collage: [img("thumbs/neon-drift.webp"), img("thumbs/silicon-soul.webp"), img("thumbs/visions-of-cobalt.webp"), img("thumbs/terminal-code.webp")] },
  { slug: "experimental", name: "Experimental", description: "Boundary-pushing art from visionary creators.", collage: [img("thumbs/glitch-horizon.webp"), img("thumbs/data-stream-dreams.webp"), img("thumbs/neon-drift.webp"), img("thumbs/visions-of-cobalt.webp")] },
  { slug: "documentary", name: "Documentary", description: "True stories told through animation.", collage: [img("thumbs/terminal-code.webp"), img("thumbs/great-void.webp"), img("thumbs/trending-2.webp"), img("thumbs/silicon-soul.webp")] },
];

/* ------------------------------------------------------------------ */
/* Titles                                                              */
/* ------------------------------------------------------------------ */
const nebulaEpisodes: Episode[] = [
  { id: "nv-s1e1", season: 1, number: 1, title: "The Last Galaxy", duration: "24:00", synopsis: "As the final stars wink out, a young cartographer discovers a map drawn in living light.", thumbnail: img("titles/nebula-void.webp") },
  { id: "nv-s1e2", season: 1, number: 2, title: "Rogue Palette", duration: "23:12", synopsis: "The crew of the Brushstroke recruits an outlaw animator who can paint gravity itself.", thumbnail: img("player/nebula-stream.webp") },
  { id: "nv-s1e3", season: 1, number: 3, title: "Colors of Existence", duration: "25:40", synopsis: "Deep in the Void, the team finds a city that remembers every color the universe has lost.", thumbnail: img("titles/canyon-heights.webp") },
  { id: "nv-s1e4", season: 1, number: 4, title: "Heart of the Nebula", duration: "27:05", synopsis: "A desperate gamble at the core of the Nebula could restore the light — or erase it forever.", thumbnail: img("thumbs/data-stream-dreams.webp") },
];

export const titles: Title[] = [
  {
    slug: "chronicles-of-the-nebula-void",
    title: "Chronicles of the Nebula Void",
    kind: "series",
    synopsis:
      "As the last galaxy fades into the eternal silence, a group of rogue animators must venture into the heart of the Nebula Void to restore the colors of existence. An epic visual masterpiece that redefines cinematic animation.",
    tagline: "Follow the Chronicles of the Nebula Void",
    genres: ["fantasy", "sci-fi", "adventure"],
    label: "FANTASY",
    creatorId: "rokey-mahmud",
    thumbnail: img("titles/nebula-void.webp"),
    backdrop: img("titles/nebula-void.webp"),
    duration: "24:00",
    rating: 4.9,
    views: 4_800_000,
    year: 2026,
    maturity: "TV-Y",
    badges: ["HD", "CC"],
    seasons: 1,
    episodes: nebulaEpisodes,
    icon: "sparkles",
    publishedAt: "2026-09-20T10:00:00Z",
    featured: { eyebrow: "Trending Now", meta: "S3 • E12" },
  },
  { slug: "neon-drift-protocol-7", title: "Neon Drift: Protocol 7", kind: "film", synopsis: "In a rain-soaked megacity, a courier races a rogue AI across rooftops lit by a thousand holograms.", genres: ["sci-fi", "action"], label: "SCI-FI", creatorId: "astra-studio", thumbnail: img("thumbs/neon-drift.webp"), duration: "08:42", rating: 4.9, views: 1_200_000, year: 2026, maturity: "TV-PG", badges: ["HD", "CC"], icon: "sparkles", publishedAt: "2026-09-12T10:00:00Z" },
  { slug: "visions-of-cobalt", title: "Visions of Cobalt", kind: "film", synopsis: "A detective who sees memories through a cybernetic eye unravels the case that erased her own past.", genres: ["sci-fi", "drama"], label: "CYBER-NOIR", creatorId: "luna-void", thumbnail: img("thumbs/visions-of-cobalt.webp"), duration: "12:15", rating: 4.8, views: 840_000, year: 2026, maturity: "TV-14", badges: ["HD", "CC"], icon: "badge", publishedAt: "2026-08-30T10:00:00Z" },
  { slug: "the-glitch-horizon", title: "The Glitch Horizon", kind: "film", synopsis: "A lone runner sprints through a forest of corrupted code, chasing the last uncorrupted sunrise.", genres: ["experimental", "sci-fi"], label: "2D EXPERIMENTAL", creatorId: "pixel-rebel", thumbnail: img("thumbs/glitch-horizon.webp"), duration: "05:30", rating: 4.7, views: 420_000, year: 2025, maturity: "TV-PG", badges: ["HD"], icon: "zap", publishedAt: "2026-09-27T10:00:00Z" },
  { slug: "silicon-soul", title: "Silicon Soul", kind: "film", synopsis: "An android sculptor reaches for the one thing its makers never programmed: the need to create.", genres: ["sci-fi", "drama"], label: "3D FEATURE", creatorId: "nebula-studios", thumbnail: img("thumbs/silicon-soul.webp"), duration: "15:00", rating: 5.0, views: 3_100_000, year: 2026, maturity: "TV-PG", badges: ["4K", "CC"], icon: "clapper", publishedAt: "2026-07-18T10:00:00Z" },
  { slug: "the-terminal-code", title: "The Terminal Code", kind: "film", synopsis: "The true story of the late-night hackers who turned green phosphor screens into an art form.", genres: ["documentary"], label: "DOCUMENTARY", creatorId: "code-walker", thumbnail: img("thumbs/terminal-code.webp"), duration: "09:10", rating: 4.6, views: 156_000, year: 2025, maturity: "TV-G", badges: ["HD", "CC"], icon: "video", publishedAt: "2026-06-02T10:00:00Z" },
  { slug: "data-stream-dreams", title: "Data Stream Dreams", kind: "film", synopsis: "A whale made of starlight swims the data streams of a sleeping city, collecting forgotten dreams.", genres: ["experimental", "fantasy"], label: "ART FILM", creatorId: "vivid-void", thumbnail: img("thumbs/data-stream-dreams.webp"), duration: "07:45", rating: 4.9, views: 2_100_000, year: 2026, maturity: "TV-Y7", badges: ["4K"], icon: "palette", publishedAt: "2026-09-01T10:00:00Z" },
  { slug: "the-last-spore", title: "The Last Spore", kind: "series", synopsis: "In a bioluminescent jungle, the final mushroom spirit must choose a successor before the long night.", genres: ["fantasy", "adventure"], label: "FANTASY", creatorId: "astra-studio", thumbnail: img("thumbs/continue-1.webp"), duration: "22:00", rating: 4.8, views: 610_000, year: 2026, maturity: "TV-Y7", badges: ["HD", "CC"], seasons: 1, icon: "sparkles", publishedAt: "2026-09-05T10:00:00Z", episodes: [
    { id: "ls-s1e1", season: 1, number: 1, title: "Glow", duration: "22:00", synopsis: "The jungle dims for the first time in a thousand years.", thumbnail: img("thumbs/continue-1.webp") },
    { id: "ls-s1e2", season: 1, number: 2, title: "Mycelium", duration: "21:30", synopsis: "Roots carry a message from the other side of the forest.", thumbnail: img("thumbs/watchlist-2.webp") },
    { id: "ls-s1e3", season: 1, number: 3, title: "Night Bloom", duration: "23:10", synopsis: "An unlikely hero sprouts where no light has reached.", thumbnail: img("thumbs/watchlist-4.webp") },
    { id: "ls-s1e4", season: 1, number: 4, title: "The Successor", duration: "24:45", synopsis: "The spirit’s choice will change the jungle forever.", thumbnail: img("thumbs/continue-1.webp") },
  ] },
  { slug: "fractal-dreams", title: "Fractal Dreams", kind: "film", synopsis: "A clay doll wanders a garden that rearranges itself every time she blinks.", genres: ["adventure", "comedy"], label: "FEATURE FILM", creatorId: "nebula-studios", thumbnail: img("thumbs/continue-2.webp"), duration: "1:52:00", rating: 4.7, views: 980_000, year: 2026, maturity: "TV-G", badges: ["4K", "CC"], icon: "clapper", publishedAt: "2026-08-14T10:00:00Z" },
  { slug: "meadow-wanderer", title: "Meadow Wanderer", kind: "film", synopsis: "A tiny traveller and her rubber-duck companions cross the biggest lawn in the world.", genres: ["adventure", "comedy"], label: "STOP-MOTION", creatorId: "pixel-rebel", thumbnail: img("thumbs/trending-1.webp"), duration: "05:30", rating: 4.6, views: 312_000, year: 2026, maturity: "TV-Y", badges: ["HD"], icon: "sparkles", publishedAt: "2026-09-27T09:00:00Z" },
  { slug: "golden-hare", title: "Golden Hare", kind: "film", synopsis: "Under a sky of falling gold dust, a porcelain hare waits for the one who wound its key.", genres: ["drama", "fantasy"], label: "3D SHORT", creatorId: "vivid-void", thumbnail: img("thumbs/trending-2.webp"), duration: "08:42", rating: 4.8, views: 205_000, year: 2026, maturity: "TV-G", badges: ["4K"], icon: "palette", publishedAt: "2026-09-28T07:58:00Z" },
  { slug: "city-of-tails", title: "City of Tails", kind: "film", synopsis: "A rookie bunny officer and a smooth-talking fox crack the case of the vanishing night markets.", genres: ["comedy", "action"], label: "COMEDY", creatorId: "solaris-studios", thumbnail: img("thumbs/trending-3.webp"), duration: "12:15", rating: 4.9, views: 1_640_000, year: 2026, maturity: "TV-PG", badges: ["HD", "CC"], icon: "video", publishedAt: "2026-09-27T12:00:00Z" },
  { slug: "canyon-heights", title: "Canyon Heights", kind: "film", synopsis: "A visual journey through the vertical slums of the future. Winner of the 2024 Nebula Award for Direction.", genres: ["sci-fi", "drama"], label: "ART FILM", creatorId: "mira", thumbnail: img("titles/canyon-heights.webp"), backdrop: img("titles/canyon-heights.webp"), duration: "18:20", rating: 4.9, views: 2_750_000, year: 2024, maturity: "TV-14", badges: ["4K", "CC"], icon: "badge", publishedAt: "2024-11-02T10:00:00Z", awards: "2024 Nebula Award for Direction" },
  { slug: "neon-genesis-rebirth", title: "Neon Genesis: Rebirth", kind: "series", synopsis: "A grinning green giant wakes up in a toy box and decides he’s the hero of the story.", genres: ["comedy"], label: "COMEDY", creatorId: "pixel-rebel", thumbnail: img("thumbs/watchlist-1.webp"), duration: "11:00", rating: 4.5, views: 530_000, year: 2025, maturity: "TV-Y7", badges: ["HD"], seasons: 2, icon: "sparkles", publishedAt: "2026-05-11T10:00:00Z" },
  { slug: "stellar-odyssey", title: "Stellar Odyssey", kind: "film", synopsis: "A stag of embers leads a lost child through a forest lit only by falling stars.", genres: ["fantasy", "drama"], label: "FANTASY", creatorId: "luna-void", thumbnail: img("thumbs/watchlist-2.webp"), duration: "14:20", rating: 4.8, views: 740_000, year: 2026, maturity: "TV-PG", badges: ["4K"], icon: "palette", publishedAt: "2026-04-21T10:00:00Z" },
  { slug: "void-dragon-chronicles", title: "Void Dragon Chronicles", kind: "series", synopsis: "A brave little doll insists the ducks in her garden are dragons — and sets out to prove it.", genres: ["adventure", "comedy"], label: "ADVENTURE", creatorId: "nebula-studios", thumbnail: img("thumbs/watchlist-3.webp"), duration: "09:30", rating: 4.6, views: 412_000, year: 2026, maturity: "TV-Y", badges: ["HD", "CC"], seasons: 1, icon: "clapper", publishedAt: "2026-03-08T10:00:00Z" },
  { slug: "ether-gardens", title: "Ether Gardens", kind: "film", synopsis: "A hooded gardener tends a meadow where every flower hums a different song.", genres: ["fantasy"], label: "FANTASY", creatorId: "vivid-void", thumbnail: img("thumbs/watchlist-4.webp"), duration: "06:50", rating: 4.7, views: 268_000, year: 2026, maturity: "TV-Y", badges: ["HD"], icon: "sparkles", publishedAt: "2026-02-17T10:00:00Z" },
  { slug: "cyber-shell", title: "Cyber Shell", kind: "series", synopsis: "A snowman with a heart of circuitry protects his winter town from a heatwave of rogue drones.", genres: ["comedy", "action"], label: "ACTION COMEDY", creatorId: "astra-studio", thumbnail: img("thumbs/cyber-shell.webp"), duration: "24:00", rating: 4.6, views: 890_000, year: 2025, maturity: "TV-Y7", badges: ["HD", "CC"], seasons: 1, icon: "zap", publishedAt: "2026-01-12T10:00:00Z" },
  { slug: "the-great-void", title: "The Great Void: Part II", kind: "film", synopsis: "A retired robot comes out of retirement for one last dance across the great green void.", genres: ["comedy", "sci-fi"], label: "SCI-FI COMEDY", creatorId: "code-walker", thumbnail: img("thumbs/great-void.webp"), duration: "21:00", rating: 4.4, views: 377_000, year: 2025, maturity: "TV-PG", badges: ["HD"], icon: "video", publishedAt: "2025-12-01T10:00:00Z" },
  { slug: "neon-horizon-part-ii", title: "Neon Horizon: Part II", kind: "film", synopsis: "Riding the aurora currents of a dying nebula, a pilot searches for the signal that called her home.", genres: ["sci-fi", "fantasy"], label: "SPACE OPERA", creatorId: "solaris-studios", thumbnail: img("player/nebula-stream.webp"), backdrop: img("player/nebula-stream.webp"), duration: "24:00", rating: 4.9, views: 1_020_000, year: 2026, maturity: "TV-PG", badges: ["4K", "CC"], icon: "sparkles", publishedAt: "2026-09-18T10:00:00Z" },
  { slug: "stellar-drift", title: "Stellar Drift", kind: "film", synopsis: "Two astronauts adrift in a painted cosmos learn that home is the person beside you.", genres: ["sci-fi", "drama"], label: "SCI-FI", creatorId: "rokey-mahmud", thumbnail: img("titles/nebula-void.webp"), duration: "16:10", rating: 4.8, views: 695_000, year: 2026, maturity: "TV-PG", badges: ["4K", "CC"], icon: "sparkles", publishedAt: "2026-09-09T10:00:00Z" },
];

/** Landing “Explore Unlimited Animated Worlds” grid, in design order */
export const exploreSlugs = [
  "neon-drift-protocol-7",
  "visions-of-cobalt",
  "the-glitch-horizon",
  "the-glitch-horizon",
  "silicon-soul",
  "silicon-soul",
  "the-terminal-code",
  "data-stream-dreams",
];

export const featuredSlugs = ["chronicles-of-the-nebula-void", "canyon-heights", "neon-horizon-part-ii", "silicon-soul"];
export const trendingSlugs = ["meadow-wanderer", "golden-hare", "city-of-tails", "the-glitch-horizon", "neon-drift-protocol-7", "data-stream-dreams", "silicon-soul", "visions-of-cobalt", "the-terminal-code"];

export const continueWatchingSeed: ContinueWatchingItem[] = [
  { slug: "the-last-spore", subtitle: "S1 : E4 • 12m left", progress: 0.74, watchedAt: "2026-09-27T20:00:00Z", remaining: "12m" },
  { slug: "fractal-dreams", subtitle: "Feature Film • 1h 45m left", progress: 0.3, watchedAt: "2026-09-26T19:00:00Z", remaining: "1h 45m" },
  { slug: "cyber-shell", heading: "Cyber Shell: Episode 12", subtitle: "Watched 1 day ago • 22m remaining", progress: 0.54, watchedAt: "2026-09-27T09:00:00Z", remaining: "22m", thumbnail: img("thumbs/cyber-shell.webp") },
  { slug: "the-great-void", heading: "The Great Void: Part II", subtitle: "Watched 3 days ago • 4m remaining", progress: 0.745, watchedAt: "2026-09-25T09:00:00Z", remaining: "4m", thumbnail: img("thumbs/great-void.webp") },
];

export const watchlistSeed = ["neon-genesis-rebirth", "stellar-odyssey", "void-dragon-chronicles", "ether-gardens"];

/* ------------------------------------------------------------------ */
/* Marketing content                                                   */
/* ------------------------------------------------------------------ */
export const faqs: FaqItem[] = [
  { id: "what", question: "What is Channel Infinity?", answer: "A streaming platform for independent animation creators and fans." },
  { id: "account", question: "Do I need an account?", answer: "You can browse the catalog freely, but you’ll need a free account to stream, build a watchlist, follow creators and rate animations." },
  { id: "support", question: "How can I support creators?", answer: "Use the TipJar on any title page to send a one-time donation, follow creators to boost their reach, or upgrade to Premium — a share of every subscription goes directly to the artists you watch." },
  { id: "premium", question: "What does Premium include?", answer: "Ad-free Ultra HD & 4K streaming, early access to new releases 48 hours before everyone else, and studio extras like director commentary and process breakdowns." },
  { id: "later", question: "Can I continue watching later?", answer: "Yes. Your progress is saved automatically and every title you start appears in Continue Watching on your home screen and profile." },
  { id: "find", question: "How do I find animations?", answer: "Browse by category, search by title or creator, or explore curated collections like Trending Now and Spotlight Artist picks." },
  { id: "upload", question: "How do creators upload content?", answer: "Creators apply through the Creator Program. Once approved, you get access to the Creator Page for uploading, scheduling and managing your animations." },
  { id: "payments", question: "Can I see my payments and donations?", answer: "Absolutely. Your account settings show a complete history of subscriptions, TipJar donations and receipts." },
];

export const howItWorks = [
  { icon: "user" as const, title: "Sign Up & Setup", body: "Create an account using email or social login, verify your email, and set up your profile with a nickname and profile picture." },
  { icon: "play" as const, title: "Discover & Watch", body: "Browse categories or search for animations by title or creator, then stream videos with adjustable quality and rate them with stars." },
  { icon: "gift" as const, title: "Support & Enjoy", body: "Save videos to watch later, track your history, support creators through TipJar donations, and upgrade to Premium for ad-free HD viewing." },
];

export const creatorPerks = [
  { title: "Showcase Your Work", body: "Upload your indie animations and reach a global audience passionate about unique, creative content." },
  { title: "Grow Your Channel", body: "Get discovered by animation enthusiasts and build your fanbase with our creator-friendly platform." },
  { title: "Earn Revenue", body: "Monetize your content through our fair revenue sharing model designed for indie creators." },
  { title: "Creative Freedom", body: "Express your artistic vision without restrictions. We celebrate unique and experimental animation." },
  { title: "Community Support", body: "Connect with fellow animators, collaborate, and get feedback from our vibrant creator community." },
  { title: "Analytics", body: "Track your performance with detailed analytics and insights to grow your audience effectively." },
  { title: "TipJar Donations", body: "Fans can support you directly with one-time tips on every title page — paid out monthly." },
  { title: "Premium Placement", body: "Stand-out projects get featured in Spotlight Artist collections and home-screen banners." },
  { title: "Rights Stay Yours", body: "You keep full ownership of your work. Licensing terms are transparent and flexible." },
  { title: "Festival Ready", body: "Showcase awards and festival selections right on your title page to build credibility." },
  { title: "Global Subtitles", body: "Upload captions in any language and reach viewers across every region we serve." },
  { title: "Creator Payouts", body: "Track tips, revenue share and payouts in one dashboard with exportable statements." },
];

export const plans: Plan[] = [
  { id: "free", tier: "TIER 01", name: "Free channel infinity", price: 0, cta: "Continue with Free", features: [
    { title: "Standard Definition", description: "Watch in crisp 720p resolution." },
    { title: "Ad-Supported", description: "Brief cinematic interruptions between films." },
    { title: "Unlimited Library", description: "Access to our full catalog of animations." },
  ] },
  { id: "premium", tier: "TIER 02", name: "Channel infinity Premium", price: 12.99, cta: "Upgrade Now", features: [
    { title: "Ultra HD & 4K", description: "Experience every detail in stunning 4K HDR." },
    { title: "Ad-Free Immersion", description: "Zero interruptions. Pure artistic experience." },
    { title: "Early Access", description: "Watch new releases 48 hours before everyone else." },
    { title: "Studio Extras", description: "Director commentary and process breakdowns." },
  ] },
];

export const notificationsSeed: NotificationItem[] = [
  { id: "n1", title: "New episode from Rokey Mahmud", body: "Chronicles of the Nebula Void — S3 • E12 is now streaming.", createdAt: "2026-09-28T07:30:00Z", href: "/title/chronicles-of-the-nebula-void" },
  { id: "n2", title: "Spotlight: Canyon Heights", body: "MIRA’s award-winning art film just joined the collection.", createdAt: "2026-09-27T16:00:00Z", href: "/title/canyon-heights" },
  { id: "n3", title: "Your TipJar receipt", body: "Thanks for supporting Stellar Drift with $10.", createdAt: "2026-09-25T11:00:00Z", read: true },
];

export const avatarOptions = [
  { id: "goblin-green", src: img("avatars/goblin-green.webp"), label: "Green goblin" },
  { id: "blossom-pink", src: img("avatars/blossom-pink.webp"), label: "Pink blossom" },
  { id: "popcorn-blue", src: img("avatars/popcorn-blue.webp"), label: "Blue popcorn lover" },
  { id: "devil-red", src: img("avatars/devil-red.webp"), label: "Red devil" },
  { id: "cool-yellow", src: img("avatars/cool-yellow.webp"), label: "Cool yellow" },
  { id: "buns-orange", src: img("avatars/buns-orange.webp"), label: "Orange buns" },
];
