import { AddCategoryForm } from "@/components/AddCategoryForm";
import { AddIncomeForm } from "@/components/AddIncomeForm";
import { AddLineItemForm } from "@/components/AddLineItemForm";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { CategoryWithLineItems } from "@/types";
import { useState } from "react";
import { View } from "react-native";

function stepFromData(
  totalIncome: number,
  categories: CategoryWithLineItems[] | null
): number {
  if (totalIncome <= 0) return 1;
  if (!categories || categories.length === 0) return 2;
  if (!categories[0].line_items?.length) return 3;
  return 4;
}

type BudgetSetupWizardProps = {
  householdId: string;
  userId: string;
  monthKey: string;
  income: { id: string; name: string | null; amount: number }[];
  totalIncome: number;
  categories: CategoryWithLineItems[] | null;
  totalPlanned: number;
  monthLabel: string;
  onComplete: () => void;
};

export function BudgetSetupWizard({
  householdId,
  userId,
  monthKey,
  totalIncome,
  categories,
  onComplete,
}: BudgetSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const stepFromDataValue = stepFromData(totalIncome, categories);
  const effectiveStep = Math.max(currentStep, stepFromDataValue);

  const firstCategory = categories?.[0];

  const advanceToStep2 = () => setCurrentStep(2);
  const advanceToStep3 = () => setCurrentStep(3);
  const advanceToStep4 = () => setCurrentStep(4);

  return (
    <View className="gap-6 pt-4">
      <StepIndicator currentStep={effectiveStep} totalSteps={4} />

      {effectiveStep === 1 && (
        <>
          <Card className="p-4">
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
                onSuccess={advanceToStep2}
              />
            </CardContent>
          </Card>
          <Button variant="link" onPress={onComplete}>
            <Text className="text-muted-foreground">Skip for now</Text>
          </Button>
        </>
      )}

      {effectiveStep === 2 && (
        <>
          <Card className="p-4">
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
                onSuccess={advanceToStep3}
              />
            </CardContent>
          </Card>
          <Button variant="link" onPress={onComplete}>
            <Text className="text-muted-foreground">Skip for now</Text>
          </Button>
        </>
      )}

      {effectiveStep === 3 && firstCategory && (
        <>
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-xl">Add a budget item</CardTitle>
              <Text className="text-sm text-muted-foreground">
                Now add specific items to your category. For example, &quot;Rent&quot;
                or &quot;Groceries&quot; with a planned amount.
              </Text>
            </CardHeader>
            <CardContent>
              <AddLineItemForm
                categoryId={firstCategory.id}
                categoryName={firstCategory.name ?? "Category"}
                monthKey={monthKey}
                userId={userId}
                onSuccess={advanceToStep4}
              />
            </CardContent>
          </Card>
          <Button variant="link" onPress={onComplete}>
            <Text className="text-muted-foreground">Skip for now</Text>
          </Button>
        </>
      )}

      {effectiveStep === 4 && (
        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-xl">You&apos;re all set!</CardTitle>
            <Text className="text-sm text-muted-foreground">
              Your first budget is ready. You can always come back here to
              tweak it.
            </Text>
          </CardHeader>
          <CardContent>
            <Button onPress={onComplete}>
              <Text>Let&apos;s Go</Text>
            </Button>
          </CardContent>
        </Card>
      )}
    </View>
  );
}
