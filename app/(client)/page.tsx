import React from 'react'
import Hero from '../components/home/Hero'
import CategoriesSection from '../components/home/CategoriesSection'
import Benefits from '../components/home/Benefits'
import FeaturedProducts from '../components/home/FeaturedProducts'
import CampaignBanner from '../components/home/CampaignBanner'
import LooksSection from '../components/home/LooksSection'
import Testimonials from '../components/home/Testimonials'
import Newsletter from '../components/home/Newsletter'

function page() {
    return (
        <>
            <Hero />
            <CategoriesSection />
            <Benefits />
            <FeaturedProducts />
            <CampaignBanner />
            <LooksSection />
            <Testimonials />
            <Newsletter />
        </>
    )
}

export default page
