import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import {
  ExpenseForm,
  type Expense,
  type CurrencyInfo,
} from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseStats } from "@/components/ExpenseStats";
import { CurrencySelector } from "@/components/CurrencySelector";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  getExpenses,
  addExpense as addExpenseToDb,
  deleteExpense as deleteExpenseFromDb,
  getUserPreferences,
  saveUserPreferences,
  migrateLocalStorageData,
} from "@/utils/database";

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currency, setCurrency] = useState<CurrencyInfo>({
    code: "USD",
    symbol: "$",
    hasDecimals: true,
  });
  const [loading, setLoading] = useState(false);
  const [hasMigrated, setHasMigrated] = useState(false);
  const [isInitialCurrencyLoad, setIsInitialCurrencyLoad] = useState(true);

  // Load data when user is authenticated
  useEffect(() => {
    if (!user || hasMigrated) return;

    const loadUserData = async () => {
      setLoading(true);
      try {
        // Check if user has existing data in localStorage and migrate it
        const hasLocalExpenses = localStorage.getItem("expenses");
        const hasLocalCurrency = localStorage.getItem("currency");

        if (hasLocalExpenses || hasLocalCurrency) {
          toast("Migrating Data", {
            description: "Moving your local data to the cloud...",
          });
          await migrateLocalStorageData(user.id);
          toast("Migration Complete", {
            description: "Your data has been safely moved to the cloud.",
          });
        }

        // Load expenses from Supabase
        const userExpenses = await getExpenses(user.id);
        setExpenses(userExpenses);

        // Load currency preferences
        const userPreferences = await getUserPreferences(user.id);
        if (userPreferences) {
          setCurrency(userPreferences);
        }

        // Mark initial load as complete to prevent saving during load
        setIsInitialCurrencyLoad(false);
        setHasMigrated(true);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast("Error Loading Data", {
          description: "Failed to load your data. Please try refreshing.",
          className: "bg-red-500 text-white",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, hasMigrated]);

  // Save currency preferences to Supabase when changed
  useEffect(() => {
    if (!user || !hasMigrated || isInitialCurrencyLoad) return;

    // Debounce the save operation to prevent multiple rapid saves
    const saveTimeout = setTimeout(async () => {
      try {
        await saveUserPreferences(currency, user.id);
      } catch (error) {
        console.error("Error saving currency preferences:", error);
        toast("Error", {
          description: "Failed to save currency preferences.",
          className: "bg-red-500 text-white",
        });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(saveTimeout);
  }, [currency, user, hasMigrated, isInitialCurrencyLoad]);

  const addExpense = async (newExpense: Omit<Expense, "id">) => {
    if (!user) return;

    try {
      const expense = await addExpenseToDb(newExpense, user.id);
      setExpenses((prev) => [expense, ...prev]);

      toast(newExpense.type === "expense" ? "Expense Added" : "Income Added", {
        description: `${currency.symbol}${newExpense.amount} ${
          newExpense.type === "expense" ? "spent on" : "earned from"
        } ${newExpense.description}`,
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      toast("Error", {
        description: "Failed to add transaction. Please try again.",
        className: "bg-red-500 text-white",
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteExpenseFromDb(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      toast("Transaction Deleted", {
        description: "The transaction has been removed from your records.",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast("Error", {
        description: "Failed to delete transaction. Please try again.",
        className: "bg-red-500 text-white",
      });
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if user is not authenticated
  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <Header isCloudSyncEnabled={true} />

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <ExpenseStats expenses={expenses} currency={currency} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">
                <ExpenseForm onAddExpense={addExpense} currency={currency} />
                <CurrencySelector
                  currency={currency}
                  onCurrencyChange={setCurrency}
                />
              </div>

              {/* Expense List */}
              <div className="lg:col-span-2">
                <ExpenseList
                  expenses={expenses}
                  onDeleteExpense={deleteExpense}
                  currency={currency}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
