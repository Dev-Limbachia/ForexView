import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const { action, queryStringParameters } = JSON.parse(event.body);

        if (action === "getData") {
            const { currency_pair } = queryStringParameters;

            const params = {
                TableName: "ForexData",
                KeyConditionExpression: "currency_pair = :pair",
                ExpressionAttributeValues: {
                    ":pair": currency_pair
                },
                Limit: 10
            };

            const { Items } = await docClient.send(new QueryCommand(params));
            console.log("Retrieved data from DynamoDB:", Items);

            const response = {
                statusCode: 200,
                body: JSON.stringify(Items)
            };

            return response;
        } else {
            return {
                statusCode: 400,
                body: "Invalid action specified"
            };
        }
    } catch (error) {
        console.error("Error processing WebSocket message:", error);
        return {
            statusCode: 500,
            body: "Internal Server Error"
        };
    }
};
