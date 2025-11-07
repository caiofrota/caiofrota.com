export type Type = {
  title: string;
  description: string;
  menu: {
    about: string;
    blog: string;
    resume: string;
    contact: string;
  };
  hero: {
    brief: string;
    subtitle: string;
    me: {
      availability: string;
    };
    cta: {
      primary: string;
      secondary: string;
    };
  };
  about: {
    title: string;
    subtitle: string;
    kicker: string;
    text: {
      p1: string;
      p2: string;
      p3: string;
      p4: string;
      p5: string;
    };
  };
};
