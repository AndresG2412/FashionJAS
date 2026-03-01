import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

export default function Logo({className, spanDesing }: {className?: string, spanDesing?: string}) {
    return (
        <Link
            href={'/'}>
                <h2 className={cn("hoverEffect group font-sans text-2xl text-shop-dark-green font-extrabold tracking-wider hover:text-shop-light-green",className)}>
                    <span className={cn("text-shop-light-green group-hover:text-shop-dark-green hoverEffect", spanDesing)}>GABO</span>SHOP
                </h2>
        </Link>
    )
}
