import React, { useState } from 'react';
import { Search, Eye, Check, X, User, Mail, Phone, Calendar, FileText } from 'lucide-react';

interface JoiningRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedDate: string;
  identityType: string;
  identityNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
}

const joiningRequests: JoiningRequest[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    appliedDate: '15 Dec 2024, 10:30 AM',
    identityType: 'Driving License',
    identityNumber: 'DL123456789',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1234567891',
    appliedDate: '14 Dec 2024, 02:15 PM',
    identityType: 'Passport',
    identityNumber: 'P987654321',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+1234567892',
    appliedDate: '13 Dec 2024, 09:45 AM',
    identityType: 'National ID',
    identityNumber: 'NID456789123',
    status: 'pending'
  }
];

export default function JoiningRequestPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState(joiningRequests);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.phone.includes(searchTerm);
    return matchesSearch;
  });

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'approved' as const } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'rejected' as const } : req
    ));
  };

  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">📝 New Joining Requests</h1>
            <p className="text-gray-600">Review and approve new deliveryman applications</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {pendingRequests.length} Pending
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600">{pendingRequests.length}</p>
              <p className="text-sm text-orange-700">Pending Requests</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'approved').length}</p>
              <p className="text-sm text-green-700">Approved</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{requests.filter(r => r.status === 'rejected').length}</p>
              <p className="text-sm text-red-700">Rejected</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Joining Requests</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, email, or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full lg:w-80"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request, index) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {request.avatar ? (
                          <img src={request.avatar} alt={request.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{request.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{request.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{request.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.appliedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{request.identityType}</div>
                      <div className="text-gray-500">{request.identityNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}