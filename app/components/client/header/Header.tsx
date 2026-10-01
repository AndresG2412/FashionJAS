"use client";

import React, { useState } from 'react'
import Container from '../../Container'
import Logo from '../../Logo'
import HeaderMenu from './HeaderMenu'
import { Search } from 'lucide-react'
import Link from 'next/link'

import CartButton from './CartButton'
import OrdersButton from './OrdersButton'
import FavoriteButton from './FavoriteButton'

import MobileMenu from './MobileMenu'
import SingIn from './SingIn'
import { ClerkLoaded, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import AnnouncementBar from '../../home/AnnouncementBar'
import SearchPanel from '../../home/SearchPanel'

const Header = () => {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <AnnouncementBar />
            <header className="sticky top-0 z-50 py-4 bg-eshop-bgMain/90 backdrop-blur-xl shadow-sm/50 shadow-eshop-accent">
                <Container className='flex items-center justify-between text-danashop-textPrimary'>
                    <div className='flex w-auto md:w-1/3 items-center justify-start gap-2.5 md:gap-0'>
                        <MobileMenu />
                        <Logo className='hidden md:block' />
                    </div>
                    <HeaderMenu />
                    <div className='flex w-auto md:w-1/3 items-center justify-end gap-2.5 md:gap-5'>
                        {/* Búsqueda */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            aria-label="Buscar productos"
                            className="hidden md:inline-flex p-1.5 rounded-full hover:bg-eshop-formsBackground hover:text-eshop-accent transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        {/* Comprar ahora (desktop) */}
                        <Link
                            href="/tienda"
                            className="hidden xl:inline-flex items-center gap-1.5 bg-eshop-buttonBase hover:bg-eshop-buttonHover text-eshop-textDark font-bold text-sm px-5 py-2 rounded-full transition-colors"
                        >
                            Comprar ahora
                        </Link>
                        <OrdersButton />
                        <CartButton />
                        <FavoriteButton />
                        <ClerkLoaded>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                            <SignedOut>
                                <SingIn />
                            </SignedOut>
                        </ClerkLoaded>
                    </div>
                </Container>
            </header>
            <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    )
}

export default Header
