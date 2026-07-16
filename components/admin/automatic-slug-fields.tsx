"use client";

import { Pencil, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import { adminInputClass, adminLabelClass } from "./admin-ui";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function AutomaticSlugFields({
  suffix,
  initialTitle,
  initialSlug,
  titlePlaceholder,
  slugPlaceholder,
}: {
  suffix: "br" | "en";
  initialTitle: string;
  initialSlug: string;
  titlePlaceholder: string;
  slugPlaceholder: string;
}) {
  const initialAutomaticSlug = slugify(initialTitle);
  const savedSlug = initialSlug.trim();
  const [title, setTitle] = useState(initialTitle);
  const [manualSlug, setManualSlug] = useState(savedSlug);
  const [isManual, setIsManual] = useState(Boolean(savedSlug && savedSlug !== initialAutomaticSlug));
  const slugInput = useRef<HTMLInputElement>(null);

  const automaticSlug = slugify(title);
  const submittedSlug = isManual && manualSlug ? manualSlug : automaticSlug;

  function enableManualEditing() {
    setManualSlug(submittedSlug);
    setIsManual(true);
    requestAnimationFrame(() => {
      slugInput.current?.focus();
      slugInput.current?.select();
    });
  }

  function useAutomaticSlug() {
    setManualSlug(automaticSlug);
    setIsManual(false);
  }

  function finishManualEditing() {
    const normalizedSlug = slugify(manualSlug);
    if (!normalizedSlug || normalizedSlug === automaticSlug) {
      useAutomaticSlug();
      return;
    }
    setManualSlug(normalizedSlug);
  }

  return (
    <div className="space-y-5">
      <label className={adminLabelClass}>
        Título
        <input
          required
          name={`title_${suffix}`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={adminInputClass}
          placeholder={titlePlaceholder}
        />
      </label>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`slug-${suffix}`} className={adminLabelClass}>
            Slug
          </label>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-site-muted">{isManual ? "Manual" : "Automático"}</span>
        </div>
        <div className="mt-2 flex overflow-hidden rounded-xl border border-site-border bg-site-surface-strong shadow-sm transition focus-within:border-site-accent/50 focus-within:ring-2 focus-within:ring-site-accent focus-within:ring-offset-2 focus-within:ring-offset-site-canvas">
          <span className="flex items-center border-r border-site-border px-3 text-xs font-normal text-site-muted">/blog/</span>
          <input
            ref={slugInput}
            id={`slug-${suffix}`}
            value={isManual ? manualSlug : automaticSlug}
            onChange={(event) => setManualSlug(slugify(event.target.value))}
            onBlur={finishManualEditing}
            disabled={!isManual}
            placeholder={slugPlaceholder}
            aria-describedby={`slug-${suffix}-help`}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-mono text-sm font-normal text-site-heading outline-none placeholder:text-site-muted/70 disabled:cursor-default disabled:text-site-muted"
          />
          <button
            type="button"
            onClick={isManual ? useAutomaticSlug : enableManualEditing}
            className="cf-ring inline-flex shrink-0 items-center gap-2 border-l border-site-border px-3 text-xs font-semibold text-site-accent transition hover:bg-site-surface-hover"
            aria-label={isManual ? "Voltar a gerar o slug automaticamente" : "Editar o slug manualmente"}
          >
            {isManual ? <RotateCcw className="size-3.5" aria-hidden="true" /> : <Pencil className="size-3.5" aria-hidden="true" />}
            <span className="hidden sm:inline">{isManual ? "Usar automático" : "Editar"}</span>
          </button>
        </div>
        <input type="hidden" name={`slug_${suffix}`} value={submittedSlug} readOnly />
        <p id={`slug-${suffix}-help`} className="mt-2 text-xs font-normal leading-5 text-site-muted">
          {isManual
            ? "Edição manual ativa. Use letras minúsculas, números e hífens."
            : "Gerado automaticamente a partir do título e atualizado enquanto você digita."}
        </p>
      </div>
    </div>
  );
}
