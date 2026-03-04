"use client";
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { headerDataAdmin } from '@/app/constants/data';

export default function HeaderMenuAdmin() {
    const pathname = usePathname();
    
    return (
        <div className='hidden md:flex w-1/3 items-center justify-center gap-7 capitalize font-normal text-danashop-textPrimary'>
            {headerDataAdmin?.map((item, index) => (
                <Link 
                    key={index} 
                    href={item.href} 
                    className={`hover:text-danashop-brandSoft hoverEffect font-semibold tracking-wide relative group ${pathname === item?.href ? 'text-danashop-brandSoft' : ''}`}
                >
                    {item.title}
                    
                    <span 
                        className={`absolute -bottom-0.5 left-1/2 h-0.5 bg-danashop-brandSoft hoverEffect -translate-x-1/2 
                        group-hover:w-full ${pathname === item?.href ? 'w-full' : 'w-0'}`}
                    />
                </Link>
            ))}
        </div>
    )
}