import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card } from "../components/ui/card";
import { Plus, X, Heart, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

interface CreateRecipeProps {
  onClose?: () => void;
}

export function CreateRecipe({ onClose }: CreateRecipeProps = {}) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("");

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("You must be logged in as a chef to create a recipe.");
      return;
    }

    if (!difficulty || !category || !cuisine.trim()) {
      toast.error("Please fill in difficulty, category, and cuisine.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = (formData.get("title") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const prepTimeStr = (formData.get("prepTime") as string || "").trim();
    const cookTimeStr = (formData.get("cookTime") as string || "").trim();
    const servingsStr = (formData.get("servings") as string || "").trim();

    const prepTime = parseInt(prepTimeStr, 10) || 0;
    const cookTime = parseInt(cookTimeStr, 10) || 0;
    const servings = parseInt(servingsStr, 10) || 1;

    if (!title || !description) {
      toast.error("Please provide a title and description.");
      return;
    }

    try {
      const payload = {
        title,
        description,
        prepTime,
        cookTime,
        servings,
        difficulty,
        category,
        cuisine: cuisine.trim(),
        ingredients: ingredients.map((text) => ({
          name: text,
          quantity: text,
          unit: "",
        })),
        instructions: instructions.map((text, index) => ({
          step: index + 1,
          instruction: text,
        })),
        images: imagePreview
          ? [{ url: imagePreview, alt: title }]
          : [],
        tags,
      };

      const response = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create recipe");
      }

      toast.success("🎉 Your recipe has been shared with the community! Thank you for spreading the joy of cooking!");

      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          navigate("/recipes");
        }
      }, 1500);
    } catch (err: any) {
      console.error("Create recipe error:", err);
      toast.error(err.message || "Failed to create recipe");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full mb-4">
            <Heart className="size-5 text-orange-600" fill="rgb(234 88 12)" />
            <span className="text-sm font-medium text-orange-800">Share Your Love Through Food</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Share Your Recipe</h1>
          <p className="text-gray-600 text-lg">
            Have a special dish that brings joy to your table? Share it with our community!
          </p>
        </div>

        {/* Encouraging Message */}
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 p-6 mb-8">
          <div className="flex items-start gap-3">
            <Sparkles className="size-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">A few friendly tips before you start:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Write instructions as if you're telling a friend - be warm and encouraging!</li>
                <li>• Share what makes this recipe special to you - personal touches make it memorable</li>
                <li>• Don't worry about perfection - authentic recipes are the most loved</li>
                <li>• Include any tips or tricks that helped you perfect the dish</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipe Basics</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Recipe Title *</Label>
                <Input 
                  id="title"
                  name="title"
                  placeholder="e.g., Mom's Special Chicken Curry"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Tell us what makes this recipe special! Share the story, the flavors, or why your family loves it..."
                  rows={4}
                  required
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: A warm, inviting description makes people excited to try your recipe!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prepTime">Prep Time *</Label>
                  <Input 
                    id="prepTime"
                    name="prepTime" 
                    placeholder="e.g., 20"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="cookTime">Cook Time *</Label>
                  <Input 
                    id="cookTime"
                    name="cookTime"
                    placeholder="e.g., 30"
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servings">Servings *</Label>
                  <Input 
                    id="servings" 
                    name="servings"
                    type="number"
                    placeholder="4"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select value={difficulty} onValueChange={setDifficulty} required>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy - Perfect for beginners!</SelectItem>
                      <SelectItem value="medium">Medium - Some experience helpful</SelectItem>
                      <SelectItem value="hard">Hard - For confident cooks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">Appetizer</SelectItem>
                      <SelectItem value="main-course">Main Course</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="beverage">Beverage</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cuisine">Cuisine *</Label>
                  <Input
                    id="cuisine"
                    name="cuisine"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="e.g., Nepali, Italian, Indian"
                    required
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Recipe Photo */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe Photo</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload a clear, appetizing photo of your finished dish. This will appear on recipe cards.
            </p>
            <div className="grid md:grid-cols-2 gap-4 items-start">
              <div>
                <Label htmlFor="recipeImage">Upload Image</Label>
                <div className="mt-2 flex flex-col gap-2">
                  <Input
                    id="recipeImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="recipeImage"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-300 bg-white text-orange-700 text-sm font-medium shadow-sm hover:bg-orange-50 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>{imagePreview ? "Change photo" : "Upload recipe photo"}</span>
                  </label>
                  <p className="text-xs text-gray-500">
                    {imagePreview
                      ? "Nice! You can replace the photo anytime."
                      : "Supported formats: JPG, PNG. Max size ~5MB."}
                  </p>
                </div>
              </div>
              <div className="border border-dashed border-orange-200 rounded-xl p-3 flex items-center justify-center bg-orange-50/40 min-h-[160px]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="max-h-40 w-full object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    <p className="mb-1">No image selected yet.</p>
                    <p>Choose a photo to see a live preview here.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Ingredients */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ingredients</h2>
            <p className="text-sm text-gray-600 mb-4">
              List each ingredient with measurements. Be specific to help others succeed!
            </p>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="e.g., 2 cups rice, washed"
                    required
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addIngredient}
              className="mt-4"
            >
              <Plus className="size-4 mr-2" />
              Add Ingredient
            </Button>
          </Card>

          {/* Instructions */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cooking Instructions</h2>
            <p className="text-sm text-gray-600 mb-4">
              Write step-by-step instructions. Imagine you're guiding a friend in your kitchen!
            </p>
            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      placeholder="Describe this step clearly and warmly..."
                      rows={3}
                      required
                    />
                    {instructions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInstruction(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addInstruction}
              className="mt-4"
            >
              <Plus className="size-4 mr-2" />
              Add Step
            </Button>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tags</h2>
            <p className="text-sm text-gray-600 mb-4">
              Add tags to help others find your recipe (e.g., Vegetarian, Quick, Spicy)
            </p>
            <div className="flex gap-2 mb-4">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Type a tag and press Enter"
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="size-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Submit */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  navigate('/recipes');
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg"
            >
              <Heart className="size-4 mr-2" />
              Share Recipe with Community
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
