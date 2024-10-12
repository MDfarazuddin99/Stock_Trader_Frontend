// pages/api/chart.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import yf from 'yfinance'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('api called')
  const { symbol, interval } = req.query

  if (typeof symbol !== 'string' || typeof interval !== 'string') {
    return res.status(400).json({ error: 'Invalid symbol or interval parameter' })
  }

  try {
    const ticker = await yf.Ticker(symbol)
    const history = await ticker.history(interval)
    const chartData = history.map((item: any) => ({
      date: item.date.toISOString().split('T')[0],
      price: item.close,
    }))
    res.status(200).json(chartData)
  } catch (error) {
    console.error('Error fetching chart data:', error)
    res.status(500).json({ error: 'Failed to fetch chart data' })
  }
}