"use client";
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { headerDataAdmin } from '@/app/constants/data';

export default function HeaderMenuAdmin() {
    const pathname = usePathname();
    
    return (
        <div className='hidden md:flex w-1/3 items-center justify-center gap-7 capitalize font-normal text-eshop-textPrimary'>
            {headerDataAdmin?.map((item, index) => (
                <Link 
                    key={index} 
                    href={item.href} 
                    className={`hover:text-eshop-accent hoverEffect font-medium tracking-wide relative group ${
                        pathname === item?.href ? 'text-eshop-accent' : 'text-eshop-textPrimary'
                    }`}
                >
                    {item.title}
                    
                    <span 
                        className={`absolute -bottom-1 left-1/2 h-0.5 bg-eshop-accent hoverEffect -translate-x-1/2 
                        group-hover:w-full ${pathname === item?.href ? 'w-full' : 'w-0'}`}
                    />
                </Link>
            ))}
        </div>
    )
}