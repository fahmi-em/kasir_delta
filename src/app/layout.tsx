import { Inter } from 'next/font/google';
import { auth } from '@/auth';
import ClientRootLayout from './client-root-layout';

import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); 

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientRootLayout session={session}>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
