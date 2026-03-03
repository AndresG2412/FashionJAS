import React from 'react'
import { Youtube, Github, Linkedin, Instagram, Facebook, Slack } from 'lucide-react'
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
        tittle: 'Youtube',
        href: 'https://www.youtube.com/@gabosky2412',
        icon: <Youtube className='w-5 h-5 text-danashop-textPrimary' />
    },
    {
        tittle: 'Github',
        href: 'https://www.youtube.com/@gabosky2412',
        icon: <Github className='w-5 h-5 text-danashop-textPrimary' />
    },
    {
        tittle: 'Linkedin',
        href: 'https://www.youtube.com/@gabosky2412',
        icon: <Linkedin className='w-5 h-5 text-danashop-textPrimary' />
    },
    {
        tittle: 'Instagram',
        href: 'https://www.youtube.com/@gabosky2412',
        icon: <Instagram className='w-5 h-5 text-danashop-textPrimary' />
    },
    {
        tittle: 'Facebook',
        href: 'https://www.youtube.com/@gabosky2412',
        icon: <Facebook className='w-5 h-5 text-danashop-textPrimary' />
    },
]

const SocialMedia = ({className, iconClassName, tooltipClassName}:Props) => {
    return (
        <TooltipProvider>
            <div className={cn('flex items-center gap-3.5 ', className)}>
                {SocialLiknk?.map((item) => (
                    <Tooltip key={item?.tittle}>
                        <TooltipTrigger asChild>
                            <Link href={item?.href} target='_blank' rel='noopener noreferrer' 
                            className={cn("p-2 border rounded-full hover:text-danashop-textPrimary hoverEffect", iconClassName)}>
                                {item?.icon}
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            {item?.tittle}
                        </TooltipContent>
                        <TooltipContent className={cn("bg-black text-danashop-textPrimary font-semibold", tooltipClassName)}>
                            {item?.tittle}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
}

export default SocialMedia
