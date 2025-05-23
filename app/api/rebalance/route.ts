import { NextResponse } from 'next/server';
import { rebalanceInvestment, decideRebalanceMode } from './actions';

// For backward compatibility 
const API_SECRET = process.env.REBALANCE_API_SECRET || 'default-secret-change-me';

/**
 * POST handler for the rebalance API endpoint
 * This can be called by a cron job or manually triggered
 */
export async function POST(request: Request) {
  try {

    let isAuthorized = false;

    // Check if the request is from Vercel Cron using the Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
      isAuthorized = true;
    } 

    // Check authorization
    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    // Get mode from decision function (now async)
    const modeNumber = await decideRebalanceMode();

    // Call the server action to rebalance
    const result = await rebalanceInvestment(modeNumber);

    // Return the result
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: any) {
    console.error('Error in rebalance API route:', error);
    return NextResponse.json(
      { success: false, message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * GET handler for checking if the API is alive
 */
export async function GET(request: Request) {
  // Also secure the GET endpoint with the same authorization pattern
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
  }
  
  return NextResponse.json({ success: true, message: 'Rebalance API is running' });
} 