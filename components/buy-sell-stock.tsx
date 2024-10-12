'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ChartDataPoint = {
  date: string
  price: number
}

type Stock = {
  symbol: string
  name: string
  price: number
  change: number | null
  chartData: ChartDataPoint[]
}

type TimeRange = 'day' | 'week' | 'month' | '6months' | 'year' | '5years'

export default function BuyAndSellStock() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('month')

  const handleSearch = async () => {
    if (!searchTerm) return

    setIsLoading(true)
    setError(null)

    try {       
      const response = await fetch(`http://127.0.0.1:5000/api/search?q=${searchTerm}&range=${timeRange}`)
      if (!response.ok) {
        throw new Error('Failed to fetch stock data')
      }
      const data = await response.json()
      setSearchResults([data])
      setSelectedStock(data)
    } catch (err) {
      setError('An error occurred while searching for stocks')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock)
    setSearchTerm('')
    setSearchResults([])
  }

  const handleBuy = () => {
    if (selectedStock) {
      console.log(`Bought ${quantity} shares of ${selectedStock.symbol}`)
      // Here you would typically call an API to process the purchase
    }
  }

  const handleSell = () => {
    if (selectedStock) {
      console.log(`Sold ${quantity} shares of ${selectedStock.symbol}`)
      // Here you would typically call an API to process the sale
    }
  }

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value)
    if (selectedStock) {
      handleSearch()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (timeRange === 'day') {
      return date.toLocaleTimeString()
    } else if (timeRange === 'week' || timeRange === 'month') {
      return date.toLocaleDateString()
    } else {
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
    }
  }

  return (
    <Card className="w-full h-full overflow-auto">
      <CardHeader>
        <CardTitle>Buy and Sell Stock</CardTitle>
        <CardDescription>Search for stocks, view trends, and make trades</CardDescription>
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
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {error && <p className="text-red-500">{error}</p>}

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
                  <TableRow key={stock.symbol} onClick={() => handleStockSelect(stock)} className="cursor-pointer hover:bg-muted">
                    <TableCell>{stock.symbol}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>${stock.price?.toFixed(2) ?? 'N/A'}</TableCell>
                    <TableCell>
                      {stock.change !== null ? (
                        <span className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {stock.change.toFixed(2)}%
                        </span>
                      ) : (
                        'N/A'
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
                <CardTitle>{selectedStock.name} ({selectedStock.symbol})</CardTitle>
                <CardDescription>Current Price: ${selectedStock.price?.toFixed(2) ?? 'N/A'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                      />
                      <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20"
                  />
                  <Button onClick={handleBuy}>Buy</Button>
                  <Button onClick={handleSell} variant="outline">Sell</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}