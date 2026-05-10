import { motion } from "framer-motion";
import {
  BarChart,
  PieChart,
  FileText,
  Activity,
  ImageUp,
  MoveUpRight,
  Percent,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import clsx from "clsx";
import { useAnalysis } from "../utils/AnalysisContext";
import { useEffect, useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const buttons = [
  { id: "bar", icon: BarChart, color: "bg-blue-500", label: "Distribution" },
  { id: "pie", icon: PieChart, color: "bg-green-500", label: "Categories" },
  { id: "stats", icon: Activity, color: "bg-yellow-500", label: "Statistics" },
  { id: "text", icon: FileText, color: "bg-purple-500", label: "Details" },
];

export function DataVisualizer() {
  const [data, setData] = useState<any>(null);

  const [activeView, setActiveView] = useState("bar");

  const { analysisData } = useAnalysis();

  useEffect(() => {
    if (analysisData) {
      setData({
        barData: [
          {
            name: "Normal",
            value: Math.round((1 - analysisData.accuracy) * 100),
          },
          { name: "PTB", value: Math.round(analysisData.accuracy * 100) },
        ],
        pieData: [
          {
            name: "Normal",
            value: Math.round((1 - analysisData.accuracy) * 100),
          },
          { name: "PTB", value: Math.round(analysisData.accuracy * 100) },
        ],
        stats: {
          "Confidence PTB Score": analysisData.loss * 100,
          "Confidence Normal Score": Math.round(analysisData.accuracy * 100),
        },
        description: analysisData.message,
      });
    }
  }, [analysisData]);

  if (analysisData == null) {
    return (
      <div className="w-2/3 flex items-center justify-center gap-2 bg-gray-800 rounded-lg">
        <ImageUp className={clsx("w-6 h-6 mb-1 text-white")} />
        <p className="text-white">Upload an image to view analysis</p>
        <MoveUpRight className={clsx("w-6 h-6 mb-1 text-white")} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-2/3 bg-gray-800 rounded-lg p-2">
      <div className="flex-1 overflow-hidden">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="h-full flex items-center justify-center"
        >
          {activeView === "bar" && (
            <RechartsBarChart
              width={600}
              height={400}
              data={data?.barData || []}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  borderColor: "#444",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
                cursor={{ fill: "#0f172a" }}
              />
              <Bar dataKey="value" fill="#00C49F" />
            </RechartsBarChart>
          )}
          {activeView === "pie" && (
            <RechartsPieChart width={600} height={400}>
              <Pie
                data={data?.pieData || []}
                cx={300}
                cy={200}
                label={({ name, value, x, y }) => (
                  <g>
                    {/* Background rectangle for label */}
                    <rect
                      x={x - 50}
                      y={y - 12}
                      width={100}
                      height={24}
                      fill="white"
                      stroke="transparent"
                      rx={12} // Rounded corners
                    />
                    {/* Text label */}
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fontSize: "12px",
                        fill: "#1E40AF", // Sky-800 color
                        fontWeight: "bold",
                      }}
                    >
                      {`${name}: ${value} %`}
                    </text>
                  </g>
                )}
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {(data?.pieData || []).map((_entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          )}
          {activeView === "stats" && (
            <div className="grid grid-cols-2 gap-4 p-4">
              {Object.entries(data?.stats || {}).map(([key, value]) => (
                <div key={key} className="bg-gray-900 p-4 rounded-lg">
                  <h3 className="text-white text-sm">{key}</h3>
                  <p className="text-2xl font-bold text-white flex items-center gap-2">
                    {value as string} <Percent size={16} />
                  </p>
                </div>
              ))}
            </div>
          )}
          {activeView === "text" && (
            <div className="max-w-2xl p-4">
              <p className="text-white leading-relaxed">{data?.description}</p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="flex justify-center gap-4 mt-6 bg-gray-900 rounded py-2">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => setActiveView(button.id)}
            className={clsx(
              "flex flex-col items-center p-3 rounded-lg transition-all w-1/12",
              activeView === button.id
                ? button.color
                : "bg-gray-600 hover:bg-gray-700"
            )}
          >
            <button.icon
              className={clsx(
                "w-6 h-6 mb-1",
                activeView === button.id ? "text-white" : "text-gray-50"
              )}
            />
            <span
              className={clsx(
                "text-sm",
                activeView === button.id ? "text-white" : "text-gray-50"
              )}
            >
              {button.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
