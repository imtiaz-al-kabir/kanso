import React from 'react';
import { getDashboardAnalyticsAction } from '@/actions/orderActions';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const res = await getDashboardAnalyticsAction();

  // Handle empty or error states gracefully
  const stats = res.success && res.stats 
    ? res.stats 
    : { totalSales: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0, activeOrders: 0, lowStockCount: 0 };
    
  const lowStock = res.success && res.lowStock ? res.lowStock : [];
  const chartData = res.success && res.chartData ? res.chartData : [];

  return (
    <AdminDashboardClient
      stats={stats}
      lowStock={lowStock}
      chartData={chartData}
    />
  );
}
