"use client";
import { Pill } from "./pill";

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ kicker, title, subtitle }: Props) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {kicker ? <Pill>{kicker}</Pill> : null}
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base text-neutral-800 dark:text-neutral-300/90 md:text-lg">{subtitle}</p> : null}
    </div>
  );
}
