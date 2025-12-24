"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Settings } from "../types/settings";

const STORAGE_URL = "http://127.0.0.1:8000/storage/";

export default function Header() {
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
		<header className="w-full py-3 bg-blue-100 dark:bg-blue-900 shadow flex items-center px-6 min-h-16 max-h-20 overflow-hidden z-50">
			<div className="flex items-center gap-4 flex-shrink-0">
				<Image
					src={getLogoUrl(settings?.site_white_logo || null)}
					alt="Logo"
					width={40}
					height={40}
					className="rounded object-contain bg-white"
					unoptimized
				/>
				<span className="text-xl font-bold text-blue-900 dark:text-blue-100">
					{settings?.site_name || "Proje2"}
				</span>
			</div>
			<nav className="flex gap-4 ml-68 cursor-pointer">
				<Link href="/" className="px-4 py-2 rounded-full bg-white/70 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800">Anasayfa</Link>
				<Link href="/hakkimizda" className="px-4 py-2 rounded-full bg-white/70 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800">Hakkımızda</Link>
				<Link href="/hizmetlerimiz" className="px-4 py-2 rounded-full bg-white/70 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800">Hizmetlerimiz</Link>
				<Link href="/iletisim" className="px-4 py-2 rounded-full bg-white/70 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800">İletişim</Link>
			</nav>
		</header>
	);
}