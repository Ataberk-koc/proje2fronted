import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Proje2",
  description: "Written by Ataberk",
};

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1 w-full">{children}</main>
    </>
  );
}
