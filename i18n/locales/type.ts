export type Type = {
  title: string;
  description: string;
  menu: {
    home: string;
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
  contact: {
    title: string;
    subtitle: string;
    kicker: string;
    shortcut: string;
    note: string;
    form: {
      name: {
        label: string;
        placeholder: string;
      };
      email: {
        label: string;
        placeholder: string;
      };
      message: {
        label: string;
        placeholder: string;
      };
      send: string;
      sending: string;
      success: string;
      error: string;
      captchaError: string;
    };
  };
  blog: {
    title: string;
    subtitle: string;
    article: {
      backToBlog: string;
      readMore: string;
      loading: {
        title: string;
        message: string;
      };
      notFound: {
        title: string;
        message: string;
      };
    };
    categories: {
      title: string;
      subtitle: string;
      notFound: {
        title: string;
        message: string;
      };
    };
  };
  resume: {
    title: string;
    subtitle: string;
    kicker: string;
    sections: {
      header: {
        descriptions: string[];
        languages: {
          title: string;
          list: string[];
        };
      };
      skills: {
        title: string;
        languages: {
          title: string;
          list: string[];
        };
        technologiesAndPlatforms: {
          title: string;
          list: string[];
        };
      };
      experience: {
        title: string;
        jobs: Array<{
          company: string;
          location: string;
          period: string;
          overview: string;
          description: string;
          skills: string[];
          positions: Array<{
            title: string;
            period: string;
            responsibilities: string[];
          }>;
        }>;
      };
      education: {
        title: string;
        institutions: Array<{
          name: string;
          qualifications: string[];
        }>;
      };
      certifications: {
        title: string;
        qualifications: string[];
      };
    };
  };
  footer: {
    madeWith: (year: number) => string;
  };
};
