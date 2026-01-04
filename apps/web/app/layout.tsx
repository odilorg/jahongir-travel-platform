import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jahongir Travel - Unforgettable Cultural Immersion in Uzbekistan",
  description: "Experience the authentic Silk Road treasures with Jahongir Travel. Discover Samarkand, Bukhara, Khiva and more with our expert-guided cultural tours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
