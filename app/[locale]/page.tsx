import { About } from "./_sections/about";
import { Contact } from "./_sections/contact";
import { Hero } from "./_sections/hero";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <About />
      <Contact />
    </div>
  );
}
