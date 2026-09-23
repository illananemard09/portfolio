import Link from "next/link";
import { person } from "@/content/site";
import { MagneticButton } from "./ui/Magnetic";
import { FadeIn } from "./ui/Reveal";

export function FinalContact({ link }: { link?: { href: string; label: string } }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="wrap relative bg-[#f3eee6] pb-10 pt-24 text-ink">
      <FadeIn>
        <p className="eyebrow text-ink/50">Final call</p>
        <h2 id="contact-title" className="mt-6 font-display text-[clamp(48px,10vw,180px)] font-light uppercase leading-[0.85] tracking-[-0.06em]">
          Have an idea?
          <br />
          <em className="normal-case text-accent">Let&apos;s make it happen.</em>
        </h2>
      </FadeIn>
      <div className="mt-12 flex flex-wrap gap-3">
        <MagneticButton href={`mailto:${person.email}`} variant="accent" tone="light" cursor="Write">
          {person.email}
        </MagneticButton>
        <MagneticButton href={person.linkedin} variant="ghost" tone="light">
          LinkedIn ↗
        </MagneticButton>
      </div>
      {link && (
        <Link href={link.href} className="mt-10 inline-block font-hand text-[24px] text-ink/70 underline decoration-accent underline-offset-4 hover:text-ink">
          {link.label}
        </Link>
      )}
      <footer className="mt-24 flex flex-wrap items-end justify-between gap-6 border-t border-ink/15 pt-6 text-[12px] text-ink/50">
        <p suppressHydrationWarning>© {new Date().getFullYear()} {person.name} · {person.location}</p>
        <p className="font-hand text-[20px] text-ink/70">Strategic mind. Creative execution. Memorable experiences.</p>
        <a href="#home" className="uppercase tracking-[0.18em] hover:text-ink">Back to top ↑</a>
      </footer>
    </section>
  );
}
