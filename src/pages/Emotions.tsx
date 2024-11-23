import React, { useState } from "react";
import EmotionList from "../components/EmotionList";
import EmotionDetails from "../components/EmotionDetails";

interface Emotion {
  name: string;
  description: string;
  color: string;
  xp: number;
}

const emotions: Emotion[] = [
  { name: "😊 Joie", description: "Un sentiment de bonheur et de légèreté.", color: "#FFD700", xp: 25 },
  { name: "😢 Tristesse", description: "Une sensation de vide ou de perte.", color: "#4A90E2", xp: 20 },
  { name: "😠 Colère", description: "Une montée d'énergie face à l'injustice.", color: "#FF4757", xp: 15 },
  { name: "😨 Peur", description: "Un sentiment d'insécurité ou de danger.", color: "#7158e2", xp: 30 },
];

interface EmotionsProps {
  onXPUpdate: (xp: number) => void;
}

const Emotions: React.FC<EmotionsProps> = ({ onXPUpdate }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    onXPUpdate(emotion.xp);
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-6">🔭 Explorer les émotions</h2>
      <EmotionList emotions={emotions} handleEmotionSelect={handleEmotionSelect} />
      <EmotionDetails selectedEmotion={selectedEmotion} />
    </div>
  );
};

export default Emotions;
