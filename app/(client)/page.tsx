import React from 'react'
import Container from '../components/Container'
import HomeBanner from '../components/HomeBanner'
import ProductGrid from '../components/ProductGrid'

function page() {
    return (
        <Container className="text-danashop-textPrimary md:p-5">
            <HomeBanner/>
            <ProductGrid/>
        </Container>
    )
}

export default page
