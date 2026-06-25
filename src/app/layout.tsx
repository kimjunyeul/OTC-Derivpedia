import type { Metadata } from 'next';
import { Noto_Sans_KR, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider } from '@/components/SidebarContext';
import { ALL_PRODUCTS } from '@/content/products';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '장외파생상품 백과사전',
  description: '리스크공학부 OTC Derivatives Encyclopedia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 h-12 flex items-center px-4 bg-primary text-white border-b border-white/10 z-10">
          <span className="font-bold text-sm tracking-tight">장외파생상품 백과사전</span>
          <span className="mx-2 text-white/30">|</span>
          <span className="text-xs text-white/60">Shinhan Risk Engineering</span>
        </header>

        {/* Body: sidebar + main */}
        <SidebarProvider>
          <div className="flex flex-1 overflow-hidden">
            <Sidebar products={ALL_PRODUCTS} />
            <main className="flex-1 overflow-y-auto bg-bg">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
