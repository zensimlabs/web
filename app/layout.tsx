import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zensimlabs.com"),
  title: "zensim — a deterministic simulator for STM32 firmware",
  description:
    "Boot the same firmware you flash on the board, drive its console from a script, assert on what it prints, and get the same result every time. 146 STM32 profiles, 23 boards, one binary.",
  openGraph: {
    title: "zensim — a deterministic simulator for STM32 firmware",
    description:
      "Boot the same firmware you flash on the board, drive its console from a script, and get the same result every time.",
    url: "https://zensimlabs.com",
    siteName: "Zensim Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "zensim — a deterministic simulator for STM32 firmware",
    description:
      "146 STM32 profiles, 23 boards, 235 scenarios. One binary, no emulator, no JIT.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
