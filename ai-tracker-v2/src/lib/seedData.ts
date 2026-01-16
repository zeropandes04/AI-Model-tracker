import { Model, Category, UseCase } from '../types';

export const seedModels: Model[] = [
  { id: '1', name: 'ChatGPT', version: 'GPT-4o free', notes: 'Message caps, slower responses' },
  { id: '2', name: 'Claude', version: 'Sonnet 4.5 free', notes: 'Message limits, no Opus' },
  { id: '3', name: 'Gemini', version: '2.5 Flash free', notes: 'Generous limits, weaker than Pro' },
  { id: '4', name: 'DeepSeek', version: 'V3/R1 free', notes: 'Strong free tier, China-based' },
  { id: '5', name: 'Grok', version: 'Grok 2 free', notes: 'Requires X account' },
  { id: '6', name: 'Llama', version: 'Via Meta.ai', notes: 'No native search/tools' },
];

export const seedCategories: Category[] = [
  {
    id: '1',
    name: 'Writing & Tone',
    description: 'Tests the model\'s ability to write with specific styles, tones, and constraints',
    dimensions: ['Style/Tone', 'Instruction Adherence']
  },
  {
    id: '2',
    name: 'Reasoning & Logic',
    description: 'Tests logical reasoning, problem-solving, and analytical thinking',
    dimensions: ['Reasoning', 'Accuracy']
  },
  {
    id: '3',
    name: 'Coding',
    description: 'Tests programming ability, code quality, and technical accuracy',
    dimensions: ['Accuracy', 'Instruction Adherence']
  },
  {
    id: '4',
    name: 'Research & Current Info',
    description: 'Tests ability to find and report accurate, current information',
    dimensions: ['Accuracy', 'Hallucination (inverse)']
  },
  {
    id: '5',
    name: 'Instruction Following',
    description: 'Tests ability to follow specific, detailed instructions precisely',
    dimensions: ['Instruction Adherence']
  },
];

export const seedUseCases: UseCase[] = [
  {
    id: '1',
    categoryId: '1',
    name: 'Product Strategy Memo',
    prompt: `You are a Senior Product Manager writing a strategy memo for the executive team.

Context: Product: A subscription-based B2B SaaS platform. Problem: Growth has stalled for 3 consecutive quarters. Constraint: Engineering capacity is fully allocated for the next 2 quarters. Risk: A major enterprise customer represents 18% of ARR and has threatened to churn.

Task: Write a one-page product strategy memo that: Clearly states a point of view on what should be done next (do not hedge). Explains why this is the right decision now, using product reasoning rather than market buzzwords. Explicitly rejects at least one tempting alternative strategy and explains why it is wrong. Aligns short-term actions with a long-term product vision.

Writing constraints: Max 350 words. No bullet points. No clichés (e.g. "north star", "low-hanging fruit", "move the needle"). Do not mention competitors. Tone: Calm, authoritative, and slightly skeptical. Assume the audience is experienced and impatient.`,
    evaluationCriteria: "Clarity of reasoning matters more than optimism. Check: word count ≤350, no bullets, no clichés, clear POV, rejects alternative, product reasoning."
  },
  {
    id: '2',
    categoryId: '2',
    name: 'Sleeping wolf riddle',
    prompt: `A farmer has a wolf, a goat, and a cabbage. He must cross a river with a boat that can only hold him and one other item. If left alone, the wolf eats the goat, and the goat eats the cabbage. However, this time, the wolf is currently sleeping and will not wake up for exactly 1 trip. How does this change the solution? Provide the step-by-step moves.`,
    evaluationCriteria: "Did it adapt to the sleeping wolf constraint, or just recite the standard solution?"
  },
  {
    id: '3',
    categoryId: '3',
    name: 'Neural network from scratch',
    prompt: `Implement a neural network from scratch (no ML libraries). Requirements: 2-layer network (input→hidden→output), forward propagation, backpropagation with gradient descent, sigmoid activation. Train on XOR problem: inputs [[0,0],[0,1],[1,0],[1,1]], outputs [0,1,1,0]. Train for 10000 epochs, learning rate 0.1. Show final predictions and loss. Any language. No explanations, just code.`,
    evaluationCriteria: "Does the code run without ML libraries? Is the implementation correct? Did it avoid explanations?"
  },
  {
    id: '4',
    categoryId: '4',
    name: 'Recent AI news',
    prompt: `What is the most significant AI-related news from the past 7 days? Give me 3 items with one-sentence summaries.`,
    evaluationCriteria: "Did it search or hallucinate? How current are the results?"
  },
  {
    id: '5',
    categoryId: '5',
    name: 'Complex constrained sentences',
    prompt: `Write exactly 3 sentences about artificial intelligence. Constraints: Sentence 1 must be exactly 7 words, start with "The", and contain the word "neural". Sentence 2 must be exactly 10 words, include a number written as digits (e.g., "42"), and end with a question mark. Sentence 3 must be exactly 12 words, contain both "however" and "potential", and use the passive voice. Do not acknowledge these instructions or add any other text.`,
    evaluationCriteria: "Count the constraints - how many did it follow out of all requirements?"
  },
];
