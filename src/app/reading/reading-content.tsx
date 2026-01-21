"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReadingCategory, ReadingArticle } from "@/types/reading";

interface ReadingPageContentProps {
  categories: ReadingCategory[];
  articles: ReadingArticle[];
  selectedCategory: string;
}

export function ReadingPageContent({
  categories,
  articles,
  selectedCategory,
}: ReadingPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);

  const handleCategoryChange = (value: string) => {
    setPendingCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    startTransition(() => {
      router.push(`/reading${params.toString() ? `?${params.toString()}` : ""}`);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8 pt-6">
      {/* Category Tabs */}
      <div className="overflow-x-auto mb-6 -mx-4 px-4">
        <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="h-auto p-1 bg-muted/50 inline-flex w-max min-w-full md:min-w-0">
            <TabsTrigger
              value="all"
              className="px-4 py-2 text-sm cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              All
              {isPending && pendingCategory === "all" && (
                <Loader2 className="ml-1.5 h-3.5 w-3.5 animate-spin" />
              )}
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.slug}
                className={`px-4 py-2 text-sm whitespace-nowrap cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm ${
                  category.is_special ? "font-semibold" : ""
                }`}
              >
                {category.name}
                {isPending && pendingCategory === category.slug && (
                  <Loader2 className="ml-1.5 h-3.5 w-3.5 animate-spin" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Articles Grid */}
      {isPending ? (
        <ArticlesGridSkeleton />
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No articles found for this category.</p>
          <Button variant="link" onClick={() => handleCategoryChange("all")} className="mt-2">
            View all articles
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: ReadingArticle }) {
  const categorySlug = article.reading_categories?.slug || "general";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="aspect-[4/3] overflow-hidden relative bg-muted">
        <Image
          src={
            article.image_url ||
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop"
          }
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-snug min-h-[2.75rem]">
            {article.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
            {article.reading_categories?.name || "General"}
          </span>
          {article.word_count && (
            <span className="text-xs text-muted-foreground">{article.word_count} words</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/reading/${categorySlug}/${article.id}`} className="w-full">
          <Button className="w-full cursor-pointer">Read</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <CardContent className="p-4">
        <div className="mb-2">
          <Skeleton className="h-5 w-full mb-1" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

function ArticlesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[...Array(6)].map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
