"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MediaPickerDialog, type MediaPickerAsset } from "components/admin/media-picker-dialog";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  LoaderCircle,
  Quote,
  Redo2,
  Undo2,
  Unlink2,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_IMAGE_SIZE = 8_000_000;
const EXTERNAL_IMAGE_ERROR =
  "Imagens externas foram bloqueadas. Baixe o arquivo e adicione-o pelo botão, cole o arquivo da imagem ou arraste-o para o editor.";

function containsHtmlImage(data: DataTransfer | null) {
  return /<img(?:\s|>)/i.test(data?.getData("text/html") ?? "");
}

function imageFiles(data: DataTransfer | null) {
  return Array.from(data?.files ?? []).filter((file) => file.type.startsWith("image/"));
}

type ToolbarButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
};

function ToolbarButton({ label, icon: Icon, onClick, active, disabled = false }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`cf-ring inline-flex size-8 items-center justify-center rounded-lg border text-site-muted transition disabled:cursor-not-allowed disabled:opacity-35 ${
        active
          ? "border-cyan-500/30 bg-cyan-600/[.12] text-site-accent"
          : "border-transparent hover:border-site-border hover:bg-site-surface-hover hover:text-site-heading"
      }`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-0.5 h-5 w-px bg-site-border" aria-hidden="true" />;
}

export function RichTextEditor({ name, initialHtml, label = "Conteúdo do artigo" }: { name: string; initialHtml: string; label?: string }) {
  const [html, setHtml] = useState(initialHtml);
  const [toolbarRevision, setToolbarRevision] = useState(0);
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const imageButton = useRef<HTMLButtonElement>(null);
  const editorRoot = useRef<HTMLDivElement>(null);
  const uploadInProgress = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ allowBase64: false }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        "aria-label": label,
        class: "tiptap min-h-[22rem] px-5 py-4 text-site-foreground outline-none sm:px-6 sm:py-5",
        role: "textbox",
      },
      handlePaste: (_view, event) => {
        const files = imageFiles(event.clipboardData);
        if (files.length) {
          event.preventDefault();
          void uploadFiles(files);
          return true;
        }
        if (containsHtmlImage(event.clipboardData)) {
          event.preventDefault();
          setUploadError(EXTERNAL_IMAGE_ERROR);
          return true;
        }
        return false;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;

        const files = imageFiles(event.dataTransfer);
        if (files.length) {
          event.preventDefault();
          void uploadFiles(files);
          return true;
        }
        if (containsHtmlImage(event.dataTransfer)) {
          event.preventDefault();
          setUploadError(EXTERNAL_IMAGE_ERROR);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: currentEditor }) => setHtml(currentEditor.getHTML()),
    onSelectionUpdate: () => setToolbarRevision((revision) => revision + 1),
  });

  useEffect(() => {
    if (editor && initialHtml !== editor.getHTML()) {
      editor.commands.setContent(initialHtml);
      setHtml(initialHtml);
    }
  }, [editor, initialHtml]);

  useEffect(() => {
    const form = editorRoot.current?.closest("form");
    if (!form) return;

    function preventSubmitDuringUpload(event: SubmitEvent) {
      if (!uploadInProgress.current) return;
      event.preventDefault();
      setUploadError("Aguarde o envio da imagem terminar antes de salvar ou publicar.");
    }

    form.addEventListener("submit", preventSubmitDuringUpload);
    return () => form.removeEventListener("submit", preventSubmitDuringUpload);
  }, []);

  async function upload(file: File) {
    if (!editor) return false;
    if (uploadInProgress.current) {
      setUploadError("Aguarde o envio da imagem atual antes de adicionar outra.");
      return false;
    }

    setUploadError(null);
    if (!ACCEPTED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE) {
      setUploadError("Use uma imagem JPG, PNG, WebP, GIF ou AVIF de até 8 MB.");
      return false;
    }

    uploadInProgress.current = true;
    setIsUploading(true);
    try {
      const data = new FormData();
      data.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const media = (await response.json().catch(() => null)) as { url?: string; altText?: string; error?: string } | null;

      if (!response.ok || !media?.url) throw new Error(media?.error ?? "Não foi possível enviar a imagem.");

      editor
        .chain()
        .focus()
        .setImage({ src: media.url, alt: media.altText ?? file.name })
        .run();
      return true;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
      return false;
    } finally {
      uploadInProgress.current = false;
      setIsUploading(false);
    }
  }

  async function uploadFiles(files: File[]) {
    let succeeded = true;
    for (const file of files) {
      if (!(await upload(file))) succeeded = false;
    }
    return succeeded;
  }

  function openImageDialog() {
    setUploadError(null);
    setImageDialogOpen(true);
  }

  function closeImageDialog() {
    setImageDialogOpen(false);
    requestAnimationFrame(() => imageButton.current?.focus());
  }

  function selectMedia(media: MediaPickerAsset) {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .setImage({ src: media.url, alt: media.altText ?? media.filename })
      .run();
  }

  function openLinkPanel() {
    if (!editor) return;
    const currentHref = editor.getAttributes("link").href;
    setLinkUrl(typeof currentHref === "string" ? currentHref : "");
    setLinkPanelOpen(true);
  }

  function applyLink() {
    if (!editor) return;

    const value = linkUrl.trim();
    if (!value) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const href = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value) ? value : `https://${value}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkPanelOpen(false);
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkPanelOpen(false);
    setLinkUrl("");
  }

  const controlsDisabled = !editor || isUploading;
  const wordCount = editor ? editor.getText().trim().split(/\s+/).filter(Boolean).length : 0;

  // Selection-only transactions use this revision to refresh active toolbar states.
  void toolbarRevision;

  return (
    <>
      <div
        ref={editorRoot}
        className="overflow-hidden rounded-xl border border-site-border bg-site-surface-strong shadow-sm transition focus-within:border-site-accent/50 focus-within:ring-2 focus-within:ring-site-accent/20"
      >
        <div className="flex flex-wrap items-center gap-1 border-b border-site-border bg-site-surface px-2 py-2">
          <ToolbarButton
            label="Negrito"
            icon={Bold}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            active={editor?.isActive("bold")}
            disabled={controlsDisabled}
          />
          <ToolbarButton
            label="Itálico"
            icon={Italic}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            active={editor?.isActive("italic")}
            disabled={controlsDisabled}
          />
          <ToolbarDivider />
          <ToolbarButton
            label="Título nível 2"
            icon={Heading2}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor?.isActive("heading", { level: 2 })}
            disabled={controlsDisabled}
          />
          <ToolbarButton
            label="Título nível 3"
            icon={Heading3}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor?.isActive("heading", { level: 3 })}
            disabled={controlsDisabled}
          />
          <ToolbarDivider />
          <ToolbarButton
            label="Lista com marcadores"
            icon={List}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            active={editor?.isActive("bulletList")}
            disabled={controlsDisabled}
          />
          <ToolbarButton
            label="Lista numerada"
            icon={ListOrdered}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            active={editor?.isActive("orderedList")}
            disabled={controlsDisabled}
          />
          <ToolbarButton
            label="Citação"
            icon={Quote}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            active={editor?.isActive("blockquote")}
            disabled={controlsDisabled}
          />
          <ToolbarButton
            label="Bloco de código"
            icon={Code2}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            active={editor?.isActive("codeBlock")}
            disabled={controlsDisabled}
          />
          <ToolbarDivider />
          <ToolbarButton
            label="Adicionar ou editar link"
            icon={Link2}
            onClick={openLinkPanel}
            active={editor?.isActive("link") || linkPanelOpen}
            disabled={controlsDisabled}
          />
          <ToolbarButton
            label="Remover link"
            icon={Unlink2}
            onClick={removeLink}
            disabled={controlsDisabled || !editor?.isActive("link")}
          />
          <button
            ref={imageButton}
            type="button"
            onClick={openImageDialog}
            disabled={controlsDisabled}
            className="cf-ring inline-flex h-8 items-center gap-2 rounded-lg border border-site-border px-2.5 text-xs font-semibold text-site-heading transition hover:border-site-accent/40 hover:bg-site-surface-hover disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={isUploading ? "Enviando imagem" : "Adicionar imagem"}
            title="JPG, PNG, WebP, GIF ou AVIF de até 8 MB"
          >
            {isUploading ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="size-4 text-site-accent" aria-hidden="true" />
            )}
            {isUploading ? "Enviando…" : "Adicionar imagem"}
          </button>
          <span className="ml-auto flex items-center gap-1">
            <ToolbarButton
              label="Desfazer"
              icon={Undo2}
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={controlsDisabled || !editor?.can().chain().focus().undo().run()}
            />
            <ToolbarButton
              label="Refazer"
              icon={Redo2}
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={controlsDisabled || !editor?.can().chain().focus().redo().run()}
            />
          </span>
        </div>

        {linkPanelOpen ? (
          <div className="flex flex-col gap-2 border-b border-site-border bg-site-surface px-3 py-3 sm:flex-row sm:items-center">
            <label htmlFor={`${name}-link-url`} className="sr-only">
              Endereço do link
            </label>
            <input
              id={`${name}-link-url`}
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                event.preventDefault();
                applyLink();
              }}
              placeholder="https://exemplo.com ou /pagina"
              autoComplete="off"
              className="cf-ring min-w-0 flex-1 rounded-lg border border-site-border bg-site-surface-strong px-3 py-2 text-sm text-site-heading placeholder:text-site-muted/70"
            />
            <div className="flex items-center gap-2">
              <button type="button" onClick={applyLink} className="button-primary px-3 py-2 text-xs" disabled={!editor}>
                Aplicar link
              </button>
              {editor?.isActive("link") ? (
                <button type="button" onClick={removeLink} className="button-secondary px-3 py-2 text-xs">
                  Remover
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setLinkPanelOpen(false)}
                className="cf-ring inline-flex size-8 items-center justify-center rounded-lg text-site-muted hover:bg-site-surface-hover hover:text-site-heading"
                aria-label="Fechar editor de link"
                title="Fechar"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : null}

        {uploadError ? (
          <div
            className="flex items-center justify-between gap-3 border-b border-red-500/20 bg-red-500/[.08] px-4 py-2 text-xs text-red-700 dark:text-red-300"
            role="alert"
          >
            <span>{uploadError}</span>
            <button type="button" onClick={() => setUploadError(null)} className="underline underline-offset-2">
              Fechar
            </button>
          </div>
        ) : null}

        <EditorContent
          editor={editor}
          className="text-[15px] leading-7 [&_.tiptap_a]:font-medium [&_.tiptap_a]:text-site-accent [&_.tiptap_a]:underline [&_.tiptap_a]:underline-offset-2 [&_.tiptap_blockquote]:my-5 [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-site-accent/40 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:italic [&_.tiptap_code]:rounded [&_.tiptap_code]:bg-site-surface-hover [&_.tiptap_code]:px-1.5 [&_.tiptap_code]:py-0.5 [&_.tiptap_h2]:mb-3 [&_.tiptap_h2]:mt-8 [&_.tiptap_h2]:text-2xl [&_.tiptap_h2]:font-black [&_.tiptap_h2]:tracking-tight [&_.tiptap_h2]:text-site-heading [&_.tiptap_h3]:mb-2 [&_.tiptap_h3]:mt-6 [&_.tiptap_h3]:text-xl [&_.tiptap_h3]:font-bold [&_.tiptap_h3]:text-site-heading [&_.tiptap_h4]:mb-2 [&_.tiptap_h4]:mt-5 [&_.tiptap_h4]:text-lg [&_.tiptap_h4]:font-bold [&_.tiptap_h4]:text-site-heading [&_.tiptap_img]:my-6 [&_.tiptap_img]:max-h-[32rem] [&_.tiptap_img]:w-full [&_.tiptap_img]:rounded-xl [&_.tiptap_img]:border [&_.tiptap_img]:border-site-border [&_.tiptap_img]:object-contain [&_.tiptap_li]:my-1 [&_.tiptap_ol]:my-4 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_p]:my-3 [&_.tiptap_pre]:my-5 [&_.tiptap_pre]:overflow-x-auto [&_.tiptap_pre]:rounded-xl [&_.tiptap_pre]:border [&_.tiptap_pre]:border-site-border [&_.tiptap_pre]:bg-site-canvas [&_.tiptap_pre]:p-4 [&_.tiptap_pre]:font-mono [&_.tiptap_pre]:text-sm [&_.tiptap_pre]:text-site-heading [&_.tiptap_pre_code]:bg-transparent [&_.tiptap_pre_code]:p-0 [&_.tiptap_ul]:my-4 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6"
        />
        <div className="flex items-center justify-between border-t border-site-border bg-site-surface px-4 py-2 text-[11px] text-site-muted">
          <span>{isUploading ? "Enviando imagem…" : "Imagens: botão, colar ou arrastar · JPG, PNG, WebP, GIF e AVIF · até 8 MB"}</span>
          <span>{wordCount === 1 ? "1 palavra" : `${wordCount} palavras`}</span>
        </div>
        <textarea className="hidden" name={name} value={html} readOnly aria-hidden="true" />
      </div>

      <MediaPickerDialog
        open={imageDialogOpen}
        title="Adicionar imagem"
        description="Escolha uma imagem da biblioteca ou envie um novo arquivo para inserir no conteúdo."
        onClose={closeImageDialog}
        onSelect={selectMedia}
      />
    </>
  );
}
