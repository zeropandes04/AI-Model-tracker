# AI Model Comparison Tracker

A React + TypeScript application for comparing AI model performance across different test categories using star ratings and detailed scoring.

**Live Demo:** https://zeropandes04.github.io/AI-Model-tracker/

## Features

### Three Main Views

#### 1. Models
- Grid of AI model cards with overall scores
- Click any model to see detailed performance breakdown by category
- Visual star ratings for each test

#### 2. Leaderboard
- Ranked table of all models by average score
- Hover on scores to see category-specific details
- Quick comparison across all categories

#### 3. Test Lab
- Browse test categories and use cases
- Copy prompts to test models
- Record scores with star ratings (1-5 stars → 10-point scale)
- Add custom categories and use cases

### Test Categories

| Category | Dimensions | Use Case |
|----------|------------|----------|
| Writing & Tone | Style/Tone, Instruction Adherence | Product Strategy Memo |
| Reasoning & Logic | Reasoning, Accuracy | Sleeping Wolf Riddle |
| Coding | Accuracy, Instruction Adherence | Neural Network from Scratch |
| Research & Current Info | Accuracy, Hallucination (inverse) | Recent AI News |
| Instruction Following | Instruction Adherence | Complex Constrained Sentences |

### Pre-loaded Models
- ChatGPT (GPT-4o free)
- Claude (Sonnet 4.5 free)
- Gemini (2.5 Flash free)
- DeepSeek (V3/R1 free)
- Grok 2 (free with X)
- Llama (via Meta.ai)

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Build:** Vite
- **Storage:** LocalStorage (Supabase-ready hooks)
- **Deployment:** GitHub Pages

## Development

```bash
cd ai-tracker-v2
npm install
npm run dev
```

## Scoring System

- Rate each dimension: 1-5 stars
- Final score = Average stars × 2 (out of 10)
- Overall model score = Average across all categories

## Data

All data persists in browser localStorage. Visit `/add-scores.html` to import pre-scored test results.
