'use client';

import { useState, useEffect } from 'react';
import { getNebulaTradeSignal } from '../api/actions';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TradingSignal() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    action: 'buy' | 'sell';
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Automatically fetch signal when component mounts
  useEffect(() => {
    const fetchSignal = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const signal = await getNebulaTradeSignal();
        setResult(signal);
      } catch (err) {
        setError('Failed to get trading signal from Nebula');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSignal();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-700 mb-6">
      <h2 className="text-2xl font-bold mb-4">Nebula MNT Trading Signal</h2>
      
      <div className="space-y-6">
        {loading && (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && result && (
          <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                {result.action === 'buy' ? (
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="rounded-full bg-red-100 p-3 mr-4">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">AI Recommendation</p>
                  <p className={`text-2xl font-bold ${
                    result.action === 'buy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.action.toUpperCase()} MNT
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Confidence Level</p>
                <div className="flex items-center justify-end">
                  <span className={`text-xl font-bold ${
                    result.confidence > 80 ? 'text-green-600' : 
                    result.confidence > 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{result.confidence}%</span>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  result.confidence > 80 ? 'bg-green-600' : 
                  result.confidence > 60 ? 'bg-yellow-400' : 'bg-red-600'
                }`}
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Based on real-time analysis of market conditions and price trends for Mantle (MNT).</p>
              <p className="mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 