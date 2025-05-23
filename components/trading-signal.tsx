'use client';

import { useState, useEffect } from 'react';
import { getNebulaTradeSignal } from '@/app/actions';
import { TrendingUp, TrendingDown, Pause } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function TradingSignal() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    action: 'buy' | 'sell' | 'hold';
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
    <Card className="bg-white dark:bg-gray-800 shadow-md h-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Nebula AI Signal</h2>
        
        {loading && (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && result && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                {result.action === 'buy' ? (
                  <div className="rounded-full bg-green-100 p-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                ) : result.action === 'sell' ? (
                  <div className="rounded-full bg-red-100 p-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                ) : (
                  <div className="rounded-full bg-yellow-100 p-2">
                    <Pause className="w-5 h-5 text-yellow-600" />
                  </div>
                )}
                <div>
                  <p className={`text-xl font-bold ${
                    result.action === 'buy' ? 'text-green-600' : 
                    result.action === 'sell' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {result.action.toUpperCase()} MNT
                  </p>
                </div>
              </div>
              
              <div>
                <span className={`text-lg font-bold ${
                  result.confidence > 80 ? 'text-green-600' : 
                  result.confidence > 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>{result.confidence}%</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
              <div 
                className={`h-1.5 rounded-full ${
                  result.confidence > 80 ? 'bg-green-600' : 
                  result.confidence > 60 ? 'bg-yellow-400' : 'bg-red-600'
                }`}
                style={{ width: `${result.confidence}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 