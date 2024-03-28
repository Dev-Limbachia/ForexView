import axios from "axios";

// Sentiment analysis function
async function tpSentiment(title, description) {
    let url = "http://text-processing.com/api/sentiment/";
    let text = title + ". " + description;

    try {
        let response = await axios.post(
            url,
            { text },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        return response.data;
    } catch (error) {
        console.error("Error occurred during sentiment analysis:", error);
        throw error;
    }
}

// Function to perform sentiment analysis on 25 sample records
async function testSentimentAnalysis() {
    // Sample data for testing sentiment analysis
    const forexNewsData = [
        {
            time_published: "2024-03-28T09:00:00Z",
            currency_pair: "EUR/USD",
            title: "Euro Rises Against Dollar",
            description:
                "The euro gains strength against the US dollar amid positive economic data.",
        },
        {
            time_published: "2024-03-28T10:30:00Z",
            currency_pair: "GBP/USD",
            title: "Pound Falls After Brexit Announcement",
            description:
                "The British pound experiences a decline following the latest Brexit update.",
        },
        {
            time_published: "2024-03-28T12:45:00Z",
            currency_pair: "USD/JPY",
            title: "Yen Strengthens Amid Global Market Uncertainty",
            description:
                "The Japanese yen shows resilience as global market uncertainty persists.",
        },
        {
            time_published: "2024-03-28T14:20:00Z",
            currency_pair: "AUD/USD",
            title: "Australian Dollar Hits New High on Strong Economic Indicators",
            description:
                "Positive economic indicators propel the Australian dollar to new heights.",
        },
        {
            time_published: "2024-03-28T15:30:00Z",
            currency_pair: "EUR/GBP",
            title: "Euro Surges Against British Pound",
            description:
                "The euro gains significant ground against the British pound amid Brexit uncertainties.",
        },
        {
            time_published: "2024-03-28T16:45:00Z",
            currency_pair: "USD/CAD",
            title: "Canadian Dollar Strengthens on Robust Economic Data",
            description:
                "Robust economic data boosts the Canadian dollar against its US counterpart.",
        },
        {
            time_published: "2024-03-28T18:00:00Z",
            currency_pair: "NZD/USD",
            title: "New Zealand Dollar Shows Resilience Amid Market Volatility",
            description:
                "The New Zealand dollar maintains its strength amidst market volatility.",
        },
        {
            time_published: "2024-03-28T19:15:00Z",
            currency_pair: "GBP/EUR",
            title: "British Pound Weakens Against Euro",
            description:
                "The British pound experiences a decline in value against the euro due to Brexit concerns.",
        },
        {
            time_published: "2024-03-28T20:30:00Z",
            currency_pair: "AUD/JPY",
            title: "Australian Dollar-Japanese Yen Pair Sees Volatility",
            description:
                "The AUD/JPY pair experiences significant volatility amid economic data releases.",
        },
        {
            time_published: "2024-03-28T21:45:00Z",
            currency_pair: "USD/CHF",
            title: "Swiss Franc Strengthens Amid Risk Aversion",
            description:
                "Risk aversion drives investors towards the Swiss franc, leading to its strengthening.",
        },
        {
            time_published: "2024-03-28T22:30:00Z",
            currency_pair: "GBP/JPY",
            title: "British Pound-Japanese Yen Pair Faces Pressure",
            description:
                "The GBP/JPY pair faces downward pressure as Brexit uncertainties weigh on the British pound.",
        },
        {
            time_published: "2024-03-28T23:15:00Z",
            currency_pair: "EUR/AUD",
            title: "Euro-Australian Dollar Pair Sees Upside Momentum",
            description:
                "The EUR/AUD pair gains momentum on positive economic outlook for the eurozone.",
        },
        {
            time_published: "2024-03-29T00:00:00Z",
            currency_pair: "CAD/JPY",
            title: "Canadian Dollar-Japanese Yen Pair Trades Sideways",
            description:
                "The CAD/JPY pair remains range-bound amid lack of significant market drivers.",
        },
        {
            time_published: "2024-03-29T01:30:00Z",
            currency_pair: "GBP/NZD",
            title: "British Pound-New Zealand Dollar Pair Volatile",
            description:
                "The GBP/NZD pair experiences volatility as Brexit developments unfold.",
        },
        {
            time_published: "2024-03-29T02:45:00Z",
            currency_pair: "EUR/CHF",
            title: "Euro-Swiss Franc Pair Sees Consolidation",
            description:
                "The EUR/CHF pair consolidates within a narrow range amid lack of clear directional bias.",
        },
        {
            time_published: "2024-03-29T03:30:00Z",
            currency_pair: "AUD/CAD",
            title: "Australian Dollar-Canadian Dollar Pair Edges Lower",
            description:
                "The AUD/CAD pair shows a slight decline as market sentiment turns cautious.",
        },
        {
            time_published: "2024-03-29T04:15:00Z",
            currency_pair: "GBP/CHF",
            title: "British Pound-Swiss Franc Pair Retreats",
            description:
                "The GBP/CHF pair retreats amid risk aversion and Brexit concerns.",
        },
        {
            time_published: "2024-03-29T05:00:00Z",
            currency_pair: "EUR/GBP",
            title: "Euro-British Pound Pair Continues Uptrend",
            description:
                "The EUR/GBP pair maintains its uptrend as Brexit uncertainties persist.",
        },
        {
            time_published: "2024-03-29T06:30:00Z",
            currency_pair: "NZD/JPY",
            title: "New Zealand Dollar-Japanese Yen Pair Volatile",
            description:
                "The NZD/JPY pair experiences volatility amid risk sentiment shifts.",
        },
        {
            time_published: "2024-03-29T07:45:00Z",
            currency_pair: "USD/NZD",
            title: "US Dollar-New Zealand Dollar Pair Trades Sideways",
            description:
                "The USD/NZD pair remains range-bound with limited directional bias.",
        },
        {
            time_published: "2024-03-29T08:30:00Z",
            currency_pair: "AUD/CHF",
            title: "Australian Dollar-Swiss Franc Pair Faces Resistance",
            description:
                "The AUD/CHF pair encounters resistance near key technical levels.",
        },
        {
            time_published: "2024-03-29T09:15:00Z",
            currency_pair: "GBP/AUD",
            title: "British Pound-Australian Dollar Pair Consolidates",
            description:
                "The GBP/AUD pair consolidates within a narrow range amid lack of fresh catalysts.",
        },
        {
            time_published: "2024-03-29T10:00:00Z",
            currency_pair: "USD/JPY",
            title: "US Dollar-Japanese Yen Pair Gains Momentum",
            description:
                "The USD/JPY pair gains momentum as risk sentiment improves.",
        },
        {
            time_published: "2024-03-29T11:30:00Z",
            currency_pair: "EUR/USD",
            title: "Euro-Dollar Pair Continues Uptrend",
            description:
                "The EUR/USD pair maintains its upward trajectory on positive economic data.",
        },
    ];

    try {
        // Perform sentiment analysis for each record and log the result
        for (const item of forexNewsData) {
            const { title, description } = item;
            const sentimentResult = await tpSentiment(title, description);

            // Log sentiment analysis result for each record
            console.log(`Title: ${title}`);
            console.log(`Description: ${description}`);
            console.log("Sentiment Analysis Result:");
            console.log(sentimentResult);
            console.log("\n"); // Add newline for separation
        }
    } catch (error) {
        console.error("Error occurred:", error);
    }
}

// Call the function to test sentiment analysis on 25 records
testSentimentAnalysis();
