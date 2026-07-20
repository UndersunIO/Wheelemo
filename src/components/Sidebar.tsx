import {
  BarChart3,
  BookOpenCheck,
  HeartPulse,
  History,
  Sparkles,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

const links = [
  { name: "Mon ressenti", path: "/", icon: HeartPulse },
  { name: "Me réguler", path: "/breathing", icon: Sparkles },
  { name: "M'entraîner", path: "/quiz", icon: BookOpenCheck },
  { name: "Mon journal", path: "/history", icon: History },
  { name: "Mes repères", path: "/stats", icon: BarChart3 },
];

const Sidebar = ({ open, onNavigate }: SidebarProps) => (
  <aside className={`app-sidebar ${open ? "app-sidebar--open" : ""}`} aria-label="Navigation principale">
    <div className="brand-lockup">
      <span className="brand-mark" aria-hidden="true">F</span>
      <div>
        <strong>FeelFlow</strong>
        <span>par SupraLearning</span>
      </div>
    </div>

    <div className="sidebar-intro">
      <span className="eyebrow">Boussole émotionnelle</span>
      <p>Repérer. Comprendre. Exprimer.</p>
    </div>

    <nav className="sidebar-nav">
      {links.map(({ name, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          onClick={onNavigate}
          className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
        >
          <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
          <span>{name}</span>
        </NavLink>
      ))}
    </nav>

    <div className="sidebar-footer">
      <span className="status-dot" aria-hidden="true" />
      <span>Tes données restent sur cet appareil</span>
    </div>
  </aside>
);

export default Sidebar;
