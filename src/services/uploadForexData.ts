import Download from './databaseUploader'; // Import the Download class from DynamoDBClient.ts
import { downloadForexData } from './downloadForexData'; // Import the downloadForexData function

// Function to upload forex data to DynamoDB
export async function uploadForexData(): Promise<void> {
    try {
        const downloader = new Download(); // Create an instance of the Download class
        const fromCurrency = "EUR"; // Change to your desired currency pair
        const toCurrency = "USD"; // Change to your desired currency pair
        const data = await downloadForexData(fromCurrency, toCurrency); // Using the downloadForexData function

        // Get the first 1000 keys from the object
        const keys = Object.keys(data['Time Series FX (Daily)']).slice(0, 1000);

        for (let dt of keys) {
            const date = new Date(dt);
            const rate = data['Time Series FX (Daily)'][dt]['4. close'];
            const currencyPair = `${fromCurrency}-${toCurrency}`;

            // Use the saveToDynamoDB method of the downloader to save forex data
            await downloader.saveToDynamoDB("ForexData", {
                "timestamp": date.getTime(), // Convert timestamp to milliseconds
                "currency_pair": currencyPair,
                "exchange_rate": rate
            });

            console.log("Uploaded Forex Data to DynamoDB");
        }
    } catch (error) {
        console.error("Error uploading forex data to DynamoDB:", error);
    }
}
