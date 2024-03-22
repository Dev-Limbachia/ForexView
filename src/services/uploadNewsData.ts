// Importing downloadNewsData function from downloadNewsData.ts
const downloadNewsData = require('./downloadNewsData').downloadNewsData; 

// Importing the convertToMilliseconds function
const convertToMilliseconds  = require('../utils/timeConverter').convertToMilliseconds ;

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

export async function uploadNewsData(): Promise<void> {
    const data = await downloadNewsData();

    const articles = data.feed || [];

    for (let article of articles) {
        const timestamp = convertToMilliseconds(article.time_published); // Convert timestamp to milliseconds
        const summary = article.summary;

        const command = new PutCommand({
            TableName: "NewsSentimentData",
            Item: {
                "time_published": timestamp,
                "summary": summary
            }
        });

        try {
            const response = await documentClient.send(command);
            console.log(response);
        } catch (err) {
            console.error("ERROR uploading data:", err);
        }
    }
}
