"use client";

import { ImageIcon, Images, Trash2 } from "lucide-react";
import { useState } from "react";
import { MediaPickerDialog, type MediaPickerAsset } from "components/admin/media-picker-dialog";

type CoverImageAsset = Omit<MediaPickerAsset, "url"> & { url: string | null };

export function CoverImageField({ initialAsset }: { initialAsset: CoverImageAsset | null }) {
  const [selected, setSelected] = useState<CoverImageAsset | null>(initialAsset);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div>
      <input type="hidden" name="coverImageId" value={selected?.id ?? ""} />

      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-sm font-semibold text-site-heading">Imagem de capa</p>
          <p className="mt-1 text-xs leading-5 text-site-muted">Usada na listagem do blog e no compartilhamento do artigo.</p>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-site-muted">Opcional</span>
      </div>

      <div className="mt-3 rounded-2xl border border-site-border bg-site-surface-strong p-3">
        {selected ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-site-border bg-site-surface sm:w-36">
              {selected.url ? (
                <img src={selected.url} alt={selected.altText ?? "Prévia da imagem de capa"} className="size-full object-cover" />
              ) : (
                <span className="grid size-full place-items-center text-site-muted">
                  <ImageIcon className="size-5" aria-hidden="true" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1 py-0.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-site-accent">Capa selecionada</p>
              <p className="mt-1 truncate text-sm font-semibold text-site-heading" title={selected.filename}>
                {selected.filename}
              </p>
              <p className="mt-1 line-clamp-1 text-xs text-site-muted">{selected.altText || "Sem texto alternativo"}</p>
            </div>
            <div className="flex w-full flex-col gap-2 min-[360px]:flex-row sm:w-auto">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="cf-ring inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-site-surface px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-500/10 dark:text-red-300 sm:flex-none"
                aria-label="Remover associação da imagem de capa"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                Remover
              </button>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="button-secondary min-h-10 flex-1 shrink-0 px-3 py-2 text-xs sm:flex-none"
              >
                <Images className="size-4" aria-hidden="true" />
                Trocar imagem
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="grid aspect-video w-full shrink-0 place-items-center rounded-xl border border-dashed border-site-border bg-site-surface text-site-muted sm:w-36">
              <ImageIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-site-heading">Nenhuma imagem adicionada</p>
              <p className="mt-1 text-xs leading-5 text-site-muted">Abra a biblioteca para escolher ou enviar uma capa.</p>
            </div>
            <button type="button" onClick={() => setPickerOpen(true)} className="button-primary shrink-0 px-4 py-2.5 text-xs">
              <Images className="size-4" aria-hidden="true" />
              Adicionar imagem
            </button>
          </div>
        )}
      </div>

      <MediaPickerDialog
        open={pickerOpen}
        title={selected ? "Trocar imagem de capa" : "Adicionar imagem de capa"}
        description="Selecione uma imagem da biblioteca ou envie um novo arquivo."
        onClose={() => setPickerOpen(false)}
        onSelect={setSelected}
      />
    </div>
  );
}
