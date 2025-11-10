import type { Type } from "./type";

export const en: Type = {
  title: "Caio Frota - Software Engineer - Made with love and coffee!",
  description:
    "My name is Caio Frota. I'm a specialized software engineer. Here you can find a bit about me, my work, and how to get in touch.",
  menu: {
    home: "Home",
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
  blog: {
    title: "Blog",
    subtitle: "Reflections, tutorials, and stories from my daily life.",
    article: {
      backToBlog: "Back to Blog",
      readMore: "Read more",
      loading: {
        title: "Loading...",
        message: "Please wait while we fetch the article for you.",
      },
      notFound: {
        title: "Post not found",
        message: "Sorry, we couldn't find the post you're looking for.",
      },
    },
    categories: {
      title: "Categories",
      subtitle: "Explore articles by category.",
      notFound: {
        title: "Category not found",
        message: "Sorry, we couldn't find the category you're looking for.",
      },
    },
  },
  resume: {
    title: "Resume",
    subtitle: "Jose Caio Frota",
    kicker: "My Resume",
    sections: {
      header: {
        descriptions: [
          "Software Engineer with over 15 years of experience building scalable web applications and integration platforms. Specialized in TypeScript (JS, React), with solid expertise in APIs, integrations, and healthcare standards (HL7). Proven ability to lead teams and mentor engineers, turning complex requirements into simple and secure solutions.",
          "Successfully implemented unit testing and CI/CD pipelines for Mirth Connect, increasing reliability and delivery speed in a mission-critical healthcare integration layer.",
        ],
        languages: {
          title: "Languages",
          list: ["Portuguese (native)", "English (fluent, professional working proficiency)", "Spanish (limited working proficiency)"],
        },
      },
      skills: {
        title: "Skills",
        languages: {
          title: "Languages",
          list: [
            "TypeScript / JavaScript (10+ years) - Node.js, React, Angular",
            "Java (10+ years)",
            "SQL (10+ years)",
            "HL7 (4 years)",
            "Python (5 years)",
            "Tailwind CSS (5 years)",
            "HTML5 (10+ years)",
            "CSS (10+ years)",
          ],
        },
        technologiesAndPlatforms: {
          title: "Technologies & Platforms",
          list: [
            "Cloud Platforms: AWS, Google Cloud (GCP)",
            "Containerization & Orchestration: Docker, Kubernetes",
            "CI/CD: GitHub Actions, Jenkins, GitLab CI",
            "Version Control: Git, GitHub, GitLab, Bitbucket",
            "Databases: MySQL, Postgres, Oracle",
            "Integration Engine: cURL, Postman, Insomnia, Mirth Connect",
            "NoSQL: MongoDB, Firebase",
            "Frameworks: Spring Boot, Hibernate, Angular, React",
            "ETL & Analytics tooling",
          ],
        },
      },
      experience: {
        title: "Professional Experience",
        jobs: [
          {
            company: "SOAP Health",
            location: "Remote - Full-time (Florida, USA)",
            period: "Since Aug 2021 - Present",
            description:
              "A healthtech company leveraging AI and advanced clinical data to improve patient outcomes, helping providers deliver more accurate, efficient, and personalized care.",
            overview: "Healthtech leveraging AI & clinical data",
            skills: [
              "Leadership",
              "TypeScript",
              "Node.js",
              "API Development",
              "React.js",
              "SQL",
              "Mirth Connect",
              "HL7 FHIR (Healthcare Standards)",
            ],
            positions: [
              {
                title: "Integration Tech Lead",
                period: "Since Aug 2023 - Present",
                responsibilities: [
                  "Lead the integration team, designing and delivering scalable solutions that connect healthcare systems and enterprise platforms.",
                  "Drive development best practices with a focus on APIs, interoperability, and data exchange across complex environments.",
                  "Mentor and guide engineers, fostering clarity, pragmatism, and measurable outcomes.",
                  "Successfully implemented unit testing and CI/CD pipelines for Mirth Connect, improving reliability, quality, and delivery speed in a mission-critical integration layer.",
                ],
              },
              {
                title: "Senior Software Engineer",
                period: "Aug 2021 - Aug 2023 (2 yrs)",
                responsibilities: [
                  "Developed and maintained enterprise-grade applications with a strong focus on backend services and system integrations.",
                  "Collaborated closely with cross-functional teams to ensure scalable, secure, and business-driven solutions.",
                  "Quickly adapted to HL7 and Mirth Connect, establishing integration patterns and best development practices to ensure quality and consistency.",
                ],
              },
            ],
          },
          {
            company: "CF Inova Tech",
            location: "Remote - Full-time (CE, Brazil)",
            period: "Oct 2018 - Aug 2021 (2 yrs and 10 mos)",
            description: "A software company focused on web, mobile, and business solutions, delivering innovation through technology.",
            overview: "Software company focused on web, mobile & business solutions",
            skills: [
              "TypeScript",
              "API Development",
              "Java",
              "Spring boot",
              "Hibernate",
              "ETL",
              "Angular",
              "React.js",
              "SQL (PL/SQL, Oracle, MySQL, Postgres)",
              "NoSQL (MongoDB, Firebase)",
            ],
            positions: [
              {
                title: "Senior Software Engineer",
                period: "Oct 2018 - Aug 2021 (2 yrs and 10 mos)",
                responsibilities: [
                  "Designed and developed fullstack applications and APIs, ensuring performance, reliability, and maintainability.",
                  "Collaborated with cross-functional teams to align technical solutions with business requirements.",
                  "Contributed to code quality improvements by promoting standards, peer reviews, and maintainable development practices.",
                ],
              },
            ],
          },
          {
            company: "M. Dias Branco",
            location: "Full-time (CE, Brazil)",
            period: "Apr 2008 - Oct 2018 (10 yrs and 5 mos)",
            description:
              "The largest food company in Brazil and a leading producer of pasta, cookies, crackers, and flour in Latin America, with over 20,000 employees and presence in more than 40 countries.",
            overview: "Largest food company in Brazil, strong presence in LATAM",
            skills: ["TypeScript", "API Development", "Java", "Spring Boot", "Hibernate", "ETL", "Oracle", "Angular", "React.js", "SQL"],
            positions: [
              {
                title: "Senior Software Engineer",
                period: "Jun 2012 - Oct 2018 (6 yrs and 5 mos)",
                responsibilities: [
                  "Developed and maintained fullstack enterprise applications, combining Oracle (PL/SQL) backend with modern frontend solutions.",
                  "Delivered business-critical features with high reliability, ensuring compliance and scalability in complex environments.",
                  "Key contributor to the Profit-Sharing (PL) payment project, handling intricate business rules in a payroll system serving over 20,000 employees.",
                ],
              },
              {
                title: "Mid-level Software Developer",
                period: "Oct 2010 - Jun 2012 (1 yr and 8 mos)",
                responsibilities: [
                  "Contributed to the development and maintenance of enterprise applications, supporting both backend and frontend demands.",
                  "Actively participated in key company projects, delivering features that directly supported business growth and operations.",
                ],
              },
              {
                title: "Junior Software Developer",
                period: "Apr 2009 - Oct 2010 (1 yr and 6 mos)",
                responsibilities: [
                  "Supported the development and maintenance of internal systems while learning best practices in software engineering.",
                  "Contributed to core company projects, gaining early experience in delivering real business value through technology.",
                ],
              },
              {
                title: "Software Developer Intern",
                period: "Apr 2008 - Apr 2009 (1 yr)",
                responsibilities: [
                  "Assisted in the development and maintenance of applications, gaining hands-on experience with real-world projects.",
                  "Earned an early promotion to a full-time developer role, recognized for strong performance and contribution to the team.",
                ],
              },
            ],
          },
        ],
      },
      education: {
        title: "Education",
        institutions: [
          {
            name: "Estácio University",
            qualifications: [
              "MBA in Artificial Intelligence - 2025 - In progress",
              "BSc in Computer Science - 2020 - 2024",
              "PGDip, Big Data, Business Intelligence and Analytics Applied to Business - 2021 - 2024",
              "AS, Systems Analysis and Development - 2015 - 2017",
            ],
          },
        ],
      },
      certifications: {
        title: "Licenses & Certifications",
        qualifications: [
          "Oracle Certified Professional, Java SE 6 Programmer - 2011 (Oracle)",
          "DevOps Essentials - 2020 (4linux)",
          "Android Oreo and Nougat App Masterclass - 2017 (Udemy)",
          "Spring Framework Masterclass - Beginner to Expert - 2017 (Udemy)",
          "Oracle SOA Suite 11g: Essential Concepts Ed 2 PRV - 2014 (Oracle)",
          "Oracle WebLogic Server 11g: Monitor and Tune Performance Ed 2 - 2014 (Oracle)",
          "Oracle WebLogic Server 11g: Administration Essentials Ed 2 PRV - 2014 (Oracle)",
          "Oracle Fusion Middleware 11g: Build Applications with ADF Accelerated Ed 2 PRV - 2014 (Oracle)",
          "Oracle Forms & Reports 6i - 2009 (SensusX ERP)",
        ],
      },
    },
  },
  footer: {
    madeWith: "© 2008-{{year}} Caio Frota. Since 2008 building solutions with love and coffee!",
  },
};
