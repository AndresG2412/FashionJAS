import React from 'react'
import Container from './components/Container'
import HomeBanner from './components/HomeBanner'

function page() {
    return (
        <Container className="text-black p-10">
            <HomeBanner/>
            <div className="py-10">
            </div>
        </Container>
    )
}

export default page
