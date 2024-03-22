import axios from 'axios';

require('dotenv').config();

interface NewsArticle {
    time_published: string;
    summary: string;
}

interface NewsData {
    articles: NewsArticle[];
}

export async function downloadNewsData(): Promise<NewsData> {
    const apiKey: string | undefined = process.env.ALPHAVANTAGE_API_KEY;
    if (!apiKey) {
        throw new Error("API key not found in environment variables.");
    }

    const url: string = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=FOREX:USD&FOREX:EUR&time_from=20220410T0130&limit=1000&apikey=${apiKey}`;
    console.log("Full URL:", url);

    const response = await axios.get(url);
    const data: NewsData = response.data;

    return data;
}
