import { MetadataRoute } from "next";
import { getAllTestIds } from "@/lib/grammar";
import { getAllArticleSlugs } from "@/lib/reading";
import { getAllGrammarVideoSlugs } from "@/lib/grammar-videos";
import { getAllListeningVideoSlugs } from "@/lib/listening";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://learne.org";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/grammar`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/grammar-videos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reading`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/listening`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ielts-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/writing-practice`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/speaking-questions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic grammar test pages
  const grammarTests = await getAllTestIds();
  const grammarPages: MetadataRoute.Sitemap = grammarTests.map((test) => ({
    url: `${baseUrl}/grammar/${test.topicSlug}/${test.testSlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic reading article pages
  const readingArticles = await getAllArticleSlugs();
  const readingPages: MetadataRoute.Sitemap = readingArticles.map((article) => ({
    url: `${baseUrl}/reading/${article.categorySlug}/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic grammar video pages
  const grammarVideoSlugs = await getAllGrammarVideoSlugs();
  const grammarVideoPages: MetadataRoute.Sitemap = grammarVideoSlugs.map((slug) => ({
    url: `${baseUrl}/grammar-videos/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic listening pages
  const listeningSlugs = await getAllListeningVideoSlugs();
  const listeningPages: MetadataRoute.Sitemap = listeningSlugs.map((slug) => ({
    url: `${baseUrl}/listening/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...grammarPages, ...readingPages, ...grammarVideoPages, ...listeningPages];
}
