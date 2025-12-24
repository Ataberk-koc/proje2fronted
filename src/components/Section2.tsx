"use client";

import Image from "next/image";
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime } from "react-icons/md";
import { useEffect, useState } from "react";
import i18n from "../i18n";
import { Settings, Contact, PhoneContact } from "../types/settings";

type Language = {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

const STORAGE_URL = "http://127.0.0.1:8000/storage/";

export default function Section2() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/languages")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const activeLangs = data.data.filter((lang: Language) => lang.is_active);
          setLanguages(activeLangs);
          if (activeLangs.length > 0) setSelectedLang(activeLangs[0].code);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedLang) return;
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          const found = data.data.find((item: Settings & { code?: string }) => item.code === selectedLang);
          setSettings(found || data.data[0]);
        } else {
          setSettings(null);
        }
      });
  }, [selectedLang]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    if (i18n) {
      i18n.changeLanguage(newLang);
    }
  };

  const getLogoUrl = (path: string | null | undefined) => {
    if (!path || path === "null") return "/logo.svg";
    if (path.startsWith("http")) return path;
    return `${STORAGE_URL}${path}`;
  };

  return (
    <section className="w-full py-2 flex flex-col sm:flex-row items-center justify-between px-4 gap-2 relative min-h-12 max-h-15 overflow-hidden">
      {/* Logo ve şirket ismi kaldırıldı, sadece iletişim bilgileri kalacak */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-gray-700 dark:text-gray-200 text-xs">
        <span className="flex items-center gap-1">
          <MdPhone className="inline text-blue-500" size={16} />  {
            Array.isArray(settings?.phone)
              ? (settings.phone as PhoneContact[]).map((p, idx) => (
                  <span key={idx}>
                    <a href={`tel:${p.phone}`}>{p.tag ? `${p.tag}: ` : ""}{p.phone}</a>{idx < (settings.phone as PhoneContact[]).length - 1 ? ", " : ""}
                  </span>
                ))
              : typeof settings?.phone === "object" && settings?.phone !== null
                ? <a href={`tel:${(settings.phone as PhoneContact).phone}`} >{(settings.phone as PhoneContact).tag ? `${(settings.phone as PhoneContact).tag}: ` : ""}{(settings.phone as PhoneContact).phone}</a>
                : <a href={`tel:${settings?.phone || ""}`} >{settings?.phone || "+90 555 111 22 33"}</a>
          }
        </span>
        <span className="flex items-center gap-1">
          <MdEmail className="inline text-blue-500" size={16} />  {
            Array.isArray(settings?.email)
              ? (settings.email as Contact[]).map((e, idx) => (
                  <span key={idx}>
                    <a href={`mailto:${e.email}`} >{e.name ? `${e.name}: ` : ""}{e.email}</a>{idx < (settings.email as Contact[]).length - 1 ? ", " : ""}
                  </span>
                ))
                    : typeof settings?.email === "object" && settings?.email !== null
                        ? <a href={`mailto:${(settings.email as Contact).email}`} >{(settings.email as Contact).name ? `${(settings.email as Contact).name}: ` : ""}{(settings.email as Contact).email}</a>
                : <a href={`mailto:${settings?.email || ""}`} >{settings?.email || "info@myapp.com"}</a>
          }
        </span>
        <span className="flex items-center gap-1">
          <MdLocationOn className="inline text-blue-500" size={16} /> {settings?.address || settings?.full_address || "İstanbul, Türkiye"}
        </span>
        <span className="flex items-center gap-1">
          <MdAccessTime className="inline text-blue-500" size={16} /> {
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
      <div className="absolute right-4 top-2 sm:static sm:ml-4">
        <select
          className="border-2 border-blue-400 focus:border-blue-600 rounded-full px-4 py-1 text-black dark:text-white bg-white dark:bg-zinc-800 shadow transition-all duration-200 hover:border-blue-600 outline-none cursor-pointer min-w-22.5 text-xs"
          value={selectedLang}
          onChange={handleChange}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
