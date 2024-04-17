import Download from './databaseUploader';
import { downloadForexData, AlphaVantageForex } from './downloadForexData';

export async function uploadForexData(): Promise<void> {
    try {
        const downloader = new Download();
        const fromCurrency = "EUR";
        const toCurrency = "USD";

        // Download forex data
        const data: AlphaVantageForex = await downloadForexData(fromCurrency, toCurrency);

        // Check if 'Time Series FX (Daily)' property exists
        if ('Time Series FX (Daily)' in data) {
            // Access 'Time Series FX (Daily)' property from data object
            const forexData = data['Time Series FX (Daily)'] as { [date: string]: { [key: string]: string } };

            let count = 0;

            // Iterate through each date in the forexData
            for (const date in forexData) {
                if (count >= 5000) break; // Exit loop after processing 10 data points
                
                const values = forexData[date];
                const timestamp = new Date(date).getTime(); // Convert timestamp to milliseconds 
                const currencyPair = `${fromCurrency}-${toCurrency}`;
                
                // Extract open, high, low, and close values
                const open = values['1. open'];
                const high = values['2. high'];
                const low = values['3. low'];
                const close = values['4. close'];

                // Upload data to DynamoDB
                await downloader.saveToDynamoDB("ForexDataTest", {
                    "timestamp": timestamp,
                    "currency_pair": currencyPair,
                    "open": open,
                    "high": high,
                    "low": low,
                    "close": close
                });

                console.log(`Uploaded Forex Data to DynamoDB for ${date}`);

                count++;
            }
        } else {
            throw new Error("Data does not contain 'Time Series FX (Daily)' property");
        }

        console.log("Forex data upload completed.");
    } catch (error) {
        console.error("Error uploading forex data to DynamoDB:", error);
    }
}
