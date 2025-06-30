
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import RecipeGenerator from "@/components/RecipeGenerator";
import RecipeDisplay from "@/components/RecipeDisplay";
import { ChefHat, Sparkles, Users, BookOpen } from "lucide-react";

const Index = () => {
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);

  const featuredRecipes = [
    {
      id: 1,
      title: "Mediterranean Quinoa Bowl",
      author: "Chef Maria",
      ingredients: ["Quinoa", "Chickpeas", "Cucumber", "Tomatoes", "Feta"],
      cookTime: "25 min",
      difficulty: "Easy"
    },
    {
      id: 2,
      title: "Spicy Thai Coconut Curry",
      author: "Chef Alex",
      ingredients: ["Coconut milk", "Red curry paste", "Chicken", "Bell peppers"],
      cookTime: "30 min",
      difficulty: "Medium"
    },
    {
      id: 3,
      title: "Classic Italian Carbonara",
      author: "Chef Giuseppe",
      ingredients: ["Pasta", "Eggs", "Pancetta", "Parmesan", "Black pepper"],
      cookTime: "20 min",
      difficulty: "Medium"
    }
  ];

  if (showGenerator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => setShowGenerator(false)}
            variant="outline" 
            className="mb-6 hover:bg-orange-100 transition-colors"
          >
            ← Back to Home
          </Button>
          <RecipeGenerator onRecipeGenerated={setActiveRecipe} />
          {activeRecipe && <RecipeDisplay recipe={activeRecipe} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <ChefHat size={48} />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            AI Recipe
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
              Generator
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Transform your ingredients into culinary masterpieces with the power of AI
          </p>
          <Button 
            onClick={() => setShowGenerator(true)}
            size="lg" 
            className="bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 transition-all duration-300 shadow-xl text-lg px-8 py-4"
          >
            <Sparkles className="mr-2" />
            Start Cooking
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our AI Chef?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover endless possibilities with ingredients you already have
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
                <Sparkles className="text-orange-600" size={32} />
              </div>
              <CardTitle className="text-xl text-gray-800">AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Advanced AI analyzes your ingredients to create personalized, delicious recipes tailored just for you.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
                <Users className="text-red-600" size={32} />
              </div>
              <CardTitle className="text-xl text-gray-800">Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Share your creations and discover amazing recipes from fellow cooking enthusiasts worldwide.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-yellow-100 rounded-full w-fit">
                <BookOpen className="text-yellow-600" size={32} />
              </div>
              <CardTitle className="text-xl text-gray-800">Smart Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Get intelligent recipe recommendations based on cuisine preferences and dietary requirements.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Recipes */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Featured Recipes</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                  <ChefHat size={64} className="text-orange-600 opacity-50" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <CardDescription>by {recipe.author}</CardDescription>
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
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>⏱️ {recipe.cookTime}</span>
                    <span>📊 {recipe.difficulty}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-3xl">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">Ready to Create Something Delicious?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of home cooks discovering new flavors every day
          </p>
          <Button 
            onClick={() => setShowGenerator(true)}
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:scale-105 transition-all duration-300 shadow-xl text-lg px-8 py-4"
          >
            <Sparkles className="mr-2" />
            Generate Your First Recipe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
