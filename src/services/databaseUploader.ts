import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

class Download {
    private client: DynamoDBClient;
    private documentClient: DynamoDBDocumentClient;

    constructor() {
        this.client = new DynamoDBClient({});
        this.documentClient = DynamoDBDocumentClient.from(this.client);
    }

    public async saveToDynamoDB(tableName: string, item: any): Promise<void> {
        try {
            const command = new PutCommand({
                TableName: tableName,
                Item: item
            });

            const response = await this.documentClient.send(command);
            console.log(`Uploaded data to DynamoDB table ${tableName}:`, response);
        } catch (error) {
            console.error(`Error uploading data to DynamoDB table ${tableName}:`, error);
        }
    }

    // You can add other methods for downloading data here
}

export default Download;
