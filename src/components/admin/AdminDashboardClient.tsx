'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShoppingBag, Box, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const CHART_HEIGHT = 280;

type ChartPoint = { name: string; Sales: number; Orders: number };

function SalesAreaChart({ data }: { data: ChartPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const { width } = el.getBoundingClientRect();
      if (width > 0) {
        setSize({ width: Math.floor(width), height: CHART_HEIGHT });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-w-0"
      style={{ height: CHART_HEIGHT }}
    >
      {size ? (
        <AreaChart
          width={size.width}
          height={size.height}
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C2B29F" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#C2B29F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(28,26,23,0.03)" />
          <XAxis dataKey="name" stroke="#A89885" strokeWidth={0.5} tickLine={false} />
          <YAxis stroke="#A89885" strokeWidth={0.5} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'rgba(28,26,23,0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#FAF9F6',
            }}
            itemStyle={{ color: '#C2B29F' }}
          />
          <Area
            type="monotone"
            dataKey="Sales"
            stroke="#C2B29F"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      ) : (
        <div className="h-full w-full flex items-center justify-center text-stone-400 font-sans text-xs">
          Loading chart…
        </div>
      )}
    </div>
  );
}

interface AdminDashboardClientProps {
  stats: {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    activeOrders: number;
    lowStockCount: number;
  };
  lowStock: { id: string; name: string; countInStock: number; price: number; slug: string }[];
  chartData: ChartPoint[];
}

export function AdminDashboardClient({ stats, lowStock, chartData }: AdminDashboardClientProps) {
  return (
    <div className="flex flex-col gap-8 font-sans animate-fade-up">
      {/* 1. Page Title */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] tracking-[0.25em] font-bold text-stone-400 uppercase">Management Control</span>
        <h1 className="font-serif text-3xl font-light text-charcoal">Studio Overview</h1>
      </div>

      {/* 2. Numeric Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-stone-400">Total Sales</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-charcoal shrink-0 font-serif font-bold text-sm">
              ৳
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-semibold text-charcoal">
              {formatCurrency(stats.totalSales)}
            </span>
            <span className="text-[9px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +12% vs last month
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-stone-400">Fulfillments</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-charcoal shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-semibold text-charcoal">
              {stats.totalOrders}
            </span>
            <span className="text-[9px] font-bold text-stone-400 mt-1">
              {stats.activeOrders} pending dispatch
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-stone-400">Stoneware Types</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-charcoal shrink-0">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-semibold text-charcoal">
              {stats.totalProducts}
            </span>
            <span className="text-[9px] font-bold text-stone-400 mt-1">
              In stock categories
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-bold text-stone-400">Guest Accounts</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-charcoal shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-semibold text-charcoal">
              {stats.totalCustomers}
            </span>
            <span className="text-[9px] font-bold text-primary mt-1">
              Registered customers
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recharts Sales Widget & Low Stock panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Container (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-charcoal/5 pb-3">
            <h3 className="font-serif text-sm font-semibold text-charcoal">Monthly Sales Curve</h3>
            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 bg-sand px-2.5 py-1 rounded">
              Revenue (৳)
            </span>
          </div>

          <div className="w-full min-w-0 text-xs font-medium">
            <SalesAreaChart data={chartData} />
          </div>
        </div>

        {/* Low Stock Alerts list (1 col) */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-charcoal/5 pb-3">
            <h3 className="font-serif text-sm font-semibold text-charcoal">Low Stock Monitor</h3>
            <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400 bg-sand px-2.5 py-1 rounded">
              Limit: &lt; 5
            </span>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[280px]">
            {lowStock.length > 0 ? (
              lowStock.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-yellow-200/50 bg-yellow-50/15 gap-4"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-bold text-charcoal truncate">{prod.name}</span>
                    <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                      Price: {formatCurrency(prod.price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0 bg-yellow-100 text-yellow-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{prod.countInStock} left</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-10 text-stone-400">
                <Box className="w-8 h-8 text-stone-300" />
                <span className="text-xs font-semibold text-stone-400">All inventory levels normal</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardClient;
