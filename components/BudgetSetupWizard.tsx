import { AddCategoryForm } from "@/components/AddCategoryForm";
import { AddIncomeForm } from "@/components/AddIncomeForm";
import { AddLineItemForm } from "@/components/AddLineItemForm";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { CategoryWithLineItems } from "@/types";
import { useEffect, useState } from "react";
import { View } from "react-native";

type BudgetSetupWizardProps = {
  householdId: string;
  userId: string;
  monthKey: string;
  income: { id: string; name: string | null; amount: number }[];
  totalIncome: number;
  categories: CategoryWithLineItems[] | null;
  totalPlanned: number;
  monthLabel: string;
  refetch: () => void;
  onComplete: () => void;
};

export function BudgetSetupWizard({
  householdId,
  userId,
  monthKey,
  totalIncome,
  categories,
  refetch,
  onComplete,
}: BudgetSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (currentStep === 1 && totalIncome > 0) {
      setCurrentStep(2);
    }
  }, [currentStep, totalIncome]);

  useEffect(() => {
    if (currentStep === 2 && categories && categories.length > 0) {
      setCurrentStep(3);
    }
  }, [currentStep, categories]);

  useEffect(() => {
    if (
      currentStep === 3 &&
      categories &&
      categories.length > 0 &&
      categories[0].line_items.length > 0
    ) {
      setCurrentStep(4);
    }
  }, [currentStep, categories]);

  const firstCategory = categories?.[0];

  return (
    <View className="flex-1">
      <ScreenWrapper header="plan">
        <View className="gap-6 pt-4">
          <StepIndicator currentStep={currentStep} totalSteps={4} />

          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  First, add your income
                </CardTitle>
                <Text className="text-sm text-muted-foreground">
                  How much money are you working with this month? Add your
                  income sources to get started.
                </Text>
              </CardHeader>
              <CardContent>
                <AddIncomeForm
                  householdId={householdId}
                  userId={userId}
                  monthKey={monthKey}
                  onSuccess={refetch}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  Create a spending category
                </CardTitle>
                <Text className="text-sm text-muted-foreground">
                  Categories help organize your budget. Think: Housing, Food,
                  Transportation...
                </Text>
              </CardHeader>
              <CardContent>
                <AddCategoryForm
                  householdId={householdId}
                  monthKey={monthKey}
                  onSuccess={refetch}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && firstCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Add a budget item</CardTitle>
                <Text className="text-sm text-muted-foreground">
                  Now add specific items to your category. For example, "Rent"
                  or "Groceries" with a planned amount.
                </Text>
              </CardHeader>
              <CardContent>
                <AddLineItemForm
                  categoryId={firstCategory.id}
                  categoryName={firstCategory.name ?? "Category"}
                  monthKey={monthKey}
                  userId={userId}
                  onSuccess={refetch}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">You're all set!</CardTitle>
                <Text className="text-sm text-muted-foreground">
                  Your first budget is ready. You can always come back here to
                  tweak it.
                </Text>
              </CardHeader>
              <CardContent>
                <Button onPress={onComplete}>
                  <Text>Let's Go</Text>
                </Button>
              </CardContent>
            </Card>
          )}
        </View>
      </ScreenWrapper>
    </View>
  );
}
