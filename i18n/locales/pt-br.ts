import { Type } from "./type";

export const pt_BR: Type = {
  title: "Caio Frota - Feito com amor e café!",
  description: "Um pouco sobre mim, meu trabalho e como entrar em contato.",
  menu: {
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
  },
  footer: {
    madeWith: (year: number) => `© 2008-${year} Caio Frota. Desde 2008 construindo soluções com amor e café!`,
  },
};
