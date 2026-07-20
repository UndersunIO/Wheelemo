import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Pause, Play, RotateCcw, Wind } from "lucide-react";
import { Link } from "react-router-dom";

interface BreathingProps {
  onXPUpdate: (xp: number) => void;
}

const phases = [
  { name: "Inspire", duration: 4, cue: "Laisse l'air entrer doucement", className: "inhale" },
  { name: "Garde", duration: 2, cue: "Sans forcer", className: "hold" },
  { name: "Expire", duration: 6, cue: "Relâche lentement", className: "exhale" },
] as const;

const Breathing = ({ onXPUpdate }: BreathingProps) => {
  const [duration, setDuration] = useState(120);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const rewarded = useRef(false);

  const phase = useMemo(() => {
    let position = elapsed % 12;
    for (const item of phases) {
      if (position < item.duration) return { ...item, remaining: item.duration - position };
      position -= item.duration;
    }
    return { ...phases[0], remaining: phases[0].duration };
  }, [elapsed]);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        if (current + 1 >= duration) {
          window.clearInterval(timer);
          setRunning(false);
          setCompleted(true);
          if (!rewarded.current) {
            onXPUpdate(15);
            rewarded.current = true;
          }
          return duration;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [duration, onXPUpdate, running]);

  const reset = () => {
    setElapsed(0);
    setRunning(false);
    setCompleted(false);
    rewarded.current = false;
  };

  const remaining = Math.max(0, duration - elapsed);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <section className="flow-page regulation-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Régulation · rythme 4—2—6</span>
          <h1>Créer un peu d'espace avant d'agir</h1>
          <p className="page-lead">Suis le rythme sans chercher à respirer très fort. Arrête si tu ressens un inconfort.</p>
        </div>
      </header>

      <div className="regulation-layout">
        <div className="breathing-stage">
          <div className="duration-picker" aria-label="Durée de la session">
            {[60, 120, 180].map((secondsOption) => (
              <button
                type="button"
                className={duration === secondsOption ? "active" : ""}
                key={secondsOption}
                disabled={running || elapsed > 0}
                onClick={() => setDuration(secondsOption)}
              >
                {secondsOption / 60} min
              </button>
            ))}
          </div>

          <div className={`breath-orbit ${running ? `is-running is-${phase.className}` : ""} ${completed ? "is-complete" : ""}`}>
            <div className="orbit-ring orbit-ring--outer" />
            <div className="orbit-ring orbit-ring--inner" />
            <div className="breath-core" aria-live="polite">
              {completed ? <Check size={34} aria-hidden="true" /> : <Wind size={28} aria-hidden="true" />}
              <strong>{completed ? "Terminé" : running ? phase.name : elapsed > 0 ? "En pause" : "Prêt·e ?"}</strong>
              <span>{completed ? "Observe ce qui a changé" : running ? phase.cue : "Respire à ton rythme"}</span>
              {running && <b>{phase.remaining}</b>}
            </div>
          </div>

          <div className="session-time" aria-label={`${minutes} minutes et ${seconds} secondes restantes`}>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>

          <div className="session-controls">
            {!completed && (
              <button className="sl-button sl-button--primary sl-button--lg" type="button" onClick={() => setRunning((value) => !value)}>
                {running ? <Pause size={18} /> : <Play size={18} />}
                {running ? "Mettre en pause" : elapsed > 0 ? "Reprendre" : "Commencer"}
              </button>
            )}
            {(elapsed > 0 || completed) && (
              <button className="sl-button sl-button--lg" type="button" onClick={reset}>
                <RotateCcw size={18} /> Recommencer
              </button>
            )}
          </div>
        </div>

        <aside className="regulation-guide">
          <span className="eyebrow">Un cycle simple</span>
          <ol>
            {phases.map((item, index) => (
              <li className={running && phase.name === item.name ? "active" : ""} key={item.name}>
                <span>{index + 1}</span>
                <div><strong>{item.name} · {item.duration} s</strong><small>{item.cue}</small></div>
              </li>
            ))}
          </ol>
          <div className="rail-separator" />
          <p>Après la session, reviens à ton ressenti. Le mot juste est souvent plus accessible quand l'intensité a un peu baissé.</p>
          <Link className="sl-button" to="/">Nommer mon ressenti</Link>
        </aside>
      </div>
    </section>
  );
};

export default Breathing;
