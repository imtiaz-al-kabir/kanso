'use client';

import React, { useState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FolderHeart, Check, MessageSquare, Truck, DollarSign, Calendar, RefreshCw, XCircle } from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { updateOrderStatusAction, updateOrderPaymentAction } from '@/actions/orderActions';
import Button from '../ui/Button';

interface OrderItem {
  id: string;
  customer: { name: string; email: string };
  createdAt: string;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  isPaid: boolean;
  paidAt: string | null;
  isDelivered: boolean;
  deliveredAt: string | null;
  paymentMethod: 'COD' | 'WhatsApp';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant: string;
    image: string;
  }[];
}

interface OrderManagerProps {
  orders: OrderItem[];
}

export function OrderManager({ orders }: OrderManagerProps) {
  const router = useRouter();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered'>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'pending') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (activeTab === 'delivered') return o.status === 'Delivered';
    return true;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    const res = await updateOrderStatusAction(orderId, newStatus);
    setIsUpdating(false);

    if (res.success) {
      toast(`Order status updated to ${newStatus}`, 'success');
      // Update local detailed view if active
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus as any,
          isDelivered: newStatus === 'Delivered' ? true : selectedOrder.isDelivered,
          deliveredAt: newStatus === 'Delivered' ? new Date().toISOString() : selectedOrder.deliveredAt,
        });
      }
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast('Failed to update status', 'error');
    }
  };

  const handleTogglePayment = async (orderId: string, newPaidState: boolean) => {
    setIsUpdating(true);
    const res = await updateOrderPaymentAction(orderId, newPaidState);
    setIsUpdating(false);

    if (res.success) {
      toast(newPaidState ? 'Order marked as PAID' : 'Order marked as UNPAID', 'success');
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          isPaid: newPaidState,
          paidAt: newPaidState ? new Date().toISOString() : null,
        });
      }
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast('Failed to update payment status', 'error');
    }
  };

  // WhatsApp Follow-up Integration for Merchants!
  const triggerWhatsAppFollowUp = (order: OrderItem) => {
    const message = `*KANSO STORE SHIPPING UPDATE*%0A%0AHello *${order.shippingAddress.fullName}*,%0A%0AThis is KANSO Support reaching out regarding your curation order *%23${order.id}*.%0A%0A*Shipment Status:* ${order.status}%0A*Items Breakdown:*%0A${order.items.map(i => `• ${i.name} (x${i.quantity})`).join('%0A')}%0A*Total Invoice:* $${order.totalPrice.toFixed(2)}%0A%0A_If you need any adjustments or express shipment scheduling, please let us know here!_`;
    
    const url = `https://wa.me/${order.shippingAddress.phone.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(url, '_blank');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans animate-fade-up">
      {/* 1. Orders List column (2 cols) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl font-light text-charcoal">Fulfillment Hub</h2>
          <p className="text-xs text-stone-500 font-light">Dispatches, cash settlement validations, and client communications.</p>
        </div>

        {/* Tab filters */}
        <div className="flex gap-2 border-b border-charcoal/5 pb-2">
          {['all', 'pending', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-charcoal text-sand shadow-sm'
                  : 'text-stone-500 hover:bg-charcoal/5 hover:text-charcoal'
              }`}
            >
              {tab === 'all' ? 'All Orders' : tab === 'pending' ? 'Active / Queue' : 'Delivered'}
            </button>
          ))}
        </div>

        {/* List card elements */}
        {filteredOrders.length > 0 ? (
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`glass-panel p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between cursor-pointer transition-all duration-300 shadow-xs ${
                  selectedOrder?.id === order.id
                    ? 'border-charcoal ring-2 ring-charcoal/5 bg-sand/80 scale-100.5 shadow-md'
                    : 'hover:border-charcoal/30'
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-serif text-sm font-semibold text-charcoal">
                    #{order.id.slice(-6).toUpperCase()} — {order.shippingAddress.fullName}
                  </span>
                  <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3 h-3 text-stone-300" />
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <p className="text-[10px] text-stone-500 font-light truncate max-w-[200px] mt-1">
                    {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end gap-3 sm:gap-1.5 w-full sm:w-auto border-t sm:border-t-0 border-charcoal/5 pt-3 sm:pt-0 justify-between">
                  <span className="font-sans text-xs font-bold text-charcoal">
                    {formatCurrency(order.totalPrice)}
                  </span>
                  
                  <div className="flex gap-2">
                    {/* Status badge */}
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        order.status === 'Pending'
                          ? 'bg-yellow-50 text-yellow-800'
                          : order.status === 'Processing'
                          ? 'bg-blue-50 text-blue-800'
                          : order.status === 'Shipped'
                          ? 'bg-orange-50 text-orange-800'
                          : order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {order.status}
                    </span>

                    {/* Payment badge */}
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        order.isPaid ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center gap-3 py-24">
            <FolderHeart className="w-8 h-8 text-stone-400" />
            <h3 className="font-serif text-sm font-semibold text-charcoal">No Orders Found</h3>
            <p className="text-xs text-stone-400 font-light max-w-xs leading-relaxed">
              No merchant logs match the selected queue tab filter.
            </p>
          </div>
        )}
      </div>

      {/* 2. Order details column (1 col) */}
      <div className="flex flex-col gap-6">
        <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">Fulfillment Details</span>
        
        {selectedOrder ? (
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 shadow-sm border border-charcoal/5 animate-fade-up">
            {/* Header meta */}
            <div className="flex flex-col gap-1 border-b border-charcoal/5 pb-3">
              <span className="font-serif text-sm font-semibold text-charcoal">
                Order #{selectedOrder.id}
              </span>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                Method: {selectedOrder.paymentMethod}
              </span>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2 text-xs">
              <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">Client & Address</span>
              <div className="flex flex-col text-stone-500 font-light leading-relaxed">
                <span className="font-bold text-charcoal">{selectedOrder.shippingAddress.fullName}</span>
                <span>{selectedOrder.shippingAddress.address}</span>
                <span>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode},{' '}
                  {selectedOrder.shippingAddress.country}
                </span>
                <span className="font-bold text-charcoal mt-1">📞 {selectedOrder.shippingAddress.phone}</span>
              </div>
            </div>

            {/* Items showcase */}
            <div className="flex flex-col gap-3">
              <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">Cargo Breakdown</span>
              <div className="flex flex-col gap-2.5 max-h-36 overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4 text-xs">
                    <span className="text-stone-500 font-medium truncate max-w-[70%]">
                      {item.name} <span className="font-bold text-stone-400">x{item.quantity}</span>
                    </span>
                    <span className="text-charcoal font-bold shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Modifiers Form */}
            <div className="flex flex-col gap-3 border-t border-charcoal/5 pt-4">
              <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">Operational Actions</span>
              
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 text-[10px] font-sans text-stone-400 font-semibold">
                  <span>Shipment Status ({selectedOrder.status})</span>
                  <select
                    value={selectedOrder.status}
                    disabled={isUpdating}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="w-full bg-sand/60 border border-charcoal/5 px-3 py-2 rounded-lg text-xs font-bold text-charcoal focus:outline-none focus:border-charcoal cursor-pointer"
                  >
                    <option value="Pending">Pending Queue</option>
                    <option value="Processing">Processing / Packaged</option>
                    <option value="Shipped">Shipped / Dispatched</option>
                    <option value="Delivered">Delivered / Settled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex gap-2 mt-1">
                  {/* Payment toggle */}
                  <Button
                    type="button"
                    variant={selectedOrder.isPaid ? 'outline' : 'glass'}
                    size="sm"
                    className="flex-1 text-[10px]"
                    disabled={isUpdating}
                    onClick={() => handleTogglePayment(selectedOrder.id, !selectedOrder.isPaid)}
                  >
                    {selectedOrder.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                  </Button>

                  {/* WhatsApp Follow-up Link */}
                  <button
                    onClick={() => triggerWhatsAppFollowUp(selectedOrder)}
                    className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 font-sans text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    WhatsApp Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center text-stone-400 py-16">
            <RefreshCw className="w-6 h-6 animate-pulse text-stone-300" />
            <span className="text-xs font-semibold text-stone-400 mt-3">Select an order card to review details</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderManager;
