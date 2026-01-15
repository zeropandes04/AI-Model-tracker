// Script to add neural network results to the AI Model Tracker
// Open index.html in a browser, then paste this script into the console

// Neural network results for each model
const neuralNetworkResults = [
    {
        modelId: '1', // ChatGPT (GPT-4o free)
        dimensions: {
            'Accuracy': 5,
            'Instruction Adherence': 5
        },
        notes: 'Pure Python implementation without ML libraries. Correct forward/backward propagation. Shows final predictions and loss.'
    },
    {
        modelId: '3', // Gemini 3
        dimensions: {
            'Accuracy': 4,
            'Instruction Adherence': 4
        },
        notes: 'Uses numpy for matrix operations. Correct algorithm implementation with proper gradient descent.'
    },
    {
        modelId: '6', // Llama (via Meta.ai)
        dimensions: {
            'Accuracy': 4,
            'Instruction Adherence': 4
        },
        notes: 'Uses numpy for matrix operations. Clean implementation with proper backpropagation.'
    },
    {
        modelId: '2', // Claude (Sonnet 4.5 free)
        dimensions: {
            'Accuracy': 5,
            'Instruction Adherence': 4
        },
        notes: 'Uses 4 hidden units (more than minimum). Slightly verbose output with labels. Uses numpy.'
    },
    {
        modelId: '4', // DeepSeek (V3/R1 free)
        dimensions: {
            'Accuracy': 5,
            'Instruction Adherence': 3
        },
        notes: 'OOP class structure (more complex than needed). Includes epoch progress printing during training. Uses numpy.'
    },
    {
        modelId: '5', // Grok 2 (free with X)
        dimensions: {
            'Accuracy': 5,
            'Instruction Adherence': 4
        },
        notes: 'Clean implementation with numpy. Proper forward/backward propagation and gradient descent.'
    }
];

// Get the stored data
const stored = localStorage.getItem('trackerData');
const data = JSON.parse(stored);

// Find the Coding category (id: '3')
const codingCategoryId = '3';

// Initialize results for Coding category if not exists
if (!data.categoryResults[codingCategoryId]) {
    data.categoryResults[codingCategoryId] = {};
}

// Add each model's results
neuralNetworkResults.forEach(result => {
    const scores = Object.values(result.dimensions);
    const avgStars = scores.reduce((a, b) => a + b, 0) / scores.length;
    const finalScore = parseFloat((avgStars * 2).toFixed(1));

    data.categoryResults[codingCategoryId][result.modelId] = {
        dimensions: result.dimensions,
        finalScore: finalScore,
        notes: result.notes
    };
});

// Save back to localStorage
localStorage.setItem('trackerData', JSON.stringify(data));

console.log('✅ Neural network results added successfully!');
console.log('📊 Results summary:');
neuralNetworkResults.forEach(result => {
    const modelName = ['ChatGPT (GPT-4o free)', 'Claude (Sonnet 4.5 free)', 'Gemini 3', 'DeepSeek (V3/R1 free)', 'Grok 2 (free with X)', 'Llama (via Meta.ai)'][parseInt(result.modelId) - 1];
    const scores = Object.values(result.dimensions);
    const avgStars = scores.reduce((a, b) => a + b, 0) / scores.length;
    const finalScore = (avgStars * 2).toFixed(1);
    console.log(`${modelName}: ${finalScore}/10`);
});

console.log('\n🔄 Refresh the page to see the updated results!');
