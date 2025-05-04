import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Roadmap Generator | Custom Learning Paths",
  description: "Generate personalized, goal-driven roadmaps for mastering skills in tech, programming, and more. Powered by AI.",
  keywords: ["Roadmap Generator", "AI Learning Paths", "Skill Development", "Next.js", "Tech Roadmaps"],
  authors: [{ name: "Mohit"}],
  creator: "Your Name",
  metadataBase: new URL("https://roadmap-generator-ten.vercel.app"),
  openGraph: {
    title: "AI Roadmap Generator",
    description: "Create tailored tech roadmaps based on your goals and skill level.",
    url: "https://roadmap-generator-ten.vercel.app/",
    siteName: "AI Roadmap Generator",
    images: [
      {
        url: "https://roadmap-generator-ten.vercel.app/",
        width: 1200,
        height: 630,
        alt: "AI Roadmap Generator Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
