import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Trash2, Loader, ArrowLeft } from "lucide-react";
import { apiService } from "../services/api";

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Get user ID from localStorage
    const stored = localStorage.getItem("user_data");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const id = parsed?.id ?? parsed?.userId ?? null;
        setUserId(id);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleDeleteAccount = async () => {
    if (!userId) {
      setError("User ID not found. Please login again.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await apiService.deleteUser(userId);

      // Clear all local storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_data");

      // Redirect to home page
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <button
          onClick={handleCancel}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-red-50 border-b border-red-100 p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Confirm Permanent Account Deletion
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Warning Message */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                You are about to permanently delete your Grocyon account. This action is irreversible.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Once confirmed, all data associated with your account — including personal details, preferences, saved records, orders, and system activity — will be permanently removed from Grocyon's servers. You will not be able to recover your account or any linked information after deletion.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                If you fully understand the consequences and still wish to proceed, please confirm your request.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !userId}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Account</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isDeleting}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            {/* Safety Notice */}
            <p className="text-xs text-gray-500 text-center mt-6">
              This is a permanent action. Make sure you want to proceed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
