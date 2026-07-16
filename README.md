# caiofrota.com

Portfolio bilíngue (PT-BR/EN-US), currículo em PDF e blog com painel editorial.

## Desenvolvimento

1. Copie `.env.example` para `.env` e preencha os segredos.
2. Inicie o banco local: `pnpm db:up`.
3. Execute `pnpm db:migrate`, `pnpm db:generate` e `pnpm dev`.
4. Crie o primeiro acesso administrativo: `pnpm admin:create "Caio Frota" voce@exemplo.com uma-senha-segura`.
5. Importe uma vez o par legado de “Hello World”, se o banco ainda estiver vazio: `pnpm content:import-legacy`.

O Postgres local usa a porta `55434` por padrão. Para alterá-la, mantenha `POSTGRES_PORT` e a porta de `DATABASE_URL` iguais no `.env`.
Em produção, `POSTGRES_PORT` não é necessário: somente `DATABASE_URL` é lida pela aplicação.

O login do painel fica em [`/admin/login`](http://localhost:3000/admin/login). O Postgres é a única fonte pública do blog; apenas traduções com status `PUBLISHED` aparecem no site, nas categorias, na API e no sitemap. Os arquivos Markdown existem somente como fonte para a importação inicial.

Em desenvolvimento, nenhuma variável de mídia é obrigatória. Sem a configuração completa de `R2_*`, os uploads são gravados em `.data/uploads` e servidos pela rota local de mídia. Preencha todas as variáveis `R2_*` para usar o bucket S3/R2.

## Produção

Configure um Postgres e um bucket S3-compatível exclusivos para este site. Os uploads usam as variáveis `R2_*`; o banco guarda apenas a chave do objeto, nunca URLs permanentes de desenvolvimento. O fallback local é persistente em um servidor tradicional, mas não deve ser usado em ambientes serverless com filesystem efêmero.
