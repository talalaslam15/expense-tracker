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
import { toast } from "sonner";

const App = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currency, setCurrency] = useState<CurrencyInfo>({
    code: "USD",
    symbol: "$",
    hasDecimals: true,
  });

  // Load expenses and currency from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    }

    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      try {
        setCurrency(JSON.parse(savedCurrency));
      } catch (error) {
        console.error("Error loading currency:", error);
      }
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Save currency to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem("currency", JSON.stringify(currency));
  }, [currency]);

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    toast("Transaction Deleted", {
      description: "The transaction has been removed from your records.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <Header isCloudSyncEnabled={false} />

      <main className="container mx-auto px-4 py-8">
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

          {/* Cloud Sync Notice */}
          {expenses.length > 0 && (
            <div className="mt-8 p-6 bg-warning-light border border-warning/20 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <div className="h-4 w-4 bg-warning rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-warning-foreground">
                    Enable Cloud Sync
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your data is currently stored locally. Connect to Supabase
                    to enable automatic cloud sync, backup your data, and access
                    it from any device.
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        toast("Connect to Supabase", {
                          description:
                            "Click the green Supabase button in the top right to enable cloud sync.",
                          duration: 5000,
                        });
                      }}
                      className="text-sm text-primary hover:text-primary/80 font-medium underline"
                    >
                      Learn how to enable cloud sync →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
