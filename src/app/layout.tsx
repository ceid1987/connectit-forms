import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ConnectIT Survey",
  description: "Customer Satisfaction Survey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Fixed Header with Logo */}
        <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xs shadow-sm border-b border-gray-200 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center">
              <img 
                src="/cit-logo.png" 
                alt="ConnectIT Logo" 
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </div>
        </header>
        
        {/* Main Content with top padding to account for fixed header */}
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
