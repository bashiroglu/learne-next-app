import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Learne</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="https://app.learne.org/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="https://app.learne.org/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
