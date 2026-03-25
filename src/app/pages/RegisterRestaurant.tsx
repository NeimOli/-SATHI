import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, AlertCircle, User, Mail, Lock, Store, MapPin, Phone, Globe, Utensils, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

interface RestaurantRegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile: {
    fullName: string;
    phone: string;
    bio: string;
    gender: string;
  };
  restaurant: {
    name: string;
    type: string;
    phone: string;
    address: string;
    website: string;
    cuisine: string[];
  };
}

export function RegisterRestaurant() {
  const [formData, setFormData] = useState<RestaurantRegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: {
      fullName: "",
      phone: "",
      bio: "",
      gender: "",
    },
    restaurant: {
      name: "",
      type: "",
      phone: "",
      address: "",
      website: "",
      cuisine: [],
    },
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { registerRestaurant: registerRestaurantFn, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const cuisineOptions = [
    "Italian", "Chinese", "Indian", "Mexican", "Japanese", "Thai", 
    "French", "Mediterranean", "American", "Korean", "Vietnamese", 
    "Spanish", "Greek", "Turkish", "Fusion", "Other"
  ];

  const restaurantTypes = [
    "Fine Dining", "Casual Dining", "Fast Food", "Cafe", "Bakery",
    "Food Truck", "Catering", "Cloud Kitchen", "Bar & Grill", "Other"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested profile fields
    if (name.startsWith('profile.')) {
      const profileField = name.replace('profile.', '');
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } 
    // Handle nested restaurant fields
    else if (name.startsWith('restaurant.')) {
      const restaurantField = name.replace('restaurant.', '');
      setFormData(prev => ({
        ...prev,
        restaurant: {
          ...prev.restaurant,
          [restaurantField]: value
        }
      }));
    } 
    // Handle root level fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError("");
  };

  const handleCuisineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      restaurant: {
        ...prev.restaurant,
        cuisine: checked 
          ? [...prev.restaurant.cuisine, value]
          : prev.restaurant.cuisine.filter(c => c !== value)
      }
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    // Basic Nepal phone validation: +977 9XXXXXXXXX or 9XXXXXXXXX (10 digits starting with 9)
    const phone = formData.profile.phone.trim();
    const nepalPhoneRegex = /^(?:\+977[- ]?)?9\d{9}$/;
    if (!nepalPhoneRegex.test(phone)) {
      setError("Please enter a valid Nepali phone number (e.g. +977 98XXXXXXXX).");
      return false;
    }

    if (formData.restaurant.cuisine.length === 0) {
      setError("Please select at least one cuisine type");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const generatedUsername =
        formData.username ||
        (formData.profile.fullName
          ? formData.profile.fullName.toLowerCase().replace(/\s+/g, "_")
          : formData.email.split("@")[0]);

      const restaurantPhone = formData.restaurant.phone || formData.profile.phone;
      const restaurantName =
        formData.restaurant.name || formData.profile.fullName || "Chef";
      const restaurantType = formData.restaurant.type || "Other";
      const restaurantAddress = formData.restaurant.address || "Not provided";

      await registerRestaurantFn({
        username: generatedUsername,
        email: formData.email,
        password: formData.password,
        profile: {
          fullName: formData.profile.fullName,
          phone: formData.profile.phone,
          bio: formData.profile.bio,
          gender: formData.profile.gender
        },
        restaurant: {
          name: restaurantName,
          type: restaurantType,
          phone: restaurantPhone,
          address: restaurantAddress,
          website: formData.restaurant.website,
          cuisine: formData.restaurant.cuisine
        }
      });
      
      // Show success message
      setSuccess(true);
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Restaurant</h1>
          <p className="text-gray-600">Join our community of culinary professionals</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <span className="text-green-700 text-sm font-semibold">Restaurant Registration Successful!</span>
                <p className="text-green-600 text-xs mt-1">Redirecting to login page...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="profile.fullName"
                    value={formData.profile.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="profile.gender"
                    value={formData.profile.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone (Nepal)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="profile.phone"
                      value={formData.profile.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="+977 98XXXXXXXX"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Information Section (only cuisine types) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuisine Types</h3>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Utensils className="inline w-4 h-4 mr-2" />
                  Select all cuisines you specialize in
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {cuisineOptions.map(cuisine => (
                    <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={cuisine}
                        checked={formData.restaurant.cuisine.includes(cuisine)}
                        onChange={handleCuisineChange}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="text-orange-600 hover:text-orange-700 transition-colors">
                      Terms of Service
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Chef & Restaurant Partner Terms of Service</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-gray-600 space-y-4">
                      <p>Welcome to भान्साSATHI! By registering as a Chef/Restaurant Partner, you agree to the following additional terms:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>You represent a legitimate culinary business or professional cooking service.</li>
                        <li>All business details, menus, and operating hours provided must be accurate and kept up to date.</li>
                        <li>You are responsible for the quality and safety of the food provided at your hosted events or establishment.</li>
                        <li>We may verify your business credentials before granting full partner privileges.</li>
                      </ul>
                      <p>We look forward to helping you grow your culinary community!</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <span> and </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="text-orange-600 hover:text-orange-700 transition-colors">
                      Privacy Policy
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Privacy Policy</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-gray-600 space-y-4">
                      <p>Your privacy is important to us. Information collected during registration is used solely to enhance your experience on भान्साSATHI.</p>
                      <p>We do not share your personal information with third parties without your explicit consent, except as required by law.</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating restaurant account...
                </div>
              ) : (
                "Create Restaurant Account"
              )}
            </Button>
          </form>

          {/* Back to Choice */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              <Link to="/register-choice" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                ← Back to registration options
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
