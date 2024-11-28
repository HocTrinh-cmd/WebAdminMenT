import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,
} from "chart.js";
import { format, subDays } from "date-fns";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

const StatsView: React.FC = () => {
  const { customers, orders, loading } = useAdmin();
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [],
  });
  const [monthlyRevenueData, setMonthlyRevenueData] = useState({
    labels: [],
    datasets: [],
  });


  // Tính toán tổng doanh thu
  const calculateTotalRevenue = (orders: any[]) => {
    return orders
      ?.filter((order) => order.status === "delivered") // Chỉ lấy đơn hàng delivered
      .reduce((acc, order) => acc + (order.total || 0), 0) || 0;
  };


  // Lấy thông tin doanh thu hiện tại và tháng trước
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const getRevenueByMonth = (orders: any[], month: number, year: number) => {
    return orders
      ?.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          order.status === "delivered" &&
          orderDate.getMonth() === month &&
          orderDate.getFullYear() === year
        );
      })
      .reduce((acc, order) => acc + order.total, 0) || 0;
  };

  const currentMonthRevenue = getRevenueByMonth(orders, currentMonth, currentYear);
  const lastMonthRevenue = getRevenueByMonth(orders, lastMonth, lastMonthYear);

  const monthlyGrowthRate = lastMonthRevenue
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  const deliveredOrdersCount = orders?.filter(
    (order) => order.status === "delivered"
  ).length;

  const getDailyRevenue = (orders: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i); // Tạo danh sách 7 ngày gần đây
      return format(date, "yyyy-MM-dd");
    }).reverse();

    const revenueByDay = last7Days.map((date) => {
      const totalRevenueForDay = orders
        .filter(
          (order) =>
            order.status === "delivered" &&
            format(new Date(order.date), "yyyy-MM-dd") === date
        )
        .reduce((sum, order) => sum + order.total, 0);

      return totalRevenueForDay;
    });

    return {
      labels: last7Days.map((date) => format(new Date(date), "MMM dd")), // Hiển thị dạng 'Nov 19'
      data: revenueByDay,
    };
  };

  const getMonthlyRevenue = (orders: any[]) => {
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = Array.from({ length: 12 }, (_, month) => {
      const totalRevenue = orders
        ?.filter((order) => {
          const orderDate = new Date(order.date);
          return (
            order.status === "delivered" &&
            orderDate.getMonth() === month &&
            orderDate.getFullYear() === currentYear
          );
        })
        .reduce((acc, order) => acc + order.total, 0);
      return totalRevenue || 0;
    });

    return {
      labels: Array.from({ length: 12 }, (_, i) =>
        format(new Date(currentYear, i, 1), "MMM")
      ), // Hiển thị tháng như "Jan", "Feb",...
      data: monthlyRevenue,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!loading) {
        const dailyRevenue = getDailyRevenue(orders);
        const monthlyRevenue = getMonthlyRevenue(orders);

        setRevenueData({
          labels: dailyRevenue.labels as any,
          datasets: [
            {
              label: "Daily Revenue",
              data: dailyRevenue.data,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ] as any,
        });

        setMonthlyRevenueData({
          labels: monthlyRevenue.labels as any,
          datasets: [
            {
              label: "Monthly Revenue",
              data: monthlyRevenue.data,
              fill: false,
              borderColor: "rgb(255, 99, 132)",
              tension: 0.1,
            },
          ] as any,
        });
      }
    };

    fetchData();
  }, [loading, orders]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Daily Revenue (Last 7 Days)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            if (typeof value === "number") {
              return `${value.toLocaleString('vi-VN')} VNĐ`;
            }
            return value;
          },
        },

      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalRevenue(orders).toLocaleString('vi-VN')} VNĐ
              </p>
              <p className="text-sm text-green-600">
                {monthlyGrowthRate > 0 ? "+" : ""}
                {monthlyGrowthRate.toFixed(1)}% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {deliveredOrdersCount}
              </p>
              <p className="text-sm text-blue-600">+12.5% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customers?.length || 0}
              </p>
              <p className="text-sm text-purple-600">+8.2% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">2.4%</p>
              <p className="text-sm text-yellow-600">+4.1% from last month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <Line options={options} data={revenueData} />
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <Line
          options={{
            ...options,
            plugins: {
              ...options.plugins,
              title: {
                display: true,
                text: "Monthly Revenue (Current Year)",
              },
            },
          }}
          data={monthlyRevenueData}
        />
      </div>
    </div>
  );
};

export default StatsView;
