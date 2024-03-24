// Importing AWS SDK components
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Importing the downloadNewsData function
const { downloadNewsData } = require('./downloadNewsData');

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

// Function to upload news data to DynamoDB
export async function uploadNewsData(): Promise<void> {
    try {
        const data = await downloadNewsData();
        const articles = data || []; // Adjusting for the structure of your data

        console.log(`Number of articles fetched: ${articles.length}`);

        for (let article of articles) {
            const timestamp  = new Date(article.publishedAt).getTime();

            // Define the DynamoDB PutCommand to insert the article data
            const command = new PutCommand({
                TableName: "NewsSentimentData",
                Item: {
                    "time_published": timestamp  , // time_published is stored as a Number
                    "currency_pair": 'EUR/USD', // Hardcoded currency pair as 'EUR/USD'
                    "title": article.title , // Store the title
                    "description": article.description  // Store the description
                }
            });

            // Execute the PutCommand to upload the article data to DynamoDB
            const response = await documentClient.send(command);
            console.log("Uploaded Article to DynamoDB:", response);
        }
    } catch (error) {
        console.error("Error uploading news data to DynamoDB:", error);
    }
}
