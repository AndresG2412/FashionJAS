"use client";
import React, { FC } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation';
import { useOutsideClick } from '@/app/hooks';
import { headerDataAdmin } from '@/app/constants/data';

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenuAdmin: FC<SideBarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

    return (
        <div 
            onClick={onClose} 
            className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-eshop-textDark/40 backdrop-blur-sm transition-opacity duration-300 ${
                isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            <div 
                ref={sidebarRef}
                onClick={(e) => e.stopPropagation()} 
                className={`min-w-72 max-w-96 bg-eshop-bgWhite h-screen p-10 border-r border-eshop-borderSubtle flex flex-col gap-6 transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className='flex items-center justify-between gap-5 border-b pb-4 border-eshop-borderSubtle'>
                    <p className='font-extrabold tracking-wider text-2xl text-eshop-textPrimary'>FASHIONJAS</p>
                    <button onClick={onClose} className='text-eshop-textSecondary hover:text-eshop-accent transition-colors'>
                        <X size={24} />
                    </button>
                </div>

                <div className='flex flex-col space-y-5 text-lg font-semibold tracking-wide'>
                    {headerDataAdmin.map((item) => (
                        <Link 
                            href={item?.href} 
                            key={item?.title}
                            onClick={onClose} 
                            className={`hover:text-eshop-accent hoverEffect ${
                                pathname === item?.href ? 'text-eshop-accent' : 'text-eshop-textSecondary'
                            }`}
                        >
                            {item?.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SideMenuAdmin;