
"use client";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import SliderSection from "@/components/SliderSection";


export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center w-full">
        <SliderSection />
      </main>
    </div>
    );
}
