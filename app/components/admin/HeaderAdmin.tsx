import React from 'react'
import Container from '../Container'
import { ClerkLoaded, SignedIn, UserButton } from '@clerk/nextjs'
import HeaderMenuAdmin from './HeaderMenuAdmin'
import MobileMenuAdmin from './MobileMenuAdmin'
import ShopButton from './ShopButton'

const HeaderAdmin = () => {
    return (
        <header className="sticky top-0 z-50 py-5 bg-eshop-bgMain backdrop-blur-xl shadow-sm/50 shadow-eshop-accent">
            <Container className='flex items-center justify-between'> 
                <div className='flex w-auto md:w-1/3 items-center justify-start gap-2.5 md:gap-0'>
                    <MobileMenuAdmin/>
                    <p className='font-serif font-bold tracking-wider text-2xl text-eshop-textPrimary'>FASHIONJAS</p>
                </div>
                <HeaderMenuAdmin/>
                <div className='flex w-auto md:w-1/3 items-center justify-end gap-5'>
                    <ClerkLoaded>
                        <ShopButton/>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </ClerkLoaded>
                </div>
            </Container>
        </header>
    )
}

export default HeaderAdmin