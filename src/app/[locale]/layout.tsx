import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Doen Beauty",
  description: "Written by Ataberk",
};

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 w-full">{children}</main>
    </>
  );
}
