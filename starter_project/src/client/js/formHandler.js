// Define the backend API URL
const serverURL = 'http://localhost:8000/analyze-url';

// Add event listener to the form
const form = document.getElementById('urlForm');
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    // Get the URL from the input field
    const formText = document.getElementById('name').value;

    // Validate the URL format
    if (!isValidURL(formText)) {
        alert("Invalid URL! Please enter a valid URL.");
        return;
    }

    sendURLToServer(formText);
}

// Function to validate URL format
function isValidURL(url) {
    const urlPattern = new RegExp(
        "^(https?:\\/\\/)" + // Protocol
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // Domain name
        "localhost|" + // Localhost
        "\\d{1,3}(\\.\\d{1,3}){3})" + // IP (v4)
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // Port & path
        "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // Query string
        "(\\#[-a-zA-Z\\d_]*)?$", "i" // Fragment locator
    );
    return !!urlPattern.test(url);
}

// Function to send the URL to the server
async function sendURLToServer(url) {
    try {
        const response = await fetch(serverURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        // Handle errors from the server
        if (!response.ok) {
            throw new Error(data.error || "Failed to analyze the URL");
        }

        // Dynamically update the UI with the API response
        document.getElementById('results').innerHTML = `
            <p><strong>Sentiment:</strong> ${data.sentiment || 'N/A'}</p>
            <p><strong>Content Type:</strong> ${data.contentType || 'N/A'}</p>
            <p><strong>Input Text Preview:</strong> "${data.textPreview || 'N/A'}"</p>
        `;

    } catch (error) {
        console.error("Error:", error.message);
        alert("An error occurred while analyzing the URL. Please try again.");
    }
}

// Export the function
export { handleSubmit };
