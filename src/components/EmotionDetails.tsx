import { motion } from "framer-motion";

interface Emotion {
  name: string;
  description: string;
  color: string;
  xp: number;
}

interface EmotionDetailsProps {
  selectedEmotion: Emotion | null;
}

const EmotionDetails: React.FC<EmotionDetailsProps> = ({ selectedEmotion }) => {
  if (!selectedEmotion) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg text-center"
    >
      <h2 className="text-2xl font-bold mb-4">{selectedEmotion.name}</h2>
      <p className="text-gray-300 text-lg mb-4">{selectedEmotion.description}</p>
      <span className="text-yellow-400 text-lg font-semibold">+{selectedEmotion.xp} XP</span>
    </motion.div>
  );
};

export default EmotionDetails;
