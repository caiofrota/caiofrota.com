type Props = {
  children: React.ReactNode;
};

export function Pill({ children }: { children: React.ReactNode }) {
  return <div className={"cf-pill cf-accent"}>{children}</div>;
}
