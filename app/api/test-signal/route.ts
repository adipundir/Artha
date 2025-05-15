import { NextRequest, NextResponse } from 'next/server';
import { getNebulaTradeSignal } from '../actions';

export async function GET(request: NextRequest) {
  try {
    const signal = await getNebulaTradeSignal();
    
    return NextResponse.json({
      success: true,
      signal,
      message: `Nebula recommends to ${signal.action.toUpperCase()} MNT with ${signal.confidence}% confidence`
    });
  } catch (error) {
    console.error('Error testing trade signal:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 