import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Currency, CurrencyInfo } from "./ExpenseForm";
import { Settings } from "lucide-react";

interface CurrencySelectorProps {
  currency: CurrencyInfo;
  onCurrencyChange: (currency: CurrencyInfo) => void;
}

const currencies: Record<Currency, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", hasDecimals: true },
  PKR: { code: "PKR", symbol: "Rs ", hasDecimals: false },
};

export function CurrencySelector({
  currency,
  onCurrencyChange,
}: CurrencySelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Currency Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="currency">Select Currency</Label>
          <Select
            value={currency.code}
            onValueChange={(code: Currency) =>
              onCurrencyChange(currencies[code])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
              <SelectItem value="PKR">PKR (Rs) - Pakistani Rupee</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {currency.code === "PKR" &&
              "PKR amounts will be rounded to whole numbers"}
            {currency.code === "USD" && "USD amounts support decimal values"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
