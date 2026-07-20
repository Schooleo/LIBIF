import './globals.css';
import type { ReactNode } from 'react';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-be-vietnam-pro',
  weight: ['400', '500', '600', '700']
});

export const metadata = { title: 'LIBIF', description: 'LIBIF' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={beVietnamPro.variable}>
        <nav className="libif-top-nav" aria-label="Primary">
          <a href="/">Home</a>
          <a href="/admin/books/new">New Intake</a>
          <a href="/admin/books">Admin Books</a>
          <a href="/catalog">Public Catalog</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
