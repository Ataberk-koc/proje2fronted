"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
// import { createPortal } from "react-dom";
import { Settings } from "../types/settings";
import { Category } from "../types/category";
import { useRouter, usePathname } from "next/navigation";
import i18n from "../i18n";
const STORAGE_URL = "http://127.0.0.1:8000/storage/";

function Header() {
		const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [settings, setSettings] = useState<Settings | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	// const [dropdownPos, setDropdownPos] = useState<{left: number, top: number} | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const router = useRouter();
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
		// Fetch categories
		fetch("http://127.0.0.1:8000/api/categories")
			.then((res) => {
				if (!res.ok) {
					throw new Error("API isteği başarısız: " + res.status + " " + res.statusText);
				}
				return res.json();
			})
			.then((data) => {
				if (data && Array.isArray(data.data)) {
					// parent varsa ve parent.title "hakkimizda" olanları filtrele
					const filtered = data.data.filter((cat: Category) => cat.parent && (cat.parent as { title: string }).title === "hakkimizda");
					console.log("Tüm kategorilerin parent.title değerleri:", data.data.map((cat: Category) => cat.parent && (cat.parent as { title: string }).title));
					setCategories(filtered);
					console.log("Dropdown için hakkimizda alt kategoriler:", filtered);
				} else {
					setCategories([]);
					console.log("Kategori verisi boş veya beklenmeyen formatta geldi.");
				}
			})
			.catch((err) => {
				setCategories([]);
				alert("Kategoriler API'den çekilemedi!\nHata: " + err.message + "\nAPI yolu: /api/categories");
				console.log("Kategoriler çekilemedi:", err);
			});
	}, []);

	// Dışarı tıklanınca dropdown kapansın
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setDropdownOpen(false);
			}
		}
		if (dropdownOpen) {
			document.addEventListener("mousedown", handleClick);
		} else {
			document.removeEventListener("mousedown", handleClick);
		}
		return () => document.removeEventListener("mousedown", handleClick);
	}, [dropdownOpen]);

	const getLogoUrl = (path: string | null | undefined) => {
		if (!path || path === "null") return "/logo.svg";
		if (path.startsWith("http")) return path;
		return `${STORAGE_URL}${path}`;
	};
	// locale'yi path'ten al, yoksa i18n'den al
	const locale = pathname?.split("/")[1] || i18n.language || "tr";
	return (
		<header className="w-full py-3 bg-blue-100 dark:bg-blue-900 shadow px-4 sm:px-6 min-h-16 max-h-20 z-[99999]">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-3 shrink-0">
					<Image
						src={getLogoUrl(settings?.site_white_logo || null)}
						alt="Logo"
						width={40}
						height={40}
						className="rounded object-contain bg-white"
						unoptimized
					/>
					<span className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100">
						{settings?.site_name || "Proje2"}
					</span>
				</div>
				{/* Hamburger icon for mobile */}
				<button
					className="sm:hidden flex flex-col justify-center items-center w-10 h-10 ml-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
					onClick={() => setMobileMenuOpen((v) => !v)}
					aria-label="Menüyü Aç/Kapat"
				>
					<span className={`block w-6 h-0.5 bg-blue-900 dark:bg-blue-100 mb-1 transition-all duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
					<span className={`block w-6 h-0.5 bg-blue-900 dark:bg-blue-100 mb-1 transition-all duration-200 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
					<span className={`block w-6 h-0.5 bg-blue-900 dark:bg-blue-100 transition-all duration-200 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
				</button>
				{/* Desktop nav */}
				<nav className="hidden sm:flex flex-nowrap gap-4 items-center cursor-pointer ml-auto">
					<Link href="/" className="px-4 py-2 rounded-full bg-white/70 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800">Anasayfa</Link>
					<Link href={`/${locale}/hakkimizda`} className="px-4 py-2 rounded-full bg-white/70 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800">Hakkımızda</Link>
					<div className="relative" ref={dropdownRef}>
						<button
							className="px-4 py-2 rounded-full bg-white/70 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800 flex items-center gap-2"
							onClick={() => setDropdownOpen((v) => !v)}
							type="button"
						>
							Hizmetlerimiz
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/></svg>
						</button>
						{dropdownOpen && (
							<div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-blue-200 z-[100000] py-2 animate-fade-in">
								{categories.length === 0 && (
									<div className="px-4 py-2 text-gray-500">Kategori bulunamadı</div>
								)}
								{categories.map((cat) => (
									<Link
										key={cat.id}
										href={`/${locale}/${cat.slug}`}
										className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-900 font-medium transition-colors"
										onClick={() => setDropdownOpen(false)}
									>
										{cat.title}
									</Link>
								))}
							</div>
						)}
					</div>
					<Link href="/iletisim" className="px-4 py-2 rounded-full bg-white/70 dark:bg-blue-950/70 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800">İletişim</Link>
				</nav>
			</div>
			{/* Mobile menu drawer */}
			{mobileMenuOpen && (
				<div className="sm:hidden fixed inset-0 bg-black/40 z-[100000]" onClick={() => setMobileMenuOpen(false)}>
					<div className="absolute top-0 right-0 w-64 h-full bg-white dark:bg-blue-950 shadow-lg p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
						<button className="self-end mb-4" onClick={() => setMobileMenuOpen(false)} aria-label="Menüyü Kapat">
							<svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6"/></svg>
						</button>
						<Link href="/" className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800" onClick={() => setMobileMenuOpen(false)}>Anasayfa</Link>
						<Link href={`/${locale}/hakkimizda`} className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800" onClick={() => setMobileMenuOpen(false)}>Hakkımızda</Link>
						<div className="relative">
							<button
								className="w-full px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold shadow border border-blue-300 dark:border-blue-800 flex items-center gap-2"
								onClick={() => setDropdownOpen((v) => !v)}
								type="button"
							>
								Hizmetlerimiz
								<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/></svg>
							</button>
							{dropdownOpen && (
								<div className="absolute left-0 mt-2 w-full bg-white dark:bg-blue-950 rounded-lg shadow-2xl border border-blue-200 z-[100000] py-2 animate-fade-in">
									{categories.length === 0 && (
										<div className="px-4 py-2 text-gray-500">Kategori bulunamadı</div>
									)}
									{categories.map((cat) => (
										<Link
											key={cat.id}
											href={`/${locale}/${cat.slug}`}
											className="block w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-900 font-medium transition-colors"
											onClick={() => { setDropdownOpen(false); setMobileMenuOpen(false); }}
										>
											{cat.title}
										</Link>
									))}
								</div>
							)}
						</div>
						<Link href="/iletisim" className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold shadow hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 border border-blue-300 dark:border-blue-800" onClick={() => setMobileMenuOpen(false)}>İletişim</Link>
					</div>
				</div>
			)}
		</header>
	);
}

export default Header;