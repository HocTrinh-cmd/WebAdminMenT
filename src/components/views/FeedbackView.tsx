import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';  // Đảm bảo đường dẫn đúng với AdminContext của bạn

interface Feedback {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

const FeedbackView: React.FC = () => {
  const { feedbacks, loading, error } = useAdmin();  // Lấy feedbacks từ AdminContext
  const [formattedFeedbacks, setFormattedFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    if (feedbacks.length > 0) {
      // Chuyển đổi dữ liệu feedback từ context thành định dạng phù hợp với interface Feedback
      const formattedData = feedbacks.map((feedback: any) => ({
        id: feedback._id,
        productId: feedback.productId.id,
        productName: feedback.productId.name,
        customerName: feedback.user.name,
        rating: feedback.rating,
        comment: feedback.content,
        date: new Date(feedback.createdAt).toLocaleDateString(),
        avatar: `https://ui-avatars.com/api/?name=${feedback.user.name}`
      }));
      
      setFormattedFeedbacks(formattedData);
    }
  }, [feedbacks]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Product Feedback</h2>
      
      <div className="grid gap-6">
        {formattedFeedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start">
              <img
                className="h-10 w-10 rounded-full"
                src={feedback.avatar || 'https://via.placeholder.com/40'}
                alt={feedback.customerName}
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{feedback.customerName}</h3>
                  <p className="text-sm text-gray-500">{feedback.date}</p>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-gray-600">Tên sản phẩm: {feedback.productName}</p>
                </div>
                <div className="flex items-center mt-1">
                  {renderStars(feedback.rating)}
                </div>
                <p className="mt-2 text-sm text-gray-700">{feedback.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackView;
