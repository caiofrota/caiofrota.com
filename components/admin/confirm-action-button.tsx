"use client";

import { AlertTriangle, LoaderCircle, X, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { useFormStatus } from "react-dom";

type ConfirmActionButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  icon: LucideIcon;
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel?: string;
  tone: "danger" | "warning";
};

type DialogActionsProps = {
  cancelRef: RefObject<HTMLButtonElement | null>;
  confirmLabel: string;
  onCancel: () => void;
  onPendingChange: (pending: boolean) => void;
  onSettled: () => void;
  tone: ConfirmActionButtonProps["tone"];
};

const toneStyles = {
  danger: {
    trigger: "text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200",
    icon: "bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-300",
    confirm: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-400",
  },
  warning: {
    trigger: "text-amber-700 hover:bg-amber-500/10 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200",
    icon: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300",
    confirm:
      "bg-amber-600 text-white hover:bg-amber-500 focus:ring-amber-500 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400",
  },
} satisfies Record<ConfirmActionButtonProps["tone"], Record<string, string>>;

function DialogActions({ cancelRef, confirmLabel, onCancel, onPendingChange, onSettled, tone }: DialogActionsProps) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    onPendingChange(pending);
    if (pending) {
      wasPending.current = true;
    } else if (wasPending.current) {
      wasPending.current = false;
      onSettled();
    }
  }, [onPendingChange, onSettled, pending]);

  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        ref={cancelRef}
        type="button"
        onClick={onCancel}
        disabled={pending}
        className="cf-ring inline-flex min-h-11 items-center justify-center rounded-xl border border-site-border bg-site-surface px-4 text-sm font-bold text-site-heading transition hover:bg-site-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-site-canvas disabled:cursor-wait disabled:opacity-70 ${toneStyles[tone].confirm}`}
      >
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
        {pending ? "Aguarde…" : confirmLabel}
      </button>
    </div>
  );
}

export function ConfirmActionButton({
  action,
  icon: TriggerIcon,
  triggerLabel,
  title,
  description,
  confirmLabel = "Confirmar",
  tone,
}: ConfirmActionButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const dialogId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const styles = toneStyles[tone];

  const closeAfterAction = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const closeDialog = useCallback(() => {
    if (!pending) dialogRef.current?.close();
  }, [pending]);

  const openDialog = () => {
    setPending(false);
    dialogRef.current?.showModal();
    setOpen(true);
    requestAnimationFrame(() => cancelRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        className={`cf-ring grid size-9 cursor-pointer place-items-center rounded-lg transition ${styles.trigger}`}
        title={triggerLabel}
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={open}
      >
        <TriggerIcon className="size-4" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        role="alertdialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md overflow-hidden whitespace-normal rounded-3xl border border-site-border bg-site-canvas p-5 text-site-foreground shadow-[0_30px_90px_rgb(2_6_23/0.35)] outline-none backdrop:bg-slate-950/55 backdrop:backdrop-blur-sm sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ring-1 ${styles.icon}`}>
            <AlertTriangle className="size-5" aria-hidden="true" />
          </span>
          <button
            type="button"
            onClick={closeDialog}
            disabled={pending}
            className="cf-ring grid size-9 shrink-0 place-items-center rounded-lg text-site-muted transition hover:bg-site-surface-hover hover:text-site-heading disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Fechar confirmação"
            title="Fechar"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <h2 id={titleId} className="mt-5 text-xl font-black tracking-[-0.025em] text-site-heading">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 break-words text-sm leading-6 text-site-muted">
          {description}
        </p>

        <form action={action} onSubmit={() => setPending(true)}>
          <DialogActions
            cancelRef={cancelRef}
            confirmLabel={confirmLabel}
            onCancel={closeDialog}
            onPendingChange={setPending}
            onSettled={closeAfterAction}
            tone={tone}
          />
        </form>
      </dialog>
    </>
  );
}
