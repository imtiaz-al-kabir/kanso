import React from 'react';
import { getAdminOrdersAction } from '@/actions/orderActions';
import OrderManager from '@/components/admin/OrderManager';

export default async function AdminOrdersPage() {
  const res = await getAdminOrdersAction();
  const orders = res.success && res.orders ? res.orders : [];

  return <OrderManager orders={orders as any} />;
}
