import type { Type } from "./type";

export const en: Type = {
  title: "Caio Frota - Made with love and coffee!",
  description: "A little about me, my work, and how to get in touch.",
  menu: {
    about: "About",
    blog: "Blog",
    resume: "My Resume",
    contact: "Let's Talk",
  },
  hero: {
    brief: "A software engineer passionate about crafting high-quality applications and experiences.",
    subtitle: "I don't just write code, I build with passion, precision and purpose.",
    me: {
      availability: "Available for collab",
    },
    cta: {
      primary: "Check out my work",
      secondary: "Get in touch",
    },
  },
  about: {
    title: "About Me",
    subtitle: "Get to know me better",
    kicker: "Who I Am",
    text: {
      p1: "Hey there! I'm Caio, a fullstack developer and tech enthusiast who loves turning ideas into real projects. I've been in the software world for over 15 years, currently working as a Senior Software Engineer and Tech Lead, but beyond the code, what truly drives me is building solutions that make an impact.",
      p2: "Here you'll find a bit of everything: my resume (of course!), some personal projects that I've brought to life, and a blog where I share thoughts on technology, career, and whatever else I find worth writing about.",
      p3: "But this space isn't just about work. It's also about who I am: curious, creative, always eager to learn something new (and sometimes even invent my own crazy ideas). When I'm not coding, I'm usually experimenting with home automation, sketching, or exploring how tech can make everyday life more fun.",
      p4: "This site is a place for anyone who wants to know me better, whether you're a fellow developer, a potential collaborator, or just someone who loves chatting about tech and creativity.",
      p5: "Welcome aboard!",
    },
  },
  contact: {
    title: "Get in Touch",
    subtitle: 'Partnerships, quick consults, complex integrations, or just a simple "Hi"!',
    kicker: "Let's Chat",
    shortcut: "Also find me on",
    note: "I also help companies with quick architecture & integrations consulting and performance diagnostics.",
    form: {
      name: {
        label: "Your Name",
        placeholder: "How should I call you?",
      },
      email: {
        label: "Email",
        placeholder: "you@email.com",
      },
      message: {
        label: "Message",
        placeholder: "Tell me more about your challenge...",
      },
      send: "Send",
      sending: "Sending...",
      success: "Message sent successfully!",
      error: "An error occurred while sending the message.",
      captchaError: "Please complete the CAPTCHA challenge.",
    },
  },
  footer: {
    madeWith: (year: number) => `© 2008-${year} Caio Frota. Since 2008 building solutions with love and coffee!`,
  },
};
