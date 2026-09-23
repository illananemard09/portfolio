import type { Metadata } from "next";
import { FinalContact } from "@/components/FinalContact";
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
import { portfolioNav } from "@/content/site";

export const metadata: Metadata = {
  title: "Portfolio",
  alternates: { canonical: "/portfolio/" },
};

// The detailed editorial portfolio: work, events, marketing, experience, toolkit.
export default function Portfolio() {
  return (
    <SmoothScroll>
      <Loader />
      <Nav items={portfolioNav} />
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
        <FinalContact link={{ href: "/#cafe", label: "Pull up a chair at the café table →" }} />
      </main>
      <Cursor />
    </SmoothScroll>
  );
}
