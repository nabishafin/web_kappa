import Link from "next/link";
import { Compass, LayoutGrid, Rocket, Smile, Sparkles, Swords } from "lucide-react";

const chips = [
  { label: "Adventure", href: "/categories/adventure", Icon: Compass },
  { label: "Action", href: "/categories/action", Icon: Swords },
  { label: "Fantasy", href: "/categories/fantasy", Icon: Sparkles },
  { label: "Comedy", href: "/categories/comedy", Icon: Smile },
  { label: "Sci-Fi", href: "/categories/sci-fi", Icon: Rocket },
  { label: "Others", href: "/categories", Icon: LayoutGrid },
];

export function GenreChips() {
  return (
    <nav aria-label="Browse by genre" className="container-ci">
      <ul data-reveal-group className="scrollbar-none -mx-5 flex gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-6 md:gap-[16.6px] md:overflow-visible md:px-0">
        {chips.map(({ label, href, Icon }) => (
          <li key={label} data-reveal className="shrink-0">
            <Link
              data-spotlight
              href={href}
              className="border-glow flex h-[107px] w-[150px] flex-col items-center justify-center gap-[9px] rounded-[16px] bg-[#0b0a12] text-sm tracking-[0.02em] text-white transition duration-300 [--glow:linear-gradient(180deg,#7f4dc0,#5a2f94_50%,#8a55d0)] hover:-translate-y-0.5 hover:bg-[#15121f] md:w-auto"
            >
              <Icon aria-hidden className="size-[30px] text-lilac" strokeWidth={1.7} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
