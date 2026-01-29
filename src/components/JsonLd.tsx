interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  description?: string;
}

export function OrganizationJsonLd({
  name = "Learne",
  url = "https://learne.org",
  description = "English learning platform for grammar practice, reading, and IELTS preparation",
}: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    description,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebSiteJsonLdProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebSiteJsonLd({
  name = "Learne",
  url = "https://learne.org",
  description = "Practice speaking, reading, and testing in one place. Track your progress, build streaks, and achieve your language learning goals.",
}: WebSiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/grammar?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  author = "Learne",
}: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: imageUrl,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Learne",
      url: "https://learne.org",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface EducationalContentJsonLdProps {
  name: string;
  description: string;
  url: string;
  educationalLevel?: string;
  learningResourceType?: string;
  about?: string;
}

export function EducationalContentJsonLd({
  name,
  description,
  url,
  educationalLevel,
  learningResourceType = "Quiz",
  about = "English Grammar",
}: EducationalContentJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name,
    description,
    url,
    educationalLevel,
    learningResourceType,
    about: {
      "@type": "Thing",
      name: about,
    },
    provider: {
      "@type": "Organization",
      name: "Learne",
      url: "https://learne.org",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQJsonLdProps {
  items: FAQItem[];
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface VideoJsonLdProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string; // ISO 8601 format (e.g., "PT10M30S")
  educationalLevel?: string;
}

export function VideoJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
  educationalLevel,
}: VideoJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
  };

  if (uploadDate) jsonLd.uploadDate = uploadDate;
  if (contentUrl) jsonLd.contentUrl = contentUrl;
  if (embedUrl) jsonLd.embedUrl = embedUrl;
  if (duration) jsonLd.duration = duration;

  if (educationalLevel) {
    jsonLd.educationalLevel = educationalLevel;
    jsonLd.learningResourceType = "Video";
    jsonLd.about = {
      "@type": "Thing",
      name: "English Language Learning",
    };
  }

  jsonLd.provider = {
    "@type": "Organization",
    name: "Learne",
    url: "https://learne.org",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ItemListJsonLdProps {
  name: string;
  description: string;
  items: {
    name: string;
    url: string;
    thumbnailUrl?: string;
    description?: string;
  }[];
}

export function ItemListJsonLd({ name, description, items }: ItemListJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoObject",
        name: item.name,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        description: item.description,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
