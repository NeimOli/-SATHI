import { Link } from "react-router";
import { Recipe } from "../data/mockData";
import { Heart, Bookmark, Clock, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

interface RecipeCardProps {
  recipe: any; // Using any to handle both mock and backend structures flexibly
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const id = recipe._id || recipe.id;
  const image = recipe.images?.[0]?.url || recipe.image;
  const title = recipe.title;
  const description = recipe.description;
  const difficulty = recipe.difficulty;
  const cookTime = recipe.cookTime;
  const servings = recipe.servings;
  const tags = recipe.tags || [];
  const cookName = recipe.author?.profile?.fullName || recipe.author?.username || recipe.cookName || 'Chef';
  const cookAvatar = recipe.author?.profile?.avatar || recipe.cookAvatar || "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=200";
  const cookId = recipe.author?._id || recipe.cookId;
  const likes = recipe.ratings?.count || recipe.likes || 0;
  const saves = recipe.saves || 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 h-full flex flex-col"
    >
      <Link to={`/recipe/${id}`}>
        <div className="relative overflow-hidden">
          <img 
            src={image || 'https://via.placeholder.com/400x300?text=Recipe+Image'} 
            alt={title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
            {difficulty}
          </div>
        </div>
      </Link>
      
      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <Link to={`/recipe/${id}`}>
            <h3 className="font-bold text-lg text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{cookTime || '—'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-4" />
            <span>{servings || '—'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <Link 
            to={`/profile/${cookId}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src={cookAvatar} 
              alt={cookName}
              className="size-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">{cookName}</span>
          </Link>
          
          <div className="flex items-center gap-3 text-sm">
            <button className="flex items-center gap-1 text-gray-600 hover:text-rose-500 transition-colors">
              <Heart className="size-4" />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-amber-500 transition-colors">
              <Bookmark className="size-4" />
              <span>{saves}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
