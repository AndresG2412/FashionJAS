import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

export default function Logo({className, spanDesing }: {className?: string, spanDesing?: string}) {
    return (
        <Link
            href={'/'}>
                <h2 className={cn("font-serif hoverEffect group text-2xl text-eshop-textPrimary font-extrabold tracking-wider hover:text-eshop-buttonBase",className)}>
                    <span className={cn("text-eshop-buttonBase group-hover:text-eshop-textPrimary hoverEffect", spanDesing)}>FASHION</span>JAS
                </h2>
        </Link>
    )
}
