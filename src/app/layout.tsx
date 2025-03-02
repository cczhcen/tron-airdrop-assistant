import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import PasswordProtect from "@/components/PasswordProtect";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tron Batch Transfer Tool",
  description: "A tool for batch token transfer on Tron network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Navbar />
        <PasswordProtect>
          <main className="min-h-screen bg-gray-50 pt-16">{children}</main>
        </PasswordProtect>
      </body>
    </html>
  );
}
