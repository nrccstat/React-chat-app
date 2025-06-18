# React NLP Chatbot

This project is a smart, context-aware chatbot built with React and advanced natural language processing (NLP) using the [compromise](https://github.com/spencermountain/compromise) library and its plugins. No external API or backend is required—everything runs locally in your browser!

## Features

- **Entity Recognition:** Detects people, places, dates, organizations, and numbers in user messages.
- **Sentiment Detection:** Responds to positive and negative emotions.
- **Question Detection:** Recognizes and responds to questions.
- **Topic Extraction:** Identifies main nouns/topics in user input.
- **Pattern Matching:** Custom responses for jokes, fun facts, and more.
- **Keyword-Based Responses:** Uses a training data array for custom keyword-triggered replies.
- **Fully Local:** No API keys or backend required—just run and chat!

## Setup

1. **Clone the repository and install dependencies:**
   ```sh
   npm install
   npm install compromise compromise-numbers compromise-dates
   ```

2. **Start the app:**
   ```sh
   npm start
   ```

3. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000) to chat with Alice.

## How It Works

- The chatbot uses the compromise NLP library and its plugins to analyze each message.
- It first tries to recognize entities (people, places, dates, organizations, numbers).
- It detects questions, sentiment, and main topics.
- It matches custom patterns (like "tell me a joke" or "fun fact").
- If none of the above match, it checks a training data array for keywords and returns a custom response if found.
- If nothing matches, it uses a friendly fallback.

## Example Interactions

- **Entity:**
  - User: "I met John in Paris on July 4th."
  - Bot: "You mentioned John. Are they important to you?"
- **Sentiment:**
  - User: "I'm feeling happy!"
  - Bot: "I'm glad to hear that! What made you feel this way?"
- **Question:**
  - User: "What is your favorite color?"
  - Bot: "That's a great question! What do you think?"
- **Keyword:**
  - User: "I'm excited for my new job!"
  - Bot: "I'm glad you're feeling positive! What's making you feel this way?"
- **Joke:**
  - User: "Tell me a joke"
  - Bot: "Why don't scientists trust atoms? Because they make up everything!"

## Customization

- Add more keywords and responses in the `trainingData` array in `App.js`.
- Add more custom patterns or entity logic in the `analyzeMessage` function.
- Install more [compromise plugins](https://github.com/spencermountain/compromise/wiki/Plugins) for even more NLP features.

## License

MIT
