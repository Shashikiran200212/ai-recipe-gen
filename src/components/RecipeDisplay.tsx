
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Users, ChefHat, BookOpen, Heart, Share2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  cuisine?: string;
}

interface RecipeDisplayProps {
  recipe: Recipe;
  onSave?: (recipe: Recipe) => void;
  showSaveButton?: boolean;
}

const RecipeDisplay = ({ recipe, onSave, showSaveButton = false }: RecipeDisplayProps) => {
  const { toast } = useToast();

  const handleSaveRecipe = () => {
    if (onSave) {
      onSave(recipe);
    } else {
      toast({
        title: "Recipe saved!",
        description: "This recipe has been added to your collection.",
      });
    }
  };

  const handleShareRecipe = () => {
    toast({
      title: "Recipe copied!",
      description: "Recipe link copied to clipboard.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Card className="shadow-2xl border-0 bg-white overflow-hidden">
        {/* Recipe Header */}
        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                {recipe.title}
              </CardTitle>
              
              {/* Recipe Meta Info */}
              <div className="flex flex-wrap gap-4 text-green-100">
                {recipe.cookTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={20} />
                    <span>{recipe.cookTime}</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <Users size={20} />
                    <span>{recipe.servings}</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex items-center gap-2">
                    <ChefHat size={20} />
                    <span>{recipe.difficulty}</span>
                  </div>
                )}
              </div>
              
              {recipe.cuisine && (
                <Badge className="mt-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {recipe.cuisine} Cuisine
                </Badge>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 ml-4">
              <Button 
                onClick={handleSaveRecipe}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Heart size={16} className="mr-1" />
                Save
              </Button>
              <Button 
                onClick={handleShareRecipe}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Share2 size={16} className="mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <BookOpen className="mr-2 text-green-600" />
                Ingredients
              </h3>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <ChefHat className="mr-2 text-orange-600" />
                Instructions
              </h3>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div 
                    key={index}
                    className="flex gap-4 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Tips Section */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">👨‍🍳 Chef's Tips</h4>
            <p className="text-blue-700">
              Remember to taste as you cook and adjust seasonings to your preference. 
              Fresh ingredients always make a difference in the final result!
            </p>
          </div>

          {/* Action Footer */}
          <div className="flex justify-center mt-8 gap-4">
            {showSaveButton && (
              <Button 
                onClick={() => onSave && onSave(recipe)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8"
              >
                <Save className="mr-2" />
                Save to Community
              </Button>
            )}
            <Button 
              onClick={handleSaveRecipe}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-8"
            >
              <Heart className="mr-2" />
              Save to My Recipes
            </Button>
            <Button 
              onClick={handleShareRecipe}
              variant="outline"
              className="border-2 border-green-300 text-green-600 hover:bg-green-50 px-8"
            >
              <Share2 className="mr-2" />
              Share Recipe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipeDisplay;
