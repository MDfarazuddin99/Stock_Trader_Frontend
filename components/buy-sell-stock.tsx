"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

type ChartDataPoint = {
  date: string;
  price: number;
};

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number | null;
  chartData: ChartDataPoint[];
};

type TimeRange = "day" | "week" | "month" | "6months" | "year" | "5years";

export default function BuyAndSellStock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const { toast } = useToast()
  const handleSearch = async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/search?q=${searchTerm}&range=${timeRange}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }
      const data = await response.json();
      setSearchResults([data]);
      setSelectedStock(data);
    } catch (err) {
      setError("An error occurred while searching for stocks");
      console.error(err);

    } finally {
      setIsLoading(false);
    }
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleBuy = async () => {
    if (selectedStock) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/buy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol: selectedStock.symbol,
            quantity: quantity,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to buy stock');
          
        }
        setSuccess(`Successfully bought ${quantity} shares of ${selectedStock.symbol}`)
        toast({
          title: "Success",
          description: `Successfully bought ${quantity} shares of ${selectedStock.symbol}`,
        });
      } catch (err) {
        console.error('Error buying stock:', err);
        setError('Failed to buy stock');
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to buy stock. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSell = async () => {
    if (selectedStock) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/sell`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol: selectedStock.symbol,
            quantity: quantity,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to sell stock');
        }
        setSuccess(`Successfully Sold ${quantity} shares of ${selectedStock.symbol}`)
        toast({
          title: "Success",
          description: `Successfully sold ${quantity} shares of ${selectedStock.symbol}`,
        });
      } catch (err) {
        console.error('Error selling stock:', err);
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to sell stock. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    if (selectedStock) {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeRange === "day") {
      return date.toLocaleTimeString();
    } else if (timeRange === "week" || timeRange === "month") {
      return date.toLocaleDateString();
    } else {
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
    }
  };

  return (
    <Card className="w-full h-full overflow-auto">
      <CardHeader>
        <CardTitle>Buy and Sell Stock</CardTitle>
        <CardDescription>
          Search for stocks, view trends, and make trades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {/* {success && <p className="text-green-500">{success}</p>} */}
          {searchResults.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((stock) => (
                  <TableRow
                    key={stock.symbol}
                    onClick={() => handleStockSelect(stock)}
                    className="cursor-pointer hover:bg-muted"
                  >
                    <TableCell>{stock.symbol}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>${stock.price?.toFixed(2) ?? "N/A"}</TableCell>
                    <TableCell>
                      {stock.change !== null ? (
                        <span
                          className={
                            stock.change >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {stock.change.toFixed(2)}%
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {selectedStock && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedStock.name} ({selectedStock.symbol})
                </CardTitle>
                <CardDescription>
                  Current Price: ${selectedStock.price?.toFixed(2) ?? "N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-row">
                  <Select
                    value={timeRange}
                    onValueChange={handleTimeRangeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">1 Day</SelectItem>
                      <SelectItem value="week">1 Week</SelectItem>
                      <SelectItem value="month">1 Month</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="year">1 Year</SelectItem>
                      <SelectItem value="5years">5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedStock.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        interval="preserveStartEnd"
                      />
                      <YAxis domain={["auto", "auto"]} />
                      <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number) => [
                          `$${value.toFixed(2)}`,
                          "Price",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20"
                  />
                  <Button onClick={handleBuy} disabled={isLoading}>Buy</Button>
                  <Button onClick={handleSell} variant="outline" disabled={isLoading}>
                    Sell
                  </Button>
                  {error && <p className="text-red-500">{error}</p>}
                  {success && <p className="text-green-500">{success}</p>}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}