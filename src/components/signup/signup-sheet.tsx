"use client";

import { useEffect, useRef } from "react";
import { signup } from "@content/landing";
import { SignupForm } from "./signup-form";
import { useSignup } from "./signup-context";

/** Mobile bottom sheet. A native <dialog>: focus is trapped, Esc closes it, the page behind is inert. */
export function SignupSheet() {
  const { sheetOpen, closeSheet } = useSignup();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (sheetOpen && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!sheetOpen && d.open) {
      d.close();
    }
    if (!sheetOpen) document.documentElement.style.overflow = "";
  }, [sheetOpen]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={closeSheet}
      onClick={(e) => {
        if (e.target === ref.current) closeSheet(); // tap on the backdrop
      }}
    >
      {sheetOpen && (
        <div className="relative">
          <div aria-hidden="true" className="mx-auto mt-2.5 h-1.5 w-12 rounded-full bg-line-light" />
          <button
            type="button"
            onClick={closeSheet}
            className="absolute right-2 top-2 flex h-12 w-12 items-center justify-center rounded-full text-ink-soft hover:bg-white"
            aria-label={signup.closeLabel}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
          <SignupForm idPrefix="sheet" title={signup.formTitle} titleId="sheet-title" autoFocus />
        </div>
      )}
    </dialog>
  );
}
