'use client'

import { SignInButton } from '@clerk/nextjs'
import React from 'react'

export default function SignIn() {
    return (
        <SignInButton mode='modal'>
            <button className='text-base tracking-wide font-semibold hover:text-eshop-buttonBase text-eshop-textPrimary hoverEffect'>
                Login
            </button>
        </SignInButton>
  )
}