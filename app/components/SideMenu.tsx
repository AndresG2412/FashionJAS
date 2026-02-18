import React, { FC, use, useEffect, useState } from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { X } from 'lucide-react'
import { headerData } from '../constants/data';
import { usePathname } from 'next/navigation';
import SocialMedia from './SocialMedia';
import { useOutsideClick } from '../hooks';

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: FC<SideBarProps> = ({ isOpen, onClose }) => {

    const pathname = usePathname();

    const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
    
    // 1. Añadimos un estado para saber si ya estamos en el cliente
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 2. Si no está montado (está en el servidor), no renderizamos nada
    if (!isMounted) return null;

    return (
        <div onClick={onClose} className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/70 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
            <div onClick={(e) => e.stopPropagation()} className='min-w-72 max-w-96 bg-black h-screen p-10 border-r border-shop_light_green flex flex-col gap-6'>
                <div className='flex items-center justify-between gap-5'>
                    <Logo className="text-white" spanDesing="group-hover:text-white "/>
                    <button onClick={onClose} className='hover:text-shop_light_green transition-colors'>
                        <X size={24} />
                    </button>
                </div>
                <div className='flex flex-col space-y-3.5 font-semibold tracking-wide '>
                    {headerData.map((item) => (
                        <Link href={item?.href} key={item?.title} 
                        className={`hover:text-shop_light_green hoverEffect ${pathname === item?.href && 'text-white'}`}>
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
