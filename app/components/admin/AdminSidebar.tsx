"use client";

import { AlignLeft } from 'lucide-react'
import React, { useState } from 'react'
import SideMenuAdmin from './SideMenuAdmin';

export default function AdminSidebar() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <div className='pl-4 '>
            {/* Botón que abre el menú */}
            <button 
                onClick={() => setIsSideBarOpen(true)}
                className="p-2 bg-gray-900 rounded-md text-white shadow-lg border border-gray-700"
            >
                <AlignLeft size={24} />
            </button>

            {/* El Menú desplegable */}
            <SideMenuAdmin isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)}/>
        </div>
    )
}