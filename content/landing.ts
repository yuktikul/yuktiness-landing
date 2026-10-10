/**
 * All landing-page copy lives here. Edit text freely; components read from this file.
 *
 * Copy rules (please keep): no cures, no guarantees, no promised health outcomes.
 * Client quotes are verbatim, used with permission. Do not edit their wording.
 */

// ---------- Session schedule (IST) ----------

export type SessionSlot = {
  /** Stable id used on this site. */
  id: string;
  /** Fallback id of the matching CRM MasterclassSchedule row (used if the CRM's seat list can't be read). */
  crmSlotId: string;
  /** Short label used in seat lines, e.g. "Wednesday 7 PM". */
  label: string;
  /** 0 = Sunday … 3 = Wednesday … 6 = Saturday (IST calendar). */
  dayOfWeek: number;
  /** 24h "HH:mm" in IST. */
  startTime: string;
};

export const schedule: SessionSlot[] = [
  { id: "wed-1900", crmSlotId: "slot_wed_1900", label: "Wednesday 7 PM", dayOfWeek: 3, startTime: "19:00" },
  { id: "wed-1100", crmSlotId: "slot_wed_1100", label: "Wednesday 11 AM", dayOfWeek: 3, startTime: "11:00" },
];

/** Length of each live masterclass, in minutes. */
export const sessionDurationMinutes = 120;

// ---------- Site / SEO ----------

export const site = {
  brand: "Yuktiness",
  title: "Breath Alignment Masterclass | Yuktiness with Yukti Raj Kishore",
  description:
    "A 2-hour live masterclass on understanding and improving how you breathe. Explore how your breathing connects with stress, sleep and energy, try a guided practice, and leave with a clear next step.",
  ogTitle: "Breath Alignment Masterclass with Yukti Raj Kishore",
  ogDescription: "2 hours, live, every Wednesday. Understand your breathing pattern, practise with guidance, and leave with a clear next step.",
  /** Shown in the footer as a tap-to-call link. */
  contactPhone: "+91 80507 10575",
  /** Optional. Leave empty to hide the email link. */
  contactEmail: "connect@yuktiness.com",
  logoAlt: "Yuktiness: Breathe Wellness in Abundance",
  privacyUrl: "https://yuktiness.com/privacy-policy/",
};

// ---------- Navigation / CTAs ----------

export const cta = {
  reserve: "Reserve my spot",
  topBarReserve: "Reserve my spot",
  stickyReserve: "Reserve my spot",
};

// ---------- Hero ----------

export const hero = {
  eyebrow: "A 2-hour live masterclass with Yukti Raj Kishore",
  headline: "Your breath is quietly shaping your stress, sleep and energy. Learn to realign it.",
  subline: "Understand your own breathing pattern, try a guided practice, and leave with a clear next step.",
  nextSessionsLabel: "Next live session",
  countdownLabel: "Next session starts in",
  stickyCountdownLabel: "Next session in",
};

// ---------- Price ----------

export const pricing = {
  price: "₹51",
  /**
   * Shown struck through next to the price. Only show a price that is genuinely the regular
   * price of this masterclass: Indian consumer law (Consumer Protection Act 2019 and the CCPA
   * guidelines on misleading ads) treats an invented "was" price as misleading.
   * Set to "" to hide it.
   */
  regularPrice: "₹499",
  regularPriceLabel: "Regular price",
};

// ---------- Review metrics (shown under the hero button) ----------

/**
 * Fill in your real public ratings. A row with an empty rating or count is hidden,
 * so nothing is shown until you add the actual numbers from each profile.
 */
export const reviewMetrics = {
  ratings: [
    { source: "Google", rating: "", count: "" },
    { source: "Trustpilot", rating: "", count: "" },
  ],
  impact: { value: "15,000+", label: "lives impacted" },
};

// ---------- Countdown / seats ----------

export const urgency = {
  countdownUnits: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
  /**
   * Seat lines ({slot} is replaced). No numbers are shown. The wording follows the
   * real bookings from the CRM, so it stays truthful:
   *  - default (or if the CRM can't be reached): "Limited seats"
   *  - when the share of seats left is at or below closingFastShareLeft: "Seats closing fast"
   *  - when no seats are left: "This session is full"
   */
  seatsLimited: "Limited spots for {slot}",
  seatsClosingFast: "Spots closing fast for {slot}",
  seatsFull: "This session is full: {slot}",
  slotFullShort: "This session is full",
  /** 0.3 = show "closing fast" once 30% or fewer of a session's seats remain. */
  closingFastShareLeft: 0.3,
  smallGroupLine: "We keep each session small so everyone gets personal guidance.",
  liveNow: "Live now",
};

// ---------- Video ----------

export const video = {
  heading: "Watch this short video before you register",
  placeholderNote: "The video will appear here soon.",
  playLabel: "Play video",
  ctaNote: "Live online · 2 hours",
};

// ---------- Does this sound like you? ----------

export const soundsLikeYou = {
  heading: "Does this sound like you?",
  intro: "Many people who join recognise at least one of these.",
  items: [
    "You feel wired but tired: busy all day, yet unable to switch off at night.",
    "Your sleep is light or broken, and mornings don't feel restful.",
    "When pressure rises, your breath turns shallow or fast without you noticing.",
    "You know some pranayama or breathwork, but it hasn't become part of your life.",
    "You want a clear structure, not another list of random techniques.",
  ],
  closing: "If so, the masterclass is a calm place to start.",
};

// ---------- What you will learn ----------

export const learn = {
  heading: "What you will learn",
  cards: [
    {
      title: "How breath connects to how you feel",
      body: "How everyday breathing patterns relate to stress, sleep, energy and emotions.",
    },
    {
      title: "A simple self-assessment",
      body: "A few easy checks to notice how you breathe right now, with no equipment.",
    },
    {
      title: "A guided breath-alignment practice",
      body: "A practice you do together during the session and can repeat at home.",
    },
    {
      title: "A sensible next step",
      body: "What a realistic next step could look like for you, based on what you noticed.",
    },
  ],
};

// ---------- Timeline ----------

export const timeline = {
  heading: "How the 2 hours work",
  steps: [
    { title: "Understand", body: "How your breath and nervous system interact, explained simply." },
    { title: "Assess", body: "Look at your own breathing pattern with a short guided self-assessment." },
    { title: "Practise", body: "A guided breath-alignment session, live, at a comfortable pace." },
    { title: "Plan", body: "Your next step, clearly laid out, with no pressure to buy anything." },
  ],
};

// ---------- Guide ----------

export const guide = {
  heading: "Meet your guide",
  name: "Yukti Raj Kishore",
  role: "Breath Alignment Coach · Founder of Yuktiness",
  /** Set to an image path in /public (e.g. "/yukti-portrait.jpg") once the photo is ready. */
  portraitSrc: "",
  portraitAlt: "Portrait of Yukti Raj Kishore, Breath Alignment Coach",
  portraitPlaceholder: "Portrait photo",
  credentials: [
    "India's first Flow Ambassador",
    "Nirvana Fitness Ambassador",
    "Internationally certified in breathwork and ice bath, yoga, meditation and trauma-informed practice",
    "Engineering degree and MBA from XLRI Jamshedpur",
  ],
  bio: [
    "Yukti spent years in the corporate world before moving into wellness. Her own journey showed her that information on its own rarely changes how we live.",
    "She founded Yuktiness in July 2020 to bring a structured, step-by-step approach to breath, combining modern understanding with yogic tradition.",
  ],
  belief: "Knowledge alone is not enough. People need the right practice, structure, feedback and accountability.",
};

// ---------- Credibility ----------

export const stats = [
  { value: "15,000+", label: "people reached" },
  { value: "1,500+", label: "students" },
  { value: "Since 2020", label: "guiding breath practice" },
];

// ---------- Stories ----------

export type Story = { name: string; quote: string; featured: boolean };

export const stories = {
  heading: "Stories from the community",
  disclaimer: "Individual experience. Results vary.",
  previousLabel: "Previous story",
  nextLabel: "Next story",
  /** Quotes are verbatim and used with permission. Toggle `featured` to show or hide. */
  items: [
    {
      name: "Mamta Goyal",
      quote:
        "I was doing shallow breathing, so when I started doing mindful breathing, it reduces my anxiety, my shooting shoulder pain has just gone away.",
      featured: true,
    },
    {
      name: "Manasi",
      quote:
        "Adopting a Breathing Fitness Lifestyle helped me transform my health. I lost 24 kg and also saw an improvement in my lung capacity.",
      featured: true,
    },
    {
      name: "Kavita",
      quote:
        "The breathing practices brought a noticeable transformation in the way I breathe and helped me become more aware of my breathing.",
      featured: true,
    },
    {
      name: "Achala Ji",
      quote:
        "As soon as I go to bed, I am able to sleep and I am able to get a good sleep of about five to six hours. When I get up in the morning, my brain is calm and I am no more suffering from those issues that I earlier was.",
      featured: true,
    },
    {
      name: "Ritu",
      quote: "In the last two days I came to know that breathing has such an important role in our life.",
      featured: true,
    },
    {
      name: "Yogesh",
      quote: "This time for the trekking, I was totally active and I was able to achieve that without any stop.",
      featured: true,
    },
  ] satisfies Story[],
};

// ---------- FAQ ----------

export const faq = {
  heading: "Questions people ask",
  items: [
    {
      q: "Is this a medical treatment?",
      a: "No. It is education and guided practice, not a diagnosis or treatment, and it does not replace medical care.",
    },
    {
      q: "I already know pranayama. Will this still help?",
      a: "It focuses on assessing your own pattern and choosing practices in a sensible order.",
    },
    { q: "Do I need experience?", a: "No." },
    { q: "When is it held?", a: "Every Wednesday at 7 PM and 11 AM IST." },
    {
      q: "What if I can't attend live?",
      a: "There are no recordings. The masterclass is live and runs every Wednesday at 7 PM and 11 AM IST, so you can join the next one.",
    },
    {
      q: "Is it safe for everyone?",
      a: "People with certain medical conditions, or who are pregnant, should check with their doctor and tell us on the form.",
    },
    { q: "What does it cost?", a: "Rs 51." },
  ],
};

// ---------- Signup form ----------

export const signup = {
  heading: "Reserve your spot",
  intro: "One short form, then you go straight to the payment page.",
  formTitle: "Reserve your spot",
  formSubtitle: "Takes about 30 seconds.",
  closeLabel: "Close",
  fields: {
    name: { label: "Full name", placeholder: "Your full name" },
    phone: {
      label: "WhatsApp number",
      codeLabel: "Country code",
      placeholder: "98765 43210",
      hint: "We'll send your session link on WhatsApp.",
    },
    email: { label: "Email", placeholder: "you@example.com" },
    session: { label: "Your session", note: "The next live masterclass" },
    heard: { label: "How did you first hear about Yuktiness?", placeholder: "Choose one", otherLabel: "Where did you hear about us?" },
    optional: {
      summary: "Optional: tell us what you're working on",
      chipsLabel: "What would you like help with?",
      noteLabel: "Anything you'd like to share",
      medicalLabel: "Anything else we should know, for example a medical condition or pregnancy?",
    },
    consent: {
      before: "I agree to be contacted by Yuktiness about this masterclass and related programs, and I accept the ",
      link: "Privacy Policy",
      after: ".",
    },
  },
  heardOptions: [
    { value: "INSTAGRAM", label: "Instagram" },
    { value: "FACEBOOK", label: "Facebook" },
    { value: "YOUTUBE", label: "YouTube" },
    { value: "WHATSAPP", label: "WhatsApp" },
    { value: "FRIEND_OR_FAMILY", label: "Friend or family" },
    { value: "GOOGLE_SEARCH", label: "Google search" },
    { value: "EVENT_OR_WORKSHOP", label: "Event or workshop" },
    { value: "OTHER", label: "Other" },
  ],
  issueOptions: [
    { value: "STRESS_ANXIETY", label: "Stress or anxiety" },
    { value: "POOR_SLEEP", label: "Poor sleep" },
    { value: "LOW_ENERGY_BURNOUT", label: "Low energy or burnout" },
    { value: "PANIC_OR_FEAR", label: "Panic or fear" },
    { value: "HEADACHES_MIGRAINES", label: "Headaches or migraines" },
    { value: "BREATHLESSNESS_OR_MOUTH_BREATHING", label: "Breathlessness or mouth breathing" },
    { value: "EMOTIONAL_HEAVINESS", label: "Emotional heaviness" },
    { value: "IMMUNITY_RECOVERY", label: "Immunity and recovery" },
    { value: "CONSISTENCY_STRUGGLE", label: "Staying consistent" },
    { value: "WEIGHT_AND_FITNESS", label: "Weight and fitness" },
    { value: "OTHER", label: "Other" },
  ],
  errors: {
    name: "Please enter your full name.",
    phoneIndia: "Please enter your 10-digit WhatsApp number.",
    phoneOther: "Please enter your full WhatsApp number.",
    phoneCode: "Please enter a country code, like +91.",
    email: "That email doesn't look right. Please check it, for example name@gmail.com.",
    session: "Please choose a session.",
    heard: "Please choose one option.",
    heardOther: "Please tell us where you heard about us.",
    consent: "Please tick this box so we can contact you about the masterclass.",
    summary: "Please check the highlighted fields.",
  },
  price: "₹51",
  submit: "Reserve my spot and pay ₹51",
  submitting: "Taking you to payment…",
  /** Shown above the button. */
  countdownPrefix: "Next session starts in",
  checkoutNote: "Please use the same email or phone number on the payment page.",
  comingSoon: {
    heading: "Your spot request is saved",
    body: "The payment link is coming soon. Your details are saved and our team will be in touch.",
    sessionLabel: "Session",
  },
};

// ---------- Cookie notice ----------

export const cookieNotice = {
  text: "We use a cookie to remember which ad or link brought you here.",
  accept: "Accept",
  decline: "No thanks",
  policy: "Privacy Policy",
};

// ---------- Footer ----------

export const footer = {
  contactLabel: "Contact",
  privacyLabel: "Privacy policy",
  termsLabel: "Terms",
  disclaimer:
    "This masterclass is for education and wellbeing support. It is not medical advice, diagnosis or treatment. Individual experiences vary.",
};

// ---------- Terms page ----------

export const terms = {
  heading: "Terms",
  body: [
    "These terms are a placeholder and will be replaced with the full terms of use for the Breath Alignment Masterclass.",
    "The masterclass is for education and wellbeing support. It is not medical advice, diagnosis or treatment.",
  ],
  backLabel: "Back to the masterclass",
};
