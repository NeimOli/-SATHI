import { BookOpen, Users, Calendar, Heart, TrendingUp, UserRound } from "lucide-react";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Events } from "./Events";
import { Community } from "./Community";
import { Recipes } from "./Recipes";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../components/ui/dialog";
import { CreateRecipe } from "./CreateRecipe";
import { toast } from "sonner";

interface UserStats {
  recipesShared: number;
  eventsAttended: number;
  eventsHosted: number;
  followers: number;
  following: number;
  favorites: number;
  totalLikes: number;
  averageRating: number;
  consistencyStreak: number;
}

interface DashboardRecipeImage {
  url?: string;
  alt?: string;
}

interface DashboardRecipeAuthorProfile {
  fullName?: string;
  avatar?: string;
}

interface DashboardRecipeAuthor {
  username?: string;
  profile?: DashboardRecipeAuthorProfile;
}

interface DashboardRecipe {
  _id: string;
  title: string;
  description: string;
  cuisine: string;
  category: string;
  difficulty: string;
  images?: DashboardRecipeImage[];
  author?: DashboardRecipeAuthor;
  createdAt?: string;
}

export function UserDashboard() {
  const { user, token, logout } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login First</h1>
          <p className="text-gray-600 mb-6">You need to login to access your dashboard</p>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-2 rounded-full font-semibold hover:from-orange-600 hover:to-amber-700 transition-colors shadow-lg">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'all-recipes' | 'profile'>('overview');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recentActivityLoading, setRecentActivityLoading] = useState(false);
  const [recipes, setRecipes] = useState<DashboardRecipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    logout();
    // Hard refresh to fully reset app state
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!user || !token) return;

    const userId = (user as any).id || (user as any)._id;
    if (!userId) return;

    const controller = new AbortController();

    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await fetch(`http://localhost:5000/api/stats/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (response.ok && data?.data?.stats) {
          setStats(data.data.stats);
        } else {
          console.error('Failed to load user stats:', data?.message || 'Unknown error');
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching user stats:', error);
        }
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();

    return () => {
      controller.abort();
    };
  }, [user, token]);

  useEffect(() => {
    if (!user || !token) return;

    const controller = new AbortController();

    const fetchRecentActivity = async () => {
      try {
        setRecentActivityLoading(true);
        const response = await fetch('http://localhost:5000/api/activity/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (response.ok && data?.data?.activities) {
          setRecentActivity(data.data.activities);
        } else {
          console.error('Failed to load recent activity:', data?.message || 'Unknown error');
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching recent activity:', error);
        }
      } finally {
        setRecentActivityLoading(false);
      }
    };

    fetchRecentActivity();

    return () => {
      controller.abort();
    };
  }, [user, token]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecipes = async () => {
      try {
        setRecipesLoading(true);
        const response = await fetch(
          'http://localhost:5000/api/recipes?limit=9&sortBy=createdAt&sortOrder=desc&onlyChefs=true',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (response.ok && data?.data?.recipes) {
          setRecipes(data.data.recipes);
        } else {
          console.error('Failed to load recipes:', data?.message || 'Unknown error');
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching recipes:', error);
        }
      } finally {
        setRecipesLoading(false);
      }
    };

    fetchRecipes();

    return () => {
      controller.abort();
    };
  }, []);

  const handleRequestPromotion = async () => {
    try {
      setRequestLoading(true);
      const response = await fetch('http://localhost:5000/api/users/request-promotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Request sent successfully! Admin will review it shortly.");
        // We might want to refresh the user object in context or just update local state if we had it
        // For now, a simple notify is good, in a real app we'd trigger a re-fetch of user data
        window.location.reload(); // Simple way to refresh user status from server if it's in the token/session
      } else {
        toast.error(data.message || "Failed to send request");
      }
    } catch (error) {
      console.error('Error requesting promotion:', error);
      toast.error("Connection error. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const statsData = [
    { label: "Recipes Shared", value: stats?.recipesShared ?? 0, icon: BookOpen },
    { label: "Events Attended", value: stats?.eventsAttended ?? 0, icon: Calendar },
    { label: "Following", value: stats?.following ?? 0, icon: Users },
    { label: "Total Likes", value: stats?.totalLikes ?? 0, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white shadow-lg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="भान्साSATHI Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  भान्साSATHI
                </h1>
              </div>
              <p className="text-sm md:text-base text-orange-50/90">
                Welcome back, <span className="font-semibold">{user.username}</span>! Your personal space to track recipes, events, and your food journey.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
                  Consistency streak:{' '}
                  <span className="font-semibold">
                    {statsLoading || !stats
                      ? '—'
                      : `${stats.consistencyStreak} day${stats.consistencyStreak === 1 ? '' : 's'}`}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm">
                  <TrendingUp className="w-4 h-4" />
                  Level:{" "}
                  <span className="font-semibold">
                    {user.userType === "restaurant" ? "Chef Partner" : "Recipe Explorer"}
                  </span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center justify-center">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-orange-400 via-amber-300 to-orange-500 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="w-14 h-14 rounded-full flex items-center justify-center 
                      bg-orange-500/90 border border-white/40
                      transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 focus:ring-offset-orange-500"
                    aria-label="Open profile"
                  >
                    <UserRound className="w-7 h-7 text-white drop-shadow-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-6 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'all-recipes', label: 'All Recipes', icon: BookOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-orange-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Based on Active Tab */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top overview grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="xl:col-span-2 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Your activity snapshot</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsData.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-md p-5 border border-amber-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{stat.label}</h3>
                          <p className="text-xs text-gray-600">
                            {statsLoading ? 'Loading…' : 'Overall'}
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {statsLoading ? '—' : stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlight card */}
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-wide text-orange-100/90">
                    This week&apos;s highlight
                  </p>
                  <p className="text-xl font-semibold">
                    {(() => {
                      if (statsLoading) {
                        return 'Loading your progress…';
                      }

                      if (user.userType === 'restaurant') {
                        const target = 5;
                        const shared = stats?.recipesShared ?? 0;
                        const remaining = Math.max(target - shared, 0);
                        if (remaining === 0) {
                          return 'You&apos;ve unlocked your next community badge!';
                        }
                        return `You&apos;re ${remaining} recipe${remaining > 1 ? 's' : ''} away from your next community badge!`;
                      }

                      const targetEvents = 3;
                      const attended = stats?.eventsAttended ?? 0;
                      const remainingEvents = Math.max(targetEvents - attended, 0);

                      if (attended === 0) {
                        return 'Join your first community food event to start your journey!';
                      }
                      if (remainingEvents <= 0) {
                        return 'You&apos;re an active community foodie this week!';
                      }
                      return `Attend ${remainingEvents} more event${remainingEvents > 1 ? 's' : ''} to reach this week&apos;s community goal.`;
                    })()}
                  </p>
                  <p className="text-sm text-orange-100/90">
                    {user.userType === 'restaurant' ? (
                      <>
                        Share your signature dishes to unlock more community badges and reach new food lovers.
                      </>
                    ) : (
                      <>
                        Discover new recipes from local chefs and save your favorites to build your personal cookbook.
                      </>
                    )}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-orange-200 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          ((user.userType === 'restaurant'
                            ? (stats?.recipesShared ?? 0)
                            : (stats?.eventsAttended ?? 0)) /
                            (user.userType === 'restaurant' ? 5 : 3)) *
                            100 || 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="ml-3 text-xs font-semibold text-orange-50">
                    {statsLoading
                      ? 'Loading…'
                      : user.userType === 'restaurant'
                        ? `${Math.min(stats?.recipesShared ?? 0, 5)} / 5 recipes`
                        : `${Math.min(stats?.eventsAttended ?? 0, 3)} / 3 events`}
                  </span>
                </div>
                
                {/* Promotion Action */}
                {!statsLoading && user.userType === 'user' && !user.canCreateRecipe && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    {stats?.eventsAttended && stats.eventsAttended >= 3 ? (
                      user.promotionStatus === 'pending' ? (
                        <Button disabled className="w-full bg-white/20 border border-white/40 text-white cursor-not-allowed">
                          Request Pending Admin Approval
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleRequestPromotion}
                          disabled={requestLoading}
                          className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-lg py-6"
                        >
                          {requestLoading ? "Sending..." : "🎁 Claim Reward: Unlock Create Recipe"}
                        </Button>
                      )
                    ) : (
                      <p className="text-xs text-orange-100 italic text-center">
                        Complete your 3-event goal to unlock the special Create Recipe feature!
                      </p>
                    )}
                  </div>
                )}
                
                {/* Approved Feature */}
                {user.canCreateRecipe && (
                  <div className="mt-4 pt-4 border-t border-white/20 text-center">
                    <p className="text-xs text-emerald-100 mb-2 font-medium">✓ Recipe Creation Feature Unlocked!</p>
                    <Dialog open={showCreateRecipe} onOpenChange={setShowCreateRecipe}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 shadow-lg">
                          <BookOpen className="w-5 h-5 mr-2" /> Create New Recipe
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[95vw] w-[95vw] max-h-[90vh] overflow-y-auto p-0 border-none bg-white rounded-2xl">
                        <CreateRecipe onClose={() => setShowCreateRecipe(false)} />
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                        Browse Recipes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[95vw] w-[95vw] h-[95vh] p-0 border-none bg-transparent">
                      <div className="w-full h-full relative rounded-xl overflow-y-auto shadow-2xl bg-white">
                        <Recipes />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-colors shadow-md"
                      >
                        Find Events
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[95vw] w-[95vw] h-[95vh] p-0 border-none bg-transparent">
                      <div className="w-full h-full relative rounded-xl overflow-y-auto shadow-2xl bg-white">
                        <Events />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-colors shadow-md"
                      >
                        Join Community
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[95vw] w-[95vw] h-[95vh] p-0 border-none bg-transparent">
                      <div className="w-full h-full relative rounded-xl overflow-hidden shadow-2xl bg-white">
                        <Community />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent activity</h3>
                {recentActivityLoading ? (
                  <p className="text-sm text-gray-500">Loading recent activity…</p>
                ) : recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No recent activity yet. Start exploring recipes and events to see your activity
                    here.
                  </p>
                ) : (
                  <ul className="space-y-4 text-sm">
                    {recentActivity.map((activity) => {
                      const type: string = activity.type;
                      let title = 'Activity';
                      let subtitle = '';
                      let dotClass = 'bg-orange-500';

                      switch (type) {
                        case 'recipe_view':
                          title = 'Viewed a recipe';
                          subtitle = 'You checked out a community recipe.';
                          dotClass = 'bg-emerald-400';
                          break;
                        case 'recipe_favorite':
                          title = 'Saved a recipe';
                          subtitle = 'You added a recipe to your favorites.';
                          dotClass = 'bg-amber-400';
                          break;
                        case 'event_attend':
                          title = 'Attended an event';
                          subtitle = 'You joined a community food event.';
                          dotClass = 'bg-sky-400';
                          break;
                        case 'event_host':
                          title = 'Hosted an event';
                          subtitle = 'You hosted a food event for the community.';
                          dotClass = 'bg-purple-400';
                          break;
                        case 'follow':
                          title = 'Followed a chef';
                          subtitle = 'You started following a new creator.';
                          dotClass = 'bg-pink-400';
                          break;
                        case 'unfollow':
                          title = 'Unfollowed a chef';
                          subtitle = 'You unfollowed a creator.';
                          dotClass = 'bg-gray-400';
                          break;
                        default:
                          title = 'Activity';
                          subtitle = '';
                          dotClass = 'bg-orange-500';
                      }

                      const createdAt = activity.createdAt
                        ? new Date(activity.createdAt).toLocaleString()
                        : '';

                      return (
                        <li key={activity._id} className="flex items-start gap-3">
                          <span className={`mt-1 h-2 w-2 rounded-full ${dotClass}`} />
                          <div>
                            <p className="font-medium text-gray-900">{title}</p>
                            {subtitle && (
                              <p className="text-gray-500 text-xs">{subtitle}</p>
                            )}
                            {createdAt && (
                              <p className="text-gray-400 text-[11px] mt-1">
                                {createdAt}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'all-recipes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Recipes</h2>
              <div className="flex gap-4">
                <select className="px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                  <option>Filter by category</option>
                  <option>All Categories</option>
                  <option>Nepali</option>
                  <option>Chinese</option>
                  <option>Italian</option>
                  <option>Indian</option>
                  <option>Mexican</option>
                </select>
                <select className="px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                  <option>Sort by</option>
                  <option>Most Recent</option>
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                </select>
              </div>
            </div>
            {recipesLoading ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">Loading recipes…</p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes available</h3>
                <p className="text-gray-600">Check back later for new recipes!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => {
                  const firstImage = recipe.images?.[0]?.url;
                  const authorName =
                    recipe.author?.profile?.fullName ||
                    recipe.author?.username ||
                    'Chef';
                  const createdAt = recipe.createdAt
                    ? new Date(recipe.createdAt).toLocaleDateString()
                    : '';

                  return (
                    <div
                      key={recipe._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100 flex flex-col"
                    >
                      <div className="relative h-40 w-full bg-gradient-to-br from-orange-50 to-amber-50">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-orange-600">
                            Photo coming soon
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
                          {recipe.difficulty}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {recipe.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-orange-50">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">
                              {authorName}
                            </span>
                            <span className="text-[11px]">
                              {recipe.cuisine} • {recipe.category}
                            </span>
                          </div>
                          {createdAt && (
                            <span className="text-[11px]">
                              Added {createdAt}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">
              {/* Header row with mini avatar and summary */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-orange-50 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold text-xl shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Logged in as</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user.profile?.fullName || user.username || 'Not set'}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                    {user.userType === 'restaurant' ? 'Restaurant Partner' : 'Recipe Explorer'}
                  </span>
                  {user.createdAt && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100">
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Main details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Full Name
                      </label>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {user.profile?.fullName || user.username || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Phone
                      </label>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {user.profile?.phone || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Gender
                      </label>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {user.profile?.gender || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Favorite Cuisine
                      </label>
                      {user.profile?.favoriteCuisine && user.profile.favoriteCuisine.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {user.profile.favoriteCuisine.map((cuisine) => (
                            <span
                              key={cuisine}
                              className="px-2 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-xs font-medium"
                            >
                              {cuisine}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-sm font-medium text-gray-900">Not set</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">About</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Bio
                      </label>
                      <p className="mt-1 text-sm font-medium text-gray-900 leading-relaxed">
                        {user.profile?.bio || 'No bio added yet'}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Member Since
                        </label>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'Recent'}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          Last Updated
                        </label>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {user.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString()
                            : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md">
                  Edit Profile
                </Button>
                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                  Change Password
                </Button>
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
    </div>
  );
}
