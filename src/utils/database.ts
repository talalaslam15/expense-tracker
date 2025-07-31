import supabase from "./supabase";
import type { Expense, CurrencyInfo } from "@/components/ExpenseForm";

// Expense operations
export const getExpenses = async (userId: string): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }

  return data || [];
};

export const addExpense = async (
  expense: Omit<Expense, "id">,
  userId: string
): Promise<Expense> => {
  const { data, error } = await supabase
    .from("expenses")
    .insert([{ ...expense, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error("Error adding expense:", error);
    throw error;
  }

  return data;
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId);

  if (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

// User preferences operations
export const getUserPreferences = async (
  userId: string
): Promise<CurrencyInfo | null> => {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found"
    console.error("Error fetching user preferences:", error);
    throw error;
  }

  if (!data) return null;

  return {
    code: data.currency_code as "USD" | "PKR",
    symbol: data.currency_symbol,
    hasDecimals: data.currency_has_decimals,
  };
};

export const saveUserPreferences = async (
  currency: CurrencyInfo,
  userId: string
): Promise<void> => {
  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: userId,
      currency_code: currency.code,
      currency_symbol: currency.symbol,
      currency_has_decimals: currency.hasDecimals,
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
};

// Migration function to move localStorage data to Supabase
export const migrateLocalStorageData = async (
  userId: string
): Promise<void> => {
  try {
    // Migrate expenses
    const localExpenses = localStorage.getItem("expenses");
    if (localExpenses) {
      const expenses: Expense[] = JSON.parse(localExpenses);

      if (expenses.length > 0) {
        const expensesToInsert = expenses.map((expense) => ({
          ...expense,
          user_id: userId,
        }));

        const { error } = await supabase
          .from("expenses")
          .insert(expensesToInsert);

        if (error) {
          console.error("Error migrating expenses:", error);
        } else {
          localStorage.removeItem("expenses");
          console.log("Successfully migrated expenses to Supabase");
        }
      }
    }

    // Migrate currency preferences
    const localCurrency = localStorage.getItem("currency");
    if (localCurrency) {
      const currency: CurrencyInfo = JSON.parse(localCurrency);
      await saveUserPreferences(currency, userId);
      localStorage.removeItem("currency");
      console.log("Successfully migrated currency preferences to Supabase");
    }
  } catch (error) {
    console.error("Error during migration:", error);
  }
};
