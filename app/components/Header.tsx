import React from 'react'
import Container from './Container'
import Logo from './Logo'
import HeaderMenu from './HeaderMenu'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import FavoriteButton from './FavoriteButton'
import MobileMenu from './MobileMenu'
import SingIn from './SingIn'
import { ClerkLoaded, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const Header = () => {
    return (
        <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-xl shadow-sm">
            <Container className='flex items-center justify-between text-lightColor'> 
                <div className='flex w-auto md:w-1/3 items-center justify-start gap-2.5 md:gap-0'>
                    <MobileMenu/>
                    <Logo/>
                </div>
                <HeaderMenu/>
                <div className='flex w-auto md:w-1/3 items-center justify-end gap-5'>
                    <SearchBar/>
                    <CartIcon/>
                    <FavoriteButton/>
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
    )
}

export default Header