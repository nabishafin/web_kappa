export interface LegalDoc {
  slug: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}

export const legalDocs: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms of Use",
    updated: "2026-09-01",
    sections: [
      { heading: "1. Accepting these terms", body: ["By creating an account or streaming on Channel Infinity you agree to these Terms of Use. If you do not agree, please do not use the service."] },
      { heading: "2. Your account", body: ["You are responsible for keeping your credentials secure and for all activity under your account. You must be at least 13 years old, or the minimum age required in your country, to create an account."] },
      {
        heading: "3. Subscriptions & billing",
        body: [
          "Premium is billed monthly until cancelled. You can cancel at any time from Settings → Subscription; access continues until the end of the current billing period.",
          "TipJar donations are voluntary, one-time payments to creators and are non-refundable except where required by law.",
        ],
      },
      { heading: "4. Content & creators", body: ["All animations remain the property of their creators. You may stream titles for personal, non-commercial use only. Downloading, re-uploading or redistributing content is prohibited."] },
      { heading: "5. Community conduct", body: ["Don’t harass creators or other members, post unlawful content, or attempt to disrupt the platform. We may suspend accounts that violate these rules."] },
      { heading: "6. Changes", body: ["We may update these terms from time to time. We’ll notify you of material changes by email or in-app before they take effect."] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "2026-09-01",
    sections: [
      { heading: "What we collect", body: ["Account details (name, email, avatar), viewing activity (watch history, ratings, watchlist) and payment records processed by our payments partner."] },
      { heading: "How we use it", body: ["To run the service, personalise recommendations, pay creators their revenue share, prevent fraud and — with your consent — send product updates."] },
      { heading: "Sharing", body: ["We never sell your personal data. Creators see aggregate, anonymised analytics only. Service providers process data on our behalf under strict contracts."] },
      { heading: "Your rights", body: ["You can access, export, correct or delete your data at any time from Settings or by contacting privacy@channelinfinity.com."] },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    updated: "2026-09-01",
    sections: [
      { heading: "Essential cookies", body: ["Required to keep you signed in and remember playback preferences. These cannot be switched off."] },
      { heading: "Analytics cookies", body: ["Help us understand how the platform is used so we can improve it. They are only set with your consent."] },
      { heading: "Managing cookies", body: ["You can change your choices at any time from your browser settings."] },
    ],
  },
  {
    slug: "content-guidelines",
    title: "Content Submission Rules",
    updated: "2026-09-01",
    sections: [
      { heading: "Eligibility", body: ["Submissions must be original animated works that you own or have the rights to distribute. Short films, pilots and full series are all welcome."] },
      { heading: "Technical requirements", body: ["Minimum 1080p resolution (4K preferred), H.264/H.265 or ProRes, stereo or 5.1 audio. Maximum 100 MB per uploaded file; share larger files via a drive link."] },
      { heading: "Content standards", body: ["Content must carry an accurate rating and content warnings. Hateful, exploitative or illegal content will be rejected."] },
      { heading: "Review process", body: ["Our team reviews every submission within 10 business days and will contact you by email with next steps."] },
    ],
  },
];
