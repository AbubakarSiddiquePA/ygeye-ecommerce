import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exclusive Store | VIP Access',
  description: 'Private collection shop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

