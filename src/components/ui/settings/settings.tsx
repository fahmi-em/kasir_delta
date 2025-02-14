import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IoColorPalette, IoPeople} from "react-icons/io5";
import { LogoutButton } from '@/components/ui/buttonform'
import { Settings as SettingsIcon } from "lucide-react";
import { getSession } from 'next-auth/react';
import { ThemeToggle } from "@/components/theme-toggle";

function SideNav({ onSelect, selectedMenu }: { onSelect: (menu: string) => void, selectedMenu: string }) {
    return (
        <nav className="w-full md:w-1/3 border border-b bg-white dark:bg-[#0a0a0a] p-4">
            <ul>
                <li className="mb-4">
                    <a
                        onClick={() => onSelect("account")}
                        className={`p-2 rounded flex items-center gap-2 cursor-pointer ${selectedMenu === "account" ? "bg-gray-100 dark:bg-neutral-800" : "hover:bg-gray-100 dark:hover:bg-neutral-800"}`}
                    >
                        <IoPeople /> Account
                    </a>
                </li>
                <li className="mb-4">
                    <a
                        onClick={() => onSelect("personalization")}
                        className={`flex p-2 rounded items-center gap-2 cursor-pointer ${selectedMenu === "personalization" ? "bg-gray-100 dark:bg-neutral-800" : "dark:hover:bg-neutral-800"}`}
                    >
                        <IoColorPalette /> Personalization
                    </a>
                </li>
            </ul>
        </nav>
    );
}

function AccountSettings() {
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        async function fetchSession() {
            const sessionData = await getSession();
            setSession(sessionData);
        }
        fetchSession();
    }, []);

    return (
        <div>
            <SheetHeader>
                <SheetTitle>Account Settings</SheetTitle>
                <SheetDescription>Manage your account details</SheetDescription>
            </SheetHeader>
            <div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className="mt-4">
                        <label className="block text-sm font-medium">Nama Pengguna</label>
                        <input className="mt-2 p-2 border rounded dark:bg-[#1a1a1a]" value={session?.user?.name ?? ''} readOnly />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium">Role Pengguna</label>
                    <input className="mt-2 p-2 border rounded dark:bg-[#1a1a1a]" value={session?.user?.role ?? ''} readOnly />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium">Email</label>
                    <input className="mt-2 p-2 border rounded dark:bg-[#1a1a1a]" value={session?.user?.email ?? ''} readOnly />
                </div>
                <div className="mt-4 flex justify-end">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

function PersonalizationSettings() {
    return (
        <div>
            <SheetHeader>
                <SheetTitle>Personalization Settings</SheetTitle>
                <SheetDescription>Customize your experience</SheetDescription>
            </SheetHeader>
            <div>
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-4">App Color Theme</label>
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}

export function Settings() {
    const [selectedMenu, setSelectedMenu] = useState("account");

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="flex items-center gap-2">
                    <SettingsIcon className="text-xl text-gray-500" size={20} />
                </div>
            </SheetTrigger>

            <SheetContent side="bottom" className="max-w-[1000%] md:w-[650px] md:h-[600px] md:mx-2 md:my-2 p-4 rounded-md flex flex-col md:flex-row">
                <SideNav onSelect={setSelectedMenu} selectedMenu={selectedMenu} />

                <div className="flex-1 p-4 overflow-y-auto md:pr-8">
                    {selectedMenu === "account" && <AccountSettings />}
                    {selectedMenu === "personalization" && <PersonalizationSettings />}
                </div>
            </SheetContent>

        </Sheet>
    );
}
