import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Expense, CurrencyInfo } from "./ExpenseForm";
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameDay,
  parseISO,
} from "date-fns";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  currency: CurrencyInfo;
}

export function ExpenseList({
  expenses,
  onDeleteExpense,
  currency,
}: ExpenseListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Filter expenses by current month first
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthlyExpenses = expenses.filter((expense) => {
    const expenseDate = parseISO(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });

  const filteredExpenses = monthlyExpenses
    .filter((expense) => {
      if (filter === "all") return true;
      if (filter === "expense") return expense.type === "expense";
      if (filter === "income") return expense.type === "income";
      return expense.category === filter;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

  // Group expenses by date
  const groupedByDate = filteredExpenses.reduce((groups, expense) => {
    const dateKey = format(parseISO(expense.date), "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  const sortedDateKeys = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAmount = (amount: number, type: "expense" | "income") => {
    const formatted = currency.hasDecimals
      ? amount.toFixed(2)
      : amount.toString();
    return type === "expense"
      ? `-${currency.symbol}${formatted}`
      : `+${currency.symbol}${formatted}`;
  };

  const getDailyTotal = (expenses: Expense[]) => {
    const total = expenses.reduce((sum, expense) => {
      return expense.type === "expense"
        ? sum - expense.amount
        : sum + expense.amount;
    }, 0);
    const formatted = currency.hasDecimals
      ? Math.abs(total).toFixed(2)
      : Math.abs(total).toString();
    return {
      amount: `${total >= 0 ? "+" : "-"}${currency.symbol}${formatted}`,
      isPositive: total >= 0,
    };
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return (
      currentMonth.getMonth() === now.getMonth() &&
      currentMonth.getFullYear() === now.getFullYear()
    );
  };

  const categories = Array.from(
    new Set(monthlyExpenses.map((e) => e.category))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Transaction History
            </CardTitle>

            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value: "date" | "amount") => setSortBy(value)}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="amount">By Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between border rounded-lg p-3 bg-secondary/30">
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h3 className="font-semibold text-lg">
              {format(currentMonth, "MMMM yyyy")}
            </h3>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextMonth}
              disabled={isCurrentMonth()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedDateKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions found for {format(currentMonth, "MMMM yyyy")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDateKeys.map((dateKey) => {
              const dayExpenses = groupedByDate[dateKey];
              const dailyTotal = getDailyTotal(dayExpenses);

              return (
                <div key={dateKey} className="space-y-3">
                  {/* Date Header with Daily Total */}
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-semibold text-lg">
                      {format(parseISO(dateKey), "EEEE, MMMM d")}
                    </h4>
                    <span
                      className={`font-bold text-lg ${
                        dailyTotal.isPositive ? "text-success" : "text-expense"
                      }`}
                    >
                      {dailyTotal.amount}
                    </span>
                  </div>

                  {/* Day's Transactions */}
                  <div className="space-y-2">
                    {dayExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              expense.type === "expense"
                                ? "bg-expense-light text-expense"
                                : "bg-success-light text-success"
                            }`}
                          >
                            {expense.type === "expense" ? (
                              <ArrowDownCircle className="h-4 w-4" />
                            ) : (
                              <ArrowUpCircle className="h-4 w-4" />
                            )}
                          </div>

                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {expense.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`font-semibold ${
                              expense.type === "expense"
                                ? "text-expense"
                                : "text-success"
                            }`}
                          >
                            {formatAmount(expense.amount, expense.type)}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteExpense(expense.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
