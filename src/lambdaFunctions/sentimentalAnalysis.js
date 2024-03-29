const axios = require('axios');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Create DynamoDB Document Client with default region from credentials
const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        for (const record of event.Records) {
            if (record.eventName !== "INSERT") {
                return { statusCode: 400, message: "Not expected event" };
            }

            const title = record.dynamodb.NewImage.title.S;
            const description = record.dynamodb.NewImage.description.S;
            const currencyPair = record.dynamodb.NewImage.currency_pair.S;
            const timePublished = parseInt(record.dynamodb.NewImage.time_published.N);

            const url = 'http://text-processing.com/api/sentiment/';
            const text = `${title}. ${description}`;
            const body = { text };
            const options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

            try {
                // Perform sentiment analysis with new data
                const response = await axios.post(url, body, options);
                const sentiment = response.data;
                
                // Convert sentiment data object to JSON string
                const sentimentJSON = JSON.stringify(sentiment);

                // Save sentiment result to database
                const command = new PutCommand({
                    TableName: "ForexSentimentAnalysis",
                    Item: {
                        "currency_pair": currencyPair,
                        "time_published": timePublished,
                        "sentiment_score": sentimentJSON
                    }
                });

                await docClient.send(command);
                console.log(`Sentiment score saved for ${currencyPair} at ${timePublished}`);

            } catch (error) {
                console.error("Error occurred while processing sentiment:", error);
                return {
                    statusCode: 500,
                    message: "Error occurred while processing sentiment"
                }
            }
        }

        return {
            statusCode: 200,
            message: "Sentiment analysis completed successfully"
        };
    } catch (error) {
        console.error("Unhandled error occurred:", error);
        return { statusCode: 500, message: "Unhandled error occurred" };
    }
}
