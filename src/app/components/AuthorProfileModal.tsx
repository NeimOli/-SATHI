import { useState, useEffect } from "react";
import { Link } from "react-router";
import { 
  Users, 
  BookOpen, 
  Award, 
  MapPin, 
  X, 
  ChevronRight
} from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";

interface AuthorProfileModalProps {
  authorId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onRecipeClick?: (id: string) => void;
}

export function AuthorProfileModal({ authorId, isOpen, onClose, onRecipeClick }: AuthorProfileModalProps) {
  const [author, setAuthor] = useState<any | null>(null);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !authorId) {
      setAuthor(null);
      setRecipes([]);
      return;
    }

    const fetchAuthorData = async () => {
      setLoading(true);
      setError("");
      try {
        const userRes = await fetch(`http://localhost:5000/api/users/${authorId}`);
        const userData = await userRes.json();

        const recipesRes = await fetch(`http://localhost:5000/api/recipes/user/${authorId}?limit=6`);
        const recipesData = await recipesRes.json();

        if (userData.success) {
          setAuthor(userData.data.user);
          if (recipesData.status === 'success') {
            setRecipes(recipesData.data.recipes || []);
          }
        } else {
          setError(userData.message || "Author not found");
        }
      } catch (err) {
        console.error("Error fetching author data:", err);
        setError("Failed to load profile. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[115] overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full relative overflow-hidden my-8 border border-white/20"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 bg-slate-100/50 hover:bg-slate-200 rounded-full text-slate-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[450px] p-12">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-orange-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-orange-500 border-t-transparent animate-spin rounded-full"></div>
              </div>
              <p className="mt-6 text-slate-500 font-medium animate-pulse">Visiting the chef's kitchen...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Oops!</h2>
              <p className="text-slate-600 mb-8">{error}</p>
              <Button onClick={onClose} variant="outline" className="px-10 rounded-full border-2">
                Go Back
              </Button>
            </div>
          ) : author ? (
            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="relative pt-24 pb-12 px-8 bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-orange-400 to-amber-500"></div>
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative group">
                    <img 
                      src={author.profile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"} 
                      alt={author.profile?.fullName}
                      className="size-32 rounded-3xl object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                    />
                    {author.userType === 'restaurant' && (
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg">
                        <Award className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="mt-6 text-3xl font-black text-slate-900 tracking-tight">
                    {author.profile?.fullName || author.username}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    Kitchen: {author.restaurant?.address || "Hometown Cook"}
                  </div>

                  <p className="mt-4 text-slate-600 font-medium max-w-md leading-relaxed">
                    {author.profile?.bio || "A passionate food lover sharing traditional recipes and culinary secrets with the community."}
                  </p>

                  <div className="flex gap-4 mt-8">
                    <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center min-w-24">
                      <span className="text-2xl font-black text-slate-900">{author.stats?.recipesCount || 0}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Recipes</span>
                    </div>
                    <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center min-w-24">
                      <span className="text-2xl font-black text-slate-900">{author.stats?.followersCount || 0}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Followers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-500" />
                    Top Recipes
                  </h3>
                  <Link to={`/profile/${author._id}`} className="text-orange-600 font-bold text-sm hover:underline" onClick={onClose}>
                    View All
                  </Link>
                </div>

                {recipes.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {recipes.map((recipe) => (
                      <div 
                        key={recipe._id} 
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                        onClick={() => onRecipeClick && (onClose(), onRecipeClick(recipe._id))}
                      >
                        <img 
                          src={recipe.images?.[0]?.url || recipe.images?.[0] || 'https://via.placeholder.com/200'} 
                          alt="" 
                          className="aspect-video w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-xs font-bold truncate">{recipe.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm font-medium">No recipes shared yet.</p>
                  </div>
                )}

                <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-between bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-orange-500 rounded-2xl">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-black text-lg leading-tight">Join the Circle</p>
                        <p className="text-slate-400 text-xs font-medium">Get notified of new recipes!</p>
                      </div>
                    </div>
                    <Button className="bg-white text-slate-900 hover:bg-orange-50 font-black rounded-xl px-6">
                      Follow
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 pt-4">
                  <Link 
                    to={`/profile/${author._id}`} 
                    className="flex items-center gap-2 text-slate-400 hover:text-orange-500 text-xs font-bold transition-colors"
                    onClick={onClose}
                  >
                    Standalone Profile <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
