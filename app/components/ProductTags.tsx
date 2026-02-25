import React from 'react'

import { ShieldCheck, PackageCheck, Motorbike } from 'lucide-react'

function ProductTags() {
    return (
        <div className='flex justify-between gap-x-3 items-center mt-3 w-full'>
            <div className='flex gap-x-3 md:gap-x-3 items-center text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded'>
                <ShieldCheck/> 
                <p>Producto Nuevo</p>
            </div>
            <div className='flex gap-x-3 md:gap-x-3 items-center text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded'>
                <PackageCheck/>
                <p>Envio Protegido</p>
            </div>
            <div className='flex gap-x-3 md:gap-x-3 items-center text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded'>
                <Motorbike/>
                <p>Entrega Rapida</p>
            </div>
        </div>
    )
}

export default ProductTags
