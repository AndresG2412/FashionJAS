import React from 'react'
import Container from './components/Container'
import HomeBanner from './components/HomeBanner'
import ProductGrid from './components/ProductGrid'

function page() {
    return (
        <Container className="text-black p-10">
            <HomeBanner/>
            <ProductGrid/>
        </Container>
    )
}

export default page
