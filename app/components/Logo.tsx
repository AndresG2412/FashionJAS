import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

export default function Logo({className, spanDesing }: {className?: string, spanDesing?: string}) {
    return (
        <Link
            href={'/'}>
                <h2 className={cn("hoverEffect group font-sans text-2xl text-danashop-brandMain font-extrabold tracking-wider hover:text-danashop-focus",className)}>
                    <span className={cn("text-danashop-focus group-hover:text-danashop-brandMain hoverEffect", spanDesing)}>GABO</span>SHOP
                </h2>
        </Link>
    )
}
