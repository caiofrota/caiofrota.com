"use client";
import { About } from "./about";
import { Contact } from "./contact";
import { Hero } from "./hero";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <About />
      <Contact />
    </div>
  );
}
