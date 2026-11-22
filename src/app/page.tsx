import { Hero } from "@/components/home/Hero";
import { AboutJourney } from "@/components/home/AboutJourney";
import { Identity } from "@/components/home/Identity";
import { Projects } from "@/components/home/Projects";
import { Teardowns } from "@/components/home/Teardowns";
import { Analytics } from "@/components/home/Analytics";
import { Experience } from "@/components/home/Experience";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutJourney />
      <Identity />
      <Experience />
      <Projects />
      <Teardowns />
      <Analytics />
      <Contact />
    </>
  );
}
