'use client';

import ContactSection from "@/components/ContactSection";
import { useParams } from "next/navigation";

export default function ContactPage() {
  const params = useParams();
  const locale = params?.locale as string || 'tr';

  return (
    <div className="min-h-screen pt-20">
      <ContactSection />
    </div>
  );
}
