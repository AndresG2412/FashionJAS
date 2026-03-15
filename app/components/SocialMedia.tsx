// SocialMedia.tsx
import React from 'react'
import { Instagram, Facebook } from 'lucide-react'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip'
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Props {
    className?: string;
    iconClassName?: string;
    tooltipClassName?: string;
}

const SocialLiknk = [
    {
        tittle: 'Whatsapp',
        href: 'https://wa.me/+573126248617',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 14c-.2-.1-1.5-.7-1.7-.8c-.2-.1-.4-.1-.6.1c-.2.2-.6.8-.8 1c-.1.2-.3.2-.5.1c-.7-.3-1.4-.7-2-1.2c-.5-.5-1-1.1-1.4-1.7c-.1-.2 0-.4.1-.5c.1-.1.2-.3.4-.4c.1-.1.2-.3.2-.4c.1-.1.1-.3 0-.4c-.1-.1-.6-1.3-.8-1.8c-.1-.7-.3-.7-.5-.7h-.5c-.2 0-.5.2-.6.3c-.6.6-.9 1.3-.9 2.1c.1.9.4 1.8 1 2.6c1.1 1.6 2.5 2.9 4.2 3.7c.5.2.9.4 1.4.5c.5.2 1 .2 1.6.1c.7-.1 1.3-.6 1.7-1.2c.2-.4.2-.8.1-1.2l-.4-.2m2.5-9.1C15.2 1 8.9 1 5 4.9c-3.2 3.2-3.8 8.1-1.6 12L2 22l5.3-1.4c1.5.8 3.1 1.2 4.7 1.2c5.5 0 9.9-4.4 9.9-9.9c.1-2.6-1-5.1-2.8-7m-2.7 14c-1.3.8-2.8 1.3-4.4 1.3c-1.5 0-2.9-.4-4.2-1.1l-.3-.2l-3.1.8l.8-3l-.2-.3c-2.4-4-1.2-9 2.7-11.5S16.6 3.7 19 7.5c2.4 3.9 1.3 9-2.6 11.4"/></svg>
    },
    {
        tittle: 'Instagram',
        href: 'https://www.instagram.com/variedadeslasdannas',
        icon: <Instagram className='w-5 h-5' />
    },
    {
        tittle: 'Facebook',
        href: 'https://web.facebook.com/profile.php?id=61579066892111',
        icon: <Facebook className='w-5 h-5' />
    },
]

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
    return (
        <TooltipProvider>
            <div className={cn('flex items-center gap-3.5', className)}>
                {SocialLiknk?.map((item) => (
                    <Tooltip key={item?.tittle}>
                        <TooltipTrigger asChild>
                            <Link
                                href={item?.href}
                                target='_blank'
                                rel='noopener noreferrer'
                                className={cn(
                                    "p-2 border border-eshop-borderEmphasis rounded-full text-eshop-textSecondary hover:text-eshop-accent hover:border-eshop-accent hoverEffect",
                                    iconClassName
                                )}
                            >
                                {item?.icon}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent className={cn(tooltipClassName)}>
                            {item?.tittle}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
}

export default SocialMedia