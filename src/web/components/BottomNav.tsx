import { useLocation, useNavigate } from "react-router";
import { Compass, MessageCircle, Users, User } from "lucide-react";

const NAV_ITEMS = [
  { icon: Compass, label: "Discover", path: "/app" },
  { icon: MessageCircle, label: "Matches", path: "/app/matches" },
  { icon: Users, label: "Campus", path: "/app/campus" },
  { icon: User, label: "Profile", path: "/app/profile" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        paddingBottom: "20px",
      }}
    >
      <div className="flex items-center justify-around pt-2 pb-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
              style={{
                background: active ? "#f0ebff" : "transparent",
                minWidth: "60px",
              }}
            >
              <item.icon
                size={22}
                style={{
                  color: active ? "#7c3aed" : "#9ca3af",
                  strokeWidth: active ? 2.5 : 1.8,
                }}
              />
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: active ? 700 : 400,
                  color: active ? "#7c3aed" : "#9ca3af",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
