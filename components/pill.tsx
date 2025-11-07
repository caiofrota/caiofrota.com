"use client";
type Props = {
  children: React.ReactNode;
};

export function Pill({ children }: Props) {
  return <div className={"cf-pill cf-accent"}>{children}</div>;
}
