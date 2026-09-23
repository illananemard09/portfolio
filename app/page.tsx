import { Finale } from "@/components/cafe/Finale";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { About } from "@/components/sections/About";
import { BehindScenes } from "@/components/sections/BehindScenes";
import { Beyond } from "@/components/sections/Beyond";
import { Events } from "@/components/sections/Events";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Marketing } from "@/components/sections/Marketing";
import { Process } from "@/components/sections/Process";
import { Toolkit } from "@/components/sections/Toolkit";
import { Work } from "@/components/sections/Work";
import { Cursor } from "@/components/ui/Cursor";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

// Story arc: discover → explore → understand → interact → remember → connect.
export default function Home() {
  return (
    <SmoothScroll>
      <Loader />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Work />
        <Events />
        <Marketing />
        <Experience />
        <Toolkit />
        <Process />
        <BehindScenes />
        <Beyond />
        <Finale />
      </main>
      <Cursor />
    </SmoothScroll>
  );
}
