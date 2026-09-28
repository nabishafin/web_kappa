export type GenreSlug =
  | "action"
  | "adventure"
  | "comedy"
  | "drama"
  | "fantasy"
  | "sci-fi"
  | "horror"
  | "thriller"
  | "romance"
  | "musical"
  | "educational"
  | "documentary"
  | "experimental";

export interface Genre {
  slug: GenreSlug;
  name: string;
  description: string;
  /** Pre-composited 2×2 collage from the design (optional) */
  cover?: string;
  /** Fallback collage images (4) when no cover is supplied */
  collage: [string, string, string, string];
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  headline?: string;
  verified?: boolean;
  animations: number;
  followers: number;
}

export type Maturity = "TV-Y" | "TV-Y7" | "TV-G" | "TV-PG" | "PG-13" | "TV-14" | "R" | "TV-MA";

export type TitleIcon = "sparkles" | "badge" | "zap" | "clapper" | "video" | "palette";

export interface Episode {
  id: string;
  season: number;
  number: number;
  title: string;
  duration: string;
  synopsis: string;
  thumbnail: string;
}

export interface Title {
  slug: string;
  title: string;
  kind: "series" | "film";
  synopsis: string;
  tagline?: string;
  genres: GenreSlug[];
  /** Short uppercase label shown on cards, e.g. “SCI-FI”, “2D EXPERIMENTAL” */
  label: string;
  creatorId: string;
  thumbnail: string;
  backdrop?: string;
  /** Runtime as shown on cards — mm:ss for shorts */
  duration: string;
  rating: number;
  views: number;
  year: number;
  maturity: Maturity;
  badges: ("HD" | "4K" | "CC")[];
  seasons?: number;
  episodes?: Episode[];
  icon: TitleIcon;
  /** ISO date the title was published */
  publishedAt: string;
  featured?: { eyebrow: string; meta: string };
  awards?: string;
}

export interface ContinueWatchingItem {
  slug: string;
  subtitle: string;
  progress: number; // 0..1
  watchedAt: string; // ISO
  remaining: string;
  thumbnail?: string;
  heading?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Plan {
  id: "free" | "premium";
  tier: string;
  name: string;
  price: number;
  features: { title: string; description: string }[];
  cta: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read?: boolean;
  href?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatar: string;
  plan: "free" | "premium";
  emailVerified: boolean;
}
