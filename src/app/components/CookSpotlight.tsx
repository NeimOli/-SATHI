import { Link } from "react-router";
import { User } from "../data/mockData";
import { BookOpen, Users, Award } from "lucide-react";
import { Button } from "./ui/button";

interface CookSpotlightProps {
  cook: User;
}

export function CookSpotlight({ cook }: CookSpotlightProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30"></div>
          <img 
            src={cook.avatar} 
            alt={cook.name}
            className="relative w-full aspect-square rounded-full object-cover shadow-xl border-4 border-white"
          />
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-full shadow-lg">
            <Award className="size-6 text-white" />
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <div>
            <div className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              ⭐ Featured Cook
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{cook.name}</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{cook.bio}</p>
          </div>

          <div className="flex items-center gap-6 py-4">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <BookOpen className="size-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{cook.recipesCount}</div>
                <div className="text-xs text-gray-600">Recipes Shared</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Users className="size-5 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{cook.followersCount}</div>
                <div className="text-xs text-gray-600">Happy Followers</div>
              </div>
            </div>
          </div>

          <Link to={`/profile/${cook.id}`}>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
              View {cook.name.split(' ')[0]}'s Kitchen
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
