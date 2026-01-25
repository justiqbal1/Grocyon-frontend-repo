import React from 'react';

interface ChartProps {
  title: string;
  data: { label: string; value: number }[];
  type: 'line' | 'bar';
  color?: string;
}

export default function Chart({ title, data, type, color = 'rgb(239, 68, 68)' }: ChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm">
      <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">{title}</h3>
      <div className="h-48 lg:h-64 flex items-end space-x-1 lg:space-x-2 overflow-x-auto">
        {data.map((item, index) => (
          <div key={index} className="flex-1 min-w-[30px] flex flex-col items-center">
            <div 
              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
              style={{ 
                height: `${(item.value / maxValue) * (window.innerWidth < 768 ? 150 : 200)}px`,
                backgroundColor: color,
                minHeight: '4px'
              }}
            />
            <span className="text-xs text-gray-500 mt-2 text-center transform -rotate-45 lg:rotate-0 origin-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}