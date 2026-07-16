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
    role: "Engenheiro de Software Sênior & Tech Lead",
    intro:
      "Há mais de 15 anos construo aplicações web, serviços backend e plataformas cloud, transformando requisitos complexos em software confiável e times mais fortes.",
    availability: "Disponível para oportunidades em engenharia de software e liderança técnica",
    nav: { projects: "Cases", resume: "Currículo", blog: "Conteúdo", contact: "Contato" },
    actions: { work: "Ver cases", resume: "Ver currículo", contact: "Vamos conversar", download: "Baixar PDF" },
    proof: [
      { value: "15+", label: "anos construindo software" },
      { value: "Backend & Cloud", label: "APIs, dados e plataformas" },
      { value: "Tech Lead", label: "arquitetura e mentoria" },
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
        summary: "Implementei testes automatizados e pipelines de entrega para sistemas que exigem segurança e rastreabilidade.",
        impact: "Redução de risco operacional e entregas mais frequentes em ambientes críticos.",
        stack: ["CI/CD", "Testes", "GitHub Actions", "Automação"],
      },
      {
        title: "Interoperabilidade em saúde",
        eyebrow: "Healthtech · liderança técnica",
        summary: "Liderei a evolução de integrações clínicas, conectando sistemas com HL7/FHIR e práticas sustentáveis de engenharia.",
        impact: "Mais previsibilidade, qualidade e velocidade em uma camada de integração essencial.",
        stack: ["TypeScript", "Mirth Connect", "HL7 / FHIR", "APIs"],
      },
    ],
    expertise: [
      { title: "Backend, APIs e integrações", text: "Serviços escaláveis, contratos claros e troca confiável de dados entre sistemas." },
      { title: "Liderança pragmática", text: "Clareza técnica, decisões sustentáveis e mentoria para times entregarem melhor." },
      { title: "Cloud e confiabilidade", text: "CI/CD, automação, observabilidade e operação sustentável em produção." },
    ],
  },
  en: {
    role: "Senior Software Engineer & Tech Lead",
    intro:
      "For more than 15 years, I have built web applications, backend services, and cloud platforms, turning complex requirements into dependable software and stronger teams.",
    availability: "Open to software engineering and technical leadership opportunities",
    nav: { projects: "Cases", resume: "Resume", blog: "Writing", contact: "Contact" },
    actions: { work: "View cases", resume: "View resume", contact: "Let's talk", download: "Download PDF" },
    proof: [
      { value: "15+", label: "years building software" },
      { value: "Backend & Cloud", label: "APIs, data, and platforms" },
      { value: "Tech Lead", label: "architecture and mentoring" },
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
        summary: "Implemented automated testing and delivery pipelines for systems that demand safety and traceability.",
        impact: "Lower operational risk and more frequent delivery in critical environments.",
        stack: ["CI/CD", "Testing", "GitHub Actions", "Automation"],
      },
      {
        title: "Healthcare interoperability",
        eyebrow: "Healthtech · technical leadership",
        summary: "Led the evolution of clinical integrations, connecting systems with HL7/FHIR and sustainable engineering practices.",
        impact: "More predictable, higher-quality delivery in an essential integration layer.",
        stack: ["TypeScript", "Mirth Connect", "HL7 / FHIR", "APIs"],
      },
    ],
    expertise: [
      {
        title: "Backend, APIs, and integrations",
        text: "Scalable services, clear contracts, and dependable data exchange across systems.",
      },
      { title: "Pragmatic leadership", text: "Technical clarity, sustainable decisions, and mentoring that help teams deliver better." },
      { title: "Cloud and reliability", text: "CI/CD, automation, observability, and sustainable production operations." },
    ],
  },
};
