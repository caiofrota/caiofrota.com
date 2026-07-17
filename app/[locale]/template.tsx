import { Reveal } from "components/reveal";
import type { ReactNode } from "react";

export default function LocaleTemplate({ children }: { children: ReactNode }) {
  return (
    <Reveal variant="fade" distance={0} duration={280} rootMargin="0px" threshold={0}>
      {children}
    </Reveal>
  );
}
