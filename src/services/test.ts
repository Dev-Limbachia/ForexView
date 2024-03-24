// Import the NewsAPI library
const NewsAPI = require('newsapi');

// Module that reads keys from .env file
require('dotenv').config();

// Define structure of article returned from NewsAPI
interface Article {
    title: string;
    publishedAt: string;
    description: string;
    content: string;
}

// Define structure of data returned from NewsAPI
interface NewsAPIResult {
    articles: Array<Article>;
}

// Pulls and logs data from API
async function getNews(): Promise<void> {
    // Create new NewsAPI class
    const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

    // Search API with the specified query parameters
    const result: NewsAPIResult = await newsapi.v2.everything({
        q: 'dailyfx',
        from: '2024-02-24',
        sortBy: 'publishedAt',
        pageSize: 100,
        language: 'en'
    });

    // Filter articles containing "EUR/USD" in the title, description, or content
    const eurUsdArticles = result.articles.filter(article => {
        return (
            article.title.includes('EUR/USD') ||
            article.description.includes('EUR/USD') ||
            article.content.includes('EUR/USD')
        );
    });

    // Output title and publishedAt for filtered articles with UNIX time format
    console.log(`Number of articles related to EUR/USD: ${eurUsdArticles.length}\n`);
    for (let article of eurUsdArticles) {
        const unixTime = new Date(article.publishedAt).getTime();
        console.log(`Title: ${article.title}`);
        console.log(`Description: ${article.description}`);
        console.log(`Published At (UNIX time): ${unixTime}`);
        console.log(); // Add a line break for readability
    }
}

getNews();
