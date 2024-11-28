import React from 'react';
import { BarChart3, Users, Package, MessageSquare, TruckIcon, Menu, Ticket, LayersIcon, UserCog, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', id: 'dashboard' },
    { icon: UserCog, label: 'Admin Management', id: 'admins' },
    { icon: Users, label: 'Customers', id: 'customers' },
    { icon: Package, label: 'Products', id: 'products' },
    { icon: MessageSquare, label: 'Feedback', id: 'feedback' },
    { icon: TruckIcon, label: 'Orders', id: 'orders' },
    { icon: Ticket, label: 'Vouchers', id: 'vouchers' },
    { icon: LayersIcon, label: 'Categories & Suppliers', id: 'categories-suppliers' },
  ];

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AdminProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          menuItems={menuItems}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{user.email}</span>
                <button
                  onClick={logout}
                  className="p-2 rounded-md hover:bg-gray-100 text-gray-600 flex items-center gap-2"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <Dashboard />
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppContent />
    </AuthProvider>
  );
}

export default App;