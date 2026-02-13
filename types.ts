export type Language = 'en' | 'zh-HK' | 'zh-CN';
export type ViewState = 'home' | 'explore' | 'bookmarks' | 'result';

export interface PriceInfo {
  market: number;
  supermarket: number;
}

export interface Ingredient {
  name: string;
  marketQuantity: string;
  supermarketQuantity: string;
  prices: PriceInfo;
  notes: string;
}

export interface Dish {
  name: string;
  ingredients: Ingredient[];
  cookingSteps: string[];
}

export interface RecipeResponse {
  dishes: Dish[];
  commonIngredients: Ingredient[];
  portionSize: number;
  shoppingTips: string[];
  wastePreventionTip: string;
  createdAt?: number; // timestamp for bookmarks
}

export interface SavedRecipe extends RecipeResponse {
  id: string; // Unique ID for the bookmark
  originalQuery: string;
}

export interface Category {
  id: string;
  icon: string;
  label: Record<Language, string>;
  suggestions: string[];
}

export interface Translation {
  title: string;
  subtitle: string;
  familySizeLabel: string;
  peopleUnit: string;
  dishInputLabel: string;
  dishInputPlaceholder: string;
  submitButton: string;
  loadingMessage: string;
  ingredientsTitle: string;
  commonIngredientsTitle: string;
  marketLabel: string;
  supermarketLabel: string;
  forPeople: string;
  shoppingTipsTitle: string;
  wastePreventionTitle: string;
  cookingStepsTitle: string;
  resetButton: string;
  updateButton: string;
  errorTitle: string;
  errorMessage: string;
  languageName: string;
  // New Nav Translations
  navHome: string;
  navExplore: string;
  navSaved: string;
  exploreTitle: string;
  savedTitle: string;
  noSavedMessage: string;
  saveButton: string;
  savedButton: string;
  deleteButton: string;
  priceDisclaimer: string;
  shareButton: string;
  shareSuccess: string;
}