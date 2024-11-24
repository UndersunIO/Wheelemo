import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#FFD700", "#4A90E2", "#FF4757", "#7158e2", "#FFA500", "#228B22"];

const Stats: React.FC = () => {
  const [emotionFrequency, setEmotionFrequency] = useState([]);
  const [emotionTimeline, setEmotionTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmotionData = () => {
      const rawHistory = localStorage.getItem("emotionHistory");

      if (!rawHistory) {
        console.warn("No emotionHistory found in localStorage");
        setLoading(false);
        return;
      }

      let history;
      try {
        history = JSON.parse(rawHistory);
      } catch (error) {
        console.error("Error parsing emotionHistory from localStorage", error);
        setLoading(false);
        return;
      }

      if (!Array.isArray(history)) {
        console.error("emotionHistory is not an array");
        setLoading(false);
        return;
      }

      const frequencyMap: Record<string, number> = {};
      const timelineData: Record<string, number> = {};

      history.forEach((entry) => {
        if (entry && entry.name) {
          // Fréquency emotion
          frequencyMap[entry.name] = (frequencyMap[entry.name] || 0) + 1;
        }
      });

      setEmotionFrequency(
        Object.entries(frequencyMap).map(([name, frequency]) => ({ name, frequency }))
      );

      setEmotionTimeline(
        Object.entries(timelineData).map(([date, frequency]) => ({ date, frequency }))
      );

      setLoading(false);
    };

    loadEmotionData();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Chargement des données...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-center text-3xl font-bold mb-8">📊 Statistiques des émotions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Histogram */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-center text-xl font-bold mb-4">Fréquence des émotions</h3>
          <div style={{ overflowX: "auto" }}>
  <ResponsiveContainer width={Math.max(emotionFrequency.length * 70, 300)} height={300}>
    <BarChart
      data={emotionFrequency}
      margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
      <XAxis
        dataKey="name"
        stroke="#fff"
        interval={0}
        angle={-45}
        textAnchor="end"
      />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Bar dataKey="frequency" fill="#FF69B4" />
    </BarChart>
  </ResponsiveContainer>
</div>

        </div>

        {/* Pie Chart */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-center text-xl font-bold mb-4">Répartition des émotions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionFrequency}
                dataKey="frequency"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#FF69B4"
                label={({ name }) => name} 
                labelLine={false}
              >
                {emotionFrequency.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

    
      </div>
    </div>
  );
};

export default Stats;
