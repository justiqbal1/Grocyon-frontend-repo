import React, { useState } from 'react';
import { Search, Star, User, Calendar, MessageSquare } from 'lucide-react';

interface Review {
  id: string;
  deliverymanName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  orderId: string;
  deliverymanAvatar?: string;
}

const reviews: Review[] = [
  {
    id: '1',
    deliverymanName: 'Dim Tim',
    customerName: 'John Smith',
    rating: 5,
    comment: 'Excellent service! Very fast delivery and friendly attitude.',
    date: '15 Dec 2024, 02:30 PM',
    orderId: '100164',
    deliverymanAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    deliverymanName: 'Will Smith',
    customerName: 'Sarah Johnson',
    rating: 4,
    comment: 'Good delivery service, arrived on time.',
    date: '14 Dec 2024, 11:15 AM',
    orderId: '100163',
    deliverymanAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    deliverymanName: 'Marco Rossi',
    customerName: 'Emily Davis',
    rating: 3,
    comment: 'Average service, could be improved.',
    date: '13 Dec 2024, 06:45 PM',
    orderId: '100162'
  },
  {
    id: '4',
    deliverymanName: 'Ethan Walker',
    customerName: 'Michael Brown',
    rating: 5,
    comment: 'Outstanding delivery! Very professional and courteous.',
    date: '12 Dec 2024, 01:20 PM',
    orderId: '100161'
  }
];

export default function DeliverymanReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.deliverymanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.orderId.includes(searchTerm);
    const matchesRating = ratingFilter === 'All' || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(review => review.rating === rating).length
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">⭐ Delivery Man Reviews</h1>
            <p className="text-gray-600">Monitor customer feedback and ratings</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
              <p className="text-sm text-yellow-700">Average Rating</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{totalReviews}</p>
              <p className="text-sm text-blue-700">Total Reviews</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{ratingDistribution[0]}</p>
              <p className="text-sm text-green-700">5 Star Reviews</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{ratingDistribution[3] + ratingDistribution[4]}</p>
              <p className="text-sm text-red-700">Low Ratings</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-800">Reviews & Ratings</h3>
            <select 
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option>All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by deliveryman, customer, or order ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full lg:w-80"
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              {/* Deliveryman Info */}
              <div className="flex items-center space-x-3 lg:w-64">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {review.deliverymanAvatar ? (
                    <img src={review.deliverymanAvatar} alt={review.deliverymanName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{review.deliverymanName}</h4>
                  <p className="text-sm text-gray-500">Delivery Man</p>
                </div>
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">({review.rating}.0)</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Order #{review.orderId}</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{review.date}</span>
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <User className="w-3 h-3" />
                  <span>by {review.customerName}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Reviews Found</h3>
          <p className="text-gray-600">No reviews match your current search criteria.</p>
        </div>
      )}
    </div>
  );
}