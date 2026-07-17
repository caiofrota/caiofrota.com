import type { SocialLink, SocialType } from "lib/social-links";
import { Github, Instagram, Linkedin, type LucideIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  socials: readonly SocialLink[];
  showLabels?: boolean;
};
export function SocialBar({ socials, showLabels = false }: Props) {
  return (
    <div className="flex items-center gap-4">
      {socials.map(({ type, label, url }) => {
        const Icon = ICONS[type];
        return (
          <Link
            key={type}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-md text-sm transition-[color,transform] duration-200 hover:-translate-y-0.5 hover:text-site-accent motion-reduce:transform-none cf-ring"
            aria-label={label}
            title={label}
          >
            <Icon
              aria-hidden="true"
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 motion-reduce:transform-none motion-reduce:transition-none"
            />
            {showLabels && label}
          </Link>
        );
      })}
    </div>
  );
}

const ICONS: Record<SocialType, LucideIcon> = {
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
};
