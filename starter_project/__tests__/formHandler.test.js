// __tests__/formHandler.test.js
import { handleSubmit, isValidURL } from '../src/client/js/formHandler';

// Mock the DOM elements for testing
global.document.body.innerHTML = `
    <form id="urlForm">
        <input id="name" type="text" value="https://example.com" />
        <button id="submitButton" type="submit">Submit</button>
    </form>
    <div id="results"></div>
`;

describe("handleSubmit function", () => {
    let formElement, submitButton, nameInput;

    beforeEach(() => {
        // Set up a simple DOM for testing
        formElement = document.getElementById('urlForm');
        submitButton = document.getElementById('submitButton');
        nameInput = document.getElementById('name');
    });

    test("should be defined", () => {
        // Check if the function is defined
        expect(handleSubmit).toBeDefined();
    });

    test("should prevent default form submission", () => {
        const mockEvent = { preventDefault: jest.fn() };

        handleSubmit(mockEvent);

        // Check if preventDefault is called
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    test("should alert when URL is invalid", () => {
        // Set the input field value to an invalid URL
        nameInput.value = 'invalid-url';

        // Mock alert function
        global.alert = jest.fn();

        const mockEvent = { preventDefault: jest.fn() };

        handleSubmit(mockEvent);

        // Check if alert was called for invalid URL
        expect(global.alert).toHaveBeenCalledWith("Invalid URL! Please enter a valid URL.");
    });

    test("should send valid URL to the server", async () => {
        // Set the input field value to a valid URL
        nameInput.value = 'https://example.com';

        // Mock fetch API
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    sentiment: "positive",
                    contentType: "text/html",
                    textPreview: "Example text preview."
                })
            })
        );

        const mockEvent = { preventDefault: jest.fn() };

        await handleSubmit(mockEvent);

        // Check if fetch was called with the correct URL
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8000/analyze-url',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: 'https://example.com' })
            })
        );

        // Check if the result UI was updated with the response
        expect(document.getElementById('results').innerHTML).toContain('Sentiment: positive');
        expect(document.getElementById('results').innerHTML).toContain('Content Type: text/html');
        expect(document.getElementById('results').innerHTML).toContain('Input Text Preview: "Example text preview."');
    });

    test("should alert on server error", async () => {
        // Set the input field value to a valid URL
        nameInput.value = 'https://example.com';

        // Mock fetch API to simulate server error
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: "Failed to analyze the URL" })
            })
        );

        // Mock alert function
        global.alert = jest.fn();

        const mockEvent = { preventDefault: jest.fn() };

        await handleSubmit(mockEvent);

        // Check if alert was called on error
        expect(global.alert).toHaveBeenCalledWith("An error occurred while analyzing the URL. Please try again.");
    });
});

describe("isValidURL function", () => {
    test("should return true for valid URL", () => {
        const validURL = "https://example.com";
        expect(isValidURL(validURL)).toBe(true);
    });

    test("should return false for invalid URL", () => {
        const invalidURL = "invalid-url";
        expect(isValidURL(invalidURL)).toBe(false);
    });

    test("should return true for localhost", () => {
        const localhostURL = "http://localhost:3000";
        expect(isValidURL(localhostURL)).toBe(true);
    });

    test("should return false for empty string", () => {
        const emptyURL = "";
        expect(isValidURL(emptyURL)).toBe(false);
    });
});
