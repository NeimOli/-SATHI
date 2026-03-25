import { useParams } from "react-router";
import { users, recipes } from "../data/mockData";
import { RecipeCard } from "../components/RecipeCard";
import { BookOpen, Users, Award, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { motion } from "motion/react";

export function Profile() {
  const { id } = useParams();
  const user = users.find(u => u.id === id);
  const userRecipes = recipes.filter(r => r.cookId === id);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
              <img 
                src={user.avatar} 
                alt={user.name}
                className="relative size-40 rounded-full object-cover border-4 border-white shadow-2xl"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Award className="size-5" />
                <span className="text-sm font-medium">Community Member</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{user.name}</h1>
              <p className="text-xl text-orange-100 mb-6 max-w-2xl">
                {user.bio}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5" />
                  <span className="font-semibold">{user.recipesCount} Recipes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-5" />
                  <span className="font-semibold">{user.followersCount} Followers</span>
                </div>
              </div>
            </div>
            <div>
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 shadow-xl">
                Follow
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="recipes" className="w-full">
            <TabsList className="w-full md:w-auto mb-8">
              <TabsTrigger value="recipes" className="flex items-center gap-2">
                <BookOpen className="size-4" />
                Recipes ({userRecipes.length})
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Users className="size-4" />
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipes">
              {userRecipes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <RecipeCard recipe={recipe} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="size-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes yet</h3>
                  <p className="text-gray-600">
                    {user.name} hasn't shared any recipes yet. Check back soon!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="about">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">About {user.name.split(' ')[0]}</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {user.bio}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="size-5 text-orange-500" />
                      <span>Kitchen Location: Home Sweet Home</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <BookOpen className="size-5 text-orange-500" />
                      <span>Cooking Style: Home-style & Traditional</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-md p-6 border border-orange-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Cooking Journey</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold text-orange-600 mb-1">
                        {user.recipesCount}
                      </div>
                      <div className="text-sm text-gray-600">Recipes Shared</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-amber-600 mb-1">
                        {user.followersCount}
                      </div>
                      <div className="text-sm text-gray-600">Community Members Following</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-rose-600 mb-1">
                        {Math.floor(user.recipesCount * 12.5)}
                      </div>
                      <div className="text-sm text-gray-600">Recipe Loves Received</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Kitchen Philosophy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    "Cooking is not just about following recipes - it's about sharing love, 
                    creating memories, and bringing people together around the table. Every 
                    dish tells a story, and I'm here to share mine with this wonderful community. 
                    Let's inspire each other to cook with heart!"
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
