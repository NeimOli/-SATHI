import { useState, useEffect } from "react";
import { 
  Heart, 
  ChefHat, 
  MessageCircle,
  Send,
  X,
  Share2,
  Loader2,
  Edit2
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { EditRecipeModal } from "./EditRecipeModal";

interface RecipeDetailModalProps {
  recipeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAuthorClick?: (id: string) => void;
}

export function RecipeDetailModal({ recipeId, isOpen, onClose, onAuthorClick }: RecipeDetailModalProps) {
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState<any[]>([]);

  // Use a more robust check for authorship since user structure might vary
  const canEdit = user && recipe && (
    (user.id === (recipe.cookId?._id || recipe.cookId)) ||
    (user as any).userId === (recipe.cookId?._id || recipe.cookId) ||
    user.userType === 'admin'
  );

  useEffect(() => {
    if (isOpen && recipeId) {
      fetchRecipe();
    }
  }, [isOpen, recipeId]);

  const fetchRecipe = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}`);
      if (!res.ok) throw new Error("Failed to fetch recipe");
      
      const data = await res.json();
      if (data.status === 'success') {
        const r = data.data.recipe;
        const mappedRecipe = {
          ...r,
          id: r._id,
          cookName: r.author?.profile?.fullName || r.author?.username || "Unknown Chef",
          cookAvatar: r.author?.profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
          cookId: r.author?._id || r.author,
          difficulty: r.difficulty || "medium",
          prepTime: r.prepTime || 0,
          cookTime: r.cookTime || 0,
          servings: r.servings || 1,
          tags: r.tags || [],
          comments: r.reviews?.map((rev: any) => ({
            id: rev._id,
            user: rev.user?.profile?.fullName || rev.user?.username || "Gourmet Guest",
            avatar: rev.user?.profile?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
            text: rev.comment,
            time: new Date(rev.createdAt).toLocaleDateString()
          })) || []
        };
        setRecipe(mappedRecipe);
        setLocalComments(mappedRecipe.comments);
      } else {
        setError("Recipe not found");
      }
    } catch (err) {
      console.error("Fetch recipe details error:", err);
      setError("Failed to load recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    toast(liked ? "Recipe removed from likes" : "Added to your liked recipes!");
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now().toString(),
      user: user?.profile?.fullName || user?.username || "Guest Lover",
      avatar: user?.profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      text: comment,
      time: "Just now"
    };

    setLocalComments([newComment, ...localComments]);
    setComment("");
    toast.success("Thanks for sharing your thoughts!");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="bg-white rounded-[3rem] shadow-2xl max-w-7xl w-full relative overflow-hidden my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2.5 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white text-slate-900 transition-all shadow-xl rounded-2xl group"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] p-20">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-slate-500 font-bold text-xl animate-pulse tracking-tight">Gathering ingredients...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Chef's Blunder!</h2>
              <p className="text-slate-600 mb-8 text-lg">{error}</p>
              <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl px-12 py-6">
                Go Back
              </Button>
            </div>
          ) : recipe ? (
            <div className="flex flex-col lg:flex-row max-h-[90vh]">
              <div className="lg:w-1/2 relative bg-slate-100 overflow-y-auto custom-scrollbar">
                <img 
                  src={recipe.images?.[0]?.url || recipe.images?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"} 
                  alt={recipe.title}
                  className="w-full h-[400px] lg:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-8 left-8 flex flex-wrap gap-2">
                  <Badge className="bg-orange-500 text-white border-0 py-1.5 px-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                    {recipe.category}
                  </Badge>
                  <Badge className="bg-emerald-500 text-white border-0 py-1.5 px-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                    {recipe.difficulty}
                  </Badge>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-2xl">
                    {recipe.title}
                  </h1>
                </div>
              </div>

              <div className="lg:w-1/2 overflow-y-auto custom-scrollbar bg-white p-8 lg:p-12">
                <div className="space-y-10">
                  <div className="flex items-center justify-between pb-8 border-b border-slate-100">
                    <div className="flex gap-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleLike}
                        className={`rounded-2xl w-12 h-12 transition-all ${liked ? 'bg-rose-50 text-rose-500 scale-110' : 'text-slate-400 hover:bg-slate-50'}`}
                      >
                        <Heart className="w-6 h-6" fill={liked ? "currentColor" : "none"} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:bg-slate-50 rounded-2xl w-12 h-12"
                      >
                        <Share2 className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time</p>
                        <p className="font-black text-slate-900">{recipe.prepTime + recipe.cookTime}m</p>
                      </div>
                      <div className="w-px h-8 bg-slate-100"></div>
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Serves</p>
                        <p className="font-black text-slate-900">{recipe.servings}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="space-y-8">
                    <section>
                      <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                          <ChefHat className="w-4 h-4 text-orange-600" />
                        </div>
                        Ingredients
                      </h3>
                      <div className="grid gap-4">
                        {recipe.ingredients?.map((ing: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 p-4 hover:bg-orange-50/50 rounded-2xl transition-colors border border-transparent hover:border-orange-100">
                            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                            <p className="text-slate-700 font-bold">{ing.name}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold italic">?</div>
                        Instructions
                      </h3>
                      <div className="space-y-6">
                        {recipe.instructions?.map((inst: any) => (
                          <div key={inst.step} className="flex gap-6 group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black group-hover:scale-110 group-hover:bg-orange-500 transition-all shadow-lg">
                              {inst.step}
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed pt-1">
                              {inst.instruction}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="pt-10 border-t border-slate-100">
                      <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-orange-500" />
                        Community Bites
                      </h3>
                      
                      <form onSubmit={handleComment} className="mb-10 relative">
                        <Textarea 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="What did you love about this recipe?"
                          className="w-full rounded-[2rem] border-2 border-slate-100 focus:border-orange-500 p-6 min-h-[120px] pr-16 text-slate-600 font-medium resize-none shadow-sm"
                        />
                        <button 
                          type="submit"
                          className="absolute bottom-4 right-4 p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                          disabled={!comment.trim()}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </form>

                      <div className="space-y-8">
                        {localComments.length > 0 ? (
                          localComments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-4 group">
                              <Avatar className="w-12 h-12 rounded-2xl shadow-md border-4 border-white ring-1 ring-slate-100">
                                <img src={comment.avatar} alt={comment.user} className="object-cover" />
                              </Avatar>
                              <div className="flex-1 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-black text-slate-900">{comment.user}</h4>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{comment.time}</span>
                                </div>
                                <p className="text-slate-600 font-medium leading-relaxed">{comment.text}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 font-bold italic">No bites yet. Be the first to taste!</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-8 mt-12 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Masterpiece created by</p>
                        <div 
                          className="flex items-center gap-4 group cursor-pointer"
                          onClick={() => onAuthorClick && onAuthorClick(recipe.cookId)}
                        >
                          <img 
                            src={recipe.cookAvatar} 
                            alt={recipe.cookName}
                            className="size-16 rounded-2xl object-cover ring-4 ring-orange-50 group-hover:ring-orange-100 transition-all shadow-md"
                          />
                          <div>
                            <h4 className="font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                              {recipe.cookName}
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">Home Cook Expert</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                          <Button 
                            variant="ghost" 
                            className="flex-1 rounded-2xl text-orange-600 font-black hover:bg-orange-50 py-6"
                            onClick={() => onAuthorClick && onAuthorClick(recipe.cookId)}
                          >
                            View Author Profile
                          </Button>
                          {canEdit && (
                            <Button 
                              variant="outline" 
                              className="px-6 rounded-2xl border-2 border-slate-200 hover:border-orange-500 hover:text-orange-600 py-6"
                              onClick={() => setIsEditModalOpen(true)}
                            >
                              <Edit2 className="w-5 h-5 mr-2" />
                              <span className="font-black">Edit</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>

      <EditRecipeModal
        recipeId={recipeId}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          fetchRecipe();
        }}
        isAdmin={user?.userType === 'admin'}
      />
    </AnimatePresence>
  );
}
