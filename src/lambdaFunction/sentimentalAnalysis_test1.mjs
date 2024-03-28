/* Sentiment analysis using text-processing web service:http://text-processing.com/docs/sentiment.html
    Note that this is rate-limited to 1000 requests per IP address per day.
    Lambda functions use multiple IP addresses, so this should not be an issue for this project. */

// Axios handles HTTP requests to web service
import axios from 'axios';

// Calls text-processing web service and logs sentiment.
export async function tpSentiment(title, description) {
    // URL of web service
    let url = `http://text-processing.com/api/sentiment/`;

    // Combine title and description into a single text for sentiment analysis
    let text = title + '. ' + description;

    try {
        // Sent POST request to endpoint with Axios
        let response = await axios.post(url, {
            text: text
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Log result
        console.log(`Title: ${title}`);
        console.log(`Description: ${description}`);
        console.log('Sentiment Analysis Result:');
        console.log(response.data);
    } catch (error) {
        // Handle error
        console.error('Error occurred during sentiment analysis:', error);
    }
}

// Example usage
let title = "Markets Week Ahead: Gold Breaks Out as EUR/USD Eyes ECB; Powell, BoC & NFP Loom - DailyFX";
let description = "Markets Week Ahead: Gold Breaks Out as EUR/USD Eyes ECB; Powell, BoC & NFP LoomDailyFX Jobs report, Powell testimony on Fed rates top week's economic newsUSA TODAY Take Five: Never a dull momentReuters Top 5 things to watch in markets in the week ahead By Inv…";
tpSentiment(title, description);
