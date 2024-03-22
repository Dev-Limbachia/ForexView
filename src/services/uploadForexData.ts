// Importing downloadForexData function from downloadForexData.ts
const downloadForexData = require('./downloadForexData').downloadForexData; 

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

export async function uploadForexData(): Promise<void> {
    const fromCurrency = "EUR"; // Change to your desired currency pair
    const toCurrency = "USD"; // Change to your desired currency pair
    const data = await downloadForexData(fromCurrency, toCurrency); // Using the downloadForexData function

    // Get the first 1000 keys from the object
    const keys = Object.keys(data['Time Series FX (Daily)']).slice(0, 1000);

    for (let dt of keys) {
        const date = new Date(dt);
        const rate = data['Time Series FX (Daily)'][dt]['4. close'];
        const currencyPair = `${fromCurrency}-${toCurrency}`;

        const command = new PutCommand({
            TableName: "ForexData",
            Item: {
                "timestamp": date.getTime(), // Convert timestamp to milliseconds
                "currency_pair": currencyPair,
                "exchange_rate": rate
            }
        });        

        try {
            const response = await documentClient.send(command);
            console.log(response);
        } catch (err) {
            console.error("ERROR uploading data: " + JSON.stringify(err));
        }
    }
}
