import { Link } from "react-router";
import { ChefHat, Users, Store } from "lucide-react";
import { Button } from "../components/ui/button";

export function RegisterChoice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mb-6">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join भान्साSATHI</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose how you want to join our food community
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Regular User Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Food Lover</h2>
            
            <p className="text-gray-600 mb-6">
              Join as a food enthusiast to discover recipes, share your culinary experiences, 
              and connect with fellow food lovers in our community.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Browse and save recipes</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Share your own recipes</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Join community events</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Follow other food lovers</span>
              </li>
            </ul>

            <Link to="/register">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all">
                Register as Food Lover
              </Button>
            </Link>
          </div>

          {/* Restaurant/Chef Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
              <Store className="w-8 h-8 text-orange-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant & Chef</h2>
            
            <p className="text-gray-600 mb-6">
              Register as a restaurant or professional chef to showcase your culinary expertise, 
              promote your business, and reach more food enthusiasts.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Create professional profile</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Showcase your restaurant</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Share professional recipes</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Host cooking events</span>
              </li>
            </ul>

            <Link to="/register/restaurant">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium py-3 rounded-lg transition-all">
                Register as Restaurant/Chef
              </Button>
            </Link>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
