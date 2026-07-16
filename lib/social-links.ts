export const SOCIAL_LINKS = [
  {
    type: "github",
    label: "GitHub",
    url: "https://github.com/caiofrota",
  },
  {
    type: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/jcaiofrota/",
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/caiofrota/",
  },
] as const;

export type SocialLink = (typeof SOCIAL_LINKS)[number];
export type SocialType = SocialLink["type"];
