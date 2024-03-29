// Import the NewsAPI library
const NewsAPI = require('newsapi');

// Module that reads keys from .env file
require('dotenv').config();

// Define structure of article returned from NewsAPI
interface Article {
    title: string;
    publishedAt: number;
    description: string;
    content: string;
}

// Define structure of data returned from NewsAPI
interface NewsAPIResult {
    articles: Array<Article>;
}

// Function to download data from API
export async function downloadNewsData(): Promise<Article[]> {
    // Create new NewsAPI class
    const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

    // Search API with the specified query parameters
    const result: NewsAPIResult = await newsapi.v2.everything({
        q: 'dailyfx',
        from: '2024-02-29',
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

    return eurUsdArticles;
}
