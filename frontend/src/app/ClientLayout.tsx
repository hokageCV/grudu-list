'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const noNavbarPaths = ['/', '/auth/signup', '/auth/login'];

  const showNavbar = !noNavbarPaths.includes(pathname);

  return (
    <div className="h-screen">
      {showNavbar ? (
        <>
          <div className="sm:hidden">
            <Navbar />
            {children}
          </div>
          <div className="hidden sm:flex h-full">
            <div className="w-1/6 h-full bg-secondary">
              <Navbar />
            </div>
            <div className="w-5/6 h-full overflow-y-auto">{children}</div>
          </div>
        </>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
}
