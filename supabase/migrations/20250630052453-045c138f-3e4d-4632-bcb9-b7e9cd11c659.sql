
-- Create recipes table to store all user recipes
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  cook_time TEXT,
  servings TEXT,
  difficulty TEXT,
  cuisine TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_recipes table for users to save other users' recipes
CREATE TABLE public.saved_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security (RLS) on recipes table
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for recipes table
CREATE POLICY "Anyone can view recipes" 
  ON public.recipes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own recipes" 
  ON public.recipes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" 
  ON public.recipes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" 
  ON public.recipes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on saved_recipes table
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_recipes table
CREATE POLICY "Users can view their own saved recipes" 
  ON public.saved_recipes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save recipes" 
  ON public.saved_recipes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved recipes" 
  ON public.saved_recipes 
  FOR DELETE 
  USING (auth.uid() = user_id);
