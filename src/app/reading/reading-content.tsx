"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReadingCategory, ReadingArticle } from "@/types/reading";

const LIMIT_OPTIONS = [
  { value: "9", label: "9 per page" },
  { value: "18", label: "18 per page" },
  { value: "27", label: "27 per page" },
  { value: "36", label: "36 per page" },
];

interface ReadingPageContentProps {
  categories: ReadingCategory[];
  articles: ReadingArticle[];
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

export function ReadingPageContent({
  categories,
  articles,
  selectedCategory,
  currentPage,
  totalPages,
  totalCount,
  limit,
}: ReadingPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [pendingPage, setPendingPage] = useState<number | null>(null);

  const buildUrl = (params: URLSearchParams) => {
    return `/reading${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const handleCategoryChange = (value: string) => {
    setPendingCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    // Reset to page 1 when category changes
    params.delete("page");
    startTransition(() => {
      router.push(buildUrl(params));
    });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setPendingPage(page);
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    startTransition(() => {
      router.push(buildUrl(params));
    });
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newLimit === "9") {
      params.delete("limit");
    } else {
      params.set("limit", newLimit);
    }
    // Reset to page 1 when limit changes
    params.delete("page");
    startTransition(() => {
      router.push(buildUrl(params));
    });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5; // Max number of page buttons to show

    if (totalPages <= showPages + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Results info and limit selector */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Showing {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, totalCount)} of {totalCount} articles
                </span>
                <Select value={String(limit)} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LIMIT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-1">
                {/* First page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || isPending}
                  title="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isPending}
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 mx-2">
                  {getPageNumbers().map((page, index) =>
                    page === "ellipsis" ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handlePageChange(page)}
                        disabled={isPending}
                      >
                        {pendingPage === page && isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          page
                        )}
                      </Button>
                    )
                  )}
                </div>

                {/* Next page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isPending}
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last page */}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || isPending}
                  title="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
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
        <Link href={`/reading/${categorySlug}/${article.slug}`} className="w-full">
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
