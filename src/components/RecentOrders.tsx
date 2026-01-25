import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  time: string;
  amount: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-orange-600 bg-orange-100', label: 'Pending' },
  confirmed: { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Confirmed' },
  processing: { icon: Clock, color: 'text-blue-600 bg-blue-100', label: 'Processing' },
  delivered: { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600 bg-red-100', label: 'Cancelled' },
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
            View All
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {orders.map((order) => {
          const StatusIcon = statusConfig[order.status].icon;
          return (
            <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${statusConfig[order.status].color}`}>
                    <StatusIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{order.amount}</p>
                  <p className="text-sm text-gray-500">{order.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}