import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

export default function Logo({className, spanDesing }: {className?: string, spanDesing?: string}) {
    return (
        <Link
            href={'/'}>
                <h2 className={cn("hoverEffect group font-sans text-2xl text-shop_dark_green font-black tracking-wider hover:text-shop_light_green",className)}>
                    <span className={cn("text-shop_light_green group-hover:text-shop_dark_green hoverEffect", spanDesing)}>GABO</span>SKY
                </h2>
        </Link>
    )
}
