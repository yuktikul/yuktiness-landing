import { signup } from "@content/landing";
import { AttributionCapture } from "@/components/attribution-capture";
import { MetaPixel } from "@/components/meta-pixel";
import { CookieNotice } from "@/components/cookie-notice";
import { RevealObserver } from "@/components/reveal-observer";
import { SessionProvider } from "@/components/session-context";
import { StickyBar } from "@/components/sticky-bar";
import { SignupProvider } from "@/components/signup/signup-context";
import { SignupSheet } from "@/components/signup/signup-sheet";
import { checkoutUrl } from "@/lib/server/checkout";
import { Faq, Guide, Learn, SoundsLikeYou, Stats, Stories, Timeline } from "@/components/sections/content-sections";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { SignupSection } from "@/components/sections/signup-section";
import { VideoSection } from "@/components/sections/video-section";

// Re-render at most once a minute so the server-rendered session dates are always current.
export const revalidate = 60;

export default function Home() {
  return (
    <SessionProvider initialNow={Date.now()}>
      <SignupProvider checkoutUrl={checkoutUrl()} summaryError={signup.errors.summary}>
      <CookieNotice />
      <main>
        <Hero />
        <VideoSection />
        <SoundsLikeYou />
        <Learn />
        <Timeline />
        <Guide />
        <Stats />
        <Stories />
        <Faq />
        <SignupSection />
      </main>
      <Footer />
      <StickyBar />
      <SignupSheet />
      <RevealObserver />
      <AttributionCapture />
      <MetaPixel />
      </SignupProvider>
    </SessionProvider>
  );
}
