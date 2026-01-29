import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { BookOpen, TrendingUp, Award, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Learne - Your Journey to English Fluency",
  description:
    "Practice speaking, reading, and testing in one place. Track your progress, build streaks, and achieve your language learning goals.",
  alternates: {
    canonical: "https://learne.org",
  },
  openGraph: {
    title: "Learne - Your Journey to English Fluency",
    description:
      "Practice speaking, reading, and testing in one place. Track your progress, build streaks, and achieve your language learning goals.",
    url: "https://learne.org",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learne - Your Journey to English Fluency",
    description:
      "Practice speaking, reading, and testing in one place. Track your progress, build streaks, and achieve your language learning goals.",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Master English with Confidence</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Journey to
            <span className="block text-primary">
              English Fluency
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Practice speaking, reading, and testing in one place. Track your progress, build streaks, and achieve your language learning goals.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="https://app.learne.org/signup">
              <Button size="lg" className="text-lg px-8">
                Start Learning Free
              </Button>
            </Link>
            <Link href="https://app.learne.org/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border/50 rounded-xl p-8 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Multiple Practice Areas
            </h3>
            <p className="text-muted-foreground">
              Access speaking, reading, and testing exercises all in one platform. Practice as much as you want.
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-8 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Track Your Progress
            </h3>
            <p className="text-muted-foreground">
              View your learning history, review mistakes, and see your improvement over time with detailed statistics.
            </p>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-8 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Build Streaks
            </h3>
            <p className="text-muted-foreground">
              Stay motivated with daily streaks and smart reminders to review items using spaced repetition.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students improving their English every day
          </p>
          <Link href="https://app.learne.org/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
