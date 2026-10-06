import { signup, urgency } from "@content/landing";
import { SignupForm } from "../signup/signup-form";
import { SectionHeading } from "./section-heading";

export function SignupSection() {
  return (
    <section id="signup" aria-labelledby="signup-heading" className="bg-midnight py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="reveal text-center">
          <SectionHeading id="signup-heading" tone="dark">
            {signup.heading}
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-lg text-mist">{signup.intro}</p>
        </div>
        <div className="mx-auto mt-10 max-w-xl">
          <SignupForm idPrefix="signup" />
          <p className="mt-6 text-center text-sm text-mist">{urgency.smallGroupLine}</p>
        </div>
      </div>
    </section>
  );
}
