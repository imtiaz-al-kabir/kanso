import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/providers/ToastProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import Navbar from '@/components/store/Navbar';
import BottomBar from '@/components/store/BottomBar';
import Footer from '@/components/store/Footer';
import { getAuthUser } from '@/lib/auth';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KANSO | Japandi Luxury Minimal Ecommerce',
  description: 'Crafting luxury minimal design and Japandi aesthetics for modern mindful spaces.',
  keywords: 'luxury, Japandi, minimal design, furniture, ceramics, lighting, home decor, high-end',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${outfit.variable} scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body
        className="font-sans bg-background text-foreground flex flex-col min-h-screen"
        suppressHydrationWarning
      >
        {/* Subtle cinematic overlay */}
        <div className="noise-overlay" />

        <ToastProvider>
          <StoreProvider>
            {/* Standard layout blocks */}
            <Navbar user={user} />
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-8 py-6 pb-24 md:pb-6">
              {children}
            </main>
            <BottomBar />
            <Footer />
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
