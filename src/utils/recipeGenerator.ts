
// This is a mock implementation of the recipe generator
// In a real app, this would connect to an AI service like OpenAI or similar

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  cuisine?: string;
}

const sampleRecipes = [
  {
    title: "Mediterranean Herb-Crusted Chicken",
    ingredients: [
      "4 chicken breasts",
      "2 tbsp olive oil",
      "2 cloves garlic, minced",
      "1 tsp dried oregano",
      "1 tsp dried basil",
      "1 lemon (juiced)",
      "Salt and pepper to taste",
      "Fresh parsley for garnish"
    ],
    instructions: [
      "Preheat your oven to 375°F (190°C).",
      "In a small bowl, mix olive oil, minced garlic, oregano, basil, lemon juice, salt, and pepper.",
      "Place chicken breasts in a baking dish and coat them with the herb mixture.",
      "Let marinate for 15 minutes at room temperature.",
      "Bake for 25-30 minutes or until chicken reaches internal temperature of 165°F (74°C).",
      "Remove from oven and let rest for 5 minutes before slicing.",
      "Garnish with fresh parsley and serve with your favorite sides."
    ],
    cookTime: "35 minutes",
    servings: "4 servings",
    difficulty: "Easy",
    cuisine: "Mediterranean"
  },
  {
    title: "Asian-Style Stir-Fried Vegetables",
    ingredients: [
      "2 cups mixed vegetables (bell peppers, broccoli, carrots)",
      "2 tbsp vegetable oil",
      "3 cloves garlic, minced",
      "1 tbsp fresh ginger, grated",
      "2 tbsp soy sauce",
      "1 tbsp sesame oil",
      "1 tsp honey",
      "2 green onions, sliced",
      "1 tbsp sesame seeds"
    ],
    instructions: [
      "Heat vegetable oil in a large wok or skillet over high heat.",
      "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
      "Add the mixed vegetables and stir-fry for 3-4 minutes until crisp-tender.",
      "In a small bowl, whisk together soy sauce, sesame oil, and honey.",
      "Pour the sauce over the vegetables and toss to coat.",
      "Cook for another 1-2 minutes until vegetables are glazed.",
      "Remove from heat and garnish with green onions and sesame seeds.",
      "Serve immediately over steamed rice or noodles."
    ],
    cookTime: "15 minutes",
    servings: "3-4 servings",
    difficulty: "Easy",
    cuisine: "Asian"
  },
  {
    title: "Classic Italian Pasta Arrabbiata",
    ingredients: [
      "1 lb penne pasta",
      "1/4 cup olive oil",
      "4 cloves garlic, sliced thin",
      "1/2 tsp red pepper flakes",
      "1 can (28 oz) crushed tomatoes",
      "1/2 cup fresh basil, chopped",
      "1/2 cup Parmesan cheese, grated",
      "Salt and black pepper to taste"
    ],
    instructions: [
      "Bring a large pot of salted water to boil. Cook pasta according to package directions until al dente.",
      "While pasta cooks, heat olive oil in a large skillet over medium heat.",
      "Add sliced garlic and red pepper flakes, cook for 1-2 minutes until fragrant but not browned.",
      "Add crushed tomatoes and season with salt and pepper.",
      "Simmer the sauce for 10-15 minutes, stirring occasionally.",
      "Drain pasta, reserving 1/2 cup pasta water.",
      "Add drained pasta to the sauce and toss to combine, adding pasta water if needed.",
      "Remove from heat, stir in fresh basil and half the Parmesan.",
      "Serve immediately with remaining Parmesan cheese on top."
    ],
    cookTime: "25 minutes",
    servings: "4-6 servings",
    difficulty: "Medium",
    cuisine: "Italian"
  }
];

const surpriseRecipes = [
  {
    title: "Exotic Moroccan Spiced Lamb Tagine",
    ingredients: [
      "2 lbs lamb shoulder, cubed",
      "2 onions, sliced",
      "3 cloves garlic, minced",
      "2 tsp ground cinnamon",
      "1 tsp ground ginger",
      "1 tsp turmeric",
      "1 cup dried apricots",
      "2 cups beef broth",
      "1/4 cup almonds, toasted",
      "Fresh cilantro for garnish"
    ],
    instructions: [
      "Heat oil in a large Dutch oven over medium-high heat.",
      "Brown lamb cubes on all sides, about 8 minutes total.",
      "Add onions and garlic, cook until softened.",
      "Add spices and cook for 1 minute until fragrant.",
      "Add apricots and beef broth, bring to a boil.",
      "Reduce heat, cover and simmer for 1.5-2 hours until lamb is tender.",
      "Garnish with toasted almonds and fresh cilantro.",
      "Serve over couscous or with warm flatbread."
    ],
    cookTime: "2.5 hours",
    servings: "6 servings",
    difficulty: "Advanced",
    cuisine: "Moroccan"
  }
];

export const generateRecipe = async (
  ingredients: string[], 
  cuisine?: string, 
  surprise: boolean = false
): Promise<Recipe> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (surprise) {
    const randomRecipe = surpriseRecipes[Math.floor(Math.random() * surpriseRecipes.length)];
    return randomRecipe;
  }

  // For demo purposes, we'll return a sample recipe
  // In a real implementation, this would send ingredients and cuisine to an AI service
  let selectedRecipe = sampleRecipes[Math.floor(Math.random() * sampleRecipes.length)];
  
  // If cuisine is specified, try to match it
  if (cuisine) {
    const matchingRecipe = sampleRecipes.find(recipe => 
      recipe.cuisine?.toLowerCase().includes(cuisine.toLowerCase())
    );
    if (matchingRecipe) {
      selectedRecipe = matchingRecipe;
    }
  }

  // Customize the recipe title to include some of the user's ingredients
  if (ingredients.length > 0) {
    const mainIngredient = ingredients[0];
    selectedRecipe = {
      ...selectedRecipe,
      title: `${cuisine || 'Delicious'} ${mainIngredient} ${selectedRecipe.title.split(' ').pop()}`,
    };
  }

  return selectedRecipe;
};
