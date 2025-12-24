"use client";

import { useEffect, useState } from "react";
import { Settings, Contact, PhoneContact } from "../types/settings";

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setSettings(data.data[0]);
        } else {
          setSettings(null);
        }
      });
  }, []);

  return (
    <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900 text-center mt-auto shadow flex flex-col items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">© 2025 {settings?.site_name || "My App"}. All rights reserved.</span>
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-gray-700 dark:text-gray-200 text-sm">
        <span>
          Telefon: {
            Array.isArray(settings?.phone)
              ? (settings.phone as PhoneContact[]).map((p, idx) => (
                  <span key={idx}>
                    <a href={`tel:${p.phone}`} className="underline">{p.tag ? `${p.tag}: ` : ""}{p.phone}</a>{idx < (settings.phone as PhoneContact[]).length - 1 ? ", " : ""}
                  </span>
                ))
              : typeof settings?.phone === "object" && settings?.phone !== null
                ? <a href={`tel:${(settings.phone as PhoneContact).phone}`} className="underline">{(settings.phone as PhoneContact).tag ? `${(settings.phone as PhoneContact).tag}: ` : ""}{(settings.phone as PhoneContact).phone}</a>
                : <a href={`tel:${settings?.phone || ""}`} className="underline">{settings?.phone || "+90 555 111 22 33"}</a>
          }
        </span>
        <span className="hidden sm:inline">|</span>
        <span>
          Mail: {
            Array.isArray(settings?.email)
              ? (settings.email as Contact[]).map((e, idx) => (
                  <span key={idx}>
                    <a href={`mailto:${e.email}`} className="underline">{e.name ? `${e.name}: ` : ""}{e.email}</a>{idx < (settings.email as Contact[]).length - 1 ? ", " : ""}
                  </span>
                ))
              : typeof settings?.email === "object" && settings?.email !== null
                ? <a href={`mailto:${(settings.email as Contact).email}`} className="underline">{(settings.email as Contact).name ? `${(settings.email as Contact).name}: ` : ""}{(settings.email as Contact).email}</a>
                : <a href={`mailto:${settings?.email || ""}`} className="underline">{settings?.email || "info@myapp.com"}</a>
          }
        </span>
        <span className="hidden sm:inline">|</span>
        <span>Adres: {settings?.address || settings?.full_address || "İstanbul, Türkiye"}</span>
        <span className="hidden sm:inline">|</span>
        <span>
          Çalışma Saatleri: {
            Array.isArray(settings?.working_hours)
              ? (settings.working_hours ?? []).map((wh, idx) => (
                  <span key={idx}>{wh}{idx < (settings.working_hours?.length ?? 0) - 1 ? ", " : ""}</span>
                ))
              : typeof settings?.working_hours === "object" && settings?.working_hours !== null
                ? Object.entries(settings.working_hours ?? {}).map(([key, value], idx, arr) => (
                    <span key={key}>{key}: {String(value)}{idx < arr.length - 1 ? ", " : ""}</span>
                  ))
                : typeof settings?.working_hours === "string"
                  ? settings.working_hours
                  : "09:00 - 18:00"
          }
        </span>
      </div>
    </footer>
  );
}
