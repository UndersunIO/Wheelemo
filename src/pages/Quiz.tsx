import { useState, useEffect } from "react";

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
    color: "#ff6b81",
    suggestions: ["Réfléchis calmement à ce qui s'est passé.", "Partage ton étonnement avec quelqu’un.", "Prends un moment pour t'adapter au changement."],
  },
  {
    name: "🤢 Dégout",
    description: "Une sensation de rejet envers un événement.",
    color: "#2ed573",
    suggestions: ["Éloigne-toi de ce qui te dégoûte.", "Rappelle-toi que c’est une émotion temporaire.", "Essaie de trouver un élément positif."],
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
  const [history, setHistory] = useState<Emotion[]>([]); // Historique 

  // load history
  useEffect(() => {
    const savedHistory = localStorage.getItem("emotionHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    if (step < questions.length - 1) {
      setStep(step + 1); // next question
    } else {
      calculateResult(); 
    }
  };

  const calculateResult = () => {
    let calculatedEmotion: Emotion | null = null;

    if (answers.includes("Triste") || answers.includes("Fatigué")) {
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
    const updatedHistory = [...history, calculatedEmotion!];
    setHistory(updatedHistory);

    // Save history to localStorage
    localStorage.setItem("emotionHistory", JSON.stringify(updatedHistory));
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
          <div className="inline-block p-4 rounded-lg bg-purple-600 text-white shadow-lg"> 
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

      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-lg font-bold mb-4">Historique des émotions :</h3>
        {history.length > 0 ? (
          <ul className="list-disc list-inside text-gray-400">
            {history.map((emotion, index) => (
              <li key={index}>{emotion.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Aucune émotion enregistrée pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default Quiz;
