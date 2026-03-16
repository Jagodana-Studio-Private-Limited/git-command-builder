export const siteConfig = {
  name: "Git Command Builder",
  title: "Git Command Builder - Visual Git Command Generator",
  description:
    "Build complex git commands visually. Select operations, configure flags, and copy the perfect git command. No more memorizing git syntax.",
  url: "https://git-command-builder.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "GitBranch",
  brandAccentColor: "#f97316",

  keywords: [
    "git command builder",
    "git command generator",
    "git cheat sheet",
    "visual git tool",
    "git flags",
    "git options",
    "git helper",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#ea580c",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/git-command-builder",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "Git Command Builder helps developers construct complex git commands visually — no memorization required. Pick an operation, toggle flags, fill in values, and copy the result.",
    featuresTitle: "Features",
    features: [
      "15+ git operations supported",
      "Real-time command preview",
      "One-click copy to clipboard",
      "100% client-side — no data leaves your browser",
    ],
  },

  hero: {
    badge: "Build Git Commands Visually",
    titleLine1: "Never Memorize",
    titleGradient: "Git Commands Again",
    subtitle:
      "Select an operation, configure options with checkboxes and inputs, and get the perfect git command — ready to copy and paste into your terminal.",
  },

  featureCards: [
    {
      icon: "🧩",
      title: "Visual Flag Builder",
      description:
        "Toggle flags and fill inputs instead of reading man pages. Every option is explained inline.",
    },
    {
      icon: "⚡",
      title: "Real-Time Preview",
      description:
        "Watch the command update live as you change options. What you see is what you paste.",
    },
    {
      icon: "📋",
      title: "One-Click Copy",
      description:
        "Copy the final command to your clipboard instantly. Paste it straight into your terminal.",
    },
  ],

  relatedTools: [
    {
      name: "Regex Playground",
      url: "https://regex-playground.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "JSON Formatter",
      url: "https://json-formatter.jagodana.com",
      icon: "📄",
      description: "Format and validate JSON with syntax highlighting.",
    },
    {
      name: "Cron Expression Visualizer",
      url: "https://cron-expression-visualizer.jagodana.com",
      icon: "⏰",
      description: "Build and visualize cron schedules with plain-English output.",
    },
    {
      name: "Chmod Calculator",
      url: "https://tool-chmod-calculator.jagodana.com",
      icon: "🔐",
      description: "Calculate Unix file permissions visually.",
    },
    {
      name: "Hash Generator",
      url: "https://hash-generator.jagodana.com",
      icon: "🔑",
      description: "Generate MD5, SHA-1, SHA-256, and more from any text.",
    },
    {
      name: "Diff Forge",
      url: "https://diff-forge.jagodana.com",
      icon: "🔀",
      description: "Compare text side-by-side with highlighted differences.",
    },
  ],

  howToSteps: [
    {
      name: "Choose an operation",
      text: "Pick a git command like commit, branch, merge, rebase, stash, reset, or any of the 15+ supported operations.",
      url: "",
    },
    {
      name: "Configure options",
      text: "Toggle flags with checkboxes and fill in values like branch names, commit messages, or file paths using the interactive form.",
      url: "",
    },
    {
      name: "Copy and run",
      text: "Click the copy button to grab the fully-formed git command, then paste it into your terminal.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "How many git commands does this tool support?",
      answer:
        "Git Command Builder supports 15+ operations including commit, branch, checkout, merge, rebase, cherry-pick, stash, reset, log, diff, tag, clean, remote, fetch, and pull. Each operation comes with its most commonly used flags and options.",
    },
    {
      question: "Does this tool send my data to a server?",
      answer:
        "No. Git Command Builder runs 100% in your browser. Nothing is uploaded or stored anywhere. Your command inputs stay entirely on your device.",
    },
    {
      question: "Can I use this to learn git?",
      answer:
        "Absolutely. Each flag includes a short description of what it does, making this a great companion for learning git alongside the official documentation or tutorials.",
    },
    {
      question: "Is this free to use?",
      answer:
        "Yes, Git Command Builder is completely free with no sign-up required. It's part of the Jagodana 365 Tools Challenge — one free developer tool shipped every day.",
    },
  ],

  pages: {
    "/": {
      title: "Git Command Builder - Visual Git Command Generator",
      description:
        "Build complex git commands visually. Select operations, configure flags, and copy the perfect git command. No more memorizing git syntax.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
