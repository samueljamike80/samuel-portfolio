import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { About } from "@/components/about";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <About />
    </>
  );
}
