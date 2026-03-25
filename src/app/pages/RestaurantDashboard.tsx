import { Link } from "react-router";
import { Store, ChefHat, Star, Users, Calendar, TrendingUp, Settings, Award, MapPin, Phone, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

interface RestaurantStats {
  recipesShared: number;
  eventsHosted: number;
  followers: number;
  rating: number;
  reviewCount: number;
  monthly: {
    orders: number;
    revenue: number;
    newFollowers: number;
    recipeViews: number;
  };
}

export function RestaurantDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<RestaurantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurantStats = async () => {
      if (!user?.id || !token) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/stats/restaurant/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStats(data.data.stats);
        } else {
          setError(data.message || 'Failed to fetch restaurant statistics');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Error fetching restaurant stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantStats();
  }, [user?.id, token]);

  const statsData = stats ? [
    { label: "Recipes Shared", value: stats.recipesShared.toString(), icon: ChefHat, color: "text-orange-600" },
    { label: "Events Hosted", value: stats.eventsHosted.toString(), icon: Calendar, color: "text-blue-600" },
    { label: "Followers", value: stats.followers.toString(), icon: Users, color: "text-purple-600" },
    { label: "Rating", value: stats.rating.toString(), icon: Star, color: "text-yellow-600" },
  ] : [];

  const recentOrders = [
    { id: 1, customer: "John Doe", items: "Momo Platter", amount: "Rs. 450", status: "completed" },
    { id: 2, customer: "Jane Smith", items: "Thali Set", amount: "Rs. 650", status: "preparing" },
    { id: 3, customer: "Mike Johnson", items: "Noodles", amount: "Rs. 350", status: "pending" },
    { id: 4, customer: "Sarah Williams", items: "Biryani", amount: "Rs. 550", status: "completed" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "preparing": return "text-blue-600 bg-blue-50";
      case "pending": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading restaurant statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading statistics</p>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {user?.profile?.fullName || user?.username}
          </h3>
          <p className="text-gray-600">Manage your restaurant and connect with food lovers</p>
        </div>

        {/* Restaurant Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Store className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.restaurant?.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user?.restaurant?.address || "Kathmandu, Nepal"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{user?.restaurant?.phone || "+977-1-123456"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{user?.restaurant?.website || "www.restaurant.com"}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{user?.restaurant?.rating || "4.8"}</span>
                  <span className="text-gray-500">({user?.restaurant?.reviewCount || 156} reviews)</span>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {user?.restaurant?.type || "Fine Dining"}
                </span>
                {user?.restaurant?.isVerified && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <Award className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat: any, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gray-50 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/create">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                    <ChefHat className="w-5 h-5" />
                    Add Recipe
                  </Button>
                </Link>
                <Link to="/events/create">
                  <Button variant="outline" className="w-full py-3 rounded-lg flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Host Event
                  </Button>
                </Link>
                <Link to="/menu">
                  <Button variant="outline" className="w-full py-3 rounded-lg flex items-center justify-center gap-2">
                    <Store className="w-5 h-5" />
                    Manage Menu
                  </Button>
                </Link>
                <Link to="/promotions">
                  <Button variant="outline" className="w-full py-3 rounded-lg flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Promotions
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link to="/orders" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{order.amount}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Cuisine Specialties */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuisine Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {user?.restaurant?.cuisine?.map((cuisine, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {cuisine}
                  </span>
                )) || [
                  "Nepali", "Chinese", "Italian", "Continental"
                ].map((cuisine, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mon - Fri</span>
                  <span className="text-gray-900">10:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="text-gray-900">10:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-900">10:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="font-medium text-gray-900">{stats?.monthly?.orders || "0"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-medium text-green-600">Rs. {stats?.monthly?.revenue || "0"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Followers</span>
                  <span className="font-medium text-blue-600">+{stats?.monthly?.newFollowers || "0"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recipe Views</span>
                  <span className="font-medium text-purple-600">{stats?.monthly?.recipeViews || "0"}</span>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Settings</h3>
              <div className="space-y-3">
                <Link to="/settings/restaurant" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Restaurant Info</span>
                </Link>
                <Link to="/settings/menu" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                  <Store className="w-4 h-4" />
                  <span className="text-sm">Menu Management</span>
                </Link>
                <Link to="/settings/analytics" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Analytics</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
