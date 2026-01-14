import { useState } from "react";
import { useTrackerData } from "@/hooks/useTrackerData";
import { Dashboard } from "@/components/Dashboard";
import { CategoryDetail } from "@/components/CategoryDetail";
import { AllResultsView } from "@/components/AllResultsView";
import { Category } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, List } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const {
    models,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addPrompt,
    updatePrompt,
    deletePrompt,
    addResult,
    getModelScoresForCategory,
    getCategoryWinner,
    getPromptsForCategory,
    getResultsForPrompt,
  } = useTrackerData();

  // If viewing a category detail, show that instead of tabs
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl py-8 px-4">
          <CategoryDetail
            category={selectedCategory}
            scores={getModelScoresForCategory(selectedCategory.id)}
            prompts={getPromptsForCategory(selectedCategory.id)}
            models={models}
            getResultsForPrompt={getResultsForPrompt}
            onBack={() => setSelectedCategory(null)}
            onAddPrompt={addPrompt}
            onUpdatePrompt={updatePrompt}
            onDeletePrompt={deletePrompt}
            onAddResult={addResult}
            onUpdateCategory={(id, updates) => {
              updateCategory(id, updates);
              setSelectedCategory({ ...selectedCategory, ...updates });
            }}
            onDeleteCategory={deleteCategory}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 px-4">
        <Tabs defaultValue="best" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="best" className="gap-2">
              <Trophy className="h-4 w-4" />
              Best by Category
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <List className="h-4 w-4" />
              All Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="best">
            <Dashboard
              categories={categories}
              getCategoryWinner={getCategoryWinner}
              onSelectCategory={setSelectedCategory}
              onAddCategory={addCategory}
            />
          </TabsContent>

          <TabsContent value="all">
            <AllResultsView
              categories={categories}
              getModelScoresForCategory={getModelScoresForCategory}
              getPromptsForCategory={getPromptsForCategory}
              getResultsForPrompt={getResultsForPrompt}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
