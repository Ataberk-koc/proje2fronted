"use client";

import Image from "next/image";
import { MdPhone, MdEmail, MdLocationOn, MdAccessTime } from "react-icons/md";
import { useEffect, useState } from "react";
import { Settings, Contact, PhoneContact } from "../types/settings";

const STORAGE_URL = "http://127.0.0.1:8000/storage/";

export default function Section2() {
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

  const getLogoUrl = (path: string | null | undefined) => {
    if (!path || path === "null") return "/logo.svg";
    if (path.startsWith("http")) return path;
    return `${STORAGE_URL}${path}`;
  };

  return (
    <section className="w-full py-3 flex flex-wrap sm:flex-row items-center justify-center sm:justify-between px-4 gap-3 relative">
      {/* Logo ve şirket ismi kaldırıldı, sadece iletişim bilgileri kalacak */}
      <div className="flex flex-wrap gap-3 justify-center items-center text-gray-700 dark:text-gray-200 text-xs sm:text-sm flex-1">
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
    </section>
  );
}
