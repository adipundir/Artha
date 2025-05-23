# Rebalance Cron Job

This repository contains configuration for automatically rebalancing the investment contract on a daily basis.

## Vercel Deployment (Recommended)

If you're deploying to Vercel, we use Vercel's built-in cron jobs:

1. The `vercel.json` file already includes the cron configuration to run daily at 2:00 AM UTC
2. No additional setup is required beyond normal Vercel deployment

### Required Environment Variables for Vercel

- `REBALANCE_API_SECRET`: Secret key to authenticate with the rebalance API
- `CRON_SECRET`: Secret used by Vercel Cron (if not set, defaults to `REBALANCE_API_SECRET`)
- `DEPLOYER_PRIVATE_KEY`: Private key for the wallet that will call the rebalance function
- `NEXT_PUBLIC_INVESTMENT_CONTRACT_ADDRESS`: Address of the investment contract

## Manual Deployment (Alternative)

For non-Vercel deployments, you can use the Node.js script.

### Required Environment Variables

Make sure these are set in your `.env` file:

- `REBALANCE_API_SECRET`: Secret key to authenticate with the rebalance API
- `NEXT_PUBLIC_BASE_URL`: Base URL of your application (e.g., http://localhost:3000 for local development)
- Other required variables (see Vercel section)

### Running the Manual Cron Job

Run the cron job with:

```bash
npm run cron
```

The job will trigger the rebalance API endpoint once daily at 2:00 AM.

### Manual Deployment Options

For production use, consider these options:

1. **Systemd Service (Linux)**: Create a systemd service to run the script as a daemon
2. **PM2**: Use PM2 process manager (`npm install -g pm2` then `pm2 start scripts/cron.js`)
3. **Docker**: Run in a container with a Dockerfile
4. **GitHub Actions**: Schedule GitHub Action workflows to call your API

## How it Works

1. The cron job runs daily at 2:00 AM
2. It calls the `/api/rebalance` endpoint with proper authentication
3. The API endpoint uses the decision function to determine a mode (0, 1, or 2)
4. The rebalance function is called with the selected mode 