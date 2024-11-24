import { useState } from "react";

interface Emotion {
  name: string;
  description: string;
  color: string;
  suggestions: string[];
}

const emotions: Emotion[] = [
  {
    name: "😊 Joie",
    description: "Un sentiment de bonheur et de légèreté.",
    color: "#FFD700",
    suggestions: ["Partage cette joie avec un proche.", "Écris ce qui te rend heureux.", "Prends un moment pour sourire."],
  },
  {
    name: "😢 Tristesse",
    description: "Une sensation de vide ou de perte.",
    color: "#4A90E2",
    suggestions: ["Prends un moment pour pleurer si nécessaire.", "Parle à quelqu’un en qui tu as confiance.", "Écoute une musique apaisante."],
  },
  {
    name: "😠 Colère",
    description: "Une montée d'énergie face à l'injustice.",
    color: "#FF4757",
    suggestions: ["Respire profondément plusieurs fois.", "Va marcher pour te défouler.", "Exprime calmement ce qui t'a frustré."],
  },
  {
    name: "😨 Peur",
    description: "Un sentiment d'insécurité ou de danger.",
    color: "#7158e2",
    suggestions: ["Note ce qui te fait peur pour mieux l'analyser.", "Rappelle-toi que c'est temporaire.", "Essaie un exercice de respiration."],
  },
  {
    name: "😧 Surprise",
    description: "Une sensation d'étonnement.",
    color: "#FFA500",
    suggestions: ["Réfléchis calmement à ce qui s'est passé.", "Partage ton étonnement avec quelqu’un.", "Prends un moment pour t'adapter au changement."],
  },
];

const questions = [
  {
    id: 1,
    question: "Ton ressenti est plutôt ?",
    options: ["Joyeux", "Triste", "Neutre", "En colère"],
  },
  {
    id: 2,
    question: "Te sens-tu calme ou agité ?",
    options: ["Calme", "Agité"],
  },
  {
    id: 3,
    question: "Cette émotion est-elle forte ou légère ?",
    options: ["Forte", "Légère"],
  },
];

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<Emotion | null>(null);

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    let calculatedEmotion: Emotion | null = null;

    if (answers.includes("Triste") || answers.includes("Neutre")) {
      calculatedEmotion = emotions.find((emotion) => emotion.name === "😢 Tristesse")!;
    } else if (answers.includes("En colère")) {
      calculatedEmotion = emotions.find((emotion) => emotion.name === "😠 Colère")!;
    } else if (answers.includes("Joyeux") && answers.includes("Calme")) {
      calculatedEmotion = emotions.find((emotion) => emotion.name === "😊 Joie")!;
    } else {
      calculatedEmotion = emotions.find((emotion) => emotion.name === "😧 Surprise")!;
    }

    setResult(calculatedEmotion);

    // Add emotion to history 
    if (calculatedEmotion) {
      const currentHistory = JSON.parse(localStorage.getItem("emotionHistory") || "[]");
      const newEntry = {
        name: calculatedEmotion.name,
        description: calculatedEmotion.description,
        color: calculatedEmotion.color,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("emotionHistory", JSON.stringify([...currentHistory, newEntry]));
    }
  };

  const restartQuiz = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {result ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Tu ressens actuellement :</h2>
          <div
            className="inline-block p-4 rounded-lg"
            style={{
              backgroundColor: result.color,
              color: "#fff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <span className="text-xl font-bold">{result.name}</span>
          </div>
          <p className="text-gray-300 text-lg mt-4">{result.description}</p>
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Suggestions d'actions :</h3>
            <ul className="list-disc list-inside text-gray-400">
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={restartQuiz}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
          >
            Recommencer
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-6">{questions[step].question}</h2>
          <div className="grid grid-cols-2 gap-4">
            {questions[step].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
