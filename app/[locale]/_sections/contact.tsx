"use client";

import { Card } from "components/card";
import { SectionHeading } from "components/section-heading";
import { useTranslator } from "i18n/provider";
import { SOCIAL_LINKS, type SocialType } from "lib/social-links";
import { ArrowRight, Github, Instagram, Linkedin, type LucideIcon } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { createContactFormToken, sendEmail, type ContactErrorCode } from "./action";

const SOCIAL_ICONS: Record<SocialType, LucideIcon> = {
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
};

export function Contact() {
  const { t } = useTranslator();
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [formToken, setFormToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);
  const tokenRequestId = useRef(0);

  const refreshFormToken = useCallback(async () => {
    const requestId = ++tokenRequestId.current;
    setIsTokenLoading(true);
    setFormToken(null);

    try {
      const nextToken = await createContactFormToken();
      if (tokenRequestId.current === requestId) setFormToken(nextToken);
    } catch (error) {
      console.error("Error preparing contact form:", error);
      if (tokenRequestId.current === requestId) setErrorMessage(t.contact.form.errors.generic);
    } finally {
      if (tokenRequestId.current === requestId) setIsTokenLoading(false);
    }
  }, [t.contact.form.errors.generic]);

  useEffect(() => {
    void refreshFormToken();
  }, [refreshFormToken]);

  function getErrorMessage(error: ContactErrorCode) {
    switch (error) {
      case "invalid-fields":
        return t.contact.form.errors.invalidFields;
      case "invalid-form":
        return t.contact.form.errors.generic;
      case "rate-limited":
        return t.contact.form.errors.rateLimited;
      case "configuration":
        return t.contact.form.errors.configuration;
      case "send-failed":
        return t.contact.form.errors.generic;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSentSuccess(false);
    setErrorMessage(null);

    if (!formToken) {
      setErrorMessage(t.contact.form.errors.generic);
      await refreshFormToken();
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendEmail({
        name,
        email,
        message,
        website,
        formToken,
      });

      if (!result.ok) {
        setErrorMessage(getErrorMessage(result.error));
        await refreshFormToken();
        return;
      }

      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
      setSentSuccess(true);
      await refreshFormToken();
    } catch (error) {
      console.error("Error sending contact message:", error);
      setErrorMessage(t.contact.form.errors.generic);
      await refreshFormToken();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-[58px] px-5 py-24 sm:px-8 md:py-32 lg:px-10">
      <SectionHeading kicker={t.contact.kicker} title={t.contact.title} subtitle={t.contact.subtitle} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <form onSubmit={handleSubmit} className="relative grid gap-4">
            <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input
                id="contact-website"
                name="website"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <label className="text-sm">
              <span className="mb-1 block text-slate-800 dark:text-neutral-200">{t.contact.form.name.label}</span>
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-neutral-400 dark:border-slate-700 dark:bg-slate-800 dark:text-neutral-100 cf-ring"
                placeholder={t.contact.form.name.placeholder}
                minLength={2}
                maxLength={100}
                required
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-slate-800 dark:text-neutral-200">{t.contact.form.email.label}</span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-neutral-400 dark:border-slate-700 dark:bg-slate-800 dark:text-neutral-100 cf-ring"
                placeholder={t.contact.form.email.placeholder}
                maxLength={254}
                required
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-slate-800 dark:text-neutral-200">{t.contact.form.message.label}</span>
              <textarea
                name="message"
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full resize-none rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-neutral-400 dark:border-slate-700 dark:bg-slate-800 dark:text-neutral-100 cf-ring"
                placeholder={t.contact.form.message.placeholder}
                minLength={10}
                maxLength={5000}
                required
              />
            </label>

            <div aria-live="polite">
              {errorMessage ? (
                <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                  {errorMessage}
                </p>
              ) : null}
              {sentSuccess ? (
                <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">
                  {t.contact.form.success}
                </p>
              ) : null}
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r cf-accent px-5 py-3 text-sm font-semibold text-white shadow-xl transition active:scale-[.98] disabled:cursor-wait disabled:opacity-50 disabled:shadow-none"
              type="submit"
              disabled={isLoading || isTokenLoading || !formToken}
            >
              {isLoading ? t.contact.form.sending : t.contact.form.send} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold tracking-tight">{t.contact.shortcut}</h3>
          <div className="mt-4 grid gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.type];
              return (
                <a
                  key={social.type}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-between rounded-2xl border border-neutral-200 px-4 py-3 text-sm transition hover:bg-neutral-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  title={social.label}
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {social.label}
                  </span>
                  <ArrowRight className="h-4 w-4 translate-x-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </a>
              );
            })}
          </div>
          <div className="mt-6 rounded-2xl border border-neutral-200 p-4 text-sm dark:border-slate-700">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">{t.contact.note}</p>
          </div>
        </Card>
      </div>
    </section>
  );
}
