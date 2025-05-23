// Simple script to fetch MNT token holders directly from Mantle Explorer API
const fetchMntHolders = async () => {
  try {
    console.log('Fetching MNT holders directly from API...');
    const apiUrl = 'https://explorer.mantle.xyz/api/v2/tokens/0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8/holders';
    
    console.log(`API URL: ${apiUrl}`);
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw API response structure:', Object.keys(data));
    
    // Check if data has items property
    if (!data.items || !Array.isArray(data.items)) {
      console.error('API response does not contain expected items array:', data);
      return;
    }
    
    console.log(`Found ${data.items.length} holders in response`);
    
    // Log the first item to see its structure
    if (data.items.length > 0) {
      console.log('First holder data structure:', JSON.stringify(data.items[0], null, 2));
      
      // Process top 10 holders
      const topHolders = data.items.slice(0, 10).map((item, index) => {
        const address = item.address.hash;
        const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
        
        // Convert the balance from wei to MNT (18 decimals)
        const balanceInWei = BigInt(item.value);
        const mntBalance = Number(balanceInWei / BigInt(10**14)) / 10000;
        
        // Calculate USD value based on exchange rate
        const exchangeRate = parseFloat(item.token.exchange_rate);
        const usdValue = mntBalance * exchangeRate;
        
        return {
          id: index + 1,
          address,
          shortAddress,
          mntBalance,
          usdValue,
          lastActivity: "Recently",
          is_contract: item.address.is_contract,
          name: item.address.name || null
        };
      });
      
      console.log('Processed top 10 holders:');
      topHolders.forEach(holder => {
        console.log(`${holder.id}. ${holder.shortAddress} - ${holder.mntBalance.toLocaleString()} MNT ($${holder.usdValue.toLocaleString()}) - ${holder.is_contract ? 'Contract' : 'EOA'}${holder.name ? ` - ${holder.name}` : ''}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

fetchMntHolders(); 