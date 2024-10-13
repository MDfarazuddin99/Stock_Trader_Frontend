// components/trade-history-view.tsx
import React from 'react';

interface Trade {
  id: string;
  symbol: string;
  quantity: number;
  price: number;
  action: string;
  timestamp: string;
}

interface TradeHistoryViewProps {
  trades: Trade[];
}

export const TradeHistoryView: React.FC<TradeHistoryViewProps> = ({ trades }) => {
  return (
    <div className="w-[90%] oveflow-x-auto ">
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Symbol</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr key={trade.id} className="border-t border-gray-300 dark:border-gray-700">
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{trade.symbol}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{trade.quantity}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${trade.price.toFixed(2)}</td>
              <td className={`px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${(trade.action === 'buy')?'bg-blue-700':'bg-orange-700'}`}>{trade.action}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{new Date(trade.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};