import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { Expense, CurrencyInfo } from "./ExpenseForm";

interface ExpenseStatsProps {
  expenses: Expense[];
  currency: CurrencyInfo;
}

export function ExpenseStats({ expenses, currency }: ExpenseStatsProps) {
  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const monthlyExpenses = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        e.type === "expense" &&
        expenseDate.getMonth() === thisMonth &&
        expenseDate.getFullYear() === thisYear
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const monthlyIncome = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        e.type === "income" &&
        expenseDate.getMonth() === thisMonth &&
        expenseDate.getFullYear() === thisYear
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const formatCurrency = (amount: number) => {
    const formatted = currency.hasDecimals
      ? amount.toFixed(2)
      : amount.toString();
    return `${currency.symbol}${formatted}`;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-success";
    if (balance < 0) return "text-expense";
    return "text-foreground";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getBalanceColor(balance)}`}>
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted-foreground">
            {balance >= 0 ? "Positive balance" : "Negative balance"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">
            This month: {formatCurrency(monthlyIncome)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-expense" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-expense">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">
            This month: {formatCurrency(monthlyExpenses)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expenses.length}</div>
          <p className="text-xs text-muted-foreground">
            {expenses.filter((e) => e.type === "expense").length} expenses,{" "}
            {expenses.filter((e) => e.type === "income").length} income
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
