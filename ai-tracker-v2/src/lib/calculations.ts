import { Score, Model, Category, UseCase, ModelStats, CategoryRanking } from '../types';

// Convert star rating (1-5) average to 10-point scale
export function starsToTen(stars: number): number {
  return Math.round(stars * 2 * 10) / 10;
}

// Calculate final score from dimension scores
export function calculateFinalScore(dimensionScores: Record<string, number>): number {
  const values = Object.values(dimensionScores);
  if (values.length === 0) return 0;
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  return starsToTen(average);
}

// Get all scores for a model
export function getModelScores(modelId: string, scores: Score[]): Score[] {
  return scores.filter(s => s.modelId === modelId);
}

// Get all scores for a use case
export function getUseCaseScores(useCaseId: string, scores: Score[]): Score[] {
  return scores.filter(s => s.useCaseId === useCaseId);
}

// Get model's score for a specific category
export function getModelCategoryScore(
  modelId: string,
  categoryId: string,
  scores: Score[],
  useCases: UseCase[]
): number | null {
  const categoryUseCaseIds = useCases
    .filter(uc => uc.categoryId === categoryId)
    .map(uc => uc.id);

  const categoryScores = scores.filter(
    s => s.modelId === modelId && categoryUseCaseIds.includes(s.useCaseId)
  );

  if (categoryScores.length === 0) return null;

  const average = categoryScores.reduce((sum, s) => sum + s.finalScore, 0) / categoryScores.length;
  return Math.round(average * 10) / 10;
}

// Get model's overall score
export function getModelOverallScore(
  modelId: string,
  scores: Score[],
  useCases: UseCase[],
  categories: Category[]
): number | null {
  const categoryScores: number[] = [];

  for (const category of categories) {
    const score = getModelCategoryScore(modelId, category.id, scores, useCases);
    if (score !== null) {
      categoryScores.push(score);
    }
  }

  if (categoryScores.length === 0) return null;

  const average = categoryScores.reduce((sum, s) => sum + s, 0) / categoryScores.length;
  return Math.round(average * 10) / 10;
}

// Get full model stats
export function getModelStats(
  model: Model,
  scores: Score[],
  useCases: UseCase[],
  categories: Category[]
): ModelStats {
  const categoryScores: Record<string, number> = {};

  for (const category of categories) {
    const score = getModelCategoryScore(model.id, category.id, scores, useCases);
    if (score !== null) {
      categoryScores[category.name] = score;
    }
  }

  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1]);

  const strengths = sortedCategories.slice(0, 2).map(([name]) => name);
  const weakness = sortedCategories.length > 0
    ? sortedCategories[sortedCategories.length - 1][0]
    : null;

  const modelScores = getModelScores(model.id, scores);

  return {
    model,
    overallScore: getModelOverallScore(model.id, scores, useCases, categories) ?? 0,
    categoryScores,
    strengths,
    weakness: weakness !== strengths[0] ? weakness : null,
    useCasesTested: modelScores.length,
  };
}

// Get leaderboard rankings for all categories
export function getCategoryRankings(
  categories: Category[],
  models: Model[],
  scores: Score[],
  useCases: UseCase[]
): CategoryRanking[] {
  return categories.map(category => {
    const rankings = models
      .map(model => {
        const score = getModelCategoryScore(model.id, category.id, scores, useCases);
        const categoryUseCaseIds = useCases
          .filter(uc => uc.categoryId === category.id)
          .map(uc => uc.id);
        const useCaseCount = scores.filter(
          s => s.modelId === model.id && categoryUseCaseIds.includes(s.useCaseId)
        ).length;

        return {
          model,
          score: score ?? 0,
          useCaseCount,
        };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return {
      categoryId: category.id,
      categoryName: category.name,
      rankings,
    };
  });
}

// Get use case count for a model in a category
export function getModelUseCaseCount(
  modelId: string,
  categoryId: string,
  scores: Score[],
  useCases: UseCase[]
): number {
  const categoryUseCaseIds = useCases
    .filter(uc => uc.categoryId === categoryId)
    .map(uc => uc.id);

  return scores.filter(
    s => s.modelId === modelId && categoryUseCaseIds.includes(s.useCaseId)
  ).length;
}
