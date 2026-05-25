'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, CheckCircle2, MessageSquare, PhoneCall, ShieldCheck } from 'lucide-react';
import { useStore } from '@/providers/StoreProvider';
import { useToast } from '@/providers/ToastProvider';
import { createOrderAction } from '@/actions/orderActions';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';

const WHATSAPP_PHONE = '1234567890'; // Merchant phone number (change in config)

export default function CheckoutPage() {
  const router = useRouter();
  const toast = useToast();
  const { cart, clearCart } = useStore();

  // Form states
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'WhatsApp'>('COD');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any | null>(null);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  // Validation
  const validateForm = () => {
    if (!fullName.trim()) return 'Name is required';
    if (!address.trim()) return 'Address is required';
    if (!city.trim()) return 'City is required';
    if (!postalCode.trim()) return 'Postal Code is required';
    if (!country.trim()) return 'Country is required';
    if (!phone.trim()) return 'Phone number is required';
    if (phone.trim().length < 8) return 'Please provide a valid phone number';
    if (cart.length === 0) return 'Your cart is empty';
    return null;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      toast(errorMsg, 'error');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      fullName,
      address,
      city,
      postalCode,
      country,
      phone,
      paymentMethod,
      items: cart.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant || '',
      })),
    };

    const res = await createOrderAction(orderData);
    setIsSubmitting(false);

    if (res.success && res.order) {
      toast('Order created successfully!', 'success');
      setCheckoutSuccess(res.order);
      
      const order = res.order;
      
      // WhatsApp Integration Flow
      if (paymentMethod === 'WhatsApp') {
        const orderSummary = order.items
          .map((i: any) => `• ${i.name} (Qty: ${i.quantity}${i.variant ? `, Style: ${i.variant}` : ''}) - ৳${i.price}`)
          .join('%0A');

        const message = `*KANSO LUXURY PREORDER*%0A%0A*Order Reference:* %23${order.id}%0A*Customer:* ${fullName}%0A*Phone:* ${phone}%0A*Shipping Address:* ${address}, ${city}, ${postalCode}, ${country}%0A%0A*Curation Details:*%0A${orderSummary}%0A%0A*Total Amount:* ৳${Math.round(order.totalPrice).toLocaleString('en-IN')}%0A*Payment Channel:* WhatsApp Preorder Confirmation%0A%0A_Please reply to confirm details and initialize delivery!_`;

        const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
        
        // Open WhatsApp link in a new tab
        window.open(waUrl, '_blank');
      }

      clearCart();
    } else {
      toast(res.error || 'Failed to complete checkout', 'error');
    }
  };

  const handleSuccessRedirect = () => {
    router.push('/orders');
  };

  if (checkoutSuccess) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 glass-panel rounded-3xl flex flex-col items-center justify-center text-center gap-6 animate-fade-up font-sans">
        <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[10px] tracking-[0.25em] font-bold text-stone-400 uppercase">Curation Confirmed</span>
          <h2 className="font-serif text-2xl font-light text-charcoal">Order Placed Successfully</h2>
          <p className="text-stone-500 font-light text-xs leading-relaxed max-w-sm">
            Thank you for placing your order with KANSO. Your reference number is <span className="font-bold text-charcoal">#{checkoutSuccess.id}</span>.
          </p>
        </div>

        {checkoutSuccess.paymentMethod === 'WhatsApp' ? (
          <div className="bg-sand/75 rounded-2xl p-4 border border-charcoal/5 text-xs text-stone-500 font-light leading-relaxed flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[10px] justify-center">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>WhatsApp Redirected</span>
            </div>
            We have redirected you to WhatsApp to finalize your payment and shipment schedule. If the chat didn't open, click the button below to retry.
          </div>
        ) : (
          <div className="bg-sand/75 rounded-2xl p-4 border border-charcoal/5 text-xs text-stone-500 font-light leading-relaxed flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold text-stone-400">Cash on Delivery (COD)</span>
            Your shipment will be prepared for packaging. You will settle the bill of <span className="font-bold text-charcoal">{formatCurrency(checkoutSuccess.totalPrice)}</span> at the time of delivery.
          </div>
        )}

        <div className="flex flex-col gap-2 w-full pt-2">
          {checkoutSuccess.paymentMethod === 'WhatsApp' && (
            <button
              onClick={() => {
                const orderSummary = checkoutSuccess.items
                  .map((i: any) => `• ${i.name} (Qty: ${i.quantity}${i.variant ? `, Style: ${i.variant}` : ''}) - ৳${i.price}`)
                  .join('%0A');
                const message = `*KANSO LUXURY PREORDER*%0A%0A*Order Reference:* %23${checkoutSuccess.id}%0A*Customer:* ${fullName}%0A*Phone:* ${phone}%0A*Shipping Address:* ${address}, ${city}, ${postalCode}, ${country}%0A%0A*Curation Details:*%0A${orderSummary}%0A%0A*Total Amount:* ৳${Math.round(checkoutSuccess.totalPrice).toLocaleString('en-IN')}%0A*Payment Channel:* WhatsApp Preorder Confirmation%0A%0A_Please reply to confirm details and initialize delivery!_`;
                window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
              }}
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Open WhatsApp Chat
            </button>
          )}
          <Button onClick={handleSuccessRedirect} variant="outline" className="w-full">
            View My Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 w-full animate-fade-up font-sans">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase">Checkout Gate</span>
        <h1 className="font-serif text-3xl md:text-4xl font-light text-charcoal tracking-tight">Finalize Order</h1>
      </div>

      {cart.length > 0 ? (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Form left (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Address panel */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
              <h3 className="font-serif text-base font-semibold text-charcoal border-b border-charcoal/5 pb-3">Shipping Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Input
                    label="Delivery Address"
                    placeholder="Street name, suite, apartment number"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="City"
                  placeholder="e.g. Tokyo, Stockholm"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />

                <Input
                  label="Postal / ZIP Code"
                  placeholder="e.g. 100-0001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />

                <Input
                  label="Country"
                  placeholder="e.g. Japan, Sweden"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />

                <Input
                  label="Phone Number"
                  placeholder="For shipping notifications"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Payment Method panel */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
              <h3 className="font-serif text-base font-semibold text-charcoal border-b border-charcoal/5 pb-3">Settle Payment</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-charcoal bg-charcoal/5 shadow-xs'
                      : 'border-charcoal/10 hover:border-charcoal/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PhoneCall className={`w-4 h-4 ${paymentMethod === 'COD' ? 'text-charcoal' : 'text-stone-400'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal">Cash on Delivery</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-light leading-relaxed">
                    Settle the complete invoice via cash or card directly to the courier agent upon physical cargo drop.
                  </p>
                </button>

                {/* Option 2: WhatsApp Preorder */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WhatsApp')}
                  className={`p-5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                    paymentMethod === 'WhatsApp'
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                      : 'border-charcoal/10 hover:border-charcoal/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className={`w-4 h-4 ${paymentMethod === 'WhatsApp' ? 'text-emerald-600' : 'text-stone-400'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal">WhatsApp Preorder</span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-light leading-relaxed">
                    Instantly load details to WhatsApp to configure bespoke shipping arrangements and bank transfers with a merchant.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Cart review right (1 col) */}
          <div className="flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
              <h3 className="font-serif text-base font-semibold text-charcoal border-b border-charcoal/5 pb-2">Review Curation</h3>
              
              {/* Short cart summary items list */}
              <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-3 text-xs">
                    <span className="text-stone-500 truncate max-w-[70%] font-medium">
                      {item.name} <span className="font-bold text-stone-400">x{item.quantity}</span>
                    </span>
                    <span className="text-charcoal font-bold shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-charcoal/5" />

              {/* Pricing breakdown */}
              <div className="flex flex-col gap-3 font-sans text-xs text-stone-500 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-charcoal font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-primary font-bold uppercase tracking-wider">Free Shipping</span>
                  ) : (
                    <span className="text-charcoal font-bold">{formatCurrency(shipping)}</span>
                  )}
                </div>
                
                <hr className="border-charcoal/5 my-1" />

                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-charcoal">Invoice Amount</span>
                  <span className="text-charcoal font-bold text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Order Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-4 flex items-center justify-center gap-2 group"
                >
                  {paymentMethod === 'WhatsApp' ? (
                    <>
                      <MessageSquare className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                      Place & Open WhatsApp
                    </>
                  ) : (
                    <>
                      Place Order (COD)
                      <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Secure SSL Gateway</span>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Empty Checkout State */
        <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center gap-4 py-24 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center text-stone-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">No Curation Found</h3>
          <p className="font-sans text-xs text-stone-400 max-w-xs leading-relaxed font-light">
            You cannot perform checkout operations because your shopping cart is currently empty.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="bg-charcoal text-sand text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-stone-800 transition-colors"
            >
              Explore Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
