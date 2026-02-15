// gemini.js

async function runGemini(prompt) {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        alert('Please save your Gemini API key first.');
        return;
    }
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return 'No content generated.';
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return `Error: ${error.message}`;
    }
}
