import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";
// import { AuthButton } from "@/components/auth/AuthButton"; // Disabled until Supabase is configured

export const metadata: Metadata = {
  title: "Shinobi",
  description: "Modern design system with custom themes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="flex justify-between items-center p-4 bg-surface border-b border-border">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-semibold m-0 text-foreground">
              Shinobi
            </h1>
            <nav className="flex gap-4">
              <Link href="/" className="text-foreground hover:text-primary">
                Home
              </Link>
              <Link href="/blog" className="text-foreground hover:text-primary">
                Blog
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* <AuthButton /> */} {/* Disabled until Supabase is configured */}
            <DarkModeToggle />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
