import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { 
  Heart, 
  Bookmark, 
  Clock, 
  Users, 
  ChefHat, 
  MessageCircle,
  Send,
  ArrowLeft,
  Share2,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Avatar } from "../components/ui/avatar";
import { toast } from "sonner";
import { motion } from "motion/react";
import { Recipe as MockRecipe } from "../data/mockData";

export function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<MockRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/recipes/${id}`);
        const data = await response.json();

        if (data.status === 'success') {
          const backendRecipe = data.data.recipe;
          // Map to mock format for UI compatibility
          const mappedRecipe: MockRecipe = {
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
            comments: backendRecipe.reviews || [],
            createdAt: backendRecipe.createdAt
          };
          setRecipe(mappedRecipe);
          setLocalComments(backendRecipe.reviews || []);
        } else {
          setError(data.message || "Recipe not found");
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="size-12 text-orange-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading recipe details...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Recipe not found"}</h2>
        <Link to="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    toast(liked ? "Removed from favorites" : "Added to favorites! ❤️");
  };

  const handleSave = () => {
    setSaved(!saved);
    toast(saved ? "Removed from saved recipes" : "Saved for later! 📖");
  };

  const handleShare = () => {
    toast("Recipe link copied to clipboard! 🔗");
  };

  const handleComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: `c${Date.now()}`,
        userId: '1',
        userName: 'You',
        userAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
        text: comment,
        createdAt: new Date().toISOString(),
      };
      setLocalComments([...localComments, newComment]);
      setComment("");
      toast("Comment shared! Thank you for being part of our community! 💬");
    }
  };

  return (
    <div className="pb-24 md:pb-8">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link 
              to="/recipes"
              className="inline-flex items-center gap-2 text-white mb-4 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Recipes</span>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{recipe.title}</h1>
              <div className="flex flex-wrap items-center gap-4">
                {recipe.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <p className="text-gray-700 text-lg leading-relaxed">{recipe.description}</p>
            </motion.div>

            {/* Recipe Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="size-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Prep Time</div>
                    <div className="font-semibold text-gray-900">{recipe.prepTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <ChefHat className="size-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Cook Time</div>
                    <div className="font-semibold text-gray-900">{recipe.cookTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-rose-100 p-3 rounded-lg">
                    <Users className="size-6 text-rose-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Servings</div>
                    <div className="font-semibold text-gray-900">{recipe.servings}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <ChefHat className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Level</div>
                    <div className="font-semibold text-gray-900">{recipe.difficulty}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🥘</span>
                Ingredients
              </h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">👨‍🍳</span>
                Instructions
              </h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="size-6 text-orange-600" />
                Community Feedback ({localComments.length})
              </h2>

              {/* Add Comment */}
              <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-sm text-gray-700 mb-3">
                  💬 Share your experience! Did you make this recipe? How did it turn out?
                </p>
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Leave an encouraging comment or share your cooking tips..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1"
                    rows={3}
                  />
                  <Button 
                    onClick={handleComment}
                    className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {localComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                    <Avatar className="size-10">
                      <img src={comment.userAvatar} alt={comment.userName} className="object-cover" />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {comment.user?.profile?.fullName || comment.user?.username || comment.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.comment || comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-20"
            >
              <div className="space-y-3">
                <Button 
                  onClick={handleLike}
                  variant={liked ? "default" : "outline"}
                  className={`w-full ${liked ? 'bg-rose-500 hover:bg-rose-600' : ''}`}
                >
                  <Heart className="size-4 mr-2" fill={liked ? "white" : "none"} />
                  {liked ? 'Loved!' : 'Love This Recipe'} ({recipe.likes + (liked ? 1 : 0)})
                </Button>
                
                <Button 
                  onClick={handleSave}
                  variant={saved ? "default" : "outline"}
                  className={`w-full ${saved ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                >
                  <Bookmark className="size-4 mr-2" fill={saved ? "white" : "none"} />
                  {saved ? 'Saved!' : 'Save for Later'} ({recipe.saves + (saved ? 1 : 0)})
                </Button>
                
                <Button 
                  onClick={handleShare}
                  variant="outline"
                  className="w-full"
                >
                  <Share2 className="size-4 mr-2" />
                  Share Recipe
                </Button>
              </div>
            </motion.div>

            {/* Cook Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border-2 border-purple-200"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Recipe by</h3>
              <Link to={`/profile/${recipe.cookId}`} className="block group">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={recipe.cookAvatar} 
                    alt={recipe.cookName}
                    className="size-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                      {recipe.cookName}
                    </h4>
                    <p className="text-sm text-gray-600">Home Cook</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Check out more delicious recipes from {recipe.cookName.split(' ')[0]}!
                </p>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
