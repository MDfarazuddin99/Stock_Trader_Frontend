import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

type Stock = {
  symbol: string
  name: string
  shares: number
  price: number
  change: number
}

export default function MyPortfolio() {
  const [stocks, setStocks] = useState<Stock[]>([
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, price: 150.25, change: 2.5 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 5, price: 2750.80, change: -1.2 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', shares: 8, price: 305.50, change: 0.8 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 3, price: 3380.00, change: -0.5 },
  ])

  const totalValue = stocks.reduce((sum, stock) => sum + stock.shares * stock.price, 0)

  return (
    <Card className="w-full h-full ">
      <CardHeader>
        <CardTitle>My Portfolio</CardTitle>
        <CardDescription>Your current stock holdings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-2xl font-bold">Total Value: ${totalValue.toFixed(2)}</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Shares</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="font-medium">{stock.symbol}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.shares}</TableCell>
                <TableCell>${stock.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={stock.change >= 0 ? "success" : "destructive"} className="flex items-center">
                    {stock.change >= 0 ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                    {Math.abs(stock.change)}%
                  </Badge>
                </TableCell>
                <TableCell>${(stock.shares * stock.price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}