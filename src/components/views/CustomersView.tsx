import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";  // Đảm bảo đường dẫn đúng với AdminContext của bạn

const CustomersView: React.FC = () => {
  const { customers, loading, error } = useAdmin();  // Lấy dữ liệu khách hàng từ AdminContext
  const [formattedCustomers, setFormattedCustomers] = useState<any[]>([]);

  useEffect(() => {
    if (customers.length > 0) {
      const formattedData = customers.map((customer: any) => ({
        id: customer._id,
        name: customer.username,
        email: customer.email,
        orders: customer.carts ? customer.carts.length : 0,
        createdAt: customer.createAt,
        avatar: `https://ui-avatars.com/api/?name=${customer.username}`,
      }));

      setFormattedCustomers(formattedData);
    }
  }, [customers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customers</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formattedCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={customer.avatar}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.orders}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersView;
