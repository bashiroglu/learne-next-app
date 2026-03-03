import { Metadata } from "next";
import { SpeakingQuestionsContent } from "./speaking-questions-content";
import { part1Topics, part2And3Topics } from "./speaking-data";

export const metadata: Metadata = {
  title: "IELTS Speaking Questions 2026 - Latest Real Test Questions & Answers | Learne",
  description:
    "Practice with the latest IELTS Speaking test questions from January-April 2026. Real exam questions with band 9 sample answers for Part 1, Part 2, and Part 3. Updated weekly with new topics.",
  keywords: [
    "IELTS speaking questions 2026",
    "IELTS speaking test 2026",
    "latest IELTS speaking topics",
    "IELTS speaking real test questions",
    "IELTS Part 1 questions 2026",
    "IELTS Part 2 cue cards 2026",
    "IELTS Part 3 discussion 2026",
    "IELTS speaking sample answers",
    "IELTS speaking recent questions",
    "IELTS band 9 speaking answers",
    "IELTS speaking forecast 2026",
    "IELTS speaking topics January 2026",
  ],
  openGraph: {
    title: "IELTS Speaking Questions 2026 - Latest Real Test Questions & Answers",
    description:
      "Practice with the latest IELTS Speaking test questions from 2026. Real exam questions with band 9 sample answers for all 3 parts. Updated weekly.",
    type: "website",
    url: "https://learne.org/speaking-questions",
  },
  alternates: {
    canonical: "https://learne.org/speaking-questions",
  },
};

// Generate FAQ structured data from speaking questions
function generateFAQSchema() {
  const faqItems: { question: string; answer: string }[] = [];

  // Add Part 1 questions with answers
  Object.values(part1Topics).forEach((questions) => {
    questions.forEach((item) => {
      if (item.answer && item.answer.trim()) {
        faqItems.push({
          question: `IELTS Speaking 2026 Part 1: ${item.question}`,
          answer: item.answer.replace(/<\/?u>/g, ''),
        });
      }
    });
  });

  // Add Part 2 & 3 combined topics
  part2And3Topics.forEach((topic) => {
    // Add Part 2 question
    if (topic.answer && topic.answer.trim()) {
      const pointsList = topic.points.join(", ");
      faqItems.push({
        question: `IELTS Speaking 2026 Part 2: ${topic.title}`,
        answer: `You should say: ${pointsList}. Sample answer: ${topic.answer.replace(/<\/?u>/g, '')}`,
      });
    }

    // Add Part 3 questions
    topic.part3Questions.forEach((q) => {
      if (q.answer && q.answer.trim()) {
        faqItems.push({
          question: `IELTS Speaking 2026 Part 3: ${q.question}`,
          answer: q.answer.replace(/<\/?u>/g, ''),
        });
      }
    });
  });

  // Limit to top 50 FAQs for reasonable schema size
  const limitedFaqs = faqItems.slice(0, 50);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: limitedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Generate Course structured data
function generateCourseSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "IELTS Speaking Questions 2026 - Latest Real Test Questions",
    description:
      "Practice with the latest IELTS Speaking test questions from January-April 2026. Real exam questions with band 9 sample answers for Part 1, Part 2, and Part 3.",
    provider: {
      "@type": "Organization",
      name: "Learne",
      url: "https://learne.org",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT2H",
    },
    about: [
      "IELTS Speaking Test 2026",
      "IELTS Real Test Questions",
      "English Language Proficiency",
    ],
    teaches: [
      "IELTS Speaking Part 1 techniques",
      "IELTS Cue Card responses",
      "IELTS Discussion skills",
      "Band 9 speaking strategies",
    ],
    isAccessibleForFree: true,
    inLanguage: "en",
  };
}

// Generate BreadcrumbList structured data
function generateBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://learne.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "IELTS Speaking Questions 2026",
        item: "https://learne.org/speaking-questions",
      },
    ],
  };
}

export default function SpeakingQuestionsPage() {
  const faqSchema = generateFAQSchema();
  const courseSchema = generateCourseSchema();
  const breadcrumbSchema = generateBreadcrumbSchema();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SpeakingQuestionsContent />
    </>
  );
}
