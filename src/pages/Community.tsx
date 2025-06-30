
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Clock, Users, Heart, HeartHandshake, LogOut, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cook_time?: string;
  servings?: string;
  difficulty?: string;
  cuisine?: string;
  user_id: string;
  created_at: string;
}

const Community = () => {
  const { user, signOut } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [userSavedRecipes, setUserSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchRecipes();
    fetchSavedRecipes();
    fetchUserSavedRecipes();
  }, [user, navigate]);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error",
        description: "Failed to load recipes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('recipe_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setSavedRecipes(data?.map(item => item.recipe_id) || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };

  const fetchUserSavedRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select(`
          recipe_id,
          recipes (
            id,
            title,
            ingredients,
            instructions,
            cook_time,
            servings,
            difficulty,
            cuisine,
            user_id,
            created_at
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      const savedRecipesList = data?.map(item => item.recipes).filter(Boolean) || [];
      setUserSavedRecipes(savedRecipesList as Recipe[]);
    } catch (error) {
      console.error('Error fetching user saved recipes:', error);
    }
  };

  const handleSaveRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .insert({ recipe_id: recipeId, user_id: user?.id });

      if (error) throw error;
      
      setSavedRecipes(prev => [...prev, recipeId]);
      fetchUserSavedRecipes(); // Refresh saved recipes list
      toast({
        title: "Recipe saved!",
        description: "Recipe has been added to your collection.",
      });
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Already saved",
          description: "This recipe is already in your collection.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save recipe",
          variant: "destructive",
        });
      }
    }
  };

  const handleUnsaveRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setSavedRecipes(prev => prev.filter(id => id !== recipeId));
      fetchUserSavedRecipes(); // Refresh saved recipes list
      toast({
        title: "Recipe removed",
        description: "Recipe has been removed from your collection.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove recipe",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setUserSavedRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      toast({
        title: "Recipe deleted",
        description: "Your recipe has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete recipe",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const RecipeCard = ({ recipe, showDeleteButton = false }: { recipe: Recipe; showDeleteButton?: boolean }) => (
    <Card key={recipe.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
        <ChefHat size={64} className="text-orange-600 opacity-50" />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{recipe.title}</CardTitle>
        <p className="text-sm text-gray-500">by Anonymous Chef</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {ingredient}
            </Badge>
          ))}
          {recipe.ingredients.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{recipe.ingredients.length - 3} more
            </Badge>
          )}
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          {recipe.cook_time && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {recipe.cook_time}
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <Users size={14} />
              {recipe.servings}
            </span>
          )}
          {recipe.difficulty && (
            <span>📊 {recipe.difficulty}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                View Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{recipe.title}</DialogTitle>
                <p className="text-gray-600">by Anonymous Chef</p>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex gap-4 text-sm text-gray-600">
                  {recipe.cook_time && (
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {recipe.cook_time}
                    </span>
                  )}
                  {recipe.servings && (
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {recipe.servings}
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span>📊 {recipe.difficulty}</span>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3">Ingredients</h4>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-3">Instructions</h4>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <p className="text-gray-700">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {showDeleteButton && recipe.user_id === user?.id ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            savedRecipes.includes(recipe.id) ? (
              <Button 
                onClick={() => handleUnsaveRecipe(recipe.id)}
                variant="outline"
                className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
              >
                <HeartHandshake size={16} />
                Saved
              </Button>
            ) : (
              <Button 
                onClick={() => handleSaveRecipe(recipe.id)}
                variant="outline"
                className="gap-1 hover:text-red-600 hover:border-red-200"
              >
                <Heart size={16} />
                Save
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-gray-600">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ChefHat className="text-orange-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">Recipe Community</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.user_metadata?.full_name || user?.email}</span>
            <Button onClick={() => navigate("/generator")} variant="outline" className="gap-2">
              <Plus size={16} />
              Create Recipe
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="gap-2">
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Recipe Collection</h2>
          <p className="text-gray-600">Discover and manage your favorite recipes</p>
        </div>

        <Tabs defaultValue="community" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="community">Community Recipes</TabsTrigger>
            <TabsTrigger value="saved">My Saved Recipes ({userSavedRecipes.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="community">
            {recipes.length === 0 ? (
              <div className="text-center py-16">
                <ChefHat className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes yet</h3>
                <p className="text-gray-500">Be the first to share a recipe with the community!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} showDeleteButton={true} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            {userSavedRecipes.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved recipes</h3>
                <p className="text-gray-500">Start saving recipes you love from the community!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSavedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} showDeleteButton={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
