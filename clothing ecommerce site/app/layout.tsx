import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { Toaster } from '@/components/ui/toaster';
import FacebookPixelInit from '@/components/FacebookPixelInit';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RastaLife - The Roads to Finding the Best Product for You!',
  description: 'RastaLife is a Bangladeshi fashion clothing brand offering premium quality t-shirts and apparel.',
  keywords: 'RastaLife, Bangladesh fashion, t-shirts, clothing, apparel, Dhaka',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FacebookPixelInit />
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
