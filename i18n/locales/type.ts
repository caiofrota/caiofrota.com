type ResumeJob = {
  company: string;
  location: string;
  period: string;
  skills: string[];
  positions: Array<{
    title: string;
    period: string;
    responsibilities: string[];
  }>;
};

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
      errors: {
        invalidFields: string;
        rateLimited: string;
        configuration: string;
        generic: string;
      };
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
    role: string;
    contactLine: string;
    metadataDescription: string;
    downloadLabel: string;
    profileLabel: string;
    highlights: Array<{
      value: string;
      label: string;
    }>;
    sections: {
      header: {
        descriptions: string[];
      };
      skills: {
        title: string;
        groups: Array<{
          title: string;
          list: string[];
        }>;
      };
      experience: {
        title: string;
        skillsLabel: string;
        jobs: ResumeJob[];
        additionalTitle: string;
        additionalJobs: ResumeJob[];
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
      languages: {
        title: string;
        list: string[];
      };
    };
  };
  footer: {
    madeWith: string;
  };
};
