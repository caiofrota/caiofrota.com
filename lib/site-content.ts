import type { RouteLocale } from "./locale";

type Case = { title: string; eyebrow: string; summary: string; impact: string; stack: string[] };

export const siteContent: Record<
  RouteLocale,
  {
    role: string;
    intro: string;
    availability: string;
    nav: { projects: string; resume: string; blog: string; contact: string };
    actions: { work: string; resume: string; contact: string; download: string };
    proof: Array<{ value: string; label: string }>;
    sections: {
      projects: string;
      projectsLead: string;
      expertise: string;
      expertiseLead: string;
      latest: string;
      contact: string;
      contactLead: string;
    };
    cases: Case[];
    expertise: Array<{ title: string; text: string }>;
  }
> = {
  br: {
    role: "Engenheiro de Software Sênior",
    intro: "Há mais de 15 anos projeto, desenvolvo e mantenho serviços backend, aplicações web full-stack, APIs e integrações de sistemas.",
    availability: "Disponível para oportunidades em engenharia de software",
    nav: { projects: "Cases", resume: "Currículo", blog: "Conteúdo", contact: "Contato" },
    actions: { work: "Ver cases", resume: "Ver currículo", contact: "Vamos conversar", download: "Baixar PDF" },
    proof: [
      { value: "15+", label: "anos construindo software" },
      { value: "Backend & APIs", label: "serviços e integrações" },
      { value: "Full stack", label: "aplicações web e dados" },
    ],
    sections: {
      projects: "Impacto que dá para explicar",
      projectsLead: "Três recortes do tipo de problema que eu gosto de resolver.",
      expertise: "Onde gero mais valor",
      expertiseLead: "Do desenho da solução à operação confiável.",
      latest: "Conteúdo técnico",
      contact: "Vamos resolver algo relevante?",
      contactLead: "Para uma parceria, oportunidade ou conversa sobre engenharia de software, estou por aqui.",
    },
    cases: [
      {
        title: "Sistemas empresariais de grande escala",
        eyebrow: "Full-stack · backend e regras de negócio",
        summary: "Desenvolvi APIs e aplicações para processos empresariais com regras complexas e alto impacto operacional.",
        impact: "Soluções sustentáveis para operações que atendem milhares de pessoas.",
        stack: ["Java", "Spring", "Oracle", "React"],
      },
      {
        title: "Entrega contínua em sistemas críticos",
        eyebrow: "CI/CD · qualidade e confiabilidade",
        summary: "Implementei testes automatizados e pipelines de CI/CD para o Mirth Connect em uma camada crítica de integração.",
        impact: "Qualidade de código, confiabilidade e repetibilidade incorporadas ao processo de entrega.",
        stack: ["CI/CD", "Testes automatizados", "Mirth Connect", "Automação"],
      },
      {
        title: "APIs e interoperabilidade",
        eyebrow: "Integrações · dados clínicos",
        summary: "Projetei e evoluí integrações entre sistemas de saúde e plataformas empresariais com HL7, FHIR e Mirth Connect.",
        impact: "Experiência prática em troca de dados, padrões de integração e desenvolvimento de APIs.",
        stack: ["TypeScript", "Mirth Connect", "HL7 / FHIR", "APIs"],
      },
    ],
    expertise: [
      { title: "Backend, APIs e integrações", text: "Serviços escaláveis, contratos claros e troca confiável de dados entre sistemas." },
      {
        title: "Full-stack e sistemas empresariais",
        text: "Backend, interfaces web, acesso a dados e regras de negócio em aplicações de longa duração.",
      },
      {
        title: "Qualidade e entrega",
        text: "Testes automatizados, revisão de código, CI/CD e práticas voltadas à manutenção do software.",
      },
    ],
  },
  en: {
    role: "Senior Software Engineer",
    intro:
      "For more than 15 years, I have designed, built, and maintained backend services, full-stack web applications, APIs, and system integrations.",
    availability: "Open to software engineering opportunities",
    nav: { projects: "Cases", resume: "Resume", blog: "Writing", contact: "Contact" },
    actions: { work: "View cases", resume: "View resume", contact: "Let's talk", download: "Download PDF" },
    proof: [
      { value: "15+", label: "years building software" },
      { value: "Backend & APIs", label: "services and integrations" },
      { value: "Full stack", label: "web applications and data" },
    ],
    sections: {
      projects: "Impact you can explain",
      projectsLead: "Three examples of the kind of problem I enjoy solving.",
      expertise: "Where I create the most value",
      expertiseLead: "From solution design to dependable operation.",
      latest: "Technical writing",
      contact: "Want to solve something meaningful?",
      contactLead: "For a partnership, opportunity, or software engineering conversation, I am here.",
    },
    cases: [
      {
        title: "Enterprise systems at scale",
        eyebrow: "Full-stack · backend and business rules",
        summary: "Built APIs and applications for enterprise processes with complex rules and high operational impact.",
        impact: "Sustainable solutions for operations serving thousands of people.",
        stack: ["Java", "Spring", "Oracle", "React"],
      },
      {
        title: "Continuous delivery for critical systems",
        eyebrow: "CI/CD · quality and reliability",
        summary: "Implemented automated tests and CI/CD pipelines for Mirth Connect in a critical integration layer.",
        impact: "Code quality, reliability, and repeatability built into the delivery process.",
        stack: ["CI/CD", "Automated testing", "Mirth Connect", "Automation"],
      },
      {
        title: "APIs and interoperability",
        eyebrow: "Integrations · clinical data",
        summary: "Designed and evolved integrations between healthcare systems and enterprise platforms with HL7, FHIR, and Mirth Connect.",
        impact: "Hands-on experience with data exchange, integration standards, and API development.",
        stack: ["TypeScript", "Mirth Connect", "HL7 / FHIR", "APIs"],
      },
    ],
    expertise: [
      {
        title: "Backend, APIs, and integrations",
        text: "Scalable services, clear contracts, and dependable data exchange across systems.",
      },
      {
        title: "Full-stack and enterprise systems",
        text: "Backend services, web interfaces, data access, and business rules in long-lived applications.",
      },
      { title: "Quality and delivery", text: "Automated testing, code review, CI/CD, and practices that keep software maintainable." },
    ],
  },
};
