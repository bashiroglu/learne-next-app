"use client";

import Link from "next/link";
import { BlogCategory } from "@/types/blog";
import {
  BookText,
  GraduationCap,
  Languages,
  BookOpen,
  PenLine,
  Headphones,
  ChevronRight,
} from "lucide-react";

const icons: Record<string, React.ReactNode> = {
  BookText: <BookText className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  Languages: <Languages className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
  PenLine: <PenLine className="h-6 w-6" />,
  Headphones: <Headphones className="h-6 w-6" />,
};

const colorClasses: Record<string, { bg: string; icon: string; hover: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/50",
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    hover: "hover:border-blue-200 dark:hover:border-blue-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/50",
    icon: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    hover: "hover:border-green-200 dark:hover:border-green-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/50",
    icon: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
    hover: "hover:border-purple-200 dark:hover:border-purple-800",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/50",
    icon: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
    hover: "hover:border-orange-200 dark:hover:border-orange-800",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/50",
    icon: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400",
    hover: "hover:border-pink-200 dark:hover:border-pink-800",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/50",
    icon: "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400",
    hover: "hover:border-teal-200 dark:hover:border-teal-800",
  },
};

export function CategoryGrid({ categories }: { categories: BlogCategory[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {categories.map((cat) => {
        const colors = colorClasses[cat.color] || colorClasses.blue;
        return (
          <Link
            key={cat.id}
            href={`/blog/${cat.slug}`}
            className={`group flex flex-col items-center gap-3 rounded-xl border border-transparent p-5 text-center transition-all duration-200 ${colors.bg} ${colors.hover}`}
          >
            <div className={`rounded-xl p-3 transition-transform group-hover:scale-110 ${colors.icon}`}>
              {icons[cat.icon]}
            </div>
            <div>
              <span className="font-semibold text-foreground">{cat.name}</span>
              <div className="mt-1 flex items-center justify-center gap-0.5 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                Browse
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
