import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { JotaiProvider } from "@/components/providers/JotaiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prediction Market - Trade on Future Events",
  description: "A decentralized prediction market platform where users trade on event outcomes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <JotaiProvider>
          <div className="min-h-screen bg-gray-950">
            <Header />
            <main>{children}</main>
          </div>
        </JotaiProvider>
      </body>
    </html>
  );
}
