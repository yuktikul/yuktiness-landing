"use client";

import { signup, site, urgency } from "@content/landing";
import { formatIST } from "@/lib/schedule";
import { seatState } from "@/lib/seats";
import type { FieldName } from "@/lib/signup-validation";
import { Countdown } from "../countdown";
import { useSession } from "../session-context";
import { useSignup } from "./signup-context";

const F = signup.fields;

const inputBase =
  "block h-12 rounded-xl border bg-white px-4 text-base text-ink placeholder:text-ink-soft/70 transition-colors focus:border-teal-deep focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-teal-deep";
const borderFor = (err: string | null) => (err ? "border-[#B42318]" : "border-line-light");
const labelCls = "mb-1.5 block text-sm font-semibold text-ink";

function ErrorText({ id, message }: { id: string; message: string | null }) {
  return (
    <p id={id} className="mt-1.5 min-h-0 text-sm font-medium text-[#B42318]" aria-live="polite">
      {message}
    </p>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The one-screen signup form. Several instances can be on the page (hero, #signup, mobile
 * sheet); they share one state, so whatever a visitor typed is kept everywhere.
 */
export function SignupForm({ idPrefix, title, titleId, autoFocus = false }: { idPrefix: string; title?: string; titleId?: string; autoFocus?: boolean }) {
  const s = useSignup();
  const { sessions, seats } = useSession();
  const { values } = s;
  const id = (f: FieldName | string) => `${idPrefix}-${f}`;
  const err = (f: FieldName) => s.errorFor(f);
  const describe = (f: FieldName, extra?: string) => [err(f) ? id(`${f}-error`) : null, extra].filter(Boolean).join(" ") || undefined;
  const submitting = s.status === "submitting";

  if (s.status === "done" && s.confirmation) {
    return (
      <div className="on-light rounded-3xl bg-offwhite p-6 text-ink sm:p-8" role="status">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-deep">{signup.price}</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">{signup.comingSoon.heading}</h2>
        <p className="mt-3 text-ink-soft">{signup.comingSoon.body}</p>
        <dl className="mt-6 space-y-1 text-sm">
          <div><dt className="inline font-semibold">Name: </dt><dd className="inline">{s.confirmation.name}</dd></div>
          {s.confirmation.session && (
            <div><dt className="inline font-semibold">{signup.comingSoon.sessionLabel}: </dt><dd className="inline">{s.confirmation.session}</dd></div>
          )}
        </dl>
      </div>
    );
  }

  const selected = sessions.find((x) => x.slot.id === values.slotId) ?? sessions[0];
  const selectedState = seatState(seats?.[selected.slot.id], urgency.closingFastShareLeft);
  const seatText = { limited: urgency.seatsLimited, closing: urgency.seatsClosingFast, full: urgency.seatsFull }[selectedState].replace(
    "{slot}",
    selected.slot.label,
  );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        s.submit(idPrefix);
      }}
      className="on-light rounded-3xl bg-offwhite p-5 text-ink sm:p-7"
      aria-labelledby={title ? titleId ?? id("title") : undefined}
    >
      {title && (
        <div className="mb-5">
          <h2 id={titleId ?? id("title")} className="font-serif text-[1.9rem] font-semibold leading-tight">
            {title}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{signup.formSubtitle}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* 1. Name */}
        <div>
          <label htmlFor={id("fullName")} className={labelCls}>{F.name.label}</label>
          <input
            id={id("fullName")}
            name="name"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
            autoFocus={autoFocus}
            placeholder={F.name.placeholder}
            value={values.fullName}
            onChange={(e) => s.set("fullName", e.target.value)}
            onBlur={() => {
              s.touch("fullName");
              s.saveContactIfReady();
            }}
            aria-invalid={!!err("fullName")}
            aria-describedby={describe("fullName")}
            required
            className={`${inputBase} ${borderFor(err("fullName"))} w-full`}
          />
          <ErrorText id={id("fullName-error")} message={err("fullName")} />
        </div>

        {/* 2. WhatsApp */}
        <div>
          <label htmlFor={id("phone")} className={labelCls}>{F.phone.label}</label>
          <div className="flex gap-2">
            <input
              aria-label={F.phone.codeLabel}
              name="phone-code"
              autoComplete="tel-country-code"
              inputMode="tel"
              value={values.phoneCode}
              onChange={(e) => s.set("phoneCode", e.target.value.replace(/[^\d+]/g, "").slice(0, 4))}
              onBlur={() => {
                if (!values.phoneCode.startsWith("+")) s.set("phoneCode", `+${values.phoneCode.replace(/\D/g, "")}`);
                s.touch("phone");
              }}
              className={`${inputBase} ${borderFor(err("phone"))} w-20 shrink-0 text-center`}
            />
            <input
              id={id("phone")}
              name="tel-national"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              enterKeyHint="next"
              placeholder={F.phone.placeholder}
              value={values.phone}
              onChange={(e) => s.set("phone", e.target.value.slice(0, 20))}
              onBlur={() => {
                s.touch("phone");
                s.saveContactIfReady();
              }}
              aria-invalid={!!err("phone")}
              aria-describedby={describe("phone", id("phone-hint"))}
              required
              className={`${inputBase} ${borderFor(err("phone"))} w-full min-w-0 flex-1`}
            />
          </div>
          <p id={id("phone-hint")} className="mt-1.5 text-xs text-ink-soft">{F.phone.hint}</p>
          <ErrorText id={id("phone-error")} message={err("phone")} />
        </div>

        {/* 3. Email */}
        <div>
          <label htmlFor={id("email")} className={labelCls}>{F.email.label}</label>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="next"
            placeholder={F.email.placeholder}
            value={values.email}
            onChange={(e) => s.set("email", e.target.value.trim())}
            onBlur={() => {
              s.touch("email");
              s.saveContactIfReady();
            }}
            aria-invalid={!!err("email")}
            aria-describedby={describe("email")}
            required
            className={`${inputBase} ${borderFor(err("email"))} w-full`}
          />
          <ErrorText id={id("email-error")} message={err("email")} />
        </div>

        {/* 4. Session */}
        <fieldset aria-describedby={describe("slotId")}>
          <legend className={labelCls}>{F.session.label}</legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {sessions.map((x, i) => {
              const state = seatState(seats?.[x.slot.id], urgency.closingFastShareLeft);
              const full = state === "full";
              const note = full ? urgency.slotFullShort : state === "closing" ? "Seats closing fast" : "Limited seats";
              return (
                <label key={x.slot.id} className={`relative block ${full ? "cursor-not-allowed" : "cursor-pointer"}`}>
                  <input
                    type="radio"
                    name={`${idPrefix}-session`}
                    id={i === 0 ? id("slotId") : undefined}
                    value={x.slot.id}
                    checked={values.slotId === x.slot.id}
                    disabled={full}
                    onChange={() => s.setSlot(x.slot.id)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-14 flex-col justify-center rounded-2xl border-2 border-line-light bg-white px-4 py-2.5 transition-colors peer-checked:border-teal-deep peer-checked:bg-[#E9F5F3] peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal-deep peer-disabled:opacity-60">
                    <span className="font-semibold leading-snug">{formatIST(x.startsAt).replace(" IST", "")}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
                      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${full ? "bg-ink-soft" : "bg-amber"}`} />
                      IST · {note}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          <ErrorText id={id("slotId-error")} message={err("slotId")} />
        </fieldset>

        {/* 5. How did you hear */}
        <div>
          <label htmlFor={id("heard")} className={labelCls}>{F.heard.label}</label>
          <select
            id={id("heard")}
            name="heard"
            value={values.heard}
            onChange={(e) => {
              s.set("heard", e.target.value);
              s.touch("heard");
            }}
            onBlur={() => s.touch("heard")}
            aria-invalid={!!err("heard")}
            aria-describedby={describe("heard")}
            required
            className={`${inputBase} ${borderFor(err("heard"))} w-full appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%234B5563'%3E%3Cpath d='M5.5 7.5 10 12l4.5-4.5'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_0.9rem_center] bg-no-repeat pr-10 ${values.heard ? "" : "text-ink-soft"}`}
          >
            <option value="" disabled>{F.heard.placeholder}</option>
            {signup.heardOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ErrorText id={id("heard-error")} message={err("heard")} />
          {values.heard === "OTHER" && (
            <div className="mt-2">
              <label htmlFor={id("heardOther")} className={labelCls}>{F.heard.otherLabel}</label>
              <input
                id={id("heardOther")}
                name="heard-other"
                value={values.heardOther}
                onChange={(e) => s.set("heardOther", e.target.value.slice(0, 200))}
                onBlur={() => s.touch("heardOther")}
                aria-invalid={!!err("heardOther")}
                aria-describedby={describe("heardOther")}
                required
                className={`${inputBase} ${borderFor(err("heardOther"))} w-full`}
              />
              <ErrorText id={id("heardOther-error")} message={err("heardOther")} />
            </div>
          )}
        </div>

        {/* 6. Optional */}
        <details className="group rounded-2xl border border-line-light bg-white">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 text-sm font-semibold text-ink">
            {F.optional.summary}
            <span aria-hidden="true" className="text-lg leading-none text-teal-deep transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="space-y-4 px-4 pb-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink">{F.optional.chipsLabel}</legend>
              <div className="flex flex-wrap gap-2">
                {signup.issueOptions.map((o) => {
                  const on = values.issues.includes(o.value);
                  return (
                    <label key={o.value} className="cursor-pointer">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={on}
                        onChange={() => s.set("issues", on ? values.issues.filter((v) => v !== o.value) : [...values.issues, o.value])}
                      />
                      <span className="inline-flex min-h-12 items-center rounded-full border border-line-light bg-offwhite px-4 text-sm transition-colors peer-checked:border-teal-deep peer-checked:bg-[#E9F5F3] peer-checked:font-semibold peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal-deep">
                        {o.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <div>
              <label htmlFor={id("issuesText")} className="mb-1.5 block text-sm font-medium">{F.optional.noteLabel}</label>
              <textarea
                id={id("issuesText")}
                rows={2}
                value={values.issuesText}
                onChange={(e) => s.set("issuesText", e.target.value.slice(0, 2000))}
                className="block w-full rounded-xl border border-line-light bg-white px-4 py-3 text-base focus:border-teal-deep focus:outline-none focus-visible:outline-3 focus-visible:outline-teal-deep"
              />
            </div>
            <div>
              <label htmlFor={id("medicalNote")} className="mb-1.5 block text-sm font-medium">{F.optional.medicalLabel}</label>
              <textarea
                id={id("medicalNote")}
                rows={2}
                value={values.medicalNote}
                onChange={(e) => s.set("medicalNote", e.target.value.slice(0, 2000))}
                className="block w-full rounded-xl border border-line-light bg-white px-4 py-3 text-base focus:border-teal-deep focus:outline-none focus-visible:outline-3 focus-visible:outline-teal-deep"
              />
            </div>
          </div>
        </details>

        {/* 7. Consent */}
        <div>
          <label htmlFor={id("consent")} className="flex min-h-12 cursor-pointer items-start gap-3 py-1 text-sm leading-relaxed text-ink">
            <input
              id={id("consent")}
              type="checkbox"
              checked={values.consent}
              onChange={(e) => {
                s.set("consent", e.target.checked);
                s.touch("consent");
              }}
              aria-invalid={!!err("consent")}
              aria-describedby={describe("consent")}
              required
              className="mt-0.5 h-6 w-6 shrink-0 accent-[#1B6F6A]"
            />
            <span>
              {F.consent.before}
              <a href={site.privacyUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-teal-deep underline underline-offset-2">
                {F.consent.link}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              {F.consent.after}
            </span>
          </label>
          <ErrorText id={id("consent-error")} message={err("consent")} />
        </div>

        {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
      </div>

      {/* Countdown + seats right above the button */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line-light pt-4 text-xs">
        <span className="text-ink-soft">
          {signup.countdownPrefix} <Countdown compact tone="light" />
        </span>
        <span className="flex items-center gap-1.5 font-semibold text-ink">
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${selectedState === "full" ? "bg-ink-soft" : "bg-amber"}`} />
          {seatText}
        </span>
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-disabled={submitting}
        className="mt-3 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-amber px-6 text-base font-semibold text-midnight shadow-sm transition-colors hover:bg-amber-hover disabled:cursor-wait disabled:opacity-90"
      >
        {submitting && <Spinner />}
        {submitting ? signup.submitting : signup.submit}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">{signup.checkoutNote}</p>
      <p className="sr-only" role="alert">{s.announcement}</p>
    </form>
  );
}
