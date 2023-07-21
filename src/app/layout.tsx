import "./globals.css";
import { Inter } from "next/font/google";
import { SharedProps } from "@/shared";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Albion Online market monitoring",
  description: "market monitoring",
};

export default function RootLayout({ children }: SharedProps) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
