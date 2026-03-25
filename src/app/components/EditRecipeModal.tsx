import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

interface EditRecipeModalProps {
  recipeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export function EditRecipeModal({ recipeId, isOpen, onClose, isAdmin = false }: EditRecipeModalProps) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [calories, setCalories] = useState("");

  useEffect(() => {
    if (isOpen && recipeId) {
      fetchRecipeDetails();
    }
  }, [isOpen, recipeId]);

  const fetchRecipeDetails = async () => {
    try {
      setFetching(true);
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`);
      const data = await response.json();

      if (data.status === 'success') {
        const recipe = data.data.recipe;
        setTitle(recipe.title);
        setDescription(recipe.description);
        setPrepTime(recipe.prepTime.toString());
        setCookTime(recipe.cookTime.toString());
        setServings(recipe.servings.toString());
        setDifficulty(recipe.difficulty);
        setCategory(recipe.category);
        setCuisine(recipe.cuisine);
        setIngredients(recipe.ingredients.map((i: any) => i.name));
        setInstructions(recipe.instructions.map((i: any) => i.instruction));
        setTags(recipe.tags || []);
        setImagePreview(recipe.images?.[0]?.url || null);
        if (recipe.nutrition) {
          setCalories(recipe.nutrition.calories?.toString() || "");
        }
      } else {
        toast.error("Failed to load recipe details");
        onClose();
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      toast.error("An error occurred while fetching recipe details");
      onClose();
    } finally {
      setFetching(false);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));

  const addInstruction = () => setInstructions([...instructions, '']);
  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };
  const removeInstruction = (index: number) => setInstructions(instructions.filter((_, i) => i !== index));


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        prepTime: parseInt(prepTime) || 0,
        cookTime: parseInt(cookTime) || 0,
        servings: parseInt(servings) || 1,
        difficulty,
        category,
        cuisine: cuisine.trim(),
        ingredients: ingredients.map((text) => ({ name: text, quantity: text, unit: "" })),
        instructions: instructions.map((text, index) => ({ step: index + 1, instruction: text })),
        images: imagePreview ? [{ url: imagePreview, alt: title }] : [],
        tags,
        nutrition: {
          calories: parseInt(calories) || 0,
        }
      };

      const endpoint = isAdmin 
        ? `http://localhost:5000/api/admin/recipes/${recipeId}`
        : `http://localhost:5000/api/recipes/${recipeId}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to update recipe");

      toast.success("Recipe updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update recipe");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[200] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="bg-white rounded-[2.5rem] shadow-2xl max-w-6xl w-full relative overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-orange-50 to-amber-50">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Edit Recipe</h2>
              <p className="text-slate-500 font-medium">Refine your culinary masterpiece</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white text-slate-900 w-11 h-11 shadow-sm group"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>

          {fetching ? (
            <div className="p-24 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
              <p className="text-slate-500 font-bold animate-pulse">Loading recipe ingredients...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="font-bold text-slate-700">Recipe Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded-xl border-2 focus:border-orange-500" />
                  </div>
                  <div>
                    <Label className="font-bold text-slate-700">Description</Label>
                    <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required className="rounded-xl border-2 focus:border-orange-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-bold text-slate-700">Prep Time (min)</Label>
                    <Input value={prepTime} onChange={(e) => setPrepTime(e.target.value)} required type="number" className="rounded-xl border-2" />
                  </div>
                  <div>
                    <Label className="font-bold text-slate-700">Cook Time (min)</Label>
                    <Input value={cookTime} onChange={(e) => setCookTime(e.target.value)} required type="number" className="rounded-xl border-2" />
                  </div>
                  <div>
                    <Label className="font-bold text-slate-700">Servings</Label>
                    <Input value={servings} onChange={(e) => setServings(e.target.value)} required type="number" className="rounded-xl border-2" />
                  </div>
                  <div>
                    <Label className="font-bold text-slate-700">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty} required>
                      <SelectTrigger className="rounded-xl border-2"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Categorization */}
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <Label className="font-bold text-slate-700">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="rounded-xl border-2"><SelectValue /></SelectTrigger>
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
                    <Label className="font-bold text-slate-700">Cuisine</Label>
                    <Input value={cuisine} onChange={(e) => setCuisine(e.target.value)} required className="rounded-xl border-2" />
                  </div>
              </div>

              {/* Ingredients */}
              <Card className="p-6 border-2 border-slate-100 rounded-[2rem]">
                <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-orange-500" /> Ingredients
                </h3>
                <div className="space-y-3">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input value={ing} onChange={(e) => updateIngredient(idx, e.target.value)} placeholder="e.g. 2 cups of love" className="rounded-xl border-2" />
                      <Button type="button" variant="ghost" className="text-rose-500" onClick={() => removeIngredient(idx)}><X className="w-4 h-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addIngredient} className="w-full rounded-xl border-dashed border-2 text-slate-500 font-bold">
                    + Add Ingredient
                  </Button>
                </div>
              </Card>

              {/* Instructions */}
              <Card className="p-6 border-2 border-slate-100 rounded-[2rem]">
                <h3 className="text-xl font-black text-slate-900 mb-4">Cooking Steps</h3>
                <div className="space-y-4">
                  {instructions.map((inst, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold flex-shrink-0">{idx + 1}</div>
                      <div className="flex-1 flex gap-2">
                        <Textarea value={inst} onChange={(e) => updateInstruction(idx, e.target.value)} className="rounded-xl border-2" />
                        <Button type="button" variant="ghost" className="text-rose-500" onClick={() => removeInstruction(idx)}><X className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addInstruction} className="w-full rounded-xl border-dashed border-2 text-slate-500 font-bold">
                    + Add Step
                  </Button>
                </div>
              </Card>

              {/* Form Footer */}
              <div className="flex justify-end gap-4 p-4">
                <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-12 font-black shadow-xl">
                  {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
