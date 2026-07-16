"use client";

import { AlertCircle, ImageIcon, ImageUp, LoaderCircle, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type MediaPickerAsset = {
  id: string;
  filename: string;
  altText: string | null;
  url: string;
  mimeType?: string;
  size?: number;
  width?: number | null;
  height?: number | null;
};

type MediaPickerDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onSelect: (asset: MediaPickerAsset) => void;
};

type MediaPage = {
  assets?: MediaPickerAsset[];
  nextCursor?: string | null;
  error?: string;
};

type UploadResponse = {
  id?: string;
  url?: string;
  altText?: string | null;
  error?: string;
};

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

function mergeAssets(current: MediaPickerAsset[], incoming: MediaPickerAsset[]) {
  const known = new Set(current.map((asset) => asset.id));
  return [...current, ...incoming.filter((asset) => !known.has(asset.id))];
}

function formatDimensions(asset: MediaPickerAsset) {
  if (asset.width && asset.height) return `${asset.width} × ${asset.height}`;
  return "Dimensões não informadas";
}

export function MediaPickerDialog({ open, title, description, onClose, onSelect }: MediaPickerDialogProps) {
  const [assets, setAssets] = useState<MediaPickerAsset[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollPanelRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  const loadPage = useCallback(async (cursor: string | null, replace: boolean) => {
    if (isFetchingRef.current) return;

    const controller = new AbortController();
    requestControllerRef.current = controller;
    isFetchingRef.current = true;
    setError(null);
    if (replace) setIsInitialLoading(true);
    else setIsLoadingMore(true);

    try {
      const params = new URLSearchParams({ limit: "24" });
      if (cursor) params.set("cursor", cursor);

      const response = await fetch(`/api/admin/media?${params.toString()}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      const result = (await response.json().catch(() => null)) as MediaPage | null;

      if (!response.ok || !result || !Array.isArray(result.assets)) {
        throw new Error(result?.error ?? "Não foi possível carregar a biblioteca de mídias.");
      }

      setAssets((current) => (replace ? result.assets! : mergeAssets(current, result.assets!)));
      setNextCursor(typeof result.nextCursor === "string" && result.nextCursor ? result.nextCursor : null);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar a biblioteca de mídias.");
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        isFetchingRef.current = false;
        setIsInitialLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    setAssets([]);
    setNextCursor(null);
    setError(null);
    setUploadError(null);
    void loadPage(null, true);

    return () => {
      requestControllerRef.current?.abort();
      requestControllerRef.current = null;
      isFetchingRef.current = false;
    };
  }, [loadPage, open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(focusFrame);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open || !nextCursor || isInitialLoading || isLoadingMore || error) return;

    const root = scrollPanelRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadPage(nextCursor, false);
      },
      { root, rootMargin: "240px 0px", threshold: 0.01 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [error, isInitialLoading, isLoadingMore, loadPage, nextCursor, open]);

  const requestClose = () => {
    if (!isUploading) onClose();
  };

  const selectAsset = (asset: MediaPickerAsset) => {
    if (isUploading) return;
    onSelect(asset);
    onClose();
  };

  async function upload(file: File) {
    setUploadError(null);

    if (!allowedImageTypes.has(file.type) || !file.size || file.size > 8_000_000) {
      setUploadError("Envie uma imagem JPG, PNG, WebP, GIF ou AVIF de até 8 MB.");
      return;
    }

    setIsUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = (await response.json().catch(() => null)) as UploadResponse | null;

      if (!response.ok || !result?.id || !result.url) {
        throw new Error(result?.error ?? "Não foi possível enviar a imagem.");
      }

      const uploaded: MediaPickerAsset = {
        id: result.id,
        filename: file.name,
        altText: result.altText ?? file.name.replace(/\.[^.]+$/, ""),
        url: result.url,
        mimeType: file.type,
        size: file.size,
        width: null,
        height: null,
      };

      setAssets((current) => [uploaded, ...current.filter((asset) => asset.id !== uploaded.id)]);
      onSelect(uploaded);
      onClose();
    } catch (uploadRequestError) {
      setUploadError(uploadRequestError instanceof Error ? uploadRequestError.message : "Não foi possível enviar a imagem.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      className="m-auto h-[min(46rem,calc(100dvh-2rem))] w-[min(64rem,calc(100%-2rem))] overflow-hidden rounded-3xl border border-site-border bg-site-canvas p-0 text-site-foreground shadow-[0_32px_100px_rgb(2_6_23/0.4)] outline-none backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-full min-h-0 flex-col">
        <header className="shrink-0 border-b border-site-border bg-site-nav px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-start gap-3 sm:flex-nowrap sm:items-center">
            <span className="hidden size-10 shrink-0 place-items-center rounded-xl bg-cyan-600/10 text-site-accent sm:grid">
              <ImageIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="text-lg font-black tracking-[-0.025em] text-site-heading sm:text-xl">
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="mt-1 text-xs leading-5 text-site-muted sm:text-sm">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="button-primary min-h-10 px-3 py-2 text-xs disabled:cursor-wait disabled:opacity-65 sm:px-4"
              >
                {isUploading ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ImageUp className="size-4" aria-hidden="true" />
                )}
                <span>{isUploading ? "Enviando…" : "Enviar nova imagem"}</span>
              </button>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={requestClose}
                disabled={isUploading}
                className="cf-ring grid size-10 place-items-center rounded-xl border border-site-border bg-site-surface text-site-muted transition hover:bg-site-surface-hover hover:text-site-heading disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Fechar biblioteca"
                title="Fechar"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="sr-only"
                tabIndex={-1}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) void upload(file);
                  event.currentTarget.value = "";
                }}
              />
            </div>
          </div>
          {uploadError ? (
            <div
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-700 dark:text-red-300"
            >
              <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {uploadError}
            </div>
          ) : null}
        </header>

        <div ref={scrollPanelRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {isInitialLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" aria-label="Carregando imagens">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-xl border border-site-border bg-site-surface" aria-hidden="true">
                  <div className="aspect-[4/3] animate-pulse bg-site-surface-hover" />
                  <div className="space-y-2 p-2.5">
                    <div className="h-3 w-4/5 animate-pulse rounded bg-site-surface-hover" />
                    <div className="h-2.5 w-2/5 animate-pulse rounded bg-site-surface-hover" />
                  </div>
                </div>
              ))}
            </div>
          ) : assets.length ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" aria-label="Biblioteca de imagens">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => selectAsset(asset)}
                    disabled={isUploading}
                    className="cf-ring group min-w-0 overflow-hidden rounded-xl border border-site-border bg-site-surface text-left transition hover:border-site-accent/50 hover:bg-site-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Selecionar ${asset.filename}`}
                  >
                    <span className="block aspect-[4/3] overflow-hidden bg-site-surface-strong">
                      {asset.url ? (
                        <img
                          src={asset.url}
                          alt=""
                          loading="lazy"
                          className="size-full object-cover transition duration-200 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="grid size-full place-items-center text-site-muted">
                          <ImageIcon className="size-6" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span className="block p-2.5">
                      <span className="block truncate text-xs font-semibold text-site-heading" title={asset.filename}>
                        {asset.filename}
                      </span>
                      <span className="mt-1 block truncate text-[10px] text-site-muted">{formatDimensions(asset)}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div ref={sentinelRef} className="flex min-h-16 items-center justify-center py-4" aria-live="polite">
                {isLoadingMore ? (
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-site-muted">
                    <LoaderCircle className="size-4 animate-spin text-site-accent" aria-hidden="true" />
                    Carregando mais imagens…
                  </span>
                ) : nextCursor ? (
                  <span className="text-xs text-site-muted">Role para carregar mais</span>
                ) : (
                  <span className="text-xs text-site-muted">Fim da biblioteca</span>
                )}
              </div>
            </>
          ) : error ? (
            <div className="grid min-h-full place-items-center py-12 text-center">
              <div className="max-w-sm">
                <AlertCircle className="mx-auto size-8 text-red-600 dark:text-red-300" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-site-heading">Não foi possível carregar as imagens</p>
                <p className="mt-1 text-xs leading-5 text-site-muted">{error}</p>
                <button type="button" onClick={() => void loadPage(null, true)} className="button-secondary mt-4 px-4 py-2 text-xs">
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : nextCursor ? (
            <div className="grid min-h-full place-items-center py-12 text-center">
              <div ref={sentinelRef} className="max-w-sm" aria-live="polite">
                <LoaderCircle className={`mx-auto size-6 text-site-accent ${isLoadingMore ? "animate-spin" : ""}`} aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-site-heading">
                  {isLoadingMore ? "Buscando mais imagens…" : "Continuando a busca na biblioteca…"}
                </p>
                <p className="mt-1 text-xs leading-5 text-site-muted">
                  Alguns arquivos desta página não possuem uma URL pública disponível.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid min-h-full place-items-center py-12 text-center">
              <div className="max-w-sm">
                <ImageIcon className="mx-auto size-8 text-site-muted" aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-site-heading">A biblioteca ainda está vazia</p>
                <p className="mt-1 text-xs leading-5 text-site-muted">Envie a primeira imagem para começar sua biblioteca.</p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="button-primary mt-4 px-4 py-2 text-xs">
                  <ImageUp className="size-4" aria-hidden="true" />
                  Enviar nova imagem
                </button>
              </div>
            </div>
          )}

          {error && assets.length ? (
            <div className="mt-2 flex flex-col items-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center">
              <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
              <button
                type="button"
                onClick={() => void loadPage(nextCursor, false)}
                className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-site-heading hover:underline"
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Tentar carregar novamente
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
