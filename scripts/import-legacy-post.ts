import { PrismaClient } from "@prisma/client";
import { getPostData, slugify } from "../lib/articles";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const user = email ? await prisma.user.findUnique({ where: { email } }) : await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!user) {
    throw new Error("Crie primeiro um usuário ADMIN ou informe o e-mail dele como primeiro argumento.");
  }

  const existingArticles = await prisma.article.count();
  if (existingArticles) {
    console.log("Nenhum post importado: o banco já contém artigos.");
    return;
  }

  const [pt, en] = await Promise.all([getPostData("hello-world", "pt-BR"), getPostData("hello-world", "en-US")]);
  if (!pt || !en) throw new Error("O par bilíngue de posts hello-world não foi encontrado.");

  await prisma.$transaction(async (transaction) => {
    const article = await transaction.article.create({ data: { authorId: user.id } });
    const category = await transaction.category.create({
      data: {
        translations: {
          create: [
            { locale: "PT_BR", name: pt.category, slug: await slugify(pt.category) },
            { locale: "EN_US", name: en.category, slug: await slugify(en.category) },
          ],
        },
      },
      include: { translations: true },
    });

    const ptCategory = category.translations.find((translation) => translation.locale === "PT_BR");
    const enCategory = category.translations.find((translation) => translation.locale === "EN_US");
    if (!ptCategory || !enCategory) throw new Error("Não foi possível criar as traduções da categoria.");

    await transaction.articleTranslation.createMany({
      data: [
        {
          articleId: article.id,
          locale: "PT_BR",
          title: pt.title,
          slug: "hello-world",
          excerpt: pt.subtitle,
          contentHtml: pt.html,
          status: "PUBLISHED",
          publishedAt: parseLegacyDate(pt.date),
        },
        {
          articleId: article.id,
          locale: "EN_US",
          title: en.title,
          slug: "hello-world",
          excerpt: en.subtitle,
          contentHtml: en.html,
          status: "PUBLISHED",
          publishedAt: parseLegacyDate(en.date),
        },
      ],
    });

    const translations = await transaction.articleTranslation.findMany({ where: { articleId: article.id } });
    const ptArticle = translations.find((translation) => translation.locale === "PT_BR");
    const enArticle = translations.find((translation) => translation.locale === "EN_US");
    if (!ptArticle || !enArticle) throw new Error("Não foi possível criar as traduções do artigo.");

    await Promise.all([
      transaction.articleTranslation.update({
        where: { id: ptArticle.id },
        data: { categories: { connect: { id: ptCategory.id } } },
      }),
      transaction.articleTranslation.update({
        where: { id: enArticle.id },
        data: { categories: { connect: { id: enCategory.id } } },
      }),
    ]);
  });

  console.log("Post bilíngue hello-world importado com sucesso.");
}

function parseLegacyDate(date: string) {
  const [day, month, year] = date.split("-");
  return new Date(`${year}-${month}-${day}T12:00:00Z`);
}

void main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
