export const CTA = {
  web: { label: "Try on Web", href: "/auth/?intent=web" },
  mobile: { label: "Get Mobile App", href: "/auth/?intent=mobile" },
};

const ASSET_BASE = "assets/landing/";

export const NAV_ITEMS = [
  // Sol panel başlıkları (birebir aynı olmak zorunda değil)
  // Önemli olan 1-9 numaralandırmanın tutması
  { n: 1, label: "WHAT IT IS" },
  { n: 2, label: "WHY WE EXIST" },
  { n: 3, label: "THE PROBLEM" },
  { n: 4, label: "OUR PRINCIPLES" },
  { n: 5, label: "THE SYSTEM" },
  { n: 6, label: "HOW IT WORKS" },
  { n: 7, label: "WHO IS IT FOR" },
  { n: 8, label: "PRIVACY" },
  { n: 9, label: "SUBSCRIPTION" },
];

export const SECTIONS = [
  {
    n: 1,
    image: `${ASSET_BASE}01-hero-what-it-is.webp`,
    title: "",
    text: `Newsery is built on a curation system designed to reduce noise.
Categories are filtered, balanced, and kept intentionally clean.
You choose what you read. You decide how much “noise” you let in.`,
    // İlk section altında orta panel CTA'ları göstermek için:
    showCenterCtas: true,
  },
  {
    n: 2,
    image: `${ASSET_BASE}02-who-we-are.webp`,
    title: "Who we are / Why we exist",
    text: `We’ve spent years in the news industry. And over time, our work kept bringing us back to the same questions:
How is “news” changing—today and in the years ahead?
What does it mean to people now? And why does staying informed so often feel heavy?
News is a real need. But in our era, it has also become an endless stream—designed to compete for attention, keep us scrolling, and quietly add stress to our day.
Newsery was born from a simple idea: news can be calmer—without losing what matters.
Not another endless feed. Not another algorithm deciding for you.
A personal system that reduces information noise, lowers mental load, and helps you read with clarity.
We’re still early in this journey, and we’ll keep refining Newsery step by step.
And honestly, we’re excited to build it with you—your ideas will help shape what Newsery becomes next.`,
  },
  {
    n: 3,
    image: `${ASSET_BASE}03-problem.webp`,
    title: "The problem",
    text: `Every day, millions of news are published. The real question isn’t “What happened?”—it’s what matters to you within that ocean of information.
Because a piece of news is only meaningful when it gives you something clear:
 1.  Does it help me in any way?
 2.  Does it change how I understand the world?
 3.  Does it help me make a decision—or simply give me clarity?
Newsery is built around a simple belief: news should serve your life, not compete for your attention.
In a single day, we see dozens of headlines and deeply read only a few. Every headline asks for a small decision: Is this worth it? Now or later? Is it reliable? How long is it? Will it ruin my mood?
Those micro-decisions add up: Decision fatigue (even choosing what to read becomes tiring)
Result: you spend more time on news, but gain less clarity and less satisfaction.`,
  },
  {
    n: 4,
    image: `${ASSET_BASE}04-principles.webp`,
    title: "Our Principles",
    text: `1) Meaning over volume. We don’t need more headlines, we need more relevance and context. A healthy news experience should reduce the effort required to find what matters, and increase the value you get from reading. Less noise. More signal. More clarity per minute.
2) Calm by design: Modern news products are often shaped by incentives that don’t match the reader’s well-being: irrelevant content, ad pressure, algorithmic bait, and endless feeds that keep pulling you “just one more scroll.” We design Newsery to move in the opposite direction: a news experience that doesn’t increase anxiety, doesn’t steal time, and doesn’t add mental load in the background. Not because news should be “soft” but because your attention should be respected.
3) Personal, because people are different: No two people live the same day. Different jobs, different interests, different sensitivities, different goals. So a one-size-fits-all feed can never truly fit. Newsery is built for personal control, so your news can reflect who you are, what you care about, and what you need from the world today.`,
  },
  {
    n: 5,
    image: `${ASSET_BASE}05-system.webp`,
    title: "Newsery News System",
    text: `Newsery is built on a structured news pipeline designed to turn a high-volume stream of content into a clean, reliable reading experience.
Every day, thousands of articles enter the system from a wide range of sources. From there, Newsery applies a multi-stage process that focuses on three outcomes: clarity, category integrity, and quality.
A structured filtering pipeline
Incoming content is first normalized and cleaned to remove inconsistencies and noise.
The system then identifies the core topic and context of each item, allowing it to be processed consistently across sources.
Strict categorization by design
Newsery is designed around clear category boundaries. Instead of blending unrelated topics into a single feed, content is separated into defined categories to protect category purity and reduce cross-topic noise.
Quality signals and reliability checks
Newsery applies quality-oriented checks to strengthen the final stream prioritizing clarity, relevance, and source reliability.
This helps reduce low-signal content and improves consistency across the reading experience.
The result: a cleaner source of news
What you receive is not a raw firehose. It’s a curated, structured news stream — organized and refined so you can stay informed with less friction, less noise, and more clarity.`,
  },
  {
    n: 6,
    image: `${ASSET_BASE}06-how-it-works.webp`,
    title: "Designed for Calm Control",
    text: `Newsery’s interface is built as a direct reflection of our philosophy: clarity over clutter, calm over noise, and control over endless feeds.
Every screen is designed to feel lightweight—easy to understand, quick to use, and never overwhelming.  The goal is simple: you should always know where you are, what you’re seeing, and why you’re seeing it.  A simple flow, built around your choices
 1)  Choose your categories Start by selecting the topics you actually care about. This becomes the foundation of your news experience.
 2)  Set your mix : Adjust the ratio between categories so your feed matches your day —more science, less politics, or any balance you prefer.
 3)  Save your feeds   : Once your mix feels right, save it as a feed. You can create different feeds for different moments —morning brief, evening news or weekend feed...
 4)  Open a feed and read with clarity : Each feed displays a focused set of up to 50 articles, so the experience stays finite and intentional—not endless.
 5)  Save and share what matters: When something is worth keeping, you can save it for later or share it instantly —without losing your place or your calm.`,
  },
  {
    n: 7,
    image: `${ASSET_BASE}07-who-is-it-for.webp`,
    title: "Who it’s for — and what you gain",
    text: `Newsery is for anyone who values their time and wants a news experience that is calm, high-quality, and genuinely useful.
If you’re tired of endless feeds, irrelevant headlines, and the feeling of “I spent time but gained nothing,” Newsery is made for you.
Busy professionals
You want to stay informed without losing an hour to scrolling. You need clarity fast and you want to choose what deserves your attention.
Founders, operators, and decision-makers
You rely on news to make sense of markets, technology, and the world. You don’t need noise—you need signal, structure, and consistency.
Curious readers who care about depth
You like reading, but you don’t want your attention fragmented. You want a calmer space to follow what you truly care about.
Students and lifelong learners
You’re building understanding over time. You want categories that stay clean, and a system you can return to every day.
What you gain with Newsery
Less mental load
You spend less energy deciding what to read and more time actually understanding.
More clarity per minute
You read with intention, not under pressure. The experience stays focused and finite.
A system you control
Your feed reflects your priorities—not an algorithm’s agenda.
A healthier relationship with the news
Staying informed stops feeling like a constant background stress.
Newsery doesn’t ask for more of your time.
It helps you get more value from the time you already choose to spend.`,
  },
  {
    n: 8,
    image: `${ASSET_BASE}08-privacy.webp`,
    title: "Privacy & Continuous Improvement",
    text: `Your privacy is fundamental to how Newsery is built.
Newsery does not collect personal usage data while you use the app.
The Share and Save functions operate on your device — we do not access or store that activity.
For subscriptions and account management, we securely store the email address you provide.
Your email is used only for account communication and subscription purposes — nothing more.
We also believe transparency applies to content itself.
Every article in Newsery clearly displays its source, and you can always access the original publication directly.
Our sources are filtered according to quality standards, and we continuously refine those standards over time.
Improvement is part of our system.
We are actively working on expanding categories, refining filters, and introducing new features to make the experience even clearer and more useful.
Your feedback plays an essential role in that process.
As we build Newsery for the long term, we’re genuinely excited to shape its future together with you.`,
  },
  {
    n: 9,
    image: `${ASSET_BASE}09-subscription.webp`,
    title: "Start Your Subscription",
    text: `You can use Newsery with full access to all features — on both web and mobile — free for 30 days.
To get started, simply click "Try on Web" or "Get Mobile App"
You'll be taken to a straightforward sign-up page.
Create your email and password, enter the verification code sent to your inbox, and once confirmed, your subscription will begin.
From that moment on, you can access Newsery across both platforms under the same subscription — your web and mobile experience stay connected within a single account.
The setup takes only a few minutes.
No complex forms. No unnecessary steps.
No credit card required. Cancel anytime.
Just a clean start to a calmer news experience.`,
  },
];

export const RIGHT_PANEL_IMAGE = `${ASSET_BASE}10-right-panel.png`;
