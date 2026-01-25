import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, User, Phone, Mail, MapPin } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

const customers: Customer[] = [
  {
    id: '1',
    name: 'Diego Ramirez',
    email: 'diego@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    totalOrders: 45,
    totalSpent: 1250.50,
    joinDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Sophia Nguyen',
    email: 'sophia@example.com',
    phone: '+1234567891',
    address: '456 Oak Ave, City, State',
    totalOrders: 32,
    totalSpent: 890.25,
    joinDate: '2024-02-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '+1234567892',
    address: '789 Pine Rd, City, State',
    totalOrders: 28,
    totalSpent: 675.80,
    joinDate: '2024-03-10',
    status: 'inactive'
  }
];

export default function CustomerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || customer.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">👥 Customer Management</h1>
            <p className="text-gray-600">Manage your customer database</p>
          </div>
          <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <User className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['All', 'Active', 'Inactive'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{customer.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-800">{customer.totalOrders}</p>
                <p className="text-xs text-gray-600">Total Orders</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-800">${customer.totalSpent}</p>
                <p className="text-xs text-gray-600">Total Spent</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">View</span>
              </button>
              <button className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1">
                <Edit className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
              <button className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}