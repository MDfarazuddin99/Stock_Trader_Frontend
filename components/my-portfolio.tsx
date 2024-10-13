"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
type Stock = {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  avg_price: number;
  change: number;
  value: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export default function MyPortfolio() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    console.log("api to get portfolio called");
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/portfolio`);
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }
      const data = await response.json();
      setStocks(data);
    } catch (err) {
      setError("Error fetching portfolio data. Please try again later.");
      console.error("Error fetching portfolio:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPortfolio();
  };

  const totalValue = stocks.reduce((sum, stock) => sum + stock.value, 0);

  return (
    <ScrollArea className=" w-full h-full">
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Portfolio</CardTitle>
            <CardDescription>Your current stock holdings</CardDescription>
          </div>
          <Button onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              <h3 className="text-2xl font-bold">
                Total Value: ${totalValue.toFixed(2)}
              </h3>
            )}
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Average Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stocks.map((stock) => (
                  <TableRow key={stock.symbol}>
                    <TableCell className="font-medium">
                      {stock.symbol}
                    </TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>{stock.shares}</TableCell>
                    <TableCell>${stock.price.toFixed(2)}</TableCell>
                    <TableCell>${stock.avg_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {stock.change > 0 ? (
                          <ArrowUpIcon className="w-4 h-4 mr-1 text-green-500" />
                        ) : stock.change < 0 ? (
                          <ArrowDownIcon className="w-4 h-4 mr-1 text-red-500" />
                        ) : (
                          <span className="w-4 h-4 mr-1"></span>
                        )}
                        <Badge
                          variant={
                            stock.change === 0
                              ? "secondary"
                              : stock.change > 0
                              ? "outline"
                              : "default"
                          }
                          className={`w-[60px] ${
                            stock.change > 0
                              ? "bg-green-700 text-green-100"
                              : stock.change < 0
                              ? "bg-red-700 text-red-100"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {Math.abs(stock.change).toFixed(2)}%
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>${stock.value.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </ScrollArea>
  );
}
