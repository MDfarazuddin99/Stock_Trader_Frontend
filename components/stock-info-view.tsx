import React from 'react';

interface StockInfo {
  symbol: string;
  price: number;
}

interface StockInfoViewProps {
  stockInfo: StockInfo;
}

export const StockInfoView: React.FC<StockInfoViewProps> = ({ stockInfo }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{stockInfo.symbol}</h2>
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          ${stockInfo.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
};