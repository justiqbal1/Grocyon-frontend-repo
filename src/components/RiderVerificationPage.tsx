import React, { useState, useEffect, useRef } from 'react';
import { Search, Eye, Check, X, User, Mail, Phone, Calendar, FileText, Download, ShieldCheck, Loader2, Users, Activity, RefreshCw, ChevronDown } from 'lucide-react';
import { apiService, PendingRiderDocument } from '../services/api';
import Swal from 'sweetalert2';

export default function RiderVerificationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riders, setRiders] = useState<PendingRiderDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
  const [approvingRiderId, setApprovingRiderId] = useState<number | null>(null);
  
  // Use refs to track if API call is in progress or completed
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Prevent multiple calls on mount
    if (hasFetchedRef.current || isFetchingRef.current) {
      return;
    }

    fetchRiderDocuments(true);
    
    // Cleanup function to prevent race conditions
    return () => {
      // Don't reset hasFetchedRef on unmount, only reset isFetchingRef
      isFetchingRef.current = false;
    };
  }, []);

  const fetchRiderDocuments = async (isInitialLoad = false) => {
    // For initial load, check if already fetched
    if (isInitialLoad && (hasFetchedRef.current || isFetchingRef.current)) {
      return;
    }
    
    // Mark as fetching
    isFetchingRef.current = true;
    
    try {
      setLoading(true);
      const response = await apiService.getPendingRiderDocuments();
      
      if (response.errorCode === 0 && response.data) {
        setRiders(response.data);
        // Mark as fetched successfully
        hasFetchedRef.current = true;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.errorMessage || 'Failed to fetch rider documents',
        });
        // On error, reset hasFetchedRef to allow retry
        if (isInitialLoad) {
          hasFetchedRef.current = false;
        }
      }
    } catch (error: any) {
      console.error('Error fetching rider documents:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to fetch rider documents',
      });
      // On error, reset hasFetchedRef to allow retry
      if (isInitialLoad) {
        hasFetchedRef.current = false;
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = 
      `${rider.first_name} ${rider.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.email_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rider.phone_number.includes(searchTerm);
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'pending') return matchesSearch && !rider.rider_documents_approved;
    if (filterStatus === 'approved') return matchesSearch && rider.rider_documents_approved;
    
    return matchesSearch;
  });

  const pendingRiders = riders.filter(rider => !rider.rider_documents_approved);
  const approvedRiders = riders.filter(rider => rider.rider_documents_approved);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Image base URL from environment variable (only for images/documents, not for API calls)
  const IMAGE_BASE_URL = ((import.meta.env.VITE_IMAGE_BASE_URL as string) || "https://pub-0b64f57e41ce419f8f968539ec199b1a.r2.dev").trim().replace(/\/+$/, "");

  // Helper function to get full document URL
  const getDocumentUrl = (docPath: string | undefined | null): string => {
    if (!docPath) return "";
    
    // Trim the path to remove any leading/trailing spaces
    const trimmedPath = docPath.trim();
    
    // If it's a base64 data URL, return as is
    if (trimmedPath.startsWith("data:")) {
      return trimmedPath;
    }
    
    // If already a full URL, check if it contains wrong base URL (grocyon.com) and replace it
    if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://")) {
      // Replace grocyon.com with correct base URL
      const url = new URL(trimmedPath);
      if (url.hostname.includes("grocyon.com")) {
        // Extract the path from the URL
        const path = url.pathname;
        // Remove leading slash if present
        const cleanPath = path.startsWith("/") ? path.substring(1) : path;
        // Return with correct base URL
        return `${IMAGE_BASE_URL}/${cleanPath}`;
      }
      // If it's already a correct URL, return as is
      return trimmedPath;
    }
    
    // Remove leading slash if present
    const cleanPath = trimmedPath.startsWith("/") ? trimmedPath.substring(1) : trimmedPath;
    
    // Join base URL and path without double slashes
    return `${IMAGE_BASE_URL}/${cleanPath}`;
  };

  const handleViewDocument = (docPath: string, docType: string) => {
    const url = getDocumentUrl(docPath);
    window.open(url, '_blank');
  };

  const handleApproveRider = async (riderId: number) => {
    try {
      setApprovingRiderId(riderId);
      
      const response = await apiService.approveRiderDocuments(riderId, true);
      
      if (response.errorCode === 0) {
        // Update the rider status in the list
        setRiders(prevRiders => 
          prevRiders.map(rider => 
            rider.id === riderId 
              ? { ...rider, rider_documents_approved: true }
              : rider
          )
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Approved!',
          text: 'Rider documents have been approved successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh the data
        hasFetchedRef.current = false;
        fetchRiderDocuments(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.errorMessage || 'Failed to approve rider documents',
        });
      }
    } catch (error: any) {
      console.error('Error approving rider documents:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to approve rider documents',
      });
    } finally {
      setApprovingRiderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
          <div className="text-lg text-gray-600">Loading rider documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Welcome Section */}
      <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">
                    Rider Verification
                  </h1>
                  <p className="text-white text-opacity-80 text-sm">
                    Review and verify rider documents
                  </p>
                </div>
              </div>
              <p className="text-white text-opacity-90 text-lg mb-4">
                Manage rider document verification efficiently
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                      {pendingRiders.length} Pending
                    </span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                      {approvedRiders.length} Approved
                    </span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                      {riders.length} Total Riders
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchRiderDocuments(false)}
                disabled={loading}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-30 transition-all flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-6 h-6 text-orange-600" />
            <span className="text-3xl font-bold text-orange-700">
              {pendingRiders.length}
            </span>
          </div>
          <p className="text-sm font-medium text-orange-800">Pending Verification</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Check className="w-6 h-6 text-green-600" />
            <span className="text-3xl font-bold text-green-700">
              {approvedRiders.length}
            </span>
          </div>
          <p className="text-sm font-medium text-green-800">Approved Riders</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-3xl font-bold text-blue-700">
              {riders.length}
            </span>
          </div>
          <p className="text-sm font-medium text-blue-800">Total Riders</p>
        </div>
      </div>

      {/* Riders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Rider Documents
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredRiders.length} of {riders.length} riders
                </p>
              </div>
            </div>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search riders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    filterStatus === 'pending'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    filterStatus === 'approved'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Approved
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6 lg:p-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
              </tr>
            </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRiders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12">
                      <div className="text-center">
                        <ShieldCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                          No Rider Documents Found
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm || filterStatus !== 'all'
                            ? 'No riders match your current search or filters.'
                            : 'No rider documents at the moment.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                filteredRiders.map((rider) => (
                  <tr key={rider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {rider.first_name} {rider.last_name}
                          </div>
                          <div className="text-sm text-gray-500">ID: {rider.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {rider.email_address}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {rider.phone_number}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleViewDocument(rider.driver_licence_doc, 'Driver License')}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 hover:underline"
                        >
                          <FileText className="w-4 h-4" />
                          Driver License
                        </button>
                        <button
                          onClick={() => handleViewDocument(rider.certificate_doc, 'Certificate')}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 hover:underline"
                        >
                          <FileText className="w-4 h-4" />
                          Certificate
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rider.rider_documents_approved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <div className="relative">
                          <select
                            value="pending"
                            onChange={(e) => {
                              if (e.target.value === 'approved') {
                                handleApproveRider(rider.id);
                              }
                            }}
                            disabled={approvingRiderId === rider.id}
                            className="appearance-none bg-white border border-orange-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-orange-700 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          {approvingRiderId === rider.id && (
                            <Loader2 className="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500 animate-spin" />
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(rider.created_at)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
