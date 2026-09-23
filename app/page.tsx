import { CafeFinale } from "@/components/cafe/CafeFinale";
import { FinalContact } from "@/components/FinalContact";
import { Nav } from "@/components/Nav";
import { Cursor } from "@/components/ui/Cursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Intro } from "@/components/world/Intro";
import { Phrase } from "@/components/world/Phrase";
import { WorldHero } from "@/components/world/WorldHero";
import { homeNav } from "@/content/site";

// Illana's world: sticker collage → who I am → a pause → down to the café table → the laptop.
export default function Home() {
  return (
    <SmoothScroll>
      <Nav items={homeNav} />
      <main id="main">
        <WorldHero />
        <Intro />
        <Phrase />
        <CafeFinale />
        <FinalContact link={{ href: "/portfolio/", label: "Prefer the full portfolio? Read it here →" }} />
      </main>
      <Cursor />
    </SmoothScroll>
  );
}
