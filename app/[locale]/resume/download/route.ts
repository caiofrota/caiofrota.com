import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { ResumePdf } from "components/resume-pdf";
import { getDictionary, normalizeLocale } from "i18n";
import React from "react";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dictionary = getDictionary(normalizeLocale(locale));
  const document = React.createElement(ResumePdf, { resume: dictionary.resume }) as unknown as React.ReactElement<DocumentProps>;
  const pdf = await renderToBuffer(document);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="caio-frota-resume-${locale}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
