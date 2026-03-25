import { useState, useEffect } from "react";
import { RecipeCard } from "../components/RecipeCard";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { motion } from "motion/react";
import { Recipe as MockRecipe } from "../data/mockData";

export function Recipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        onlyChefs: 'true',
        sortBy: sortBy === 'popular' ? 'ratings.average' : 'createdAt',
        sortOrder: 'desc',
        limit: '50'
      });

      if (searchQuery) params.append('search', searchQuery);
      if (difficultyFilter !== 'all') params.append('difficulty', difficultyFilter.toLowerCase());

      const response = await fetch(`http://localhost:5000/api/recipes?${params.toString()}`);
      const data = await response.json();

      if (data.status === 'success') {
        setRecipes(data.data.recipes);
      } else {
        setError(data.message || "Failed to fetch recipes");
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [difficultyFilter, sortBy]);

  // Handle search with debounce if needed, but for now simple button or enter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes();
  };

  // Map backend recipe to MockRecipe format for RecipeCard compatibility
  const mapToMockFormat = (backendRecipe: any): MockRecipe => ({
    id: backendRecipe._id,
    title: backendRecipe.title,
    description: backendRecipe.description,
    image: backendRecipe.images?.[0]?.url || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800",
    cookId: backendRecipe.author?._id || "",
    cookName: backendRecipe.author?.profile?.fullName || backendRecipe.author?.username || "Chef",
    cookAvatar: backendRecipe.author?.profile?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    prepTime: `${backendRecipe.prepTime} min`,
    cookTime: `${backendRecipe.cookTime} min`,
    servings: backendRecipe.servings,
    difficulty: backendRecipe.difficulty?.charAt(0).toUpperCase() + backendRecipe.difficulty?.slice(1) || 'Medium',
    ingredients: backendRecipe.ingredients?.map((i: any) => `${i.quantity} ${i.unit || ''} ${i.name}`) || [],
    instructions: backendRecipe.instructions?.map((i: any) => i.instruction) || [],
    tags: backendRecipe.tags || [],
    likes: backendRecipe.likes || 0,
    saves: backendRecipe.saves || 0,
    comments: [],
    createdAt: backendRecipe.createdAt
  });

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Recipes</h1>
          <p className="text-gray-600 text-lg">
            Explore delicious home-cooked recipes shared by our community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search recipes, ingredients, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Button type="submit" className="hidden">Search</Button>
            </div>
            
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="saved">Most Saved</SelectItem>
              </SelectContent>
            </Select>
          </form>

          {(searchQuery || difficultyFilter !== "all") && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </span>
              {(searchQuery || difficultyFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setDifficultyFilter("all");
                    fetchRecipes();
                  }}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="size-12 text-orange-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Fetching chef's specialties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-600 font-medium">{error}</p>
            <Button onClick={fetchRecipes} variant="outline" className="mt-4 border-red-200 text-red-600">
              Try Again
            </Button>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <RecipeCard recipe={mapToMockFormat(recipe)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Search className="size-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No chef recipes found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setDifficultyFilter("all");
                fetchRecipes();
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
