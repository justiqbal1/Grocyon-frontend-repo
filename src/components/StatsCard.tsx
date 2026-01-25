import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray';
  trend?: string;
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-green-50 text-green-700 border-green-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  gray: 'bg-gray-50 text-gray-700 border-gray-100',
};

const iconColorMap = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
  gray: 'bg-gray-100 text-gray-600',
};

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {trend && (
            <p className="text-xs text-gray-500">{trend}</p>
          )}
        </div>
        <div className={`p-3 lg:p-4 rounded-xl ${iconColorMap[color]} shadow-sm`}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
      </div>
    </div>
  );
}