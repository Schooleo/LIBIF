import './globals.css';
import type { ReactNode } from 'react';

export const metadata = { title: 'LIBIF', description: 'LIBIF' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
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
