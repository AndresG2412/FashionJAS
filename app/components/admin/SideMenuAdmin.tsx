"use client";
import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation';
import { adminData } from '@/app/constants/data';
import { useOutsideClick } from '@/app/hooks';
import { SignOutButton, useUser } from '@clerk/nextjs';

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenuAdmin: FC<SideBarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
    const { user } = useUser();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className={`fixed inset-0 z-100 transition-opacity my-12 duration-300 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`absolute inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header igual a PC */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-shop_light_green">
                            GaboShop Admin
                        </h1>
                        <p className="text-xs text-gray-400">
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                {/* Nav igual a PC */}
                <nav className="mt-4 flex-1">
                    {adminData.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            onClick={onClose}
                            className={`block px-6 py-3 transition ${
                                pathname === item.href
                                    ? 'bg-gray-800 text-shop_light_green'
                                    : 'hover:bg-gray-800'
                            }`}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                {/* Footer igual a PC */}
                <div className="p-6 border-t border-gray-800">
                    <Link
                        href="/"
                        onClick={onClose}
                        className="block px-4 py-2 text-center bg-gray-800 rounded hover:bg-gray-700 mb-2 text-sm"
                    >
                        ← Volver a la Tienda
                    </Link>

                    <SignOutButton>
                        <button className="w-full px-4 py-2 text-center bg-red-600 rounded hover:bg-red-700 text-sm font-semibold">
                            Cerrar Sesión
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </div>
    );
}

export default SideMenuAdmin;