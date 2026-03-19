"use client";

import { AlignLeft } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import SideMenuAdmin from './SideMenuAdmin'

export default function MobileMenu() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <>
            <button onClick={() => setIsSideBarOpen(!isSideBarOpen)} className="outline-none">
                <AlignLeft className='text-eshop-textPrimary hover:text-eshop-accent hoverEffect md:hidden hover:cursor-pointer'/>
            </button>
            <div className='md:hidden'>
                <SideMenuAdmin isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)}/>
            </div>
        </>
    )
}