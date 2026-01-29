import { Metadata } from "next";
import { FAQJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "IELTS Score Calculator - Calculate Your Band Score",
  description:
    "Free IELTS band score calculator. Convert your raw Listening and Reading scores to band scores, and calculate your overall IELTS band score instantly.",
  keywords: [
    "IELTS calculator",
    "IELTS band score",
    "IELTS score converter",
    "IELTS listening score",
    "IELTS reading score",
    "IELTS overall band",
    "IELTS academic",
    "IELTS general training",
  ],
  alternates: {
    canonical: "https://learne.org/ielts-calculator",
  },
  openGraph: {
    title: "IELTS Score Calculator - Calculate Your Band Score",
    description:
      "Free IELTS band score calculator. Convert your raw scores to band scores and calculate your overall IELTS band score instantly.",
    url: "https://learne.org/ielts-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IELTS Score Calculator - Calculate Your Band Score",
    description:
      "Free IELTS band score calculator. Convert your raw scores to band scores and calculate your overall IELTS band score instantly.",
  },
};

const faqItems = [
  {
    question: "How is the IELTS overall band score calculated?",
    answer:
      "The overall IELTS band score is calculated by averaging your scores in Listening, Reading, Writing, and Speaking, then rounding to the nearest 0.5 band.",
  },
  {
    question: "What is the difference between IELTS Academic and General Training?",
    answer:
      "IELTS Academic is designed for higher education or professional registration, while IELTS General Training is for migration to English-speaking countries or secondary education. The Reading and Writing sections differ between the two tests.",
  },
  {
    question: "How many correct answers do I need for band 7 in Listening?",
    answer:
      "For IELTS Listening, you typically need 30-31 correct answers out of 40 to achieve band 7.",
  },
  {
    question: "What is the IELTS band score scale?",
    answer:
      "IELTS uses a 9-band scale from 1 (non-user) to 9 (expert user). Each band represents a level of English proficiency, with 0.5 increments between whole bands.",
  },
];

const breadcrumbItems = [
  { name: "Home", url: "https://learne.org" },
  { name: "IELTS Calculator", url: "https://learne.org/ielts-calculator" },
];

export default function IELTSCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQJsonLd items={faqItems} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {children}
    </>
  );
}
