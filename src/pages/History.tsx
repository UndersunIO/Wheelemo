import React, { useEffect, useState } from "react";

interface EmotionHistoryEntry {
  name: string;
  timestamp: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<EmotionHistoryEntry[]>([]);

  useEffect(() => {
    // load history  from localStorage
    const rawHistory = localStorage.getItem("emotionHistory");
    if (!rawHistory) {
      console.warn("No emotionHistory found in localStorage");
      return;
    }

    try {
      const parsedHistory: EmotionHistoryEntry[] = JSON.parse(rawHistory);
      if (Array.isArray(parsedHistory)) {
        setHistory(parsedHistory);
      } else {
        console.error("emotionHistory is not an VALIDATE array");
      }
    } catch (error) {
      console.error("Error parsing emotionHistory from localStorage", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white p-6">
      <h2 className="text-center text-3xl font-bold mb-8">📜 Historique des émotions</h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-400">Aucune donnée dans l'historique pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-200">
            <thead>
              <tr className="bg-gray-800">
                <th className="py-3 px-4">Émotion</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                  } hover:bg-gray-600`}
                >
                  <td className="py-3 px-4">{entry.name}</td>
                  <td className="py-3 px-4">
                    {new Date(entry.timestamp).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
