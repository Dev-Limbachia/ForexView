const axios = require('axios');

require('dotenv').config();

export interface AlphaVantageForex {
    [timestamp: number]: {
        "1. open": number;
        "2. high": number;
        "3. low": number;
        "4. close": number;
    };
}

export async function downloadForexData(fromCurrency: string, toCurrency: string): Promise<AlphaVantageForex> {
    // Retrieve API key from environment variables
    const apiKey: string | undefined = process.env.ALPHAVANTAGE_API_KEY;
    if (!apiKey) {
        throw new Error("API key not found in environment variables.");
    }

    // Construct URL with API key
    const url: string = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${fromCurrency}&to_symbol=${toCurrency}&outputsize=full&apikey=${apiKey}`;
    console.log("Full URL:", url);

    // Make request to API
    const response = await axios.get(url);
    const data: AlphaVantageForex = response.data;

    return data;
}
