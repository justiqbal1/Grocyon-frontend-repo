import React from 'react';
import { Settings, Construction, Wrench } from 'lucide-react';

interface GenericPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function GenericPage({ title, description, icon }: GenericPageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-8 lg:p-12 text-center">
        <div className="flex justify-center mb-6">
          {icon || <Construction className="w-16 h-16 text-gray-400" />}
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
          {title}
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
            Get Started
          </button>
          <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Configuration</h3>
          <p className="text-gray-600 text-sm">Simple and intuitive setup process with guided configuration.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Wrench className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Advanced Tools</h3>
          <p className="text-gray-600 text-sm">Powerful tools and features to manage your business effectively.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Construction className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
          <p className="text-gray-600 text-sm">This feature is currently under development and will be available soon.</p>
        </div>
      </div>
    </div>
  );
}