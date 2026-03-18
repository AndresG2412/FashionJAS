import React from 'react'
import NoAccess from "@/app/components/NoAccess";
import ListaPedidos from "@/app/components/ListaPedidos";
import { auth } from "@clerk/nextjs/server";
import Container from '@/app/components/Container'

export const metadata = {
  title: "Pedidos - Tiendanna",
  description: "Tus productos favoritos",
};

const page = async () => {
    
    const { userId } = await auth();

    return (
        <Container>
            {userId ? (
                <ListaPedidos />
            ) : (
                <NoAccess 
                    details="Inicia sesión para ver tus pedidos. ¡No piedas esta oportunidad!" 
                />
            )}
        </Container>
    )
}

export default page
