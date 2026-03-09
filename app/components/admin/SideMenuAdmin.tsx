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
            className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-danashop-textDark/50 text-danashop-textPrimary/70 shadow-2xl transition-transform duration-300 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div 
                ref={sidebarRef}
                onClick={(e) => e.stopPropagation()} 
                className='min-w-72 max-w-96 bg-danashop-textDark h-screen p-10 border-r border-danashop-brandSoft flex flex-col gap-6'
            >
                <div className='flex items-center justify-between gap-5 border-b-2 pb-3 border-shop_light_green'>
                    <p className='font-extrabold tracking-wider text-2xl text-danashop-textPrimary'>DANNASHOP</p>
                    <button onClick={onClose} className='hover:text-shop_light_green transition-colors'>
                        <X size={24} />
                    </button>
                </div>

                <div className='flex flex-col space-y-5 text-xl font-semibold tracking-wide'>
                    {headerDataAdmin.map((item) => (
                        <Link 
                            href={item?.href} 
                            key={item?.title}
                            onClick={onClose} 
                            className={`hover:text-shop_light_green hoverEffect ${
                                pathname === item?.href ? 'text-white' : ''
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