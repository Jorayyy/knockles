import type { SiteSettings, CollectionKey } from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  business: {
    name: "Knock'ls Boxing Gym",
    wordmark: "KNOCK'LS",
    tagline: "Boxing & Muay Thai training in Mactan, Cebu",
    phone: "+639235594226",
    phoneDisplay: "+63 923 559 4226",
    email: "",
    addressLine1: "Unit 109, B'Cebu Academy, Bldg. B, Kasinto",
    addressLine2: "Mactan, Cebu",
    city: "Lapu-Lapu City",
    region: "Central Visayas",
    postal: "6015",
    country: "Philippines",
    directionsNote: "Entrance is at the B'Cebu gate.",
    latitude: "10.305047",
    longitude: "124.013259",
    facebook: "https://www.facebook.com/KnocklsBoxGym",
    messenger: "https://m.me/KnocklsBoxGym",
    instagram: "",
    youtube: "",
    hours: [
      { day: "Monday", open: "1:00 PM", close: "8:15 PM", closed: false },
      { day: "Tuesday", open: "1:00 PM", close: "8:15 PM", closed: false },
      { day: "Wednesday", open: "1:00 PM", close: "8:15 PM", closed: false },
      { day: "Thursday", open: "1:00 PM", close: "8:15 PM", closed: false },
      { day: "Friday", open: "1:00 PM", close: "8:15 PM", closed: false },
      { day: "Saturday", open: "1:00 PM", close: "8:00 PM", closed: false },
      { day: "Sunday", open: "", close: "", closed: true },
    ],
    ratingValue: "5.0",
    ratingCount: "12",
  },
  hero: {
    eyebrow: "Mactan · Cebu · Philippines",
    headline: "Train hard.\nGet stronger.\nBecome better.",
    subheadline:
      "Boxing and Muay Thai coaching for first-timers, families and visiting fighters. Real instruction, private or small-group sessions — message us and start training.",
    primaryLabel: "Book a trial session",
    primaryHref: "/book",
    secondaryLabel: "Message us",
    secondaryHref: "",
  },
  home: {
    benefits:
      "No experience needed\nYou will be coached from the basics — stance, guard and footwork first.\nPrivate training\nOne-on-one sessions at your pace, in boxing or Muay Thai.\nBoxing and Muay Thai\nTwo disciplines, one gym, from technique to conditioning.\nCoaches who fight\nTraining shaped by coaches who work with active boxers.",
    programsHeading: "What you can train",
    programsText:
      "Pick a discipline, or let your coach build the session around your goals.",
    environmentHeading: "A real gym, not a showroom",
    environmentText:
      "A spacious training floor in Mactan with coaches who stay hands-on through every round. Visitors describe it as welcoming, knowledgeable and beginner friendly.",
    proofHeading: "What members say",
    proofText:
      "Rated 5.0 from 12 public reviews — from first-timers to travelling fighters.",
    ctaHeading: "Your first session starts with a message",
    ctaText:
      "Tell us your experience level and when you want to train. We will take it from there.",
  },
  about: {
    headline: "A boxing gym built around coaching",
    lead:
      "Knock'ls Boxing Gym is a boxing and Muay Thai gym in Mactan, Cebu — training beginners, families and competitive boxers side by side.",
    body:
      "The gym opened its doors in Mactan with one focus: real coaching, at any level. Visitors train one-on-one or in small sessions with coaches who stay involved through every round — correcting, encouraging and building technique from the ground up.\n\nPublic reviews describe the same experience from different angles: trainers who are friendly and knowledgeable, a welcoming atmosphere for absolute beginners, private sessions that are carefully planned, and coaches who also prepare fighters who compete.\n\nWhether you are in Cebu for a week or looking for a gym to train in long-term, you are training in the same room, with the same coaches, as the fighters who call Knock'ls home.",
    values:
      "Coaching first\nEvery session is led — you are never left to figure it out alone.\nEveryone starts somewhere\nBeginners are the norm here, not an exception.\nShow up, improve\nConsistency beats intensity. We build habits you can keep.",
  },
  firstVisit: {
    headline: "What happens when you visit",
    intro:
      "Walking into a boxing gym for the first time is the hardest part. Here is exactly how it goes at Knock'ls.",
    steps:
      "Message the gym\nSend us a Messenger message or fill in the trial form. Tell us if you have trained before — most people have not.\nPick a time\nWe will confirm a session that fits the gym's opening hours and your schedule.\nMeet your coach\nYour coach talks through your goals and experience before anything starts.\nLearn the basics\nStance, guard, footwork and punches — taught slowly, then built up.\nTrain\nRounds on the pads, bags and conditioning, at a pace that suits you.\nDecide\nAfter the session, ask about schedules and rates. No pressure either way.",
    closing:
      "Still unsure? Message us — a short conversation before you visit costs nothing.",
  },
  trial: {
    label: "Book a trial session",
    headline: "Book your first session",
    intro:
      "Send your details and the gym will get back to you on Messenger or phone to confirm your session.",
    successMessage:
      "Request received. The gym will contact you to confirm your session — keep an eye on your phone and Messenger.",
  },
  seo: {
    titleTemplate: "%s · Knock'ls Boxing Gym",
    description:
      "Boxing and Muay Thai gym in Mactan, Cebu. Beginner-friendly coaching, private training and sessions for visiting fighters. Book a trial session today.",
    keywords:
      "boxing gym Mactan, boxing gym Cebu, boxing classes Lapu-Lapu, Muay Thai Mactan, boxing training Cebu, gym near me Mactan",
    ogTitle: "Knock'ls Boxing Gym — Boxing & Muay Thai in Mactan, Cebu",
    ogDescription:
      "Train boxing and Muay Thai in Mactan, Cebu. Beginner friendly, private sessions, real coaching. Book a trial session.",
  },
  announcement: {
    enabled: false,
    text: "",
    linkLabel: "",
    linkHref: "",
  },
};

export const DEFAULT_COLLECTIONS: Record<CollectionKey, unknown[]> = {
  programs: [
    {
      name: "Boxing Training",
      slug: "boxing",
      summary:
        "Learn boxing properly — stance, footwork, guard and punches, built into combinations and rounds on the pads and bags.",
      level: "All levels",
      whoFor:
        "First-timers, regular members and travellers who want to train while in Cebu.",
      learns:
        "Stance, guard and footwork\nThe core punches: jab, cross, hook, uppercut\nCombinations on the pads\nBag rounds and timing\nConditioning that boxing demands",
      experience: "No experience required to start.",
      focus:
        "Sessions mix technique, pad work, bag rounds and conditioning — the exact structure depends on your coach and your level.",
    },
    {
      name: "Muay Thai",
      slug: "muay-thai",
      summary:
        "Muay Thai training with hands-on coaching — technique, rounds and conditioning, from first-timer to active practitioner.",
      level: "All levels",
      whoFor:
        "Anyone wanting to learn Muay Thai, including visitors training for a few sessions.",
      learns:
        "Stance and movement\nPunches, kicks, knees and elbows\nPad work with your coach\nDefence and timing\nRounds and conditioning",
      experience: "Beginners welcome.",
      focus:
        "Coach-led rounds with pads and bags, with corrections given as you go.",
    },
    {
      name: "Private Training",
      slug: "private-training",
      summary:
        "One-on-one sessions with a coach — the fastest way to improve, whether you are starting out or preparing to compete.",
      level: "By arrangement",
      whoFor:
        "People who want focused attention, flexible timing, or specific goals.",
      learns:
        "A session planned around your goals\nIndividual technical correction\nA pace set for you\nProgress you can measure\nBoxing or Muay Thai, your choice",
      experience: "Suitable from complete beginner upward.",
      focus:
        "Private lessons are scheduled directly with the gym — message us to arrange your first one.",
    },
    {
      name: "First-Timers",
      slug: "first-timers",
      summary:
        "Never boxed before? This is your entry point — the basics taught slowly, in a gym visitors describe as welcoming and beginner friendly.",
      level: "Beginner",
      whoFor: "Anyone nervous about their first session in a boxing gym.",
      learns:
        "How to stand and move safely\nHow to hold your guard\nBasic punches and combinations\nHow a training session works\nConfidence for your next visit",
      experience: "Zero experience expected.",
      focus:
        "No sparring, no pressure — just coaching at a pace that suits you.",
    },
  ],
  coaches: [],
  schedule: [],
  plans: [
    {
      name: "Trial Session",
      price: "",
      period: "",
      note: "Your first session — ask us how it works this week.",
      features:
        "Meet your coach\nTalk through your goals\nTry a real training session",
      highlight: true,
      cta: "Ask about a trial",
    },
    {
      name: "Membership",
      price: "",
      period: "per month",
      note: "Monthly membership rates — message us for current pricing.",
      features:
        "Train on the gym's schedule\nBoxing or Muay Thai sessions\nAsk about family and multi-month rates",
      highlight: false,
      cta: "Get current rates",
    },
    {
      name: "Private Coaching",
      price: "",
      period: "per session",
      note: "One-on-one training, priced by session — message us for rates.",
      features:
        "One-on-one with a coach\nYour pace and your goals\nBoxing or Muay Thai",
      highlight: false,
      cta: "Ask about private training",
    },
  ],
  testimonials: [
    {
      quote:
        "Very professional and friendly trainer, highly recommended! I really learned a lot — I guess I gotta work on my cardio lol.",
      author: "",
      source: "Public review",
      date: "2025-12-14",
      rating: 5,
    },
    {
      quote:
        "Kävin täällä pari kertaa (yksityistunnilla) treenaamassa thaiboxingia. Treenit oli hyvin mietitty ja ohjaaja oli koko ajan mukana kannustamassa. Sain häneltä myös hyviä vinkkejä tekniikkaan. Vahva suositus!",
      author: "",
      source: "Public review",
      date: "2025-03-05",
      rating: 5,
    },
    {
      quote:
        "Overall the experience was very enjoyable!! Beginner friendly and very welcoming. Trainers are very nice and the owner was very kind too.",
      author: "",
      source: "Public review",
      date: "2025-01-13",
      rating: 5,
    },
    {
      quote:
        "Nice trainer!! I went there with my son and had training together. It became part of good memory in Cebu.",
      author: "",
      source: "Public review",
      date: "2025-01-02",
      rating: 5,
    },
    {
      quote: "Owner is very passionate and fighting. They train professional boxers.",
      author: "",
      source: "Public review",
      date: "2024-09-13",
      rating: 5,
    },
    {
      quote: "The best of the best.",
      author: "",
      source: "Public review",
      date: "2024-08-28",
      rating: 5,
    },
    {
      quote:
        "Nice and spacious new gym. Trainers are friendly and knowledgeable. My wife and I did Muay Thai training. Entrance is at the B'Cebu gate.",
      author: "",
      source: "Public review",
      date: "2024-01-18",
      rating: 5,
    },
  ],
  faqs: [
    {
      question: "Do I need boxing experience?",
      answer:
        "No. Public reviews from real visitors describe the gym as beginner friendly and very welcoming — you will be coached from the basics.",
      group: "Training",
    },
    {
      question: "What should I wear?",
      answer:
        "Comfortable training clothes you can move in, plus clean indoor shoes. If you are unsure, message us before you come.",
      group: "Your first session",
    },
    {
      question: "Do I need my own gloves?",
      answer:
        "Message us before your first session and we will tell you exactly what gear to bring and what you can use at the gym.",
      group: "Your first session",
    },
    {
      question: "What happens during my first session?",
      answer:
        "You meet your coach, talk through your goals, then work through the basics — stance, guard, footwork and punches — before training rounds. See the First Visit page for the full walk-through.",
      group: "Your first session",
    },
    {
      question: "How much does training cost?",
      answer:
        "Message us for current rates. Membership and session prices are sent directly so you always get the latest figures.",
      group: "Membership",
    },
    {
      question: "Do you offer personal training?",
      answer:
        "Yes. Private, one-on-one coaching is available in boxing and Muay Thai — visitors have trained here on private lessons and reported carefully planned sessions.",
      group: "Training",
    },
    {
      question: "What age groups can train?",
      answer:
        "Message us with your age and we will confirm what is suitable. Visitors have trained here together with their children, so family sessions are possible.",
      group: "Training",
    },
    {
      question: "What are your opening hours?",
      answer:
        "Monday to Friday 1:00 PM – 8:15 PM, Saturday 1:00 PM – 8:00 PM, Sunday closed. Message us to confirm before you travel.",
      group: "Visit",
    },
    {
      question: "Where is the gym?",
      answer:
        "Unit 109, B'Cebu Academy, Bldg. B, Kasinto, Mactan, Cebu 6015, Philippines. Entrance is at the B'Cebu gate. A map is on the Contact page.",
      group: "Visit",
    },
    {
      question: "How do I start?",
      answer:
        "Tap Book a Trial, fill in the form, or message the gym on Messenger. We will confirm a session and take it from there.",
      group: "Visit",
    },
  ],
  gallery: [],
};

export const SEEDABLE_COLLECTIONS: CollectionKey[] = [
  "programs",
  "plans",
  "testimonials",
  "faqs",
];
