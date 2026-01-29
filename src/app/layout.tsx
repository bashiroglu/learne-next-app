import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://learne.org"),
  title: {
    default: "Learne - Your Journey to English Fluency",
    template: "%s | Learne",
  },
  description:
    "Practice speaking, reading, and testing in one place. Track your progress, build streaks, and achieve your language learning goals.",
  keywords: [
    "English learning",
    "grammar practice",
    "IELTS preparation",
    "English reading",
    "language learning",
    "English fluency",
    "grammar tests",
    "IELTS calculator",
  ],
  authors: [{ name: "Learne" }],
  creator: "Learne",
  publisher: "Learne",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://learne.org",
    siteName: "Learne",
    title: "Learne - Your Journey to English Fluency",
    description:
      "Practice speaking, reading, and testing in one place. Track your progress, build streaks, and achieve your language learning goals.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Learne - English Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learne - Your Journey to English Fluency",
    description:
      "Practice speaking, reading, and testing in one place. Track your progress, build streaks, and achieve your language learning goals.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} font-sans antialiased`}>
        <NextTopLoader
          color="hsl(var(--primary))"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
        />
        {children}
      </body>
    </html>
  );
}
