'use client';

import React, { useState } from 'react';
import { usePathname} from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { NavItems } from '@/config';
import { ChevronDown, ChevronUp, LogOut, Menu } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { ThemeToggle } from '@/components/theme-toggle';
import { Settings } from '@/components/ui/settings/settings';

export default function Header({ session }: { session: any }) {
  const pathname = usePathname();
  const navItems = NavItems();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (idx: any) => {
    setOpenDropdown(openDropdown === idx ? null : idx);
  };

  if (pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 justify-between">
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
        prefetch={false}
      >
        <span className="w-8 h-8 border bg-accent rounded-full"></span>
        <span className='text-xl'>Delta Printing</span>
      </Link>

      <div className="ml-4 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut size={16} className='mr-2'/>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button onClick={() => setIsOpen(true)} className="block sm:hidden">
          <Menu size={24} />
        </button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <VisuallyHidden.Root>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Menu</SheetDescription>
          </VisuallyHidden.Root>
          <SheetContent side="right" className="block md:hidden">
            <aside className="flex h-full flex-col w-full break-words px-4 overflow-x-hidden columns-1">
              <div className="pt-4 overflow-y-auto h-fit w-full flex flex-col gap-1">
                {navItems &&
                  navItems
                    .filter(
                      (navItem) =>
                        !navItem.role ||
                        (session &&
                          ((typeof navItem.role === "string" && session?.user?.role === navItem.role) ||
                            (Array.isArray(navItem.role) && navItem.role.includes(session.user.role))))
                    )
                    .map((navItem, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown(idx)}>
                          <Link
                            href={navItem.href || "#"}
                            onClick={() => setIsOpen(false)}
                            className={`h-full relative flex items-center whitespace-nowrap rounded-md ${navItem.active
                              ? "font-base text-sm bg-neutral-200 shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white"
                              : "hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                              } w-full flex-row justify-between`}
                          >
                            <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                              {navItem.icon}
                              <span>{navItem.name}</span>
                            </div>
                          </Link>
                          {navItem.children && (
                            <button className="p-2" onClick={() => toggleDropdown(idx)}>
                              {openDropdown === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          )}
                        </div>
                        {navItem.children && openDropdown === idx && (
                          <div className="ml-4 flex flex-col gap-1">
                            {navItem.children.map((child, cIdx) => (
                              <Link
                                key={cIdx}
                                href={child.href}
                                onClick={() => setIsOpen(false)}
                                className={`h-full relative flex items-center whitespace-nowrap rounded-md ${child.active
                                  ? "font-base text-sm bg-neutral-200 shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white"
                                  : "hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                                  } w-full flex-row justify-between`}
                              >
                                <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                                  {child.icon}
                                  <span>{child.name}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
              </div>
              <div className="sticky bottom-0 mt-auto whitespace-nowrap transition duration-200 block">
                <ThemeToggle isDropDown={true} />
                <div className='space-x-1 ml-2 flex items-center'>
                  <Settings />
                  <span className="text-sm ml-8 text-gray-400">Settings</span>
                </div>
              </div>
            </aside>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}
