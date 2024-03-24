// Importing AWS SDK components
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");

// Importing the downloadNewsData function
const { downloadNewsData } = require('./downloadNewsData');

// Create a DynamoDB client instance
const client = new DynamoDBClient({});

// Function to upload news data to DynamoDB
export async function uploadNewsData(): Promise<void> {
    try {
        const data = await downloadNewsData();
        const articles = data || []; // Adjusting for the structure of your data

        for (let article of articles) {
            const unixTime = new Date(article.publishedAt).getTime();
            
            // Define the DynamoDB PutCommand to insert the article data
            const command = new PutCommand({
                TableName: "NewsSentimentData",
                Item: {
                    "time_published": { N: unixTime}, // Assuming time_published is stored as a Number
                    "currency_pair": { S: 'EUR/USD' }, // Hardcoded currency pair as 'EUR/USD'
                    "title": { S: article.title }, // Store the title
                    "description": { S: article.description } // Store the description
                }
            });

            // Execute the PutCommand to upload the article data to DynamoDB
            const response = await client.send(command);
            console.log("Uploaded Article to DynamoDB:", response);
        }
    } catch (error) {
        console.error("Error uploading news data to DynamoDB:", error);
    }
}
