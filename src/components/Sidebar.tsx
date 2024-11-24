import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: "🥰 Les émotions", path: "/" },
    { name: "🌬 Exercice de respiration", path: "/breathing" },
    { name: "❓ Quiz", path: "/quiz" },
    { name: "📜 Historique", path: "/history" },
    { name: "📊 Statistiques", path: "/stats" },
    
  ];

  return (
    <div className="w-1/4 bg-gray-800 p-4 rounded-r-lg shadow-lg">
      <h2 className="text-center text-xl font-bold mb-4">FeelFlow</h2>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block p-3 rounded-lg transition-all ${
                location.pathname === link.path ? "bg-purple-600" : "hover:bg-gray-700"
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
