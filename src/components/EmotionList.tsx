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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {emotions.map((emotion) => (
        <motion.div
          key={emotion.name}
          className="cursor-pointer p-4 rounded-lg transition-all neon-hover"
          style={{
            background: `linear-gradient(45deg, ${emotion.color}, ${emotion.color}dd)`,
            boxShadow: `0 4px 12px ${emotion.color}80`,
          }}
          whileHover={{
            scale: 1.02,
          }}
          onClick={() => handleEmotionSelect(emotion)}
        >
          <span
            className="text-lg font-bold neon-text"
            style={{
              color: "#fff",
              textShadow: `0 0 8px ${emotion.color}, 0 0 16px ${emotion.color}, 0 0 24px ${emotion.color}`,
            }}
          >
            {emotion.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default EmotionList;
