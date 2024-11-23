import { motion } from "framer-motion";

interface Emotion {
  name: string;
  description: string;
  color: string;
  xp: number;
}

interface EmotionListProps {
  emotions: Emotion[];
  handleEmotionSelect: (emotion: Emotion) => void;
}

const EmotionList: React.FC<EmotionListProps> = ({ emotions, handleEmotionSelect }) => {
  return (
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
  );
};

export default EmotionList;
