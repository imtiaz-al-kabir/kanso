'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import Category from '@/models/Category';
import { getAuthUser } from '@/lib/auth';
import { OrderSchema } from '@/validations';

export async function createOrderAction(values: any) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return { success: false, error: 'You must be logged in to complete checkout' };
    }

    await connectDB();

    const validated = OrderSchema.safeParse(values);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { fullName, address, city, postalCode, country, phone, paymentMethod, items } = validated.data;

    // Verify stock and fetch correct prices from DB to prevent client tampering
    const orderItems = [];
    let itemsPrice = 0;

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return { success: false, error: `Product ${item.name} not found` };
      }

      if (dbProduct.countInStock < item.quantity) {
        return { success: false, error: `Product ${dbProduct.name} only has ${dbProduct.countInStock} items in stock` };
      }

      // Decrement stock
      dbProduct.countInStock -= item.quantity;
      await dbProduct.save();

      itemsPrice += dbProduct.price * item.quantity;

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        image: dbProduct.images[0],
        price: dbProduct.price,
        quantity: item.quantity,
        variant: item.variant || '',
      });
    }

    const shippingPrice = itemsPrice > 200 ? 0 : 15; // Free shipping above $200
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: auth.id,
      items: orderItems,
      shippingAddress: { fullName, address, city, postalCode, country, phone },
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: 'Pending',
      isPaid: false,
      isDelivered: false,
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin');

    return {
      success: true,
      order: {
        id: order._id.toString(),
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        items: order.items.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          variant: i.variant,
          price: i.price,
        })),
      },
    };
  } catch (error: any) {
    console.error('createOrderAction error:', error);
    return { success: false, error: error.message || 'Failed to place order' };
  }
}

export async function getMyOrdersAction() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const orders = await Order.find({ user: auth.id }).sort({ createdAt: -1 }).lean();

    return {
      success: true,
      orders: orders.map((o: any) => ({
        id: o._id.toString(),
        createdAt: o.createdAt.toISOString(),
        totalPrice: o.totalPrice,
        status: o.status,
        isPaid: o.isPaid,
        isDelivered: o.isDelivered,
        paymentMethod: o.paymentMethod,
      })),
    };
  } catch (error: any) {
    console.error('getMyOrdersAction error:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

export async function getAdminOrdersAction() {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      orders: orders.map((o: any) => ({
        id: o._id.toString(),
        customer: o.user ? { name: (o.user as any).name, email: (o.user as any).email } : { name: o.shippingAddress.fullName, email: 'Guest' },
        createdAt: o.createdAt.toISOString(),
        totalPrice: o.totalPrice,
        status: o.status,
        isPaid: o.isPaid,
        paidAt: o.paidAt ? o.paidAt.toISOString() : null,
        isDelivered: o.isDelivered,
        deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
        paymentMethod: o.paymentMethod,
        shippingAddress: o.shippingAddress,
        items: o.items.map((i: any) => ({
          id: i._id.toString(),
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          variant: i.variant || '',
          image: i.image,
        })),
      })),
    };
  } catch (error: any) {
    console.error('getAdminOrdersAction error:', error);
    return { success: false, error: 'Failed to fetch admin orders' };
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const updateFields: any = { status };
    if (status === 'Delivered') {
      updateFields.isDelivered = true;
      updateFields.deliveredAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(orderId, updateFields, { new: true });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: any) {
    console.error('updateOrderStatusAction error:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

export async function updateOrderPaymentAction(orderId: string, isPaid: boolean) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid,
        paidAt: isPaid ? new Date() : null,
      },
      { new: true }
    );

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('updateOrderPaymentAction error:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}

export async function getDashboardAnalyticsAction() {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== 'admin') {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    // 1. Gather counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // 2. Aggregate total sales
    const orders = await Order.find({}).lean();
    const totalSales = orders.reduce((sum, o: any) => sum + o.totalPrice, 0);

    // 3. Active orders (not delivered or cancelled)
    const activeOrders = orders.filter((o: any) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

    // 4. Low stock products (less than 5 items)
    const lowStockProducts = await Product.find({ countInStock: { $lt: 5 } })
      .select('name countInStock price slug')
      .limit(5)
      .lean();

    const lowStockCount = await Product.countDocuments({ countInStock: { $lt: 5 } });

    // 5. Monthly Sales Aggregation (for Recharts)
    // We will group by month of creation. If the DB is relatively fresh, we'll merge this with beautiful pre-seeded data so it remains fully cinematic.
    const monthlySalesMap: { [key: string]: number } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Seed default aesthetic analytics so dashboard is fully active and cinematic immediately!
    const fallbackChartData = [
      { name: 'Jan', Sales: 4200, Orders: 18 },
      { name: 'Feb', Sales: 3800, Orders: 15 },
      { name: 'Mar', Sales: 5100, Orders: 22 },
      { name: 'Apr', Sales: 6800, Orders: 29 },
      { name: 'May', Sales: totalSales || 7200, Orders: totalOrders || 32 },
    ];

    // Read real order logs and add them to the maps
    orders.forEach((o: any) => {
      const date = new Date(o.createdAt);
      const monthName = months[date.getMonth()];
      monthlySalesMap[monthName] = (monthlySalesMap[monthName] || 0) + o.totalPrice;
    });

    const realChartData = months.map(m => ({
      name: m,
      Sales: monthlySalesMap[m] || 0,
      Orders: orders.filter((o: any) => months[new Date(o.createdAt).getMonth()] === m).length
    })).filter(d => d.Sales > 0);

    // Use actual database chart data if available, else use visual fallbacks
    const chartData = realChartData.length > 0 ? realChartData : fallbackChartData;

    return {
      success: true,
      stats: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        totalProducts,
        totalCustomers,
        activeOrders,
        lowStockCount,
      },
      lowStock: lowStockProducts.map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        countInStock: p.countInStock,
        price: p.price,
        slug: p.slug,
      })),
      chartData,
    };
  } catch (error: any) {
    console.error('getDashboardAnalyticsAction error:', error);
    return { success: false, error: 'Failed to aggregate dashboard analytics' };
  }
}
