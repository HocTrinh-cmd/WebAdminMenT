import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import {
    addCategory,
    updateCategory,
    deleteCategory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
} from '../../services/api';
import { Category, Supplier } from '../../types';
import toast from 'react-hot-toast';

const CategorySupplierView: React.FC = () => {
    const { suppliers, categories, refreshData } = useAdmin();
    const [activeTab, setActiveTab] = useState<'categories' | 'suppliers'>('categories');
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showSupplierForm, setShowSupplierForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        brand: '',
        image: ['']
    });

    const [supplierForm, setSupplierForm] = useState({
        name: ''
    });


    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingCategory) {
                await updateCategory(editingCategory._id, categoryForm);
                toast.success('Category updated successfully');
            } else {
                await addCategory(categoryForm);
                toast.success('Category added successfully');
            }
            setShowCategoryForm(false);
            setEditingCategory(null);
            setCategoryForm({ name: '', brand: '', image: [''] });
            refreshData();
        } catch (err) {
            toast.error(editingCategory ? 'Failed to update category' : 'Failed to add category');
        } finally {
            setLoading(false);
        }
    };

    const handleSupplierSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingSupplier) {
                await updateSupplier(editingSupplier._id, supplierForm);
                toast.success('Supplier updated successfully');
            } else {
                await addSupplier(supplierForm);
                toast.success('Supplier added successfully');
            }
            setShowSupplierForm(false);
            setEditingSupplier(null);
            setSupplierForm({ name: '' });
            refreshData();
        } catch (err) {
            toast.error(editingSupplier ? 'Failed to update supplier' : 'Failed to add supplier');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id);
                toast.success('Category deleted successfully');
                refreshData();
            } catch (err) {
                toast.error('Failed to delete category');
            }
        }
    };

    const handleDeleteSupplier = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await deleteSupplier(id);
                toast.success('Supplier deleted successfully');
                refreshData();
            } catch (err) {
                toast.error('Failed to delete supplier');
            }
        }
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setCategoryForm({
            name: category.name,
            brand: category.brand,
            image: category.image
        });
        setShowCategoryForm(true);
    };

    const handleEditSupplier = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setSupplierForm({
            name: supplier.name
        });
        setShowSupplierForm(true);
    };

    return (
        <div>
            <div className="flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-lg ${activeTab === 'categories'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categories
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${activeTab === 'suppliers'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    onClick={() => setActiveTab('suppliers')}
                >
                    Suppliers
                </button>
            </div>

            {/* Categories Section */}
            {activeTab === 'categories' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
                        <button
                            onClick={() => {
                                setEditingCategory(null);
                                setCategoryForm({ name: '', brand: '', image: [''] });
                                setShowCategoryForm(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Plus size={20} />
                            Add Category
                        </button>
                    </div>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <tr key={category._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={category.image[0]}
                                                        alt={category.name}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://via.placeholder.com/40';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{category.brand}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                            <button
                                                className="bg-blue-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-700"
                                                onClick={() => handleEditCategory(category)}
                                            >
                                                <Pencil size={18} />
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-red-700"
                                                onClick={() => handleDeleteCategory(category._id)}
                                            >
                                                <Trash2 size={18} />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Suppliers Section */}
            {activeTab === 'suppliers' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Suppliers</h2>
                        <button
                            onClick={() => {
                                setEditingSupplier(null);
                                setSupplierForm({ name: '' });
                                setShowSupplierForm(true);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Plus size={20} />
                            Add Supplier
                        </button>
                    </div>

                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {suppliers.map((supplier) => (
                                    <tr key={supplier._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                            <button
                                                className="bg-blue-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-blue-700"
                                                onClick={() => handleEditSupplier(supplier)}
                                            >
                                                <Pencil size={18} />
                                                Edit
                                            </button>
                                            <button
                                                className="bg-red-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-red-700"
                                                onClick={() => handleDeleteSupplier(supplier._id)}
                                            >
                                                <Trash2 size={18} />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Category Form Modal */}
            {showCategoryForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowCategoryForm(false);
                                    setEditingCategory(null);
                                    setCategoryForm({ name: '', brand: '', image: [''] });
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                <input
                                    type="text"
                                    value={categoryForm.brand}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, brand: e.target.value })}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input
                                    type="url"
                                    value={categoryForm.image[0]}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, image: [e.target.value] })}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCategoryForm(false);
                                        setEditingCategory(null);
                                        setCategoryForm({ name: '', brand: '', image: [''] });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Add Category')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Supplier Form Modal */}
            {showSupplierForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowSupplierForm(false);
                                    setEditingSupplier(null);
                                    setSupplierForm({ name: '' });
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSupplierSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={supplierForm.name}
                                    onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSupplierForm(false);
                                        setEditingSupplier(null);
                                        setSupplierForm({ name: '' });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : (editingSupplier ? 'Update Supplier' : 'Add Supplier')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategorySupplierView;