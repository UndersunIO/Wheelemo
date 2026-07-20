import { useMemo, useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteEntry, readHistory } from "../lib/storage";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

const History = () => {
  const [history, setHistory] = useState(readHistory);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fr-FR");
    if (!normalized) return history;
    return history.filter((entry) =>
      [entry.emotion, entry.need, entry.context, entry.expression]
        .join(" ")
        .toLocaleLowerCase("fr-FR")
        .includes(normalized),
    );
  }, [history, query]);

  const remove = (id: string) => {
    if (!window.confirm("Supprimer ce repère de ton journal ?")) return;
    setHistory(deleteEntry(id));
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `feelflow-journal-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="flow-page journal-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Mémoire personnelle</span>
          <h1>Mon journal émotionnel</h1>
          <p className="page-lead">Relis les signaux, pas pour te juger : pour voir ce qui revient et ce qui t'aide.</p>
        </div>
        {history.length > 0 && (
          <button className="sl-button" type="button" onClick={download}><Download size={17} /> Exporter</button>
        )}
      </header>

      {history.length === 0 ? (
        <div className="empty-state">
          <span className="empty-symbol">◎</span>
          <h2>Ton journal est encore vierge</h2>
          <p>Ton premier check-in créera un repère que tu pourras relire ici.</p>
          <Link className="sl-button sl-button--primary" to="/">Faire mon premier check-in</Link>
        </div>
      ) : (
        <>
          <div className="journal-toolbar">
            <label className="search-field">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Rechercher dans le journal</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une émotion, un besoin…" />
            </label>
            <span>{filtered.length} repère{filtered.length > 1 ? "s" : ""}</span>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state empty-state--compact"><h2>Aucun repère trouvé</h2><p>Essaie un autre mot ou efface la recherche.</p></div>
          ) : (
            <div className="journal-list">
              {filtered.map((entry) => (
                <article className="journal-entry" key={entry.id} style={{ "--emotion-color": entry.color } as React.CSSProperties}>
                  <div className="entry-marker"><span>{entry.emoji}</span></div>
                  <div className="entry-content">
                    <div className="entry-heading">
                      <div><h2>{entry.emotion}</h2><time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time></div>
                      <span className="intensity-badge">{entry.intensity}/10</span>
                    </div>
                    <div className="entry-tags">
                      {entry.need && <span>Besoin · {entry.need}</span>}
                      {entry.body && <span>Corps · {entry.body}</span>}
                    </div>
                    {entry.context && <p className="entry-context"><strong>Situation</strong>{entry.context}</p>}
                    {entry.expression && (
                      <details>
                        <summary>Relire ma formulation</summary>
                        <blockquote>{entry.expression}</blockquote>
                      </details>
                    )}
                  </div>
                  <button className="delete-entry" type="button" aria-label={`Supprimer le repère ${entry.emotion}`} onClick={() => remove(entry.id)}>
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default History;
