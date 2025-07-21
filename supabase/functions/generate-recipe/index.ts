import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, cuisine, surprise } = await req.json();
    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');

    console.log('API Key exists:', !!googleApiKey);
    console.log('Request data:', { ingredients, cuisine, surprise });

    if (!googleApiKey) {
      console.error('Google AI API key not found in environment');
      throw new Error('Google AI API key not configured');
    }

    let prompt = '';
    
    if (surprise) {
      prompt = `Generate a unique and exciting recipe with an interesting fusion of cuisines or unusual ingredients. Make it creative and adventurous but still practical to cook at home.

Please respond with a JSON object in this exact format:
{
  "title": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "cookTime": "X minutes",
  "servings": "X servings",
  "difficulty": "Easy|Medium|Hard",
  "cuisine": "Cuisine Type"
}`;
    } else {
      const ingredientsList = ingredients.join(', ');
      const cuisineText = cuisine ? ` in ${cuisine} style` : '';
      
      prompt = `Create a delicious recipe using these ingredients: ${ingredientsList}${cuisineText}. 

Please respond with a JSON object in this exact format:
{
  "title": "Recipe Name",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "cookTime": "X minutes",
  "servings": "X servings",
  "difficulty": "Easy|Medium|Hard",
  "cuisine": "Cuisine Type"
}

Make sure to:
- Include the provided ingredients prominently in the recipe
- Add complementary ingredients as needed
- Provide clear, step-by-step instructions
- Make it practical for home cooking`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google AI API error response:', errorData);
      throw new Error(`Google AI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated from AI');
    }

    // Extract JSON from the response
    let recipe;
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recipe = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedText);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate the recipe structure
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      throw new Error('Invalid recipe structure received from AI');
    }

    return new Response(JSON.stringify(recipe), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-recipe function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate recipe' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});