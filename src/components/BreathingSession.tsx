import { motion } from "framer-motion";

const BreathingSession = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold mb-6">🌬 Exercice de respiration</h2>
      <p className="text-lg text-gray-300 mb-6">
        Prends un moment pour respirer profondément. Inspire 4 secondes, retiens ta respiration 4 secondes, expire 4 secondes.
      </p>
      <div className="flex justify-center items-center">
        <motion.div
          className="w-32 h-32 md:w-48 md:h-48 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold"
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Respire
        </motion.div>
      </div>
    </div>
  );
};

export default BreathingSession;
