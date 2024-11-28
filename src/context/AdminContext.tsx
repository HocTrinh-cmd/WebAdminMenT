import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllProducts, getAllCategories, getAllSuppliers, getAllCustomers, getAllFeedbacks, getAllOrders, getAllVouchers } from '../services/api';
import { Product, Category, Supplier, User, Feedback, Voucher, Order } from '../types';
import toast from 'react-hot-toast';

interface AdminContextType {
  activeView: string;
  setActiveView: (view: string) => void;
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  customers: User[];
  feedbacks: Feedback[];
  orders: Order[];
  vouchers: Voucher[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, suppliersData, customersData, feedbacksData, ordersData, vouchersData] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getAllSuppliers(),
        getAllCustomers(),
        getAllFeedbacks(),
        getAllOrders(),
        getAllVouchers(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
      setCustomers(customersData);
      setFeedbacks(feedbacksData);
      setOrders(ordersData);
      setVouchers(vouchersData);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast.error('Failed to fetch data');
      setProducts([]);
      setCategories([]);
      setSuppliers([]);
      setCustomers([]);
      setFeedbacks([]);
      setOrders([]);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    activeView,
    setActiveView,
    products,
    categories,
    suppliers,
    customers,
    feedbacks,
    orders,
    vouchers,
    loading,
    error,
    refreshData: fetchData,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
