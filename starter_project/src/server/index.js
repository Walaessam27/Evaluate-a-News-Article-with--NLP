// Import required dependencies
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const dotenv = require('dotenv'); // Load environment variables

dotenv.config(); // Load .env file

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 8000; // Use env variable if available

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies

// Encapsulated function to scrape text from a URL
async function scrapeTextFromURL(url) {
    try {
        console.log(`Fetching and scraping text from URL: ${url}`);

        // Fetch the webpage data
        const { data } = await axios.get(url);

        // Use Cheerio to load the HTML and extract the text
        const $ = cheerio.load(data);

        // Try targeting specific containers (e.g., articles, blog posts)
        let text = $('article, .post, .content').text().trim();  // Example of targeting common content areas

        // If no targeted content found, fallback to body text
        if (!text) {
            text = $('body').text().trim().replace(/\s+/g, ' ');
        }

        // Check if text content exists
        if (!text) {
            console.error('No text content found at the provided URL');
            return null;
        }

        // Extract and return the first 200 characters of the text
        const trimmedText = text.substring(0, 200);
        console.log(`Extracted Text (200 characters):\n${trimmedText}\n--- End of Text Preview ---`);
        return trimmedText;
    } catch (error) {
        console.error('Error while scraping text from the URL:', error.message);
        throw new Error('Failed to scrape text from the URL');
    }
}


// Route to analyze text from a URL

app.post('/analyze-url', async (req, res) => {
    const { url } = req.body;

    // Validate the input URL
    if (!url) {
        console.error('No URL provided in the request body');
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Step 1: Scrape text from the provided URL
        const text = await scrapeTextFromURL(url);

        if (!text) {
            return res.status(400).json({ error: 'No text content found at the provided URL' });
        }

        console.log("Text to be analyzed:", text);  // Log the scraped text

        // Step 2: Connect to the NLP API
        const NLP_API_URL = process.env.NLP_API_URL || 'https://kooye7u703.execute-api.us-east-1.amazonaws.com/NLPAnalyzer';
        const response = await axios.post(NLP_API_URL, { text });

        console.log("NLP API Response:", response.data);  // Log API response

        // Check if API returned valid data
        if (!response.data) {
            return res.status(500).json({ error: 'Invalid response from NLP API' });
        }

        // Send NLP API response back to frontend
        return res.json(response.data);
    } catch (error) {
        console.error('Error during URL processing or API request:', error.message);
        return res.status(500).json({ error: 'Failed to analyze the URL' });
    }
});


// Default route
app.get('/', (req, res) => {
    res.send("This is the server API page. You may access its services via the client app.");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
