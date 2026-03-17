import React from 'react'
import Container from '../components/Container'
import HomeBanner from '../components/client/welcome/HomeBanner'
import ProductGrid from '../components/client/welcome/ProductGrid'

function page() {
    return (
        <Container className="text-danashop-textPrimary md:p-5">
            <HomeBanner/>
            <ProductGrid/>
        </Container>
    )
}

export default page
