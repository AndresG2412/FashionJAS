'use client'

import { SignInButton } from '@clerk/nextjs'
import React from 'react'

export default function SignIn() {
    return (
        <SignInButton mode='modal'>
            <button className='text-base tracking-wide font-semibold text-shop-darkColor  hover:text-shop-light-green text-lightColor hoverEffect'>
                Login
            </button>
        </SignInButton>
  )
}