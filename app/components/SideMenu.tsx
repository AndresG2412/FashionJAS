"use client"; // Asegúrate de tenerlo si usas hooks
import React, { FC, useEffect, useState } from 'react'
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
    
    // Aplicamos el ref que ya tenías definido para cerrar al hacer clic afuera
    const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);
    
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div 
            onClick={onClose} 
            className={`fixed inset-y-0 h-screen left-0 z-50 w-full bg-black/50 text-white/70 shadow-2xl transition-transform duration-300 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <div 
                ref={sidebarRef} // Añadimos el ref aquí para el hook useOutsideClick
                onClick={(e) => e.stopPropagation()} 
                className='min-w-72 max-w-96 bg-black h-screen p-10 border-r border-shop_light_green flex flex-col gap-6'
            >
                <div className='flex items-center justify-between gap-5 border-b-2 pb-2 border-shop_light_green'>
                    <Logo className="text-white" spanDesing="group-hover:text-white "/>
                    <button onClick={onClose} className='hover:text-shop_light_green transition-colors'>
                        <X size={24} />
                    </button>
                </div>

                <div className='flex flex-col space-y-5 text-xl font-semibold tracking-wide'>
                    {headerData.map((item) => (
                        <Link 
                            href={item?.href} 
                            key={item?.title} 
                            // CLAVE: Al hacer clic en el link, ejecutamos onClose
                            onClick={onClose} 
                            className={`hover:text-shop_light_green hoverEffect ${
                                pathname === item?.href ? 'text-white' : ''
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