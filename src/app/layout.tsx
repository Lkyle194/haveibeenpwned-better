import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LeakRoast — CyberPwned",
  description:
    "Vérifie si ton email ou ton mot de passe a été exposé dans une fuite de données. 100% privé, k-anonymity, zéro base de données. Score Cyber Karma + roasts + carte de partage.",
  keywords: [
    "breach check",
    "pwned",
    "data leak",
    "password check",
    "have i been pwned",
    "cybersecurity",
  ],
  openGraph: {
    title: "LeakRoast — CyberPwned",
    description:
      "Ton email a-t-il été pwné ? Score Cyber Karma, roasts et carte de partage. 100% privé.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scanlines`}
      >
        <div className="cyber-bg" aria-hidden />
        <div className="cyber-grid" aria-hidden />
        {children}
      </body>
    </html>
  );
}
