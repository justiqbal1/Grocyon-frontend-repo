import React from 'react';
import { Star } from 'lucide-react';

interface ProductCardProps {
  name: string;
  price: string;
  rating: number;
  orders: number;
  image: string;
}

export default function ProductCard({ name, price, rating, orders, image }: ProductCardProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{name}</h4>
        <div className="flex items-center space-x-4 mt-1">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{rating}</span>
            <span className="text-sm text-gray-500">({orders})</span>
          </div>
          <span className="text-sm font-medium text-red-600">{price}</span>
        </div>
      </div>
    </div>
  );
}