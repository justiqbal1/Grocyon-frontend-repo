import React from 'react';
import { User } from 'lucide-react';

interface CustomerCardProps {
  name: string;
  phone: string;
  orders: number;
  image?: string;
}

export default function CustomerCard({ name, phone, orders, image }: CustomerCardProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
        {image ? (
          <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <User className="w-6 h-6 text-gray-500" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{name}</h4>
        <p className="text-sm text-gray-600">{phone}</p>
        <p className="text-xs text-gray-500 mt-1">{orders} orders</p>
      </div>
    </div>
  );
}