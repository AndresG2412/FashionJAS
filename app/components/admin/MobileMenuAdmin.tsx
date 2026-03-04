"use client";

import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import SideMenuAdmin from './SideMenuAdmin'

export default function MobileMenu() {

    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                <AlignLeft className='text-danashop-textPrimary hoverEffect md:hidden hover:cursor-pointer'/>
            </button>
            <div className='md:hidden'>
                <SideMenuAdmin isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)}/>
            </div>
        </>
    )
}
