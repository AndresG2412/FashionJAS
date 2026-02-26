"use client"; // Asegúrate de tenerlo si usas hooks
import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation';
import { useOutsideClick } from '@/app/hooks';
import { headerDataAdmin } from '@/app/constants/data';

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
                <div className='flex items-center justify-between gap-5 border-b-2 pb-3 border-shop_light_green'>
                    <p className='font-bold tracking-wider text-2xl flex justify-end md:justify-start'>GABOSHOP</p>
                    <button onClick={onClose} className='hover:text-shop_light_green transition-colors'>
                        <X size={24} />
                    </button>
                </div>

                <div className='flex flex-col space-y-5 text-xl font-semibold tracking-wide'>
                    {headerDataAdmin.map((item) => (
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
            </div>
        </div>
    )
}

export default SideMenu;