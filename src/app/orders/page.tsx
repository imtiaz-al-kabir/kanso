import { getMyOrdersAction } from "@/actions/orderActions";
import { getAuthUser } from "@/lib/auth";
import { Calendar, ChevronRight, CreditCard, Inbox } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Orders | KANSO Curation",
  description: "Review your order fulfillment history and COD schedules.",
};

import { formatCurrency } from "@/lib/utils";

export default async function MyOrdersPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/auth/login");
  }

  const res = await getMyOrdersAction();
  const orders = res.success && res.orders ? res.orders : [];


  return (
    <div className="flex flex-col gap-12 w-full animate-fade-up font-sans">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase">
          Curation History
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-light text-charcoal tracking-tight">
          My Orders
        </h1>
      </div>

      {orders.length > 0 ? (
        <div className="flex flex-col gap-5 max-w-3xl">
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shadow-xs hover:border-charcoal/30 transition-all duration-300"
            >
              <div className="flex flex-col gap-1">
                <span className="font-serif text-sm font-semibold text-charcoal">
                  Order #{order.id.slice(-6).toUpperCase()}
                </span>

                {/* Meta details row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-300" />
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="hidden md:inline text-stone-300">•</span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-stone-300" />
                    Method:{" "}
                    {order.paymentMethod === "WhatsApp"
                      ? "WhatsApp Preorder"
                      : "Cash on Delivery"}
                  </span>
                </div>
              </div>

              {/* Status and price block */}
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-charcoal/5 pt-4 md:pt-0">
                <div className="flex flex-col md:items-end gap-1">
                  <span className="font-sans text-xs font-bold text-charcoal">
                    {formatCurrency(order.totalPrice)}
                  </span>
                  <div className="flex gap-1.5 mt-0.5">
                    {/* Status badge */}
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        order.status === "Pending"
                          ? "bg-yellow-50 text-yellow-800"
                          : order.status === "Processing"
                            ? "bg-blue-50 text-blue-800"
                            : order.status === "Shipped"
                              ? "bg-orange-50 text-orange-800"
                              : order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-800"
                                : "bg-red-50 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    {/* Paid status badge */}
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        order.isPaid
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-stone-300 hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty history log */
        <div className="glass-panel p-16 rounded-2xl flex flex-col items-center justify-center text-center gap-5 py-28 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center text-stone-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-charcoal">
            No order logs found
          </h2>
          <p className="font-sans text-xs text-stone-400 max-w-xs leading-relaxed font-light">
            You haven't placed any orders with KANSO yet. Settle curations in
            the checkout panel to load history.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="bg-charcoal text-sand text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-stone-800 transition-colors shadow-lg"
            >
              Start Curation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
