import { Trophy } from "lucide-react";

interface XPBarProps {
  score: number;
}

const XPBar = ({ score }: XPBarProps) => {
  const level = Math.floor(score / 100) + 1;
  const progress = score % 100;

  return (
    <footer className="xp-dock" aria-label={`Niveau ${level}, ${progress} points sur 100`}>
      <div className="xp-level">
        <span className="xp-icon"><Trophy size={16} aria-hidden="true" /></span>
        <span><strong>Niveau {level}</strong><small>{score} XP au total</small></span>
      </div>
      <div className="xp-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <span className="xp-next">{100 - progress} XP avant le niveau {level + 1}</span>
    </footer>
  );
};

export default XPBar;
