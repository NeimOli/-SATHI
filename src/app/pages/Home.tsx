import { Link, useNavigate } from "react-router";
import { recipes, User as SpotlightUser } from "../data/mockData";
import { RecipeCard } from "../components/RecipeCard";
import { CookSpotlight } from "../components/CookSpotlight";
import { NotificationBanner } from "../components/NotificationBanner";
import { RoleSelectorModal } from "../components/RoleSelectorModal";
import { Heart, TrendingUp, Award, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface BackendRecipeAuthorProfile {
  fullName?: string;
  avatar?: string;
}

interface BackendRecipeAuthor {
  _id?: string;
  username?: string;
  profile?: BackendRecipeAuthorProfile;
}

interface BackendRecipe {
  _id: string;
  title: string;
  description: string;
  images?: { url?: string; alt?: string }[];
  author?: BackendRecipeAuthor;
}

interface CommunityStats {
  homeCooks: number;
  sharedRecipes: number;
  happyMeals: number;
  recipeReviews: number;
}

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [recipeOfWeek, setRecipeOfWeek] = useState<BackendRecipe | null>(null);
  const [trendingRecipes, setTrendingRecipes] = useState<BackendRecipe[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [spotlightCook, setSpotlightCook] = useState<SpotlightUser | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  
  // Home page is now accessible to all users
  // Users can navigate to dashboards using the navigation
  
  const featuredRecipes = recipes.filter(r => r.featured);

  useEffect(() => {
    const fetchHighlight = async () => {
      try {
        // Fetch latest recipes and pick the first as "recipe of the week"
        const res = await fetch(
          "http://localhost:5000/api/recipes?limit=6&sortBy=createdAt&sortOrder=desc"
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load recipes");
        }

        const list: BackendRecipe[] = data?.data?.recipes || [];
        if (!list.length) {
          setRecipeOfWeek(null);
          setSpotlightCook(null);
          return;
        }

        const weekly = list[0];
        setRecipeOfWeek(weekly);

        const authorId = weekly.author?._id;
        if (!authorId) {
          setSpotlightCook(null);
          return;
        }

        // Fetch stats for this cook to build Cook Spotlight
        const statsRes = await fetch(
          `http://localhost:5000/api/stats/user/${authorId}`
        );
        const statsData = await statsRes.json();

        if (!statsRes.ok || !statsData?.data?.user || !statsData?.data?.stats) {
          setSpotlightCook(null);
          return;
        }

        const backendUser = statsData.data.user;
        const backendStats = statsData.data.stats;

        const cook: SpotlightUser = {
          id: backendUser.id || backendUser._id || authorId,
          name: backendUser.profile?.fullName || backendUser.username || "Guest Cook",
          avatar:
            backendUser.profile?.avatar ||
            "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400",
          bio:
            backendUser.profile?.bio ||
            "Passionate cook sharing recipes with the भान्साSATHI community.",
          recipesCount: backendStats.recipesShared ?? 0,
          followersCount: backendStats.followers ?? 0,
        };

        setSpotlightCook(cook);
      } catch (err: any) {
        console.error("Error loading recipe of the week / spotlight:", err);
        setRecipeOfWeek(null);
        setSpotlightCook(null);
      } finally {
        // no-op for now; could add loading UI later
      }
    };

    fetchHighlight();
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setTrendingLoading(true);
        // Fetch recipes sorted by rating/created as trending
        const res = await fetch(
          "http://localhost:5000/api/recipes?limit=6&sortBy=ratings.average&sortOrder=desc"
        );
        const data = await res.json();

        if (res.ok && data?.data?.recipes) {
          setTrendingRecipes(data.data.recipes);
        }
      } catch (err) {
        console.error("Error loading trending recipes:", err);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchCommunityStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stats/community/overview");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load community stats");
        }
        setCommunityStats(data.data);
      } catch (err) {
        console.error("Error loading community stats:", err);
        setCommunityStats(null);
      }
    };

    fetchCommunityStats();
  }, []);

  const handleShareRecipe = () => {
    if (!user) {
      // User not logged in - show role selector
      setShowRoleSelector(true);
    } else if (user.userType === 'restaurant') {
      // User is restaurant - go directly to create recipe
      navigate('/create');
    } else {
      // User is regular user - show chef signup message
      setShowRoleSelector(true);
    }
  };

  const handleRoleSelect = (role: 'user' | 'restaurant') => {
    if (role === 'restaurant') {
      // User wants to sign up as restaurant
      navigate('/register/restaurant');
    } else {
      // User wants to sign up as regular user
      navigate('/register');
    }
  };

  return (
    <div className="pb-24 md:pb-8">
      <NotificationBanner />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="size-5" />
              <span className="text-sm font-medium">Welcome to your cooking community!</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Share. Discover. Cook.
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Where home cooks share their heart and soul through delicious recipes
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                to="/recipes" 
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors shadow-lg"
              >
                Explore Recipes
              </Link>
              <button
                onClick={handleShareRecipe}
                className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors border-2 border-white shadow-lg"
              >
                Share Your Recipe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Recipe of the Week */}
        {recipeOfWeek && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg">
                <Award className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Recipe of the Week</h2>
                <p className="text-gray-600">Handpicked by our community - this week's favorite!</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200 shadow-lg">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative overflow-hidden rounded-xl shadow-xl group">
                  <img 
                    src={recipeOfWeek.images?.[0]?.url || 'https://via.placeholder.com/800x400?text=Recipe+Image'}
                    alt={recipeOfWeek.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg flex items-center gap-2">
                    <Award className="size-4" />
                    Featured
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-gray-900">{recipeOfWeek.title}</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{recipeOfWeek.description}</p>
                  <div className="flex items-center gap-4 py-4 border-y border-orange-200">
                    {recipeOfWeek.author && (
                      <Link
                        to={`/profile/${recipeOfWeek.author._id}`}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <img 
                          src={
                            recipeOfWeek.author.profile?.avatar ||
                            "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=200"
                          }
                          alt={
                            recipeOfWeek.author.profile?.fullName ||
                            recipeOfWeek.author.username ||
                            "Cook"
                          }
                          className="size-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm text-gray-500">Recipe by</p>
                          <p className="font-semibold text-orange-700">
                            {recipeOfWeek.author.profile?.fullName ||
                              recipeOfWeek.author.username ||
                              "Cook"}
                          </p>
                        </div>
                      </Link>
                    )}
                    <div className="flex items-center gap-4 ml-auto text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Heart className="size-4 text-rose-500" fill="rgb(244 63 94)" />
                        {/* Likes count not yet from backend; placeholder 0 */}
                        0
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/recipe/${recipeOfWeek._id}`}
                    className="inline-block bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg"
                  >
                    View Full Recipe
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Cook Spotlight */}
        {spotlightCook && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Cook Spotlight</h2>
                <p className="text-gray-600">Meet the amazing cook making our community delicious!</p>
              </div>
            </div>
            <CookSpotlight cook={spotlightCook} />
          </motion.section>
        )}

        {/* Featured Recipes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-2 rounded-lg">
              <TrendingUp className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Recipes</h2>
              <p className="text-gray-600">Recipes our community can't stop making and sharing!</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingLoading ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Loading trending recipes...</p>
              </div>
            ) : trendingRecipes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No trending recipes yet. Be the first to share one!</p>
              </div>
            ) : (
              trendingRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link 
              to="/recipes"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              View All Recipes
              <TrendingUp className="size-4" />
            </Link>
          </div>
        </motion.section>

        {/* Community Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Our Growing Community</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">
                {communityStats ? `${communityStats.homeCooks}+` : '150+'}
              </div>
              <div className="text-orange-100">Food Lovers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {communityStats ? `${communityStats.sharedRecipes}+` : '450+'}
              </div>
              <div className="text-orange-100">Shared Recipes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {communityStats ? `${communityStats.happyMeals}+` : '2.5k+'}
              </div>
              <div className="text-orange-100">Happy Meals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {communityStats ? `${communityStats.recipeReviews}+` : '800+'}
              </div>
              <div className="text-orange-100">Recipe Reviews</div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Role Selector Modal */}
      <RoleSelectorModal
        isOpen={showRoleSelector}
        onClose={() => setShowRoleSelector(false)}
        onRoleSelect={handleRoleSelect}
      />
    </div>
  );
}