import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeBoard - AI Text Styler",
  description: "Transform your text into aesthetic Unicode styles for social media",
  keywords: ["text styler", "unicode", "fonts", "aesthetic", "social media"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
