import { Type } from "./type";

export const pt_BR: Type = {
  title: "Caio Frota - Engenheiro de Software - Feito com amor e café!",
  description:
    "Me chamo Caio Frota. Sou engenheiro de software especializado. Aqui você encontra um pouco sobre mim, meu trabalho e como entrar em contato.",
  menu: {
    home: "Início",
    about: "Sobre",
    blog: "Blog",
    resume: "Currículo",
    contact: "Contato",
  },
  hero: {
    brief: "Um engenheiro de software apaixonado por criar aplicações e experiências de alta qualidade.",
    subtitle: "Eu não apenas escrevo código, eu construo com paixão, precisão e propósito.",
    me: {
      availability: "Disponível para colaboração",
    },
    cta: {
      primary: "Confira meu trabalho",
      secondary: "Entre em contato",
    },
  },
  about: {
    title: "Sobre Mim",
    subtitle: "Conheça um pouco mais sobre mim",
    kicker: "Quem Sou Eu",
    text: {
      p1: "Olá! Eu sou Caio, um desenvolvedor fullstack e entusiasta de tecnologia que adora transformar ideias em projetos reais. Estou no mundo do software há mais de 15 anos, atualmente trabalhando como Engenheiro de Software Sênior e Tech Lead, mas além do código, o que realmente me motiva é construir soluções que façam a diferença.",
      p2: "Aqui você encontrará um pouco de tudo: meu currículo (claro!), alguns projetos pessoais que eu trouxe à vida, e um blog onde compartilho pensamentos sobre tecnologia, carreira e qualquer outra coisa que eu ache interessante escrever.",
      p3: "Mas este espaço não é apenas sobre trabalho. Também é sobre quem eu sou: curioso, criativo, sempre ansioso para aprender algo novo (e às vezes até inventar minhas próprias ideias malucas). Quando não estou codificando, geralmente estou experimentando automação residencial, esboçando ou explorando como a tecnologia pode tornar a vida cotidiana mais divertida.",
      p4: "Este site é um lugar para qualquer pessoa que queira me conhecer melhor, seja você um colega desenvolvedor, um potencial colaborador, ou apenas alguém que adora conversar sobre tecnologia e criatividade.",
      p5: "Seja bem-vindo!",
    },
  },
  contact: {
    title: "Contato",
    subtitle: 'Parcerias, consultorias rápidas, integrações complexas ou apenas um "Oi"!',
    kicker: "Vamos Conversar",
    shortcut: "Também me siga em",
    note: "Eu também ajudo empresas com consultorias rápidas de arquitetura & integrações e diagnósticos de performance.",
    form: {
      name: {
        label: "Nome",
        placeholder: "Como devo chamá-lo?",
      },
      email: {
        label: "E-mail",
        placeholder: "voce@email.com",
      },
      message: {
        label: "Mensagem",
        placeholder: "Conte-me mais sobre seu desafio...",
      },
      send: "Enviar",
      sending: "Enviando...",
      success: "Mensagem enviada com sucesso!",
      error: "Ocorreu um erro ao enviar a mensagem.",
      captchaError: "Por favor, complete o CAPTCHA.",
    },
  },
  blog: {
    title: "Blog",
    subtitle: "Reflexões, tutoriais e histórias do meu dia a dia.",
    article: {
      backToBlog: "Voltar ao Blog",
      readMore: "Ler mais",
      loading: {
        title: "Carregando...",
        message: "Por favor, aguarde enquanto carregamos o post.",
      },
      notFound: {
        title: "Post não encontrado",
        message: "Desculpe, não conseguimos encontrar o post que você está procurando.",
      },
    },
    categories: {
      title: "Categorias",
      subtitle: "Explore os artigos por categoria.",
      notFound: {
        title: "Categoria não encontrada",
        message: "Desculpe, não conseguimos encontrar a categoria que você está procurando.",
      },
    },
  },
  resume: {
    title: "Currículo",
    subtitle: "Jose Caio Frota",
    kicker: "Meu Currículo",
    sections: {
      header: {
        descriptions: [
          "Engenheiro de Software com mais de 15 anos de experiência na construção de aplicações web escaláveis e plataformas de integração. Especializado em TypeScript (JS, React), com sólida expertise em APIs, integrações e padrões de saúde (HL7). Demonstrada capacidade de liderar equipes e orientar engenheiros, transformando requisitos complexos em soluções simples e seguras.",
          "Implementei com sucesso testes automatizados e pipelines de CI/CD para o Mirth Connect, aumentando a confiabilidade e a velocidade de entrega em uma camada de integração de saúde crítica.",
        ],
        languages: {
          title: "Idiomas",
          list: ["Português (Nativo)", "Inglês (Fluente)", "Espanhol (Limitado)"],
        },
      },
      skills: {
        title: "Habilidades Técnicas",
        languages: {
          title: "Linguagens",
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
          title: "Tecnologias & Plataformas",
          list: [
            "Nuvem: AWS, Google Cloud (GCP)",
            "Conteinerização & Orquestração: Docker, Kubernetes",
            "CI/CD: GitHub Actions, Jenkins, GitLab CI",
            "Controle de Versão: Git, GitHub, GitLab, Bitbucket",
            "Banco de Dados: MySQL, Postgres, Oracle",
            "Ferramentas de Integração: cURL, Postman, Insomnia, Mirth Connect",
            "NoSQL: MongoDB, Firebase",
            "Frameworks: Spring Boot, Hibernate, Angular, React",
            "ETL & Ferramentas de Análise",
          ],
        },
      },
      experience: {
        title: "Experiência Profissional",
        jobs: [
          {
            company: "SOAP Health",
            location: "Remoto - Tempo integral (Flórida, EUA) - Desde Ago 2021",
            period: "Desde Ago 2021 - Presente",
            description:
              "Uma empresa de saúde que utiliza IA e dados clínicos avançados para melhorar os resultados dos pacientes, ajudando os provedores a oferecer cuidados mais precisos, eficientes e personalizados.",
            overview: "Healthtech utilizando IA e dados clínicos",
            skills: [
              "Liderança Técnica",
              "TypeScript",
              "Node.js",
              "Desenvolvimento de APIs",
              "React.js",
              "SQL",
              "Mirth Connect",
              "HL7 FHIR (Padrões de Saúde)",
            ],
            positions: [
              {
                title: "Líder Técnico de Integração",
                period: "Desde Jan 2023 - Presente",
                responsibilities: [
                  "Liderar a equipe de integração, projetando e entregando soluções escaláveis que conectam sistemas de saúde e plataformas empresariais.",
                  "Impulsionar as melhores práticas de desenvolvimento com foco em APIs, interoperabilidade e troca de dados em ambientes complexos.",
                  "Orientar e guiar engenheiros, promovendo clareza, pragmatismo e resultados mensuráveis.",
                  "Implementar testes automatizados e pipelines de CI/CD para o Mirth Connect, melhorando a confiabilidade, qualidade e velocidade de entrega em uma camada de integração crítica.",
                ],
              },
            ],
          },
          {
            company: "CF Inova Tech",
            location: "Remoto - Tempo integral (CE, Brasil)",
            period: "Out 2018 - Ago 2021 (2 anos e 10 meses)",
            description:
              "Uma empresa de software focada em soluções web, mobile e empresariais, entregando inovação por meio da tecnologia.",
            overview: "Empresa de software focada em soluções web, mobile e empresariais",
            skills: [
              "TypeScript",
              "Desenvolvimento de APIs",
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
                title: "Engenheiro de Software Sênior",
                period: "Out 2018 - Ago 2021 (2 anos e 10 meses)",
                responsibilities: [
                  "Projetou e desenvolveu aplicações e APIs fullstack, garantindo desempenho, confiabilidade e manutenibilidade.",
                  "Colaborou com equipes multifuncionais para alinhar soluções técnicas com requisitos de negócios.",
                  "Contribuiu para melhorias na qualidade do código promovendo padrões, revisões por pares e práticas de desenvolvimento sustentável.",
                ],
              },
            ],
          },
          {
            company: "M. Dias Branco",
            location: "Tempo integral - Fortaleza, CE, Brasil",
            period: "Abr 2008 - Out 2018 (10 anos e 5 meses)",
            description:
              "A maior empresa de alimentos do Brasil e um dos principais produtores de massas, biscoitos, crackers e farinha na América Latina, com mais de 20.000 funcionários e presença em mais de 40 países.",
            overview: "Maior empresa de alimentos do Brasil, forte presença na América Latina",
            skills: [
              "TypeScript",
              "Desenvolvimento de APIs",
              "Java",
              "Spring Boot",
              "Hibernate",
              "ETL",
              "Oracle",
              "Angular",
              "React.js",
              "SQL",
            ],
            positions: [
              {
                title: "Engenheiro de Software Sênior",
                period: "Jun 2012 - Out 2018 (6 anos e 5 meses)",
                responsibilities: [
                  "Desenvolveu e manteve aplicações empresariais fullstack, combinando Oracle (PL/SQL) no backend com soluções modernas no frontend.",
                  "Entregou recursos críticos para os negócios com alta confiabilidade, garantindo conformidade e escalabilidade em ambientes complexos.",
                  "Contribuiu significativamente para o projeto de pagamento de Participação nos Lucros (PL), lidando com regras de negócios intrincadas em um sistema de folha de pagamento que atende mais de 20.000 funcionários.",
                ],
              },
              {
                title: "Desenvolvedor de Software Pleno",
                period: "Out 2010 - Jun 2012 (1 ano e 8 meses)",
                responsibilities: [
                  "Contribuiu para o desenvolvimento e manutenção de aplicações empresariais, apoiando tanto as demandas de backend quanto de frontend.",
                  "Participou ativamente de projetos-chave da empresa, entregando recursos que apoiavam diretamente o crescimento e as operações dos negócios.",
                ],
              },
              {
                title: "Desenvolvedor de Software Júnior",
                period: "Abr 2009 - Out 2010 (1 ano e 6 meses)",
                responsibilities: [
                  "Apoiou o desenvolvimento e manutenção de sistemas internos enquanto aprendia as melhores práticas em engenharia de software.",
                  "Contribuiu para projetos centrais da empresa, ganhando experiência inicial em entregar valor real para os negócios por meio da tecnologia.",
                ],
              },
              {
                title: "Estagiário em Desenvolvimento de Software",
                period: "Abr 2008 - Abr 2009 (1 ano)",
                responsibilities: [
                  "Apoiou o desenvolvimento e manutenção de aplicações, ganhando experiência prática com projetos do mundo real.",
                  "Recebeu uma promoção antecipada para um cargo de desenvolvedor em tempo integral, reconhecido por seu forte desempenho e contribuição para a equipe.",
                ],
              },
            ],
          },
        ],
      },
      education: {
        title: "Educação",
        institutions: [
          {
            name: "Universidade Estácio de Sá",
            qualifications: [
              "MBA em Inteligência Artificial - 2025 - Presente",
              "Bacharelado em Ciência da Computação - 2020 - 2024",
              "Pós-graduação em Big Data, BI e Analytics Aplicada aos Negócios - 2021 - 2024",
              "Tecnólogo em Análise e Desenvolvimento de Sistemas - 2015 - 2017",
            ],
          },
        ],
      },
      certifications: {
        title: "Certificações",
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
    madeWith: "© 2008-{{year}} Caio Frota. Desde 2008 construindo soluções com amor e café!",
  },
};
