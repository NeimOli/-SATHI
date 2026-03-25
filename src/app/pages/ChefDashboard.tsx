import { ChefHat, Store, Star, Users, TrendingUp, Award, MapPin, Phone, Globe, Clock, Heart, BookOpen, Utensils, X, Edit } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { CreateRecipe } from "./CreateRecipe";
import { RecipeDetailModal } from "../components/RecipeModal";
import { AuthorProfileModal } from "../components/AuthorProfileModal";
import { EditRecipeModal } from "../components/EditRecipeModal";

interface Recipe {
  _id: string;
  title: string;
  description: string;
  images: any[]; // Changed to any[] to handle nested objects {url, alt}
  cookTime: number; // Align with backend
  prepTime: number; // Align with backend
  difficulty: string;
  category: string;
  likes: number;
  reviews: number;
  rating: number;
  createdAt: string;
  author: {
    username: string;
    profile: {
      fullName: string;
    };
  };
}

interface ChefStats {
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
  totalLikes: number;
  averageRecipeRating: number;
}

interface RestaurantProfile {
  name: string;
  type: string;
  phone: string;
  address: string;
  website: string;
  cuisine: string[];
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  establishedYear: number;
  operatingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export function ChefDashboard() {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState<ChefStats | null>(null);
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile | null>(null);
  const [chefRecipes, setChefRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'analytics' | 'profile'>('overview');
  const [showCreateRecipeModal, setShowCreateRecipeModal] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleLogout = () => {
    const confirmed = window.confirm("Don't go 😢\n\nAre you sure you want to log out?");
    if (!confirmed) return;

    logout();
    window.location.href = "/login";
  };

  const openRecipeModal = (id: string) => {
    setSelectedRecipeId(id);
    setIsRecipeModalOpen(true);
  };

  const openAuthorModal = (id: string) => {
    setSelectedAuthorId(id);
    setIsAuthorModalOpen(true);
  };

  useEffect(() => {
    const fetchChefData = async () => {
      // Support both id and _id from backend user object
      const chefId = (user as any)?.id || (user as any)?._id;
      if (!chefId || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch chef stats
        const statsResponse = await fetch(`http://localhost:5000/api/stats/chef/${chefId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch restaurant profile (via users route, includes restaurant field)
        const profileResponse = await fetch(`http://localhost:5000/api/users/${chefId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Fetch chef's recipes
        const recipesResponse = await fetch(`http://localhost:5000/api/recipes/chef/${chefId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const statsData = await statsResponse.json();
        const profileData = await profileResponse.json();
        const recipesData = await recipesResponse.json();

        if (statsResponse.ok) {
          setStats(statsData.data.stats);
        }
        
        if (profileResponse.ok) {
          setRestaurantProfile(profileData.data.user?.restaurant || null);
        }
        
        if (recipesResponse.ok) {
          setChefRecipes(recipesData.data.recipes || []);
        }

        if (!statsResponse.ok || !profileResponse.ok) {
          setError(statsData.message || profileData.message || 'Failed to fetch chef data');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Error fetching chef data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChefData();
  }, [user?.id, token]);

  const statsData = stats ? [
    { label: "Recipes", value: stats.recipesShared.toString(), icon: BookOpen, color: "text-blue-600" },
    { label: "Followers", value: stats.followers.toString(), icon: Users, color: "text-purple-600" },
    { label: "Rating", value: (stats.rating || 0).toFixed(1), icon: Star, color: "text-yellow-600" },
    { label: "Total Likes", value: stats.totalLikes.toString(), icon: Heart, color: "text-red-600" },
  ] : [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden cursor-pointer hover:-translate-y-1"
      onClick={() => openRecipeModal(recipe._id)}
    >
      <div className="h-48 bg-gray-200 relative">
        {recipe.images && recipe.images.length > 0 ? (
          <img 
            src={recipe.images[0]?.url || recipe.images[0]} 
            alt={recipe.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Utensils className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">{recipe.title}</h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRecipeId(recipe._id);
              setIsEditModalOpen(true);
            }}
            className="p-1 hover:bg-orange-50 rounded text-slate-400 hover:text-orange-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookTime || (recipe as any).cookingTime || 0} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{(recipe.rating || (recipe as any).ratings?.average || 0).toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {recipe.likes}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {recipe.reviews}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading chef dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard</p>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                <img
                  src="/logo.png"
                  alt="भान्साSATHI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  भान्साSATHI
                </h1>
                <p className="text-sm md:text-base text-orange-50/90">
                  Welcome, {restaurantProfile?.name || user?.username}. Manage your restaurant and recipes here.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {restaurantProfile?.isVerified && (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <Award className="w-3 h-3" />
                  Verified Chef
                </span>
              )}
              <div className="text-right">
                <p className="text-sm text-orange-100/90">Average Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-white">
                    {(stats?.rating || 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'recipes', label: 'My Recipes', icon: BookOpen },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Restaurant Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Store className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{restaurantProfile?.name}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurantProfile?.address || "Kathmandu, Nepal"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{restaurantProfile?.phone || "+977-1-123456"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{restaurantProfile?.website || "www.restaurant.com"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{restaurantProfile?.rating || "4.8"}</span>
                      <span className="text-gray-500">({restaurantProfile?.reviewCount || 156} reviews)</span>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {restaurantProfile?.type || "Fine Dining"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('profile')}
                  >
                    <ChefHat className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
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

            <div className="grid grid-cols-1 gap-8">
              {/* Recent Recipes */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Recipes</h2>
                  <button 
                    onClick={() => setActiveTab('recipes')}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {chefRecipes.slice(0, 3).map((recipe) => (
                    <div key={recipe._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        {recipe.images && recipe.images.length > 0 ? (
                          <img 
                            src={recipe.images[0]?.url || recipe.images[0]} 
                            alt={recipe.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Utensils className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{recipe.title}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {(recipe.rating || (recipe as any).ratings?.average || 0).toFixed(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {recipe.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Recipes</h2>
              <Button
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                onClick={() => setShowCreateRecipeModal(true)}
              >
                <ChefHat className="w-4 h-4 mr-2" />
                Create New Recipe
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chefRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
            {chefRecipes.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes yet</h3>
                <p className="text-gray-600 mb-6">Start sharing your culinary creations with the community!</p>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                  onClick={() => setShowCreateRecipeModal(true)}
                >
                  <ChefHat className="w-4 h-4 mr-2" />
                  Create Your First Recipe
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Followers</span>
                  <span className="text-xl font-bold text-purple-600">{stats?.followers ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Followers (Mock, This Month)</span>
                  <span className="text-xl font-bold text-blue-600">
                    +{stats?.monthly?.newFollowers ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recipe Views (Mock, This Month)</span>
                  <span className="text-xl font-bold text-orange-600">
                    {stats?.monthly?.recipeViews ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Restaurant Name</label>
                      <p className="font-medium text-gray-900">{restaurantProfile?.name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Type</label>
                      <p className="font-medium text-gray-900">{restaurantProfile?.type || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <p className="font-medium text-gray-900">{restaurantProfile?.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Address</label>
                      <p className="font-medium text-gray-900">{restaurantProfile?.address || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Website</label>
                      <p className="font-medium text-gray-900">{restaurantProfile?.website || 'Not set'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Cuisine Types</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {restaurantProfile?.cuisine?.map((cuisine, index) => (
                          <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                            {cuisine}
                          </span>
                        )) || ['Nepali', 'Chinese', 'Italian'].map((cuisine, index) => (
                          <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Description</label>
                      <p className="font-medium text-gray-900">{restaurantProfile?.description || 'No description added yet'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Established Year</label>
                      <p className="font-medium text-gray-900">{restaurantProfile?.establishedYear || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Verification Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {restaurantProfile?.isVerified ? (
                          <>
                            <Award className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">Verified Restaurant</span>
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Not Verified</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
                  Edit Restaurant Profile
                </Button>
                <Button variant="outline">Manage Menu</Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50 ml-auto"
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showCreateRecipeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCreateRecipeModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              aria-label="Close create recipe"
            >
              <X className="w-5 h-5" />
            </button>
            <CreateRecipe onClose={() => setShowCreateRecipeModal(false)} />
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      <RecipeDetailModal 
        recipeId={selectedRecipeId}
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        onAuthorClick={openAuthorModal}
      />

      {/* Author Profile Modal */}
      <AuthorProfileModal
        authorId={selectedAuthorId}
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        onRecipeClick={openRecipeModal}
      />

      <EditRecipeModal
        recipeId={selectedRecipeId}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          window.location.reload(); // Simple refresh for now
        }}
      />
    </div>
  );
}
