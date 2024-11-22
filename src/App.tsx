import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Emotion {
  name: string;
  description: string;
  color: string;
  xp: number;
}

// based on Paul Ekman
const emotions: Emotion[] = [
  { name: "😊 Joie", description: "Un sentiment de bonheur et de légèreté.", color: "#FFD700", xp: 25 },
  { name: "😢 Tristesse", description: "Une sensation de vide ou de perte.", color: "#4A90E2", xp: 20 },
  { name: "😠 Colère", description: "Une montée d'énergie face à l'injustice.", color: "#FF4757", xp: 15 },
  { name: "😨 Peur", description: "Un sentiment d'insécurité ou de danger.", color: "#7158e2", xp: 30 },
  { name: "😧 Surprise", description: "Une sensation d'etonnement. ", color: "#ff6b81", xp: 35 },
  { name: "🤢 Degout", description: "Une sensation de rejet envers un evenement.", color: "#2ed573", xp: 40 },
  { name: "😖 Mepris", description: "Une sensation de dégoût ou de frustration.", color: "#ff6b81", xp: 35 },
  { name: "Ne pas savoir", description: "N'avoir aucune idée sur ce que l'on ressent.", color: "#71d5", xp: 40 },
];

const EmotionBoard = () => {
  const getInitialValue = (key: string, defaultValue: string) => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? parseInt(storedValue) : parseInt(defaultValue);
  };

  const [score, setScore] = useState(() => getInitialValue("emotionBoardScore", "0"));
  const [level, setLevel] = useState(() => getInitialValue("emotionBoardLevel", "1"));
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [currentSection, setCurrentSection] = useState("emotions");

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    const newScore = score + emotion.xp;

    // Level and score update 
    setScore(newScore);
    if (newScore >= level * 100) {
      setLevel((prevLevel) => {
        const newLevel = prevLevel + 1;
        localStorage.setItem("emotionBoardLevel", newLevel.toString());
        return newLevel;
      });
    }

    // Save score to local storage
    localStorage.setItem("emotionBoardScore", newScore.toString());
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-800 p-4 rounded-r-lg shadow-lg flex flex-col gap-4">
          <h2 className="text-center text-xl font-bold">📊 EmotionBoard </h2>
          <ul className="flex flex-col gap-3">
            <li
              onClick={() => setCurrentSection("emotions")}
              className={`cursor-pointer p-3 rounded-lg transition-all ${
                currentSection === "emotions" ? "bg-purple-600" : "hover:bg-gray-700"
              }`}
            >
               🥰 Les émotions
            </li>
            <li
              onClick={() => setCurrentSection("breathing")}
              className={`cursor-pointer p-3 rounded-lg transition-all ${
                currentSection === "breathing" ? "bg-purple-600" : "hover:bg-gray-700"
              }`}
            >
              🌬 Exercice de respiration
            </li>
            <li
              onClick={() => setCurrentSection("quiz")}
              className={`cursor-pointer p-3 rounded-lg transition-all ${
                currentSection === "quiz" ? "bg-purple-600" : "hover:bg-gray-700"
              }`}
            >
              ❓ Quiz
            </li>
            <li
              onClick={() => setCurrentSection("history")}
              className={`cursor-pointer p-3 rounded-lg transition-all ${
                currentSection === "history" ? "bg-purple-600" : "hover:bg-gray-700"
              }`}
            >
              📜 Historique
            </li>
          </ul>
        </div>

        {/* Main Content nav emotion  */}
        <div className="flex-1 p-6">
          {currentSection === "emotions" && (
            <div>
              <h2 className="text-center text-2xl font-bold mb-6">🔭 Explorer les émotions</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {emotions.map((emotion) => (
                  <motion.div
                    key={emotion.name}
                    className="cursor-pointer p-4 bg-opacity-90 rounded-lg hover:bg-opacity-100 transition-all"
                    style={{
                      background: `linear-gradient(45deg, ${emotion.color}, ${emotion.color}dd)`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleEmotionSelect(emotion)}
                  >
                    <span className="text-lg font-bold">{emotion.name}</span>
                  </motion.div>
                ))}
              </div>
              {selectedEmotion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg text-center"
                >
                  <Sparkles className="text-yellow-400 w-8 h-8 mb-4" />
                  <h2 className="text-2xl font-bold mb-4">{selectedEmotion.name}</h2>
                  <p className="text-gray-300 text-lg mb-4">{selectedEmotion.description}</p>
                  <span className="text-yellow-400 text-lg font-semibold">+{selectedEmotion.xp} XP</span>
                </motion.div>
              )}
            </div>
          )}

          {/* Othercomponents needs to be litte component */}
          {currentSection === "breathing" && (
            <div>
              <h2 className="text-center text-2xl font-bold mb-6">🌬 Exercice de respiration</h2>
              <p className="text-center text-lg text-gray-300">
                Prends un moment pour respirer profondément. Inspire 4 secondes, retiens ta respiration 4 secondes, expire
                4 secondes.
              </p>
              <div className="mt-8 flex justify-center">
                <motion.div
                  className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Respire
                </motion.div>
              </div>
            </div>
          )}

          {currentSection === "quiz" && (
            <div>
              <h2 className="text-center text-2xl font-bold mb-6">❓ Quiz</h2>
              <p className="text-center text-lg text-gray-300">Quiz a venir.</p>
            </div>
          )}

          {currentSection === "history" && (
            <div>
              <h2 className="text-center text-2xl font-bold mb-6">📜 Historique</h2>
              <p className="text-center text-lg text-gray-300">L'historique des émotions selon le jour, l'heure apparaîtra ici.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bar Score */}
      <div className="w-full bg-gray-800 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆 Niveau {level}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟 {score} XP</span>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
          <motion.div
            className="bg-purple-500 h-4 rounded-full"
            style={{ width: `${(score % 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(score % 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmotionBoard;
