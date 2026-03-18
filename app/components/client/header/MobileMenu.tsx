"use client";

import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import SideMenu from './SideMenu'
import Logo from '../../Logo';

export default function MobileMenu() {

    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsSideBarOpen(!isSideBarOpen)} className='flex gap-x-1 justify-center items-center'>
                <AlignLeft className='hover:text-eshop-textPrimary hoverEffect md:hidden hover:cursor-pointer'/>
                <Logo className='md:hidden block'/>
            </button>
            <div className='md:hidden'>
                <SideMenu isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)}/>
            </div>
        </>
    )
}
