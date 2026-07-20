import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import XPBar from "./components/XPBar";
import Breathing from "./pages/Breathing";
import Emotions from "./pages/Emotions";
import History from "./pages/History";
import Quiz from "./pages/Quiz";
import Stats from "./pages/Stats";
import { readXP, saveXP } from "./lib/storage";
import "./App.css";

const App = () => {
  const [score, setScore] = useState(readXP);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleXPUpdate = (xp: number) => {
    setScore((current) => {
      const next = current + xp;
      saveXP(next);
      return next;
    });
  };

  return (
    <BrowserRouter>
      <div className="app-shell" data-supra-product="feelflow">
        <a className="skip-link" href="#main-content">
          Aller au contenu
        </a>

        <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />

        <div className="app-workspace">
          <header className="mobile-header">
            <button
              className="icon-button"
              type="button"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <div className="mobile-brand">
              <span className="brand-mark" aria-hidden="true">F</span>
              <span>FeelFlow</span>
            </div>
            <span className="mobile-level">Niv. {Math.floor(score / 100) + 1}</span>
          </header>

          <main id="main-content" className="page-container" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Emotions onXPUpdate={handleXPUpdate} />} />
              <Route path="/breathing" element={<Breathing onXPUpdate={handleXPUpdate} />} />
              <Route path="/quiz" element={<Quiz onXPUpdate={handleXPUpdate} />} />
              <Route path="/history" element={<History />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="*" element={<Emotions onXPUpdate={handleXPUpdate} />} />
            </Routes>
          </main>

          <XPBar score={score} />
        </div>

        {menuOpen && (
          <button
            className="nav-backdrop"
            type="button"
            aria-label="Fermer le menu en cliquant à l'extérieur"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
