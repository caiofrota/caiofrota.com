import { Expertise } from "./_sections/expertise";
import { Contact } from "./_sections/contact";
import { HomeHero } from "./_sections/home-hero";
import { Portfolio } from "./_sections/portfolio";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="flex w-full flex-col">
      <HomeHero locale={locale} />
      <Portfolio locale={locale} />
      <Expertise locale={locale} />
      <Contact />
    </div>
  );
}
