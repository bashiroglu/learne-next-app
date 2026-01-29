import { Metadata } from "next";
import { SpeakingQuestionsContent } from "./speaking-questions-content";
import { part1Topics, part2Topics, part3Topics } from "./speaking-data";

export const metadata: Metadata = {
  title: "IELTS Speaking Questions - Practice for All 3 Parts | Learne",
  description:
    "Master your IELTS speaking test with comprehensive practice questions for Part 1 (Introduction), Part 2 (Long Turn), and Part 3 (Discussion). Free sample answers included.",
  keywords: [
    "IELTS speaking questions",
    "IELTS speaking practice",
    "IELTS Part 1 questions",
    "IELTS Part 2 cue cards",
    "IELTS Part 3 discussion",
    "IELTS speaking test preparation",
    "IELTS speaking sample answers",
    "IELTS speaking topics",
    "IELTS interview questions",
    "IELTS band 7 speaking",
  ],
  openGraph: {
    title: "IELTS Speaking Questions - Practice for All 3 Parts | Learne",
    description:
      "Master your IELTS speaking test with comprehensive practice questions for Part 1, Part 2, and Part 3. Free sample answers included.",
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
          question: `IELTS Speaking Part 1: ${item.question}`,
          answer: item.answer,
        });
      }
    });
  });

  // Add Part 2 questions with answers
  Object.values(part2Topics).forEach((topics) => {
    topics.forEach((topic) => {
      if (topic.answer && topic.answer.trim()) {
        const pointsList = topic.points.join(", ");
        faqItems.push({
          question: `IELTS Speaking Part 2: ${topic.title}`,
          answer: `You should say: ${pointsList}. Sample answer: ${topic.answer}`,
        });
      }
    });
  });

  // Add Part 3 questions with answers
  Object.values(part3Topics).forEach((questions) => {
    questions.forEach((item) => {
      if (item.answer && item.answer.trim()) {
        faqItems.push({
          question: `IELTS Speaking Part 3: ${item.question}`,
          answer: item.answer,
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
    name: "IELTS Speaking Practice Questions",
    description:
      "Comprehensive IELTS speaking practice with questions and sample answers for Part 1 (Introduction), Part 2 (Long Turn/Cue Cards), and Part 3 (Discussion).",
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
      "IELTS Speaking Test",
      "English Language Proficiency",
      "Interview Skills",
    ],
    teaches: [
      "IELTS Speaking Part 1 techniques",
      "IELTS Cue Card responses",
      "IELTS Discussion skills",
      "English fluency",
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
        name: "IELTS Speaking Questions",
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
