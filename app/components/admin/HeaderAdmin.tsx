import React from 'react'
import Container from '../Container'
import { ClerkLoaded, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import HeaderMenuAdmin from './HeaderMenuAdmin'
import MobileMenuAdmin from './MobileMenuAdmin'

const HeaderAdmin = () => {
    return (
        <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-xl shadow-sm">
            <Container className='flex items-center justify-between text-lightColor'> 
                <div className='flex w-auto md:w-1/3 items-center justify-start gap-2.5 md:gap-0'>
                    <MobileMenuAdmin/>
                    <p className='font-bold tracking-wider text-2xl'>GABOSHOP</p>
                </div>
                <HeaderMenuAdmin/>
            </Container>
        </header>
    )
}

export default HeaderAdmin