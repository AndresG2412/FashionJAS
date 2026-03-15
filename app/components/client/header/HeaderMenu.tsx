"use client";
import React from 'react'
import { headerData } from "../../../constants/data"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HeaderMenu() {
    const pathname = usePathname();
    
    return (
        <div className='hidden md:flex w-1/3 items-center justify-center gap-7 capitalize font-normal text-eshop-textPrimary'>
            {headerData?.map((item, index) => (
                <Link 
                    key={index} 
                    href={item.href} 
                    className={`hover:text-eshop-accent hoverEffect font-semibold tracking-wide relative group ${pathname === item?.href ? 'text-eshop-accent' : ''}`}
                >
                    {item.title}
                    
                    <span 
                        className={`absolute -bottom-0.5 left-1/2 h-0.5 bg-eshop-accent hoverEffect -translate-x-1/2 
                        group-hover:w-full ${pathname === item?.href ? 'w-full' : 'w-0'}`}
                    />
                </Link>
            ))}
        </div>
    )
}