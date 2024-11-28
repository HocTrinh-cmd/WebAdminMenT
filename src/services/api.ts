import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function for handling API responses
const handleApiResponse = async (apiCall: Promise<any>) => {
  try {
    const response = await apiCall;
    return response.data?.data || [];
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("An error occurred while fetching data.");
  }
};

// Auth APIs
export const login = (data: { email: string; password: string }) =>
  api.post('/users/login', data);

// Admin APIs
export const getAllAdmins = async () => {
  const response = await api.get('/users/admins');
  return response.data.data || [];
};

export const addAdmin = (data: {
  email: string;
  username: string;
  password: string;
  role: 'Admin';
}) => api.post('/users/registerAdmin', data);

export const updateAdmin = (id: string, data: {
  email?: string;
  username?: string;
  password?: string;
}) => api.put(`/users/${id}`, data);

export const deleteAdmin = (id: string) =>
  api.delete(`/users/${id}`);

// Product APIs
export const getAllProducts = () => handleApiResponse(api.get('/products/getallproduct'));

export const getProductById = (id: string) =>
  handleApiResponse(api.get(`/products/getproductID/${id}`));

export const getProductsByCategory = (categoryId: string) =>
  handleApiResponse(api.get(`/products/getproductbycate/${categoryId}`));

export const addProduct = (data: {
  name: string;
  price: number;
  quantity: number;
  images: string[];
  category: string;
  supplier: string;
  description: string;
}) => api.post('/products/addproduct', data);

export const updateProduct = (id: string, data: {
  name: string;
  price: number;
  quantity: number;
  category_id: string;
  supply_id: string;
  description: string;
  discount: number;
  images: string[];
}) => api.put(`/products/update_product/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/delete/${id}`);

// Category APIs
export const getAllCategories = () => handleApiResponse(api.get('/categories/getallCate'));

export const addCategory = (data: {
  name: string;
  brand: string;
  image: string[];
}) => api.post('/categories/addCate', data);

export const updateCategory = (id: string, data: {
  name: string;
  brand: string;
  image: string[];
}) => api.put(`/categories/updateCate/${id}`, data);

export const deleteCategory = (id: string) =>
  api.delete(`/categories/deleteCate/${id}`);

// Supplier APIs
export const getAllSuppliers = () => handleApiResponse(api.get('/supplys'));

export const addSupplier = (data: {
  name: string;
}) => api.post('/supplys/addSupplier', data);

export const updateSupplier = (id: string, data: {
  name: string;
}) => api.put(`/supplys/updateSupplier/${id}`, data);

export const deleteSupplier = (id: string) =>
  api.delete(`/supplys/deleteSupplier/${id}`);

// Customer APIs
export const getAllCustomers = () => handleApiResponse(api.get('/users/customers'));

// Order APIs
export const getAllOrders = () => handleApiResponse(api.get('/carts/all'));

export const updateOrderStatus = (id: string, status: String) =>
  api.put(`/carts/status/${id}`, { status });

// Feedback APIs
export const getAllFeedbacks = () => handleApiResponse(api.get('/feedbacks/getfeedbacks'));

export const getProductFeedbacks = (productId: string) =>
  handleApiResponse(api.get(`/feedbacks/getfeedback/${productId}`));

// Voucher APIs
export const createVoucher = (data: {
  code: string;
  description: string;
  discountValue: number;
  minimumOrder: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
}) => api.post('/vouchers/createVoucher', data);

export const getAllVouchers = () => handleApiResponse(api.get(`/vouchers`))

export const updateVoucher = (id: string, data: {
  code: string;
  description: string;
  discountValue: number;
  minimumOrder: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
}) => api.put(`/vouchers/${id}`, data);

export const deleteVoucher = (id: string) =>
  api.delete(`/vouchers/deleteVoucher/${id}`);
