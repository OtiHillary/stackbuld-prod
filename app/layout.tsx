import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/nav";
import Footer from "@/app/components/footer"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stackbuld products",
  description: "A simple and seemless e-commerce experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ inter.className } flex flex-col justify-between min-h-screen`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
