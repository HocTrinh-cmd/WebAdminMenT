import React, { useState, useEffect } from "react";
import { Package, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "../../services/api";

interface Product {
  _id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
}

interface User {
  _id: string;
  name: string;
}

interface Order {
  _id: string;
  user: User;
  paymentMethod: string;
  paymentStatus: string;
  products: Product[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

const OrdersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Order["status"] | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        const formattedOrders = data.map((order: any) => ({
          _id: order._id,
          user: order.user,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          products: order.products,
          total: order.total,
          status: order.status,
          date: new Date(order.date).toLocaleDateString("vi-VN"),
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="mr-1" />;
      case "processing":
        return <Package size={16} className="mr-1" />;
      case "shipped":
        return <Package size={16} className="mr-1" />;
      case "delivered":
        return <CheckCircle size={16} className="mr-1" />;
      case "cancelled":
        return <XCircle size={16} className="mr-1" />;
    }
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Orders</h2>

      <div className="mb-6 flex space-x-2">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status as Order["status"] | "all")}
            className={`px-4 py-2 rounded-lg ${activeTab === status
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">#{order._id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.products.length}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.total.toLocaleString("vi-VN")} VNĐ
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye size={18} />
                  </button>
                  <select
                    className={`text-sm border border-gray-300 rounded-md p-1 focus:outline-none ${order.status === "delivered" || order.status === "cancelled"
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-blue-500"
                      }`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value as Order["status"])}
                    disabled={order.status === "delivered" || order.status === "cancelled"}
                  >
                    {order.status === "pending" && (
                      <>
                        <option value="pending">Pending</option>
                        <option value="processing">Update to: Processing</option>
                      </>
                    )}
                    {order.status === "processing" && (
                      <>
                        <option value="processing">Processing</option>
                        <option value="shipped">Update to: Shipped</option>
                      </>
                    )}
                    {order.status === "shipped" && (
                      <>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Update to: Delivered</option>
                      </>
                    )}
                    {order.status === "delivered" && (
                      <option value="delivered" disabled>
                        Delivered
                      </option>
                    )}
                    {order.status === "cancelled" && (
                      <option value="cancelled" disabled>
                        Cancelled
                      </option>
                    )}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details #{selectedOrder._id}</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.products.map((product) => (
                      <tr key={product._id}>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg mr-4" />
                            <span className="text-sm font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm">{product.quantity}</td>
                        <td className="px-4 py-2 text-sm">{product.price.toLocaleString("vi-VN")} VNĐ</td>
                        <td className="px-4 py-2 text-sm">
                          {(product.price * product.quantity).toLocaleString("vi-VN")} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
