import { getAllOrdersAdmin } from '@/lib/firebase/admin';
import OrdersTable from '@/app/components/admin/OrdersTable';
import Container from '@/app/components/Container';

export default async function OrdersPage() {
  const orders = await getAllOrdersAdmin();

  return (
    <Container>
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-1">
            {orders.length} pedido(s) registrado(s)
          </p>
        </div>

        <OrdersTable initialOrders={orders} />
      </div>
    </Container>
  );
}