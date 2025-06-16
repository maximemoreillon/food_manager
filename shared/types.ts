export type Macros = {
  protein: number;
  fat: number;
  carbohydrates: number;
};

export type FoodT = {
  _id?: string;
  name: string;
  vendor?: string;
  barcode?: string;

  user_id: string;
  hidden: boolean;

  image?: string;

  serving: {
    size: number;
    unit: string;
    calories: number;
    price: number;

    macronutrients: Macros;
  };
};

export type MealPlanRecord = { food: FoodT; quantity: number };

export type MealPlanT = {
  name: string;
  date: Date;
  user_id: string;
  incomplete: boolean;

  foods: MealPlanRecord[];

  macronutrients: Macros;

  // Could have been nested in 'calories'
  calories_target: number;
  calories: number;
};
