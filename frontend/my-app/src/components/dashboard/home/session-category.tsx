import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import {
  fetchSessionCategoryCount,
  SessionCategoryCount,
} from "@/service/session/getSessionCategoryCount";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const transformDataForChart = (data: SessionCategoryCount) => {
  return Object.entries(data)
    .map(([key, value]) => ({
      category: key
        .replace(/Count$/, "")
        .replace(/([A-Z])/g, " $1")
        .trim(),
      count: value,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count in descending order
};

// Color palette for bars
const COLORS = [
  "#059669",
  "#10B981",
  "#34D399",
  "#6EE7B7",
  "#A7F3D0",
  "#047857",
  "#065F46",
  "#064E3B",
  "#022C22",
  "#047857",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-md shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        <p className="text-green-600 font-bold">{`Sessions: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SessionCategoryChartPage = () => {
  const [chartData, setChartData] = useState<
    { category: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const rawData = await fetchSessionCategoryCount(accessToken);
        const formattedData = transformDataForChart(rawData);
        setChartData(formattedData);
        setError(null);
      } catch (error) {
        console.error("Failed to load session category data", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [accessToken]);

  return (
    <div className="md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto rounded-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700 text-center">
            Session Categories
          </h1>
          <p className="text-gray-500 text-center mt-2">
            Distribution of sessions by category
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-3 rounded-md text-sm"
            >
              Retry
            </button>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            No category data available
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center shadow-sm">
                  <p className="text-gray-600 text-sm">Total Sessions</p>
                  <p className="text-2xl font-bold text-green-700">
                    {chartData.reduce((sum, item) => sum + item.count, 0)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center shadow-sm">
                  <p className="text-gray-600 text-sm">Top Category</p>
                  <p className="text-2xl font-bold text-green-700">
                    {chartData.length > 0 ? chartData[0].category : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="category"
                    angle={-45}
                    textAnchor="end"
                    tick={{ fill: "#4b5563", fontSize: 12 }}
                    interval={0}
                    height={80}
                    tickMargin={10}
                  />
                  <YAxis
                    tick={{ fill: "#4b5563" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ paddingBottom: "20px" }}
                  />
                  <Bar
                    dataKey="count"
                    name="Number of Sessions"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Session Category Details
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                        Category
                      </th>
                      <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                        Count
                      </th>
                      <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => {
                      const totalSessions = chartData.reduce(
                        (sum, item) => sum + item.count,
                        0
                      );
                      const percentage = (
                        (item.count / totalSessions) *
                        100
                      ).toFixed(1);

                      return (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <td className="py-2 px-4 border-b text-sm text-gray-900">
                            {item.category}
                          </td>
                          <td className="py-2 px-4 border-b text-sm text-gray-900">
                            {item.count}
                          </td>
                          <td className="py-2 px-4 border-b text-sm text-gray-900">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionCategoryChartPage;
