import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Search,
  Plus,
  Eye,
  CreditCard as Edit,
  Trash2,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Loader,
  RefreshCw,
  Download,
  Store,
  Users,
  Activity,
} from "lucide-react";
import { apiService, User as ApiUser } from "../services/api";

interface VendorData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  restaurantName: string;
  restaurantImage?: string;
  joinDate: string;
  status: "active" | "inactive";
  totalOrders: number;
  revenue: number;
}

interface VendorsPageProps {
  onAddVendor: () => void;
}

export default function VendorsPage({ onAddVendor }: VendorsPageProps) {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null);

  // Image base URL from environment variable (only for images, not for API calls)
  const IMAGE_BASE_URL = ((import.meta.env.VITE_IMAGE_BASE_URL as string) || "https://pub-0b64f57e41ce419f8f968539ec199b1a.r2.dev").trim().replace(/\/+$/, "");

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined | null): string => {
    if (!imagePath) return "";
    
    // Trim the path to remove any leading/trailing spaces
    const trimmedPath = imagePath.trim();
    
    // If already a full URL (starts with http:// or https://), return as is
    if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://")) {
      return trimmedPath;
    }
    
    // Remove leading slash if present
    const cleanPath = trimmedPath.startsWith("/") ? trimmedPath.substring(1) : trimmedPath;
    
    // Join base URL and path without double slashes
    return `${IMAGE_BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getUsers();

      if (response.errorCode === 0 && response.data) {
        // Filter only users with role 'Vendor'
        const vendorUsers = response.data.filter(
          (user) => user.role_name === "Vendor"
        );

        // Map API data to component format
        const mappedVendors: VendorData[] = vendorUsers.map((vendor) => ({
          id: vendor.id,
          name: `${vendor.first_name} ${vendor.last_name}`,
          email: vendor.email_address,
          phone: vendor.phone_number,
          address: `${vendor.street_address1}${
            vendor.street_address2 ? ", " + vendor.street_address2 : ""
          }, ${vendor.city}, ${vendor.state} ${vendor.zip_code}`,
          restaurantName: vendor.restaurant_name || "Restaurant",
          restaurantImage: getImageUrl(vendor.restaurant_image),
          joinDate: vendor.created_at
            ? new Date(vendor.created_at).toLocaleDateString()
            : "N/A",
          status: vendor.is_active !== false ? "active" : "inactive",
          totalOrders: 0, // These would come from order statistics API
          revenue: 0,
        }));

        setVendors(mappedVendors);
      } else {
        setError(response.errorMessage || "Failed to load vendors");
      }
    } catch (error) {
      console.error("Error loading vendors:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to load vendors",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewVendor = (vendor: VendorData) => {
    setSelectedVendor(vendor);
  };

  const handleDeleteVendor = async (vendorId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await apiService.deleteUser(vendorId);
      setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Vendor has been deleted.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting vendor:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete vendor",
      });
    }
  };

  const handleRefresh = () => {
    loadVendors();
  };

  const closeModal = () => {
    setSelectedVendor(null);
  };

  const handleExport = () => {
    const csvHeaders = [
      "Name",
      "Email",
      "Phone",
      "Restaurant",
      "Address",
      "Join Date",
      "Status",
    ];

    const csvRows = filteredVendors.map((vendor) => [
      vendor.name,
      vendor.email,
      vendor.phone,
      vendor.restaurantName,
      vendor.address.replace(/,/g, ";"),
      vendor.joinDate,
      vendor.status,
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `vendors-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: "success",
      title: "Exported!",
      text: "Vendors list has been exported successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <>
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
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">
                      Vendors Management
                    </h1>
                    <p className="text-white text-opacity-80 text-sm">
                      Restaurant Partners & Network
                    </p>
                  </div>
                </div>
                <p className="text-white text-opacity-90 text-lg mb-4">
                  Manage restaurant vendors and partners efficiently
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">
                        {vendors.length} Total Vendors
                      </span>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">
                        {vendors.filter((v) => v.status === "active").length} Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-30 transition-all flex items-center space-x-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={onAddVendor}
                  className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Vendor</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-3xl font-bold text-blue-700">
                {vendors.length}
              </span>
            </div>
            <p className="text-sm font-medium text-blue-800">Total Vendors</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6 text-green-600" />
              <span className="text-3xl font-bold text-green-700">
                {vendors.filter((v) => v.status === "active").length}
              </span>
            </div>
            <p className="text-sm font-medium text-green-800">Active Vendors</p>
          </div>

          {/* <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  ${vendors.reduce((sum, v) => sum + v.revenue, 0).toFixed(2)}
                </p>
                <p className="text-sm text-orange-700">Total Revenue</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div> */}
        </div>

        {/* Vendors Table */}
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
                    All Vendors
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredVendors.length} of {vendors.length} vendors
                  </p>
                </div>
              </div>
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleExport}
                  className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="p-6 lg:p-8">
            {loading ? (
              <div className="text-center py-12">
                <Loader className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Loading Vendors
                </h3>
                <p className="text-gray-600">
                  Please wait while we fetch the vendor list...
                </p>
              </div>
            ) : vendors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {vendor.restaurantImage ? (
                              <img
                                src={vendor.restaurantImage}
                                alt={vendor.restaurantName}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Building className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {vendor.restaurantName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {vendor.address}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {vendor.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {vendor.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {vendor.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              vendor.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {vendor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/vendors/${vendor.id}`)}
                              className="text-blue-600 hover:text-blue-800"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/vendors/edit/${vendor.id}`)
                              }
                              className="text-green-600 hover:text-green-800"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteVendor(vendor.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No Vendors Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "No vendors match your current search."
                    : "Get started by adding your first vendor."}
                </p>
                {!searchTerm && (
                  <button
                    onClick={onAddVendor}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Your First Vendor</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Vendor Details
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Vendor Info */}
              <div className="flex items-start space-x-4 mb-6">
                {selectedVendor.restaurantImage ? (
                  <img
                    src={selectedVendor.restaurantImage}
                    alt={selectedVendor.restaurantName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {selectedVendor.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {selectedVendor.restaurantName}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedVendor.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedVendor.status}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        {selectedVendor.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        {selectedVendor.phone}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <span className="text-gray-700">
                        {selectedVendor.address}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Business Statistics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Join Date:</span>
                      <span className="font-medium">
                        {selectedVendor.joinDate}
                      </span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders:</span>
                      <span className="font-medium">
                        {selectedVendor.totalOrders}
                      </span>
                    </div> */}
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue:</span>
                      <span className="font-medium text-green-600">
                        ${selectedVendor.revenue.toFixed(2)}
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                  Edit Vendor
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
