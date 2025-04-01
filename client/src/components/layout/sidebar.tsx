import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();
  
  const navItems = [
    {
      title: "Navigation",
      items: [
        { name: "Tableau de bord", path: "/", icon: "dashboard" },
        { name: "Gestion des absences", path: "/absences", icon: "event_busy" },
        { name: "Élèves", path: "/students", icon: "people" },
        { name: "Classes", path: "/classes", icon: "class" },
        { name: "Rapports", path: "/reports", icon: "bar_chart" },
      ],
    },
    {
      title: "Administration",
      items: [
        { name: "Paramètres", path: "/settings", icon: "settings" },
        { name: "Aide", path: "/help", icon: "help" },
      ],
    },
  ];
  
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  
  return (
    <aside 
      className={cn(
        "w-64 bg-white shadow-lg md:shadow-none transition-all duration-300 transform md:translate-x-0 fixed md:static top-16 bottom-0 left-0 z-30 overflow-y-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <nav className="p-4">
        {navItems.map((section, idx) => (
          <div key={idx} className="mb-4">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link 
                    href={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-neutral-900 rounded-md hover:bg-neutral-100 no-underline",
                      location === item.path && "bg-primary-light text-primary"
                    )}
                    onClick={handleLinkClick}
                  >
                    <span className="material-icons mr-3 text-neutral-500">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
