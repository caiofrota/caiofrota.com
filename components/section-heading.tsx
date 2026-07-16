"use client";
import { Pill } from "./pill";

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ kicker, title, subtitle }: Props) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
      {kicker ? <Pill>{kicker}</Pill> : null}
      <h2 className="mt-4 text-3xl font-black tracking-[-.04em] text-site-heading md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-7 text-site-foreground md:text-lg">{subtitle}</p> : null}
    </div>
  );
}
