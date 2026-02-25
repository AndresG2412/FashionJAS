"use client";
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { headerDataAdmin } from '@/app/constants/data';

export default function HeaderMenuAdmin() {
    const pathname = usePathname();
    
    return (
        <div className='hidden md:flex w-1/3 items-center justify-center gap-7 capitalize font-normal text-lightColor'>
            {headerDataAdmin?.map((item, index) => (
                <Link 
                    key={index} 
                    href={item.href} 
                    className={`hover:text-shop_light_green hoverEffect font-semibold tracking-wide relative group ${pathname === item?.href ? 'text-shop_light_green' : ''}`}
                >
                    {item.title}
                    
                    <span 
                        className={`absolute -bottom-0.5 left-1/2 h-0.5 bg-shop_light_green hoverEffect -translate-x-1/2 
                        group-hover:w-full ${pathname === item?.href ? 'w-full' : 'w-0'}`}
                    />
                </Link>
            ))}
        </div>
    )
}