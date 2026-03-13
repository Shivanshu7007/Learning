import { Outlet, useLocation } from "react-router";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  const location = useLocation();
  const isChatScreen = location.pathname.startsWith("/app/chat");

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: "#fafaf8" }}>
      <div className="flex-1 overflow-hidden relative">
        <Outlet />
      </div>
      {!isChatScreen && <BottomNav />}
    </div>
  );
}
