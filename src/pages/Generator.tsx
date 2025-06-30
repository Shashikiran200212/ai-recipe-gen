
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import RecipeGenerator from "@/components/RecipeGenerator";
import RecipeDisplay from "@/components/RecipeDisplay";
import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Generator = () => {
  const { user } = useAuth();
  const [activeRecipe, setActiveRecipe] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSaveToDatabase = async (recipe: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          cuisine: recipe.cuisine,
        });

      if (error) throw error;

      toast({
        title: "Recipe saved!",
        description: "Your recipe has been shared with the community.",
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe to community",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={() => navigate("/community")}
            variant="outline" 
            className="hover:bg-orange-100 transition-colors gap-2"
          >
            <ArrowLeft size={16} />
            Back to Community
          </Button>
          <div className="flex items-center gap-3">
            <ChefHat className="text-orange-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">Recipe Generator</h1>
          </div>
        </div>
        
        <RecipeGenerator onRecipeGenerated={setActiveRecipe} />
        {activeRecipe && (
          <div className="mt-8">
            <RecipeDisplay 
              recipe={activeRecipe} 
              onSave={handleSaveToDatabase}
              showSaveButton={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Generator;
