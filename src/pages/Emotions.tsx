import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Gauge,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { bodyZones, emotionById, emotions } from "../data/emotions";
import {
  getFrequentEmotionIds,
  readHistory,
  readLearningMode,
  saveEntry,
  saveLearningMode,
} from "../lib/storage";
import type { EmotionDefinition, EmotionFamily, LearningMode } from "../types";

interface EmotionsProps {
  onXPUpdate: (xp: number) => void;
}

const stepLabels = ["Observer", "Nommer", "Relier", "Exprimer"];

const withDefiniteArticle = (name: string) => {
  const normalized = name.toLocaleLowerCase("fr-FR");
  return /^[aeiouyéèêëàâäîïôöùûü]/i.test(normalized) ? `l'${normalized}` : `la ${normalized}`;
};

const bodyPhrases: Record<string, string> = {
  tête: "ma tête",
  gorge: "ma gorge",
  poitrine: "ma poitrine",
  ventre: "mon ventre",
  mâchoire: "ma mâchoire",
  épaules: "mes épaules",
  "tout le corps": "tout mon corps",
};

const intensityLabels: Record<number, string> = {
  1: "à peine là",
  2: "très légère",
  3: "légère",
  4: "présente",
  5: "nette",
  6: "soutenue",
  7: "forte",
  8: "très forte",
  9: "envahissante",
  10: "au maximum",
};

const familyOptions: { value: EmotionFamily; label: string; hint: string }[] = [
  { value: "agréable", label: "Plutôt agréable", hint: "J'ai envie de m'en rapprocher" },
  { value: "difficile", label: "Plutôt difficile", hint: "J'ai envie que cela change" },
  { value: "mixte", label: "Mélangé ou flou", hint: "Plusieurs ressentis coexistent" },
];

const energyOptions = [
  { value: "basse", label: "Basse", hint: "ralenti·e, lourd·e" },
  { value: "moyenne", label: "Moyenne", hint: "stable, disponible" },
  { value: "haute", label: "Haute", hint: "tendu·e, en mouvement" },
] as const;

