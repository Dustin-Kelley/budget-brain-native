import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import type { CategoryWithLineItems } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { View } from "react-native";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";

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

const UNALLOCATED_COLOR = "#d1d5db"; // gray-300

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

type BudgetAllocationChartProps = {
  categories: CategoryWithLineItems[];
  totalIncome: number;
};

export function BudgetAllocationChart({
  categories,
  totalIncome,
}: BudgetAllocationChartProps) {
  if (totalIncome <= 0 || categories.length === 0) return null;

  const categoryData = categories.map((cat, i) => {
    const planned = cat.line_items.reduce(
      (sum, li) => sum + (li.planned_amount ?? 0),
      0
    );
    return {
      id: cat.id,
      name: cat.name ?? "Category",
      planned,
      percentage: (planned / totalIncome) * 100,
      color: COLORS[i % COLORS.length],
    };
  }).filter((c) => c.planned > 0);

  if (categoryData.length === 0) return null;

  const totalPlanned = categoryData.reduce((sum, c) => sum + c.planned, 0);
  const allocatedPct = Math.min((totalPlanned / totalIncome) * 100, 100);
  const unallocated = Math.max(totalIncome - totalPlanned, 0);

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;

  let currentAngle = 0;
  const slices = categoryData.map((cat) => {
    const angle = (cat.planned / totalIncome) * 360;
    const clampedAngle = Math.min(angle, 360 - currentAngle);
    const startAngle = currentAngle;
    currentAngle += clampedAngle;
    return { ...cat, startAngle, endAngle: currentAngle, angle: clampedAngle };
  });

  if (unallocated > 0 && currentAngle < 360) {
    slices.push({
      id: "unallocated",
      name: "Unallocated",
      planned: unallocated,
      percentage: (unallocated / totalIncome) * 100,
      color: UNALLOCATED_COLOR,
      startAngle: currentAngle,
      endAngle: 360,
      angle: 360 - currentAngle,
    });
  }

  return (
    <Card className="gap-0 p-4">
      <Text className="mb-1 font-semibold text-gray-800">
        Budget Allocation
      </Text>
      <Text className="mb-3 text-xs text-muted-foreground">
        Planned budget per category as a percentage of total income
      </Text>
      <View className="items-center">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G>
            {slices.map((slice) =>
              slice.angle >= 359.99 ? (
                <Circle
                  key={slice.id}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={slice.color}
                />
              ) : (
                <Path
                  key={slice.id}
                  d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
                  fill={slice.color}
                />
              )
            )}
          </G>
          <Circle cx={cx} cy={cy} r={50} fill="white" />
          <SvgText
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            fontSize={24}
            fontWeight="bold"
            fill="#1f2937"
          >
            {`${Math.round(allocatedPct)}%`}
          </SvgText>
        </Svg>
      </View>
      <View className="mt-3 gap-2">
        {slices.map((slice) => (
          <View
            key={slice.id}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-2">
              <View
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <Text className="text-sm text-gray-700">{slice.name}</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-gray-500">
                {Math.round(slice.percentage)}%
              </Text>
              <Text className="text-sm font-medium text-gray-800">
                {formatCurrency(slice.planned)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
