import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { PaymentDistributionSlice } from "@/domain/entities/Payment";

interface PaymentDonutChartProps {
  data: PaymentDistributionSlice[];
  /** Called with the slice name when a segment is clicked (drill-down). */
  onSliceClick?: (name: string) => void;
}

export function PaymentDonutChart({ data, onSliceClick }: PaymentDonutChartProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100/80 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              onClick={
                onSliceClick
                  ? (_entry, index) => {
                      const slice = data[index];
                      if (slice) onSliceClick(slice.name);
                    }
                  : undefined
              }
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  style={{ cursor: onSliceClick ? "pointer" : "default", outline: "none" }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e5e5",
                borderRadius: "8px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PaymentDonutChart;
