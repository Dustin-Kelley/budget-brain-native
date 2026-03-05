import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import type { CategorySpent } from "@/lib/queries/getSpentByCategory";
import { formatCurrency } from "@/lib/utils";
import { View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#14b8a6", // teal
  "#6366f1", // indigo
];

type CategoryPieChartProps = {
  categorySpent: CategorySpent[];
};

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export function CategoryPieChart({ categorySpent }: CategoryPieChartProps) {
  if (categorySpent.length === 0) return null;

  const total = categorySpent.reduce((sum, c) => sum + c.spent, 0);
  if (total === 0) return null;

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;

  let currentAngle = 0;
  const slices = categorySpent.map((cat, i) => {
    const angle = (cat.spent / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    return {
      ...cat,
      color: COLORS[i % COLORS.length],
      startAngle,
      endAngle: currentAngle,
      angle,
    };
  });

  return (
    <Card className="gap-0 p-4">
      <Text className="mb-3 font-semibold text-gray-900">
        Spending by Category
      </Text>
      <View className="items-center">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G>
            {slices.map((slice) =>
              slice.angle >= 359.99 ? (
                <Circle
                  key={slice.category_id}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={slice.color}
                />
              ) : (
                <Path
                  key={slice.category_id}
                  d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
                  fill={slice.color}
                />
              )
            )}
          </G>
        </Svg>
      </View>
      <View className="mt-3 gap-2">
        {slices.map((slice) => (
          <View
            key={slice.category_id}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-2">
              <View
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <Text className="text-sm text-gray-700">
                {slice.category_name ?? "Category"}
              </Text>
            </View>
            <Text className="text-sm font-medium text-gray-900">
              {formatCurrency(slice.spent)}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
