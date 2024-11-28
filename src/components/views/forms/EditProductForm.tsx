import React, { useState } from 'react';
import { X } from 'lucide-react';
import { updateProduct } from '../../../services/api';
import { useAdmin } from '../../../context/AdminContext';
import { Product } from '../../../types';
import toast from 'react-hot-toast';

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose, onSuccess }) => {
  const { categories, suppliers } = useAdmin();
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price.toString(),
    quantity: product.quantity.toString(),
    category_id: (product.category as any).category_id,
    supply_id: (product.supplier as any).supply_id,
    description: product.description,
    discount: product.discount.toString(),
    images: product.images ? [...product.images] : [], // Use array for images
  });
  const [previewImages, setPreviewImages] = useState<string[]>(formData.images);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Nếu có ảnh mới, upload ảnh lên Cloudinary trước
      let imageUrl = formData.images.toString();
      if (formData.images instanceof File) {
        const data = new FormData();
        data.append('file', formData.images);
        data.append('upload_preset', 'ml_default'); // Thay bằng preset của bạn

        const response = await fetch('https://api.cloudinary.com/v1_1/drp4ife6u/image/upload', {
          method: 'POST',
          body: data,
        });

        if (!response.ok) throw new Error('Failed to upload image');
        const result = await response.json();
        imageUrl = result.secure_url;
      }

      // Sau khi có URL ảnh mới, cập nhật thông tin sản phẩm
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('price', formData.price);  
      updateData.append('quantity', formData.quantity); 
      updateData.append('category_id', formData.category_id); 
      updateData.append('supply_id', formData.supply_id); 
      updateData.append('description', formData.description);
      updateData.append('discount', formData.discount); 
      updateData.append('images', imageUrl);

      await updateProduct(product._id, updateData as any);
      toast.success('Product updated successfully');
      onSuccess();
    } catch (err) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File) => {
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'ml_default'); // Change to your preset if needed

      const response = await fetch('https://api.cloudinary.com/v1_1/drp4ife6u/image/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const result = await response.json();
      const imageUrl = result.secure_url;

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      setPreviewImages(prev => [...prev, imageUrl]);

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadImage(file);
    }
  };

  const removeImage = (img: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== img),
    }));
    setPreviewImages(prev => prev.filter(image => image !== img));
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Edit Product</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Images</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {previewImages.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt="Uploaded" className="h-20 w-20 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Supplier */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Supplier</label>
          <select
            name="supply_id"
            value={formData.supply_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
