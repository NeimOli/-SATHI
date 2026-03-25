import { X, ChefHat, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: 'user' | 'restaurant') => void;
}

export function RoleSelectorModal({ isOpen, onClose, onRoleSelect }: RoleSelectorModalProps) {
  const { user } = useAuth();

  const handleRoleSelect = (role: 'user' | 'restaurant') => {
    onRoleSelect(role);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Share Your Recipe with भान्साSATHI
          </h2>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-orange-800 font-medium text-sm">
              🍳 Want to share recipes as a professional chef or restaurant?
            </p>
            <p className="text-orange-700 text-sm mt-1">
              Sign up as Restaurant/Chef to get access to advanced features and reach more food lovers!
            </p>
          </div>
        </div>

        {/* Role Options */}
        <div className="space-y-4">
          <Button
            onClick={() => handleRoleSelect('user')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <Users className="w-6 h-6" />
            <span>Share as Food Lover</span>
          </Button>

          <Button
            onClick={() => handleRoleSelect('restaurant')}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-3"
          >
            <ChefHat className="w-6 h-6" />
            <span>Share as Restaurant/Chef</span>
          </Button>
        </div>

        {/* Sign In/Up Prompt */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600">
            {user ? (
              <>
                Not your account?{" "}
                <button 
                  onClick={() => { window.location.href = '/login'; }}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Switch Account
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button 
                  onClick={() => { window.location.href = '/register-choice'; }}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
