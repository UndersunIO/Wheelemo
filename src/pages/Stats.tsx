import { Activity, Brain, CalendarDays, HeartHandshake, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { readHistory } from "../lib/storage";

const Stats = () => {
  const history = readHistory();

  if (history.length === 0) {
    return (
      <section className="flow-page">
        <header className="page-header"><div><span className="eyebrow">Tendances personnelles</span><h1>Mes repères</h1></div></header>
        <div className="empty-state">
          <span className="empty-symbol">↗</span>
          <h2>Les tendances apparaîtront ici</h2>
          <p>Deux ou trois check-ins suffisent déjà pour commencer à voir ce qui revient.</p>
          <Link className="sl-button sl-button--primary" to="/">Créer un repère</Link>
        </div>
      </section>
    );
  }

  const emotionCounts = history.reduce<Record<string, { count: number; color: string; emoji: string; totalIntensity: number }>>((acc, entry) => {
    const current = acc[entry.emotion] ?? { count: 0, color: entry.color, emoji: entry.emoji, totalIntensity: 0 };
    current.count += 1;
    current.totalIntensity += entry.intensity;
    acc[entry.emotion] = current;
    return acc;
  }, {});
  const emotionRanking = Object.entries(emotionCounts).sort(([, a], [, b]) => b.count - a.count);
  const maxEmotionCount = emotionRanking[0]?.[1].count ?? 1;

  const needs = history.reduce<Record<string, number>>((acc, entry) => {
    if (entry.need) acc[entry.need] = (acc[entry.need] ?? 0) + 1;
    return acc;
  }, {});
  const needsRanking = Object.entries(needs).sort(([, a], [, b]) => b - a);
  const topNeed = needsRanking[0]?.[0] ?? "à préciser";
  const averageIntensity = (history.reduce((total, entry) => total + entry.intensity, 0) / history.length).toFixed(1);

  const days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);
    const entries = history.filter((entry) => {
      const value = new Date(entry.createdAt);
      return value >= date && value < nextDate;
    });
    return {
      label: new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(date).replace(".", ""),
      count: entries.length,
      intensity: entries.length ? entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length : 0,
    };
  });
  const maxDailyCount = Math.max(1, ...days.map((day) => day.count));
  const checkInsThisWeek = days.reduce((sum, day) => sum + day.count, 0);
  const dominant = emotionRanking[0];

  return (
    <section className="flow-page stats-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Tendances personnelles</span>
          <h1>Mes repères</h1>
          <p className="page-lead">Des tendances descriptives pour apprendre de ton vécu — jamais un diagnostic.</p>
        </div>
      </header>

      <div className="metric-grid">
        <article><span><CalendarDays size={19} /></span><div><small>Check-ins cette semaine</small><strong>{checkInsThisWeek}</strong></div></article>
        <article><span><Activity size={19} /></span><div><small>Intensité moyenne</small><strong>{averageIntensity}<em>/10</em></strong></div></article>
        <article><span><HeartHandshake size={19} /></span><div><small>Besoin le plus présent</small><strong>{topNeed}</strong></div></article>
      </div>

      <div className="stats-layout">
        <article className="stats-card">
          <div className="stats-card-heading"><div><span className="eyebrow">7 derniers jours</span><h2>Rythme des check-ins</h2></div><TrendingUp size={20} /></div>
          <div className="week-chart" role="img" aria-label={days.map((day) => `${day.label}: ${day.count} check-in`).join(", ")}>
            {days.map((day) => (
              <div key={day.label}>
                <span className="bar-value">{day.count || "·"}</span>
                <span className="week-bar"><i style={{ height: `${Math.max(day.count ? 16 : 3, (day.count / maxDailyCount) * 100)}%` }} /></span>
                <small>{day.label}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="stats-card">
          <div className="stats-card-heading"><div><span className="eyebrow">Répartition</span><h2>Émotions les plus présentes</h2></div></div>
          <div className="ranking-list">
            {emotionRanking.slice(0, 5).map(([name, value]) => (
              <div key={name}>
                <span className="ranking-label"><b>{value.emoji}</b><strong>{name}</strong><small>{value.count}×</small></span>
                <span className="ranking-track"><i style={{ width: `${(value.count / maxEmotionCount) * 100}%`, background: value.color }} /></span>
              </div>
            ))}
          </div>
        </article>

        <article className="stats-card insight-card">
          <div className="insight-icon"><Brain size={22} /></div>
          <div>
            <span className="eyebrow">Ce que tes données suggèrent</span>
            <h2>Un prochain angle d'observation</h2>
            {dominant ? (
              <p>
                <strong>{dominant[0]}</strong> revient {dominant[1].count} fois, avec une intensité moyenne de {(dominant[1].totalIntensity / dominant[1].count).toFixed(1)}/10.
                Lors du prochain check-in, observe ce qui nourrit ou protège ton besoin de <strong>{topNeed}</strong>.
              </p>
            ) : <p>Continue à créer quelques repères pour faire émerger une tendance.</p>}
          </div>
          <Link className="sl-button" to="/">Faire un check-in</Link>
        </article>
      </div>
    </section>
  );
};

export default Stats;