const Emotions = ({ onXPUpdate }: EmotionsProps) => {
  const [history, setHistory] = useState(readHistory);
  const [mode, setMode] = useState<LearningMode>(readLearningMode);
  const [step, setStep] = useState(mode === "direct" ? 1 : 0);
  const [family, setFamily] = useState<EmotionFamily | "">("");
  const [energy, setEnergy] = useState<"basse" | "moyenne" | "haute" | "">("");
  const [selected, setSelected] = useState<EmotionDefinition | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [body, setBody] = useState("");
  const [context, setContext] = useState("");
  const [need, setNeed] = useState("");
  const [request, setRequest] = useState("");
  const [savedExpression, setSavedExpression] = useState("");
  const [copied, setCopied] = useState(false);

  const frequentEmotions = useMemo(
    () => getFrequentEmotionIds(history).map(emotionById).filter(Boolean) as EmotionDefinition[],
    [history],
  );

  const sortedEmotions = useMemo(() => {
    return [...emotions].sort((a, b) => {
      const score = (emotion: EmotionDefinition) =>
        Number(emotion.family === family) * 2 + Number(emotion.energy === energy);
      return score(b) - score(a);
    });
  }, [energy, family]);

  const expression = useMemo(() => {
    if (!selected || !need) return "";
    const situation = context.trim() || "je pense à ce qui vient de se passer";
    const location = body ? ` Je le remarque surtout dans ${bodyPhrases[body] ?? body}.` : "";
    const concreteRequest = request.trim()
      ? ` Ma demande concrète : ${request.trim().replace(/[.!?]+$/, "")}.`
      : "";
    return `Quand ${situation.replace(/^[Qq]uand\s+/, "")}, je ressens ${withDefiniteArticle(selected.name)} à ${intensity}/10.${location} Cela m'indique que j'ai besoin de ${need}.${concreteRequest}`;
  }, [body, context, intensity, need, request, selected]);

  const setLearningMode = (nextMode: LearningMode) => {
    setMode(nextMode);
    saveLearningMode(nextMode);
    if (nextMode === "direct" && step === 0) setStep(1);
  };

  const chooseQuickEmotion = (emotion: EmotionDefinition) => {
    setSelected(emotion);
    setFamily(emotion.family);
    setEnergy(emotion.energy);
    setNeed(emotion.needs[0]);
    setStep(2);
  };

  const reset = () => {
    setStep(mode === "direct" ? 1 : 0);
    setFamily("");
    setEnergy("");
    setSelected(null);
    setIntensity(5);
    setBody("");
    setContext("");
    setNeed("");
    setRequest("");
    setSavedExpression("");
    setCopied(false);
  };

  const handleSave = () => {
    if (!selected || !need || !expression) return;
    const entry = {
      id: crypto.randomUUID(),
      emotionId: selected.id,
      emotion: selected.name,
      emoji: selected.emoji,
      color: selected.color,
      family: selected.family,
      intensity,
      context: context.trim(),
      body,
      need,
      request: request.trim(),
      expression,
      createdAt: new Date().toISOString(),
    };
    saveEntry(entry);
    setHistory((current) => [entry, ...current]);
    setSavedExpression(expression);
    onXPUpdate(35);
  };

  const copyExpression = async () => {
    try {
      await navigator.clipboard.writeText(savedExpression || expression);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (savedExpression && selected) {
    return (
      <section className="flow-page flow-page--narrow">
        <div className="completion-mark"><CheckCircle2 size={28} aria-hidden="true" /></div>
        <span className="eyebrow">Boucle terminée · +35 XP</span>
        <h1 className="completion-title">Tu as mis des mots sur ce qui compte.</h1>
        <p className="page-lead">Garde cette formulation pour toi ou utilise-la comme point de départ d'une conversation.</p>

        <article className="expression-card" style={{ "--emotion-color": selected.color } as React.CSSProperties}>
          <div className="expression-emotion">
            <span className="emotion-symbol">{selected.emoji}</span>
            <span><strong>{selected.name}</strong><small>Intensité {intensity}/10 · besoin de {need}</small></span>
          </div>
          <blockquote>{savedExpression}</blockquote>
          <button className="sl-button" type="button" onClick={copyExpression}>
            {copied ? <Check size={17} /> : <Clipboard size={17} />}
            {copied ? "Copié" : "Copier ma formulation"}
          </button>
        </article>

        <div className="completion-actions">
          <button className="sl-button sl-button--primary" type="button" onClick={reset}>
            <RotateCcw size={17} aria-hidden="true" /> Nouveau ressenti
          </button>
          <Link className="sl-button" to="/history">Voir mon journal</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flow-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Check-in émotionnel · 2 à 4 min</span>
          <h1>Qu'est-ce qui se passe en moi&nbsp;?</h1>
          <p className="page-lead">Avance sans chercher la réponse parfaite. Une émotion est une information, pas une étiquette.</p>
        </div>
        <div className="mode-switch" aria-label="Niveau de guidage">
          <button className={mode === "guide" ? "active" : ""} type="button" onClick={() => setLearningMode("guide")}>Guidé</button>
          <button className={mode === "direct" ? "active" : ""} type="button" onClick={() => setLearningMode("direct")}>Direct</button>
        </div>
      </header>

      {frequentEmotions.length > 0 && step <= 1 && (
        <aside className="adaptive-strip">
          <div><Sparkles size={18} aria-hidden="true" /><span><strong>Raccourcis appris</strong><small>D'après tes choix récents</small></span></div>
          <div className="quick-emotions">
            {frequentEmotions.map((emotion) => (
              <button type="button" key={emotion.id} onClick={() => chooseQuickEmotion(emotion)}>
                {emotion.emoji} {emotion.name}
              </button>
            ))}
          </div>
        </aside>
      )}

      <div className="flow-progress" aria-label={`Étape ${step + 1} sur 4 : ${stepLabels[step]}`}>
        {stepLabels.map((label, index) => (
          <div className={index === step ? "active" : index < step ? "done" : ""} key={label}>
            <span>{index < step ? <Check size={14} /> : index + 1}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>

      <div className="flow-layout">
        <div className="flow-main">
          {step === 0 && (
            <div className="step-card">
              <div className="step-heading">
                <span className="step-icon"><Gauge size={20} /></span>
                <div><span className="eyebrow">01 · Observer</span><h2>Prends une photo intérieure rapide</h2></div>
              </div>

              <fieldset className="choice-fieldset">
                <legend>Ce ressenti est…</legend>
                <div className="choice-grid choice-grid--3">
                  {familyOptions.map((option) => (
                    <button
                      className={`choice-card ${family === option.value ? "selected" : ""}`}
                      type="button"
                      key={option.value}
                      aria-pressed={family === option.value}
                      onClick={() => setFamily(option.value)}
                    >
                      <span>{option.label}</span><small>{option.hint}</small>
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="choice-fieldset">
                <legend>Mon niveau d'énergie semble…</legend>
                <div className="choice-grid choice-grid--3">
                  {energyOptions.map((option) => (
                    <button
                      className={`choice-card ${energy === option.value ? "selected" : ""}`}
                      type="button"
                      key={option.value}
                      aria-pressed={energy === option.value}
                      onClick={() => setEnergy(option.value)}
                    >
                      <span>{option.label}</span><small>{option.hint}</small>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="step-card">
              <div className="step-heading">
                <span className="step-icon"><Sparkles size={20} /></span>
                <div><span className="eyebrow">02 · Nommer</span><h2>Quel mot s'en approche le plus&nbsp;?</h2></div>
              </div>
              <p className="step-help">Choisis le mot le plus proche. Tu pourras toujours l'ajuster plus tard.</p>

              <div className="emotion-grid">
                {sortedEmotions.map((emotion, index) => {
                  const suggested = Boolean(family && energy && index < 4);
                  return (
                    <button
                      className={`emotion-card ${selected?.id === emotion.id ? "selected" : ""}`}
                      style={{ "--emotion-color": emotion.color } as React.CSSProperties}
                      type="button"
                      key={emotion.id}
                      aria-pressed={selected?.id === emotion.id}
                      onClick={() => {
                        setSelected(emotion);
                        setNeed(emotion.needs[0]);
                      }}
                    >
                      <span className="emotion-symbol">{emotion.emoji}</span>
                      <span><strong>{emotion.name}</strong><small>{emotion.description}</small></span>
                      {suggested && <em>proche de tes repères</em>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && selected && (
            <div className="step-card">
              <div className="step-heading">
                <span className="step-icon"><Lightbulb size={20} /></span>
                <div><span className="eyebrow">03 · Relier</span><h2>Qu'est-ce que {withDefiniteArticle(selected.name)} essaie de te dire&nbsp;?</h2></div>
              </div>

              <aside className="emotion-insight" style={{ "--emotion-color": selected.color } as React.CSSProperties}>
                <span>{selected.emoji}</span>
                <div><strong>Le signal possible</strong><p>{selected.signal}</p></div>
              </aside>

              <label className="range-field">
                <span><strong>Intensité</strong><output>{intensity}/10 · {intensityLabels[intensity]}</output></span>
                <input type="range" min="1" max="10" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
                <span className="range-extremes"><small>Discrète</small><small>Très forte</small></span>
              </label>

              {intensity >= 9 && (
                <div className="support-callout" role="note">
                  <strong>Commence par te sécuriser.</strong>
                  <span>Si cette émotion devient ingérable ou si tu es en danger, rapproche-toi maintenant d'une personne de confiance ou d'un professionnel.</span>
                </div>
              )}

              <fieldset className="chip-fieldset">
                <legend>Où le remarques-tu surtout&nbsp;? <span>facultatif</span></legend>
                <div className="chip-list">
                  {bodyZones.map((zone) => (
                    <button className={body === zone ? "selected" : ""} type="button" key={zone} aria-pressed={body === zone} onClick={() => setBody(body === zone ? "" : zone)}>{zone}</button>
                  ))}
                </div>
              </fieldset>

              <label className="text-field">
                <span>Que s'est-il passé&nbsp;? <small>Reste sur les faits, sans interpréter.</small></span>
                <textarea value={context} onChange={(event) => setContext(event.target.value)} placeholder="Ex. mon message est resté sans réponse depuis hier…" rows={3} />
              </label>

              <fieldset className="chip-fieldset">
                <legend>Quel besoin compte le plus maintenant&nbsp;?</legend>
                <div className="chip-list">
                  {selected.needs.map((item) => (
                    <button className={need === item ? "selected" : ""} type="button" key={item} aria-pressed={need === item} onClick={() => setNeed(item)}>{item}</button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 3 && selected && (
            <div className="step-card">
              <div className="step-heading">
                <span className="step-icon"><Clipboard size={20} /></span>
                <div><span className="eyebrow">04 · Exprimer</span><h2>Transforme l'information en demande claire</h2></div>
              </div>
              <p className="step-help">Une demande utile est concrète, faisable et laisse à l'autre la possibilité de répondre.</p>

              <label className="text-field">
                <span>Quelle demande pourrais-tu formuler&nbsp;? <small>facultatif</small></span>
                <textarea value={request} onChange={(event) => setRequest(event.target.value)} placeholder="Ex. me dire quand tu seras disponible pour en parler" rows={3} />
              </label>

              <article className="expression-preview" aria-live="polite">
                <span className="eyebrow">Ta formulation</span>
                <p>{expression}</p>
                <small>Tu peux l'adapter pour qu'elle sonne comme toi.</small>
              </article>
            </div>
          )}

          <div className="flow-actions">
            <button
              className="sl-button"
              type="button"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ArrowLeft size={17} /> Retour
            </button>
            {step < 3 ? (
              <button
                className="sl-button sl-button--primary"
                type="button"
                disabled={(step === 0 && (!family || !energy)) || (step === 1 && !selected) || (step === 2 && !need)}
                onClick={() => setStep((current) => Math.min(3, current + 1))}
              >
                Continuer <ArrowRight size={17} />
              </button>
            ) : (
              <button className="sl-button sl-button--primary" type="button" disabled={!need} onClick={handleSave}>
                <Check size={17} /> Enregistrer ce repère
              </button>
            )}
          </div>
        </div>

        <aside className="learning-rail">
          <span className="eyebrow">Repère SupraLearning</span>
          {step === 0 && <><h3>Le corps répond avant les mots.</h3><p>Valence + énergie réduisent le choix sans t'enfermer dans une case.</p></>}
          {step === 1 && <><h3>Précis vaut mieux que positif.</h3><p>Nommer justement une émotion diminue le flou et rend la prochaine action plus visible.</p></>}
          {step === 2 && <><h3>L'émotion signale un besoin.</h3><p>Elle ne donne pas toujours la solution, mais elle indique ce qui mérite ton attention.</p></>}
          {step === 3 && <><h3>Fait + émotion + besoin + demande.</h3><p>Cette structure évite l'accusation et rend la conversation plus praticable.</p></>}
          <div className="rail-separator" />
          <Link to="/breathing">Besoin de redescendre d'abord&nbsp;? <ArrowRight size={15} /></Link>
        </aside>
      </div>
    </section>
  );
};

export default Emotions;
