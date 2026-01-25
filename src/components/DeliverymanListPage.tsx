import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Search,
  Plus,
  Eye,
  CreditCard as Edit,
  Trash2,
  Filter,
  Download,
  User,
  Phone,
  Mail,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Loader,
  RefreshCw,
  Truck,
  Users,
  Activity,
  Package,
} from "lucide-react";
import { apiService, User as ApiUser } from "../services/api";
import { useNavigate } from "react-router-dom";

interface DeliverymanData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joiningDate: string;
  totalOrders: number;
  ongoing: number;
  cancelled: number;
  completed: number;
  payedAmount: number;
  pendingAmount: number;
  status: "active" | "inactive";
  avatar?: string;
}

export default function DeliverymanListPage() {
  const navigate = useNavigate();
  const [deliverymen, setDeliverymen] = useState<DeliverymanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null>(null);

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
    loadDeliverymen();
  }, []);

  const loadDeliverymen = async () => {
    try {
      setLoading(true);
      setError("");
      // Call API with role=Rider
      const response = await apiService.getUsers('Rider');

      if (response.errorCode === 0 && response.data) {
        // API will return only riders
        const drivers = Array.isArray(response.data) ? response.data : [response.data];

        // Map API data to component format
        const mappedDrivers: DeliverymanData[] = drivers.map((driver) => ({
          id: driver.id,
          name: `${driver.first_name} ${driver.last_name}`,
          email: driver.email_address,
          phone: driver.phone_number,
          address: `${driver.street_address1}${
            driver.street_address2 ? ", " + driver.street_address2 : ""
          }, ${driver.city}, ${driver.state} ${driver.zip_code}`,
          joiningDate: driver.created_at
            ? new Date(driver.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "N/A",
          totalOrders: 0, // These would come from order statistics API
          ongoing: 0,
          cancelled: 0,
          completed: 0,
          payedAmount: 0,
          pendingAmount: 0,
          status: driver.is_active !== false ? "active" : "inactive",
          avatar: getImageUrl(driver.restaurant_image || driver.agreement_docs), // Use restaurant_image or agreement_docs as avatar
        }));

        setDeliverymen(mappedDrivers);
      } else {
        setError(response.errorMessage || "Failed to load delivery drivers");
      }
    } catch (error) {
      console.error("Error loading delivery drivers:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to load delivery drivers",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (
    driverId: number,
    currentStatus: "active" | "inactive"
  ) => {
    try {
      setIsUpdatingStatus(driverId);
      const newStatus = currentStatus === "active" ? false : true;

      await apiService.updateUserStatus(driverId, newStatus);

      // Update local state
      setDeliverymen((prev) =>
        prev.map((driver) =>
          driver.id === driverId
            ? { ...driver, status: newStatus ? "active" : "inactive" }
            : driver
        )
      );
    } catch (error) {
      console.error("Error updating driver status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update driver status",
      });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDeleteDriver = async (driverId: number) => {
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
      await apiService.deleteUser(driverId);
      setDeliverymen((prev) => prev.filter((driver) => driver.id !== driverId));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Delivery driver has been deleted.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting driver:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete driver",
      });
    }
  };

  const handleRefresh = () => {
    loadDeliverymen();
  };

  const handleExport = () => {
    const csvHeaders = [
      "SL",
      "Name",
      "Email",
      "Phone",
      "Address",
      "Joining Date",
      "Status",
    ];

    const csvRows = filteredDeliverymen.map((driver, index) => [
      index + 1,
      driver.name,
      driver.email,
      driver.phone,
      driver.address.replace(/,/g, ";"),
      driver.joiningDate,
      driver.status,
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
      `delivery-drivers-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: "success",
      title: "Exported!",
      text: "Delivery drivers list has been exported successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const filteredDeliverymen = deliverymen.filter((deliveryman) => {
    const matchesSearch =
      deliveryman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryman.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryman.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "All" ||
      deliveryman.status === statusFilter.toLowerCase();
    const matchesDate =
      !joiningDate || deliveryman.joiningDate.includes(joiningDate);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalDeliverymen = deliverymen.length;
  const activeDeliverymen = deliverymen.filter(
    (d) => d.status === "active"
  ).length;
  const inactiveDeliverymen = deliverymen.filter(
    (d) => d.status === "inactive"
  ).length;

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
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">
                    Deliveryman List
                  </h1>
                  <p className="text-white text-opacity-80 text-sm">
                    Delivery Team Management
                  </p>
                </div>
              </div>
              <p className="text-white text-opacity-90 text-lg mb-4">
                Manage your delivery team efficiently
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                      {totalDeliverymen} Total Deliverymen
                    </span>
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">
                      {activeDeliverymen} Active
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
                onClick={() => navigate("/add-new-delivery-man")}
                className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Add Deliveryman</span>
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

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deliveryman Joining Date
            </label>
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Select Date"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deliveryman Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setJoiningDate("");
                setStatusFilter("All");
              }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors mr-2"
            >
              Clear
            </button>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-3xl font-bold text-blue-700">
              {totalDeliverymen}
            </span>
          </div>
          <p className="text-sm font-medium text-blue-800">Total Deliverymen</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-6 h-6 text-green-600" />
            <span className="text-3xl font-bold text-green-700">
              {activeDeliverymen}
            </span>
          </div>
          <p className="text-sm font-medium text-green-800">Active Deliverymen</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-6 h-6 text-red-600" />
            <span className="text-3xl font-bold text-red-700">
              {inactiveDeliverymen}
            </span>
          </div>
          <p className="text-sm font-medium text-red-800">Inactive Deliverymen</p>
        </div>
      </div>

      {/* Deliverymen Table */}
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
                  All Deliverymen
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredDeliverymen.length} of {totalDeliverymen} deliverymen
                </p>
              </div>
            </div>
            {/* Search Bar */}
            {!loading && (
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search deliverymen..."
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
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="p-6 lg:p-8">
          {loading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Loading Delivery Drivers
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch the delivery team...
              </p>
            </div>
          ) : deliverymen.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joining Date
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDeliverymen.map((deliveryman, index) => (
                    <tr key={deliveryman.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {deliveryman.avatar ? (
                            <img
                              src={deliveryman.avatar}
                              alt={deliveryman.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {deliveryman.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{deliveryman.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{deliveryman.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={deliveryman.address}>
                          {deliveryman.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deliveryman.joiningDate}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleStatusToggle(
                              deliveryman.id,
                              deliveryman.status
                            )
                          }
                          disabled={isUpdatingStatus === deliveryman.id}
                          className="flex items-center disabled:opacity-50"
                        >
                          {isUpdatingStatus === deliveryman.id ? (
                            <Loader className="w-6 h-6 text-gray-400 animate-spin" />
                          ) : deliveryman.status === "active" ? (
                            <ToggleRight className="w-8 h-8 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-gray-400" />
                          )}
                        </button>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/delivery-man-list/${deliveryman.id}`)
                            }
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/delivery-man-list/edit/${deliveryman.id}`
                              )
                            }
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDriver(deliveryman.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
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
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No Delivery Drivers Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "All" || joiningDate
                  ? "No drivers match your current filters."
                  : "Get started by adding your first delivery driver."}
              </p>
              {!searchTerm && statusFilter === "All" && !joiningDate && (
                <button
                  onClick={() => navigate("/add-new-delivery-man")}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Your First Driver</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
