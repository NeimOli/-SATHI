import { Link } from "react-router";
import { Recipe } from "../data/mockData";
import { Heart, Bookmark, Clock, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
    >
      <Link to={`/recipe/${recipe.id}`}>
        <div className="relative overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md">
            {recipe.difficulty}
          </div>
        </div>
      </Link>
      
      <div className="p-5 space-y-4">
        <div>
          <Link to={`/recipe/${recipe.id}`}>
            <h3 className="font-bold text-lg text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
              {recipe.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {recipe.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-4" />
            <span>{recipe.servings}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link 
            to={`/profile/${recipe.cookId}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src={recipe.cookAvatar} 
              alt={recipe.cookName}
              className="size-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">{recipe.cookName}</span>
          </Link>
          
          <div className="flex items-center gap-3 text-sm">
            <button className="flex items-center gap-1 text-gray-600 hover:text-rose-500 transition-colors">
              <Heart className="size-4" />
              <span>{recipe.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-amber-500 transition-colors">
              <Bookmark className="size-4" />
              <span>{recipe.saves}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
