
"use client";
// ...existing code...
import SliderSection from "@/components/SliderSection";
// ...existing code...


export default function Home() {
  // ...existing code...
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center w-full">
        {/* Section2 sadece layout'ta kullanılacak */}
        <SliderSection />
      </main>
    </div>
    );
}
