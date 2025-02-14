'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings } from '@/components/ui/settings/settings'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NavItems } from '@/config';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

import { ThemeToggle } from './theme-toggle';

export default function SideNav({ session }: { session: any }) {
  const navItems = NavItems();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('sidebarExpanded');
      if (saved !== null) {
        setIsSidebarExpanded(JSON.parse(saved));
      } else {
        setIsSidebarExpanded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isSidebarExpanded !== null) {
      window.localStorage.setItem('sidebarExpanded', JSON.stringify(isSidebarExpanded));
    }
  }, [isSidebarExpanded]);

  const toggleSidebar = () => {
    if (isSidebarExpanded !== null) {
      setIsSidebarExpanded(!isSidebarExpanded);
    }
  };

  if (isSidebarExpanded === null) {
    return null;
  }

  return (
    <div className="pr-4" >
      <div
        className={cn(
          isSidebarExpanded ? 'w-[200px]' : 'w-[68px]',
          'border-r transition-all duration-300 ease-in-out transform hidden sm:flex h-full bg-white dark:bg-[#0a0a0a]',
        )}
      >
        <aside className="flex h-full flex-col w-full break-words px-4 overflow-x-hidden columns-1">
          {/* Top */}
          <div className="mt-4 relative pb-2">
            <div className="flex flex-col space-y-1">
              {navItems &&
                navItems.map((item, idx) => {
                  if (
                    item.position === 'top' &&
                    session &&
                    ((typeof item.role === 'string' && session.user.role === item.role) ||
                      (Array.isArray(item.role) && item.role.includes(session.user.role)))
                  ) {
                    return (
                      <Fragment key={idx}>
                        <div className="space-y-1">
                          <SideNavItem
                            label={item.name}
                            icon={item.icon}
                            path={item.href}
                            active={item.active}
                            isSidebarExpanded={isSidebarExpanded}
                            children={item.children}
                          />
                        </div>
                      </Fragment>
                    );
                  }
                })}
            </div>
          </div>
          {/* Bottom */}
          <div className="sticky bottom-0 mt-auto whitespace-nowrap mb-4 transition duration-200 block" >
            <ThemeToggle isDropDown={true} />
            {navItems &&
              navItems.map((item, idx) => {
                if (
                  item.position === 'bottom' &&
                  session &&
                  ((typeof item.role === 'string' && session.user.role === item.role) ||
                    (Array.isArray(item.role) && item.role.includes(session.user.role)))
                ) {
                  return (
                    <Fragment key={idx}>
                      <div className="space-y-1">
                        <SideNavItem
                          label={item.name}
                          icon={item.icon}
                          path={item.href}
                          active={item.active}
                          isSidebarExpanded={isSidebarExpanded}
                          children={item.children}
                        />
                      </div>
                    </Fragment>
                  );
                }
              })}
            <div className="space-y-1">
              <SideNavItem 
                label="Settings"
                icon={<Settings  />}
                path="#"
                active={false}
                isSidebarExpanded={isSidebarExpanded}
              />
            </div>
          </div>
        </aside>
        <div className="mt-[calc(calc(90vh)-40px)] relative">
          <button
            type="button"
            className="absolute bottom-32 right-[-12px] flex h-6 w-6 items-center justify-center border border-muted-foreground/20 rounded-full bg-accent shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
            onClick={toggleSidebar}
          >
            {isSidebarExpanded ? (
              <ChevronLeft size={16} className="stroke-foreground" />
            ) : (
              <ChevronRight size={16} className="stroke-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export const SideNavItem: React.FC<{
  label: string;
  icon: any;
  path: string;
  active: boolean;
  isSidebarExpanded: boolean;
  children?: any;
}> = ({ label, icon, path, active, isSidebarExpanded, children }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <>
      {isSidebarExpanded ? (
        <div>
          <Link
            href={path}
            className={`h-full relative flex items-center whitespace-nowrap rounded-md ${active
              ? 'font-base text-sm bg-neutral-200 shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white'
              : 'hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
              }`}
          >
            <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
              {icon}
              <span>{label}</span>
              {children && (
                <button onClick={toggleSubmenu} className="ml-auto">
                  {isSubmenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>
          </Link>
          {isSubmenuOpen && children && (
            <div className="ml-4">
              {children.map((child: any, idx: number) => (
                <Link
                  key={idx}
                  href={child.href}
                  className={`h-full relative flex items-center whitespace-nowrap rounded-md ${child.active
                    ? 'font-base text-sm bg-neutral-200 shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white'
                    : 'hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    } my-1`}
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
      ) : (
        <TooltipProvider delayDuration={70}>
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={path}
                className={`h-full relative flex items-center whitespace-nowrap rounded-md ${active
                  ? 'font-base text-sm bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-white'
                  : 'hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                  }`}
              >
                <div className="relative font-base text-sm p-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                  {!children && icon}
                  {children && (
                    <div onClick={toggleSubmenu} className="ml-auto cursor-pointer">
                      {icon}
                      {isSubmenuOpen ? <ChevronUp size={16} className='ml-1' /> : <ChevronDown size={16} className='ml-1' />}
                    </div>
                  )}
                </div>
              </Link>
              {isSubmenuOpen && children && (
                <div>
                  {children.map((child: any, idx: number) => (
                    <TooltipProvider delayDuration={70} key={idx}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={child.href}
                            className={`h-full relative flex items-center whitespace-nowrap rounded-md ${child.active
                              ? 'font-base text-sm bg-neutral-200 shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white'
                              : 'hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                              } my-1`}
                          >
                            <div className="relative font-base text-sm py-2 px-2 flex flex-row items-center space-x-3 rounded-md duration-100">
                              {child.icon}
                            </div>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="px-3 py-1.5 text-xs" sideOffset={10}>
                          <span>{child.name}</span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
            </TooltipTrigger>
            <TooltipContent side="left" className="px-3 py-1.5 text-xs" sideOffset={10}>
              <span>{label}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};