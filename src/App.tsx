import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import XPBar from "./components/XPBar";
import Emotions from "./pages/Emotions";
import BreathingSession from "./pages/Breathing";
import Quiz from "./pages/Quiz";
import History from "./pages/History";

const App = () => {
  const getInitialValue = (key: string, defaultValue: string) => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? parseInt(storedValue) : parseInt(defaultValue);
  };

  const [score, setScore] = useState(() => getInitialValue("emotionBoardScore", "0"));
  const [level, setLevel] = useState(() => getInitialValue("emotionBoardLevel", "1"));

  const handleXPUpdate = (xp: number) => {
    const newScore = score + xp;

    setScore(newScore);
    if (newScore >= level * 100) {
      setLevel((prevLevel) => {
        const newLevel = prevLevel + 1;
        localStorage.setItem("emotionBoardLevel", newLevel.toString());
        return newLevel;
      });
    }
    localStorage.setItem("emotionBoardScore", newScore.toString());
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Emotions onXPUpdate={handleXPUpdate} />} />
              <Route path="/breathing" element={<BreathingSession />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
        </div>
        <XPBar score={score} level={level} />
      </div>
    </Router>
  );
};

export default App;
