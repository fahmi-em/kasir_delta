'use client';

import { SessionProvider } from 'next-auth/react';
import ContextProvider from '@/components/context-provider';
import { usePathname } from 'next/navigation';
import SideNav from '@/components/side-nav';
import Header from './header';

export default function ClientRootLayout({
  session,
  children,
}: Readonly<{
  session: any;
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login';

  return (
    <SessionProvider>
      <ContextProvider>
        {!isAuthPage && <Header session={session}/>}
        <div className="flex">
          {!isAuthPage && <SideNav session={session} />}
          <div className="w-full overflow-x-auto">
            <div
              className={`sm:h-[calc(99vh-60px)] overflow-auto ${isAuthPage ? 'h-screen' : ''
                }`}
            >
              <div className="w-full flex justify-center mx-auto overflow-auto relative">
                <div className="w-full md:max-w-6xl">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </ContextProvider>
    </SessionProvider>
  );
}
