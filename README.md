# AI Model Comparison Tracker

A simple, standalone HTML5 application for comparing AI model performance across different categories using validation dimensions and star ratings.

## Features

### Two Main Views

#### 1. Best By Category (Dashboard)
- Read-only dashboard showing scorecards for each category
- Displays the winning model (highest final score) per category
- Shows star ratings (1-5) for each validation dimension
- Displays final score out of 10 (calculated from star ratings)

#### 2. Categories
- List of all test categories
- Click any category to view detailed results
- Add new custom categories with test prompts
- Manage model results within each category

### Validation Dimensions by Category

Each category uses specific validation dimensions:

- **Writing & Tone**: Style/Tone, Instruction Adherence
- **Reasoning & Logic**: Reasoning, Accuracy
- **Coding**: Accuracy, Instruction Adherence
- **Research & Current Info**: Accuracy, Hallucination (inverse)
- **Instruction Following**: Instruction Adherence

### Pre-loaded Content

#### Default Categories with Test Prompts:
1. **Writing & Tone** - Email writing test
2. **Reasoning & Logic** - Classic river crossing puzzle with twist
3. **Coding** - Python number guessing game
4. **Research & Current Info** - Recent AI news
5. **Instruction Following** - Constrained poetry writing

#### Available Models:
- ChatGPT (GPT-4o free)
- Claude (Sonnet 4.5 free)
- Gemini (1.5 Flash free)
- DeepSeek (V3/R1 free)
- Grok 2 (free with X)
- Llama (via Meta.ai)

## How to Use

1. **Open the app**: Simply open `index.html` in any modern web browser
2. **View best models**: Start on the "Best By Category" tab to see top performers
3. **Add results**:
   - Go to "Categories" tab
   - Click on a category
   - Click "Copy Prompt" to get the test prompt
   - Test a model with the prompt
   - Click "Add Model" to record results
   - Rate each validation dimension with 1-5 stars
   - Final score is calculated automatically
4. **Edit/Delete**: Update or remove model results as needed
5. **Add categories**: Create custom categories with your own test prompts

## Technical Details

- **Technology**: Pure HTML5, CSS3, and vanilla JavaScript
- **Storage**: LocalStorage (data persists in browser)
- **No dependencies**: No frameworks, no build process, no server required
- **Responsive**: Works on desktop and mobile browsers
- **Dark theme**: Modern UI with dark color scheme

## Scoring System

- Rate each dimension: 1-5 stars
- Final score = (Average of star ratings × 2)
- Final score shown as: X/10
- Winner = Highest final score in category

## Data Storage

All data is stored locally in your browser's localStorage. To reset the app, clear your browser's localStorage for this page.

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Grid
- LocalStorage API
- Flexbox

Tested on: Chrome, Firefox, Safari, Edge
