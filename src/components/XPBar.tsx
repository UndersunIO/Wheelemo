import { motion } from "framer-motion";

interface XPBarProps {
  score: number;
  level: number;
}

const XPBar: React.FC<XPBarProps> = ({ score, level }) => {
  return (
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
  );
};

export default XPBar;
