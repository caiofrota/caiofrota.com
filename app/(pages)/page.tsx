"use client";
import { About } from "./about";
import { Hero } from "./hero";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <About />
    </div>
  );
}
