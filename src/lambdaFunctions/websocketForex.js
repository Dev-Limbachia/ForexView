const WebSocket = require('ws');
const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');

const REGION = 'us-east-1'; // Replace with your AWS region
const TableName = 'ForexDataTest'; // Replace with your DynamoDB table name

const dynamodbClient = new DynamoDBClient({ region: REGION });

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const selectedPair = message.toString(); // Received currency pair from client

        const params = {
            TableName,
            KeyConditionExpression: 'currency_pair = :pair',
            ExpressionAttributeValues: {
                ':pair': { S: selectedPair }
            },
            // Limit: 1000 
        };

        const command = new QueryCommand(params);

        dynamodbClient.send(command)
            .then((data) => {
                const forexDataList = [];

                if (data.Items && data.Items.length > 0) {
                    data.Items.forEach((item) => {
                        const forexData = {
                            currency_pair: item.currency_pair.S,
                            timestamp: parseInt(item.timestamp.N),
                            close: item.close.S,
                            high: item.high.S,
                            low: item.low.S,
                            open: item.open.S
                        };
                        forexDataList.push(forexData);
                    });

                    // Send selected data to client via WebSocket
                    ws.send(JSON.stringify(forexDataList));
                } else {
                    console.log(`No data found for currency pair: ${selectedPair}`);
                    ws.send(JSON.stringify({ error: `No data found for currency pair: ${selectedPair}` }));
                }
            })
            .catch((err) => {
                console.error('DynamoDB error:', err);
                ws.send(JSON.stringify({ error: 'DynamoDB error' }));
            });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
