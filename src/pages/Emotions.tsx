import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmotionList from "../components/EmotionList";
import EmotionDetails from "../components/EmotionDetails";

interface Emotion {
  name: string;
  description: string;
  color: string;
  xp: number;
}

const emotions: Emotion[] = [
  // positives
  { name: "😊 Joie", description: "Un sentiment de bonheur et de légèreté.", color: "#FFD700", xp: 25 }, // Resté jaune accessible
  { name: "😃 Enthousiasme", description: "Un élan d'énergie et de motivation.", color: "#F4C300", xp: 35 }, // Légèrement atténué
  { name: "🤩 Excitation", description: "Une sensation intense d'attente positive.", color: "#F4AF00", xp: 35 },
  { name: "🏅 Fierté", description: "Un sentiment de satisfaction personnelle.", color: "#E0A800", xp: 30 }, // Pour contraste
  { name: "🌈 Espoir", description: "Un sentiment positif face à l'avenir.", color: "#5ABF41", xp: 40 }, // Vert plus sombre
  { name: "😌 Soulagement", description: "Un apaisement après une période de stress.", color: "#4A9F37", xp: 30 },
  { name: "🤗 Compassion", description: "Un sentiment de préoccupation pour autrui.", color: "#FF6394", xp: 30 }, // Plus de contraste sur rose

  // negatives
  { name: "😢 Tristesse", description: "Une sensation de vide ou de perte.", color: "#4579B9", xp: 20 }, // Bleu accessible
  { name: "😟 Anxiété", description: "Une inquiétude persistante face à l'incertain.", color: "#2C5A9B", xp: 30 }, // Bleu plus profond
  { name: "😠 Colère", description: "Une montée d'énergie face à l'injustice.", color: "#CC3D4D", xp: 15 }, // Rouge atténué
  { name: "😤 Frustration", description: "Un sentiment d'agacement dû à un obstacle.", color: "#B53041", xp: 15 },
  { name: "😔 Culpabilité", description: "Un sentiment de responsabilité pour un tort commis.", color: "#8C252E", xp: 20 },
  { name: "😕 Confusion", description: "Un sentiment d'incertitude ou de perplexité.", color: "#6A46A3", xp: 15 }, // Violet sombre mais contrasté

  // neutral
  { name: "😧 Surprise", description: "Une sensation d'étonnement.", color: "#E59A20", xp: 35 }, // Orange plus sombre
  { name: "😴 Ennui", description: "Une sensation de lassitude ou de désintérêt.", color: "#878787", xp: 10 }, // Gris intermédiaire

  // secondary
  { name: "❤️ Amour", description: "Un sentiment profond de connexion et d'affection.", color: "#D93070", xp: 50 }, // Rouge-rose foncé
  { name: "😶 Neutre", description: "Un état d'équilibre ou d'absence d'émotion forte.", color: "#808080", xp: 5 }, // Gris neutre
  { name: "😨 Peur", description: "Un sentiment d'insécurité ou de danger.", color: "#524EA1", xp: 30 }, // Violet plus profond pour contraste
];


interface EmotionsProps {
  onXPUpdate: (xp: number) => void;
}

const Emotions: React.FC<EmotionsProps> = ({ onXPUpdate }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const navigate = useNavigate();

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    onXPUpdate(emotion.xp);

    // Add i n history with a timestamp 
    const currentHistory = JSON.parse(localStorage.getItem("emotionHistory") || "[]");
    const newEntry = {
      name: emotion.name,
      description: emotion.description,
      color: emotion.color,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("emotionHistory", JSON.stringify([...currentHistory, newEntry]));
  };

  const handleQuizRedirect = () => {
    navigate("/quiz");
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold mb-6">🔭 Explorer les émotions</h2>
      <EmotionList emotions={emotions} handleEmotionSelect={handleEmotionSelect} />
      <EmotionDetails selectedEmotion={selectedEmotion} />

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleQuizRedirect}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
        >
          Je ressens autre chose
        </button>
      </div>
    </div>
  );
};

export default Emotions;
