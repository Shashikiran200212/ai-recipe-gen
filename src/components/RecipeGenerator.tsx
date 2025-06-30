
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChefHat, Plus, X, Sparkles, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRecipe } from "@/utils/recipeGenerator";

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: any) => void;
}

const RecipeGenerator = ({ onRecipeGenerated }: RecipeGeneratorProps) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const cuisines = [
    "Italian", "Chinese", "Mexican", "Indian", "Thai", "French", 
    "Mediterranean", "Japanese", "Korean", "American", "Greek", "Spanish"
  ];

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "Add some ingredients!",
        description: "Please add at least one ingredient to generate a recipe.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const recipe = await generateRecipe(ingredients, cuisine);
      onRecipeGenerated(recipe);
      toast({
        title: "Recipe generated!",
        description: "Your delicious recipe is ready.",
      });
    } catch (error) {
      toast({
        title: "Error generating recipe",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurpriseMe = async () => {
    setIsLoading(true);
    try {
      const recipe = await generateRecipe([], "", true);
      onRecipeGenerated(recipe);
      toast({
        title: "Surprise recipe generated!",
        description: "Hope you like this random creation!",
      });
    } catch (error) {
      toast({
        title: "Error generating recipe",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <ChefHat size={48} />
          </div>
          <CardTitle className="text-3xl font-bold">Recipe Generator</CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Tell us what you have, and we'll create something amazing!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          {/* Ingredients Input */}
          <div className="space-y-4">
            <Label htmlFor="ingredients" className="text-lg font-semibold text-gray-700">
              Your Ingredients
            </Label>
            <div className="flex gap-2">
              <Input
                id="ingredients"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter an ingredient (e.g., chicken, tomatoes, rice)"
                className="flex-1 text-lg p-3 border-2 focus:border-orange-300"
              />
              <Button 
                onClick={addIngredient} 
                variant="outline"
                className="hover:bg-orange-50 border-2 border-orange-200 px-4"
              >
                <Plus size={20} />
              </Button>
            </div>
            
            {/* Ingredients List */}
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-orange-50 rounded-lg">
                {ingredients.map((ingredient) => (
                  <Badge 
                    key={ingredient} 
                    variant="secondary" 
                    className="text-sm py-2 px-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="ml-2 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Cuisine Selection */}
          <div className="space-y-4">
            <Label htmlFor="cuisine" className="text-lg font-semibold text-gray-700">
              Preferred Cuisine (Optional)
            </Label>
            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger className="text-lg p-3 border-2 focus:border-orange-300">
                <SelectValue placeholder="Choose a cuisine style..." />
              </SelectTrigger>
              <SelectContent>
                {cuisines.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              onClick={handleGenerateRecipe}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" />
                  Generate Recipe
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleSurpriseMe}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 text-lg py-3 hover:shadow-lg transition-all duration-300"
            >
              <Shuffle className="mr-2" />
              Surprise Me!
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            💡 Tip: Add more ingredients for more creative recipe options!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeGenerator;
