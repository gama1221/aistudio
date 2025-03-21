"use client";

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useI18n } from './i18n-provider';
import { Sun, Moon, Globe, Menu, X } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center space-x-2">
          <a href="/">
            <Image src="/AiStudio.jpg" alt="AIStudio Logo" width={52} height={52} className="rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-1.5 bg-background/90 hover:bg-background hover:scale-105" />
          </a>
          <a href="/">
            <span className="font-bold text-xl">AIStudio</span>
          </a>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:static top-14 left-0 right-0 bg-background md:bg-transparent flex-col md:flex-row items-start md:items-center p-4 md:p-0 border-b md:border-0 space-y-2 md:space-x-4 md:space-y-0`}>
            <a href="/chat" className="px-4 py-2 hover:text-primary">Chat Now</a>
            <a href="https://blog.gemini.com" className="px-4 py-2 hover:text-primary" target="_blank" rel="noopener noreferrer">Gemini Blog</a>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button
              onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <Globe className="h-5 w-5" />
            </button> */}

            {/* <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}