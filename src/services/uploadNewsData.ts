import Download from './databaseUploader'; // Import the Download class from DynamoDBClient.ts
import { downloadNewsData } from './downloadNewsData'; // Import the downloadNewsData function

// Function to upload news data to DynamoDB
export async function uploadNewsData(): Promise<void> {
    try {
        const downloader = new Download(); // Create an instance of the Download class
        const data = await downloadNewsData();
        const articles = data || []; // Adjusting for the structure of your data

        console.log(`Number of articles fetched: ${articles.length}`);

        for (let article of articles) {
            const timestamp = new Date(article.publishedAt).getTime();

            // Define the DynamoDB PutCommand to insert the article data
            await downloader.saveToDynamoDB("ForexNews", { // Use the saveToDynamoDB method of the downloader
                "time_published": timestamp, // time_published is stored as a Number
                "currency_pair": 'USD-CHF', // Hardcoded currency pair as 'EUR-USD'
                "title": article.title, // Store the title
                "description": article.description // Store the description
            });

            console.log("Uploaded Article to DynamoDB");
        }
    } catch (error) {
        console.error("Error uploading news data to DynamoDB:", error);
    }
}
