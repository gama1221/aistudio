"use client";

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

type Locale = 'en' | 'zh';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    features: 'Features',
    tryItNow: 'Try It Now',
    faqs: 'FAQs',
    uploadImage: 'Upload Image',
    sendPrompt: 'Send Prompt',
    chatHistory: 'Chat History',
    imageEditing: 'Image Editing',
    promptInput: 'Enter your prompt here...',
  },
  zh: {
    features: '功能特点',
    tryItNow: '立即体验',
    faqs: '常见问题',
    uploadImage: '上传图片',
    sendPrompt: '发送提示',
    chatHistory: '聊天历史',
    imageEditing: '图片编辑',
    promptInput: '在此输入提示...',
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations['en']] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: switchLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};