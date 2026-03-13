import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Shield, Search, MessageCircle, Zap } from "lucide-react";

interface Match {
  id: string;
  name: string;
  age: number;
  major: string;
  img: string;
  verified: boolean;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
  isNew?: boolean;
  online?: boolean;
}

const NEW_MATCHES: Match[] = [
  {
    id: "1",
    name: "Priya",
    age: 21,
    major: "CS",
    img: "https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    isNew: true,
    online: true,
  },
  {
    id: "3",
    name: "Yuki",
    age: 20,
    major: "Psych",
    img: "https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    isNew: true,
    online: false,
  },
  {
    id: "5",
    name: "Sofia",
    age: 21,
    major: "Pol Sci",
    img: "https://images.unsplash.com/photo-1771051027651-707f9fbd44b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    isNew: true,
    online: true,
  },
  {
    id: "6",
    name: "Maya",
    age: 22,
    major: "Pre-Med",
    img: "https://images.unsplash.com/photo-1686543972836-ad63f87f984b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: false,
    isNew: true,
    online: false,
  },
];

const CONVERSATIONS: Match[] = [
  {
    id: "1",
    name: "Priya",
    age: 21,
    major: "CS",
    img: "https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    lastMessage: "Omg same! Which lecture section are you in? 😄",
    lastTime: "now",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Marcus",
    age: 22,
    major: "Business",
    img: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    lastMessage: "That coffee shop on University Ave is actually amazing 🍵",
    lastTime: "12m",
    online: false,
  },
  {
    id: "3",
    name: "Yuki",
    age: 20,
    major: "Psych",
    img: "https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    lastMessage: "You: Have you been to the music building? 🎵",
    lastTime: "1h",
    online: false,
  },
  {
    id: "4",
    name: "Jordan",
    age: 23,
    major: "Engineering",
    img: "https://images.unsplash.com/photo-1686543972836-ad63f87f984b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    lastMessage: "The hiking trail near campus is 🔥 Let me know if you want to go",
    lastTime: "2h",
    online: true,
  },
  {
    id: "5",
    name: "Sofia",
    age: 21,
    major: "Pol Sci",
    img: "https://images.unsplash.com/photo-1771051027651-707f9fbd44b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    lastMessage: "Model UN prep is consuming my life rn 😭",
    lastTime: "Yesterday",
    online: false,
  },
];

export function MatchesScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"matches" | "chats">("matches");

  const filteredConvos = CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#fafaf8" }}>
      {/* Header */}
      <div style={{ background: "#fff", paddingTop: "56px", paddingBottom: "0" }}>
        <div className="px-4 pb-3 flex items-center justify-between">
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1a1a2e" }}>Messages</h2>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "#f0ebff" }}>
            <Zap size={11} style={{ color: "#7c3aed" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#7c3aed" }}>Premium: See who liked you</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1 mb-3">
          {(["matches", "chats"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl capitalize"
              style={{
                background: tab === t ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "#f5f5f5",
                color: tab === t ? "white" : "#9ca3af",
                fontWeight: tab === t ? 700 : 400,
                fontSize: "0.85rem",
              }}
            >
              {t === "matches" ? `New Matches (${NEW_MATCHES.length})` : "Chats"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {tab === "matches" ? (
          <div className="px-4 py-3">
            <p className="text-gray-400 mb-4" style={{ fontSize: "0.78rem" }}>
              You have {NEW_MATCHES.length} new matches! Say hello 👋
            </p>
            <div className="grid grid-cols-2 gap-3">
              {NEW_MATCHES.map((match, i) => (
                <motion.button
                  key={match.id}
                  className="relative rounded-2xl overflow-hidden text-left"
                  style={{ height: "190px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate(`/app/chat/${match.id}`)}
                >
                  <img src={match.img} alt={match.name} className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)",
                    }}
                  />
                  {match.online && (
                    <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
                  )}
                  {match.verified && (
                    <div
                      className="absolute top-2.5 left-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(124,58,237,0.9)" }}
                    >
                      <Shield size={8} style={{ color: "white" }} />
                      <span style={{ fontSize: "0.55rem", color: "white", fontWeight: 700 }}>VERIFIED</span>
                    </div>
                  )}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p className="text-white" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      {match.name}, {match.age}
                    </p>
                    <p style={{ color: "#d1d5db", fontSize: "0.68rem" }}>{match.major}</p>
                  </div>
                  {/* New badge */}
                  <div
                    className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-full"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                  >
                    <span style={{ fontSize: "0.55rem", color: "white", fontWeight: 700 }}>NEW</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Premium upsell */}
            <motion.div
              className="mt-4 p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, #1a0533, #2d1b69)",
                border: "1px solid rgba(124,58,237,0.3)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.3)" }}>
                <span style={{ fontSize: "1.2rem" }}>👀</span>
              </div>
              <div className="flex-1">
                <p className="text-white" style={{ fontWeight: 700, fontSize: "0.85rem" }}>
                  8 students liked your profile
                </p>
                <p style={{ color: "#a78bfa", fontSize: "0.72rem" }}>Upgrade to UniVibe+ to see who</p>
              </div>
              <button
                className="px-3 py-1.5 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", fontSize: "0.72rem", fontWeight: 700 }}
              >
                Unlock
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="px-4 py-3">
            {/* Search */}
            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "#f0f0f0",
                  border: "none",
                  borderRadius: "12px",
                  padding: "10px 12px 10px 34px",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
            </div>

            {filteredConvos.map((convo, i) => (
              <motion.button
                key={convo.id}
                className="w-full flex items-center gap-3 py-3 border-b text-left"
                style={{ borderColor: "#f0f0f0" }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => navigate(`/app/chat/${convo.id}`)}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={convo.img} alt={convo.name} className="w-full h-full object-cover" />
                  </div>
                  {convo.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a2e" }}>{convo.name}</span>
                    {convo.verified && <Shield size={11} style={{ color: "#7c3aed" }} />}
                  </div>
                  <p
                    className="truncate"
                    style={{
                      fontSize: "0.78rem",
                      color: convo.unread ? "#374151" : "#9ca3af",
                      fontWeight: convo.unread ? 500 : 400,
                    }}
                  >
                    {convo.lastMessage}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{convo.lastTime}</span>
                  {convo.unread && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                    >
                      <span style={{ color: "white", fontSize: "0.6rem", fontWeight: 700 }}>{convo.unread}</span>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
