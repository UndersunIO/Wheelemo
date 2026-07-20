import { useRef, useState } from "react";
import { ArrowRight, Check, RefreshCw, X } from "lucide-react";
import { Link } from "react-router-dom";

interface QuizProps {
  onXPUpdate: (xp: number) => void;
}

const questions = [
  {
    eyebrow: "Nommer avec précision",
    situation: "« La réunion a été déplacée trois fois. J'ai la mâchoire serrée et envie de tout laisser tomber. »",
    question: "Quel mot décrit le mieux l'expérience immédiate ?",
    options: ["Frustration", "Culpabilité", "Gratitude"],
    answer: "Frustration",
    explanation: "L'obstacle répété bloque un objectif et crée une tension : c'est le signal typique de la frustration.",
  },
  {
    eyebrow: "Séparer fait et interprétation",
    situation: "Tu n'as pas reçu de réponse à ton message depuis hier.",
    question: "Quelle phrase part d'un fait observable ?",
    options: [
      "Tu m'ignores encore.",
      "Mon message est resté sans réponse depuis hier.",
      "Tu ne respectes jamais mon temps.",
    ],
    answer: "Mon message est resté sans réponse depuis hier.",
    explanation: "Un fait pourrait être filmé ou daté. « Ignorer » et « ne jamais respecter » ajoutent une intention ou un jugement.",
  },
  {
    eyebrow: "Lire le besoin",
    situation: "« Je suis anxieux·se avant cette présentation, même si je l'ai préparée. »",
    question: "Quel besoin mérite probablement le plus d'attention ?",
    options: ["Sécurité et préparation", "Célébration", "Aventure"],
    answer: "Sécurité et préparation",
    explanation: "L'anxiété anticipe un risque. Vérifier les repères disponibles et chercher du soutien peut rendre la situation plus praticable.",
  },
  {
    eyebrow: "Formuler une demande",
    situation: "Tu te sens dépassé·e par plusieurs tâches urgentes.",
    question: "Quelle demande est la plus concrète et négociable ?",
    options: [
      "Il faut que tout le monde fasse un effort.",
      "Arrêtez de me mettre la pression.",
      "Peux-tu m'aider 15 minutes à classer ces trois priorités ?",
    ],
    answer: "Peux-tu m'aider 15 minutes à classer ces trois priorités ?",
    explanation: "La demande précise une action, une durée et laisse à l'autre la possibilité de répondre.",
  },
];

const Quiz = ({ onXPUpdate }: QuizProps) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [validated, setValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const rewarded = useRef(false);
  const current = questions[index];
  const isCorrect = selected === current.answer;

  const validate = () => {
    if (!selected || validated) return;
    setValidated(true);
    if (isCorrect) setScore((value) => value + 1);
  };

  const next = () => {
    if (index === questions.length - 1) {
      setDone(true);
      if (!rewarded.current) {
        onXPUpdate(20);
        rewarded.current = true;
      }
      return;
    }
    setIndex((value) => value + 1);
    setSelected("");
    setValidated(false);
  };

  const restart = () => {
    setIndex(0);
    setSelected("");
    setValidated(false);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <section className="flow-page flow-page--narrow quiz-complete">
        <div className="completion-mark"><Check size={28} /></div>
        <span className="eyebrow">Micro-apprentissage terminé · +20 XP</span>
        <h1>{score}/4 repères consolidés</h1>
        <p className="page-lead">
          {score >= 3
            ? "Tu distingues déjà bien les étapes. Le meilleur entraînement maintenant : les appliquer à une situation réelle."
            : "Rejoue la séquence une fois, puis applique-la à un ressenti réel : c'est l'usage qui fixe les repères."}
        </p>
        <div className="score-ring" style={{ "--score": `${(score / questions.length) * 360}deg` } as React.CSSProperties}>
          <span><strong>{Math.round((score / questions.length) * 100)}%</strong><small>de réussite</small></span>
        </div>
        <div className="completion-actions">
          <Link className="sl-button sl-button--primary" to="/">Faire mon check-in</Link>
          <button className="sl-button" type="button" onClick={restart}><RefreshCw size={17} /> Rejouer</button>
        </div>
      </section>
    );
  }

  return (
    <section className="flow-page training-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Entraînement actif · 3 min</span>
          <h1>Muscler ton vocabulaire émotionnel</h1>
          <p className="page-lead">Une situation, un choix, un retour immédiat. L'objectif n'est pas la note : c'est le réflexe.</p>
        </div>
        <span className="question-count">{index + 1} / {questions.length}</span>
      </header>

      <div className="quiz-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>

      <article className="quiz-card">
        <span className="eyebrow">{current.eyebrow}</span>
        <blockquote>{current.situation}</blockquote>
        <h2>{current.question}</h2>
        <div className="quiz-options">
          {current.options.map((option, optionIndex) => {
            const answeredCorrectly = validated && option === current.answer;
            const answeredWrongly = validated && selected === option && !isCorrect;
            return (
              <button
                className={`${selected === option ? "selected" : ""} ${answeredCorrectly ? "correct" : ""} ${answeredWrongly ? "wrong" : ""}`}
                type="button"
                key={option}
                disabled={validated}
                onClick={() => setSelected(option)}
              >
                <span>{String.fromCharCode(65 + optionIndex)}</span>
                <strong>{option}</strong>
                {answeredCorrectly && <Check size={18} />}
                {answeredWrongly && <X size={18} />}
              </button>
            );
          })}
        </div>

        {validated && (
          <div className={`answer-feedback ${isCorrect ? "correct" : "retry"}`} role="status">
            <span>{isCorrect ? <Check size={18} /> : <RefreshCw size={18} />}</span>
            <div><strong>{isCorrect ? "Oui, c'est le bon repère." : "Pas tout à fait — voici le repère."}</strong><p>{current.explanation}</p></div>
          </div>
        )}

        <div className="quiz-actions">
          {!validated ? (
            <button className="sl-button sl-button--primary" type="button" disabled={!selected} onClick={validate}>Vérifier ma réponse</button>
          ) : (
            <button className="sl-button sl-button--primary" type="button" onClick={next}>
              {index === questions.length - 1 ? "Voir mon résultat" : "Question suivante"} <ArrowRight size={17} />
            </button>
          )}
        </div>
      </article>
    </section>
  );
};

export default Quiz;
