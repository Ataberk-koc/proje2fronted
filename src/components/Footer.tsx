export default function Footer() {
  return (
    <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900 text-center mt-auto shadow flex flex-col items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-300">© 2025 My App. All rights reserved.</span>
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center text-gray-700 dark:text-gray-200 text-sm">
        <span>Telefon: <a href="tel:+905551112233" className="underline">+90 555 111 22 33</a></span>
        <span className="hidden sm:inline">|</span>
        <span>Mail: <a href="mailto:info@myapp.com" className="underline">info@myapp.com</a></span>
        <span className="hidden sm:inline">|</span>
        <span>Adres: İstanbul, Türkiye</span>
      </div>
    </footer>
  );
}
