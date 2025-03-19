import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js App with shadcn UI",
  description: "A simple Next.js application using shadcn UI components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-gray-200">
          <div className="container mx-auto flex items-center justify-between p-4">
            <Link href="/" className="font-bold text-xl">
              Next.js App
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    href="/" 
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Tasks
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/leads" 
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Leads
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
