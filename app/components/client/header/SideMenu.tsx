"use client";
import React, { FC, useEffect, useState } from 'react'
import Logo from '../../Logo'
import Link from 'next/link'
import { X } from 'lucide-react'
import { headerData } from '../../../constants/data';
import { usePathname } from 'next/navigation';
import SocialMedia from '../../SocialMedia';
import { useOutsideClick } from '../../../hooks';

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: FC<SideBarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div 
            onClick={onClose} 
            className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-eshop-textPrimary/50 text-eshop-textSecondary shadow-2xl transition-transform duration-300 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div 
                ref={sidebarRef}
                onClick={(e) => e.stopPropagation()} 
                className='min-w-72 max-w-96 bg-eshop-bgMain h-screen p-10 border-r border-eshop-borderEmphasis flex flex-col gap-6'
            >
                <div className='flex items-center justify-between gap-5 border-b-2 pb-2 border-eshop-borderEmphasis'>
                    <Logo />
                    <button 
                        onClick={onClose} 
                        className='text-eshop-textSecondary hover:text-eshop-accent hoverEffect transition-colors'
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className='flex flex-col space-y-5 text-xl font-semibold tracking-wide'>
                    {headerData.map((item) => (
                        <Link 
                            href={item?.href} 
                            key={item?.title} 
                            onClick={onClose} 
                            className={`hoverEffect hover:text-eshop-accent ${
                                pathname === item?.href 
                                    ? 'text-eshop-accent' 
                                    : 'text-eshop-textPrimary'
                            }`}
                        >
                            {item?.title}
                        </Link>
                    ))}
                </div>
                <SocialMedia />
            </div>
        </div>
    )
}

export default SideMenu;