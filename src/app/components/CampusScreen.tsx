import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  Calendar,
  MessageSquare,
  Heart,
  Users,
  MapPin,
  Clock,
  ChevronRight,
  Plus,
  BookOpen,
  Music,
  Zap,
  Trophy,
  Coffee,
  ThumbsUp,
  Share2,
  Bookmark,
  TrendingUp,
} from "lucide-react";

const CAMPUS_EVENTS = [
  {
    id: "1",
    title: "Spring Mixer @ Engineering Hall",
    date: "Fri Mar 13",
    time: "7:00 PM",
    location: "Engineering Hall",
    attendees: 84,
    img: "https://images.unsplash.com/photo-1701709304274-bd9e5402d979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    category: "Social",
    color: "#7c3aed",
    emoji: "🎉",
    going: true,
  },
  {
    id: "2",
    title: "CS Hackathon: 24hr Build",
    date: "Sat Mar 14",
    time: "9:00 AM",
    location: "Gates Building",
    attendees: 152,
    img: "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    category: "Tech",
    color: "#2563eb",
    emoji: "💻",
    going: false,
  },
  {
    id: "3",
    title: "Campus Open Mic Night",
    date: "Sun Mar 15",
    time: "8:00 PM",
    location: "Student Union Stage",
    attendees: 63,
    img: "https://images.unsplash.com/photo-1758270705641-acf09b68a91f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    category: "Music",
    color: "#ec4899",
    emoji: "🎤",
    going: false,
  },
];

const DISCUSSIONS = [
  {
    id: "1",
    author: "Priya K.",
    authorImg: "https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    verified: true,
    major: "CS · Junior",
    time: "2m ago",
    text: "Anyone else low-key stressed about finals but also somehow watching Netflix? 😭 Asking for a friend (the friend is me)",
    likes: 47,
    comments: 12,
    tag: "Campus Life",
    tagColor: "#7c3aed",
    liked: false,
  },
  {
    id: "2",
    author: "Marcus T.",
    authorImg: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    verified: true,
    major: "Business · Senior",
    time: "15m ago",
    text: "PSA: The new coffee shop that opened near the quad has the BEST matcha latte. Worth the 15 min walk, trust me ☕✨",
    likes: 89,
    comments: 23,
    tag: "Food & Drinks",
    tagColor: "#f59e0b",
    liked: true,
  },
  {
    id: "3",
    author: "Yuki M.",
    authorImg: "https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    verified: true,
    major: "Psychology · Sophomore",
    time: "32m ago",
    text: "Just finished my first research paper and honestly it wasn't as bad as I thought? Maybe I've been watching too many study vlogs 😂 Study group anyone?",
    likes: 34,
    comments: 8,
    tag: "Study",
    tagColor: "#2563eb",
    liked: false,
  },
  {
    id: "4",
    author: "Sofia R.",
    authorImg: "https://images.unsplash.com/photo-1771051027651-707f9fbd44b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    verified: true,
    major: "Pol Sci · Junior",
    time: "1h ago",
    text: "Model UN prep meeting tomorrow at 4pm in the Student Union room 204! All experience levels welcome. DM me for details 🌍",
    likes: 21,
    comments: 6,
    tag: "Clubs",
    tagColor: "#22c55e",
    liked: false,
  },
];

const TABS = [
  { id: "feed", label: "Feed", icon: Flame },
  { id: "events", label: "Events", icon: Calendar },
  { id: "groups", label: "Groups", icon: Users },
];

const TRENDING_TAGS = ["#Finals", "#Hackathon", "#CampusEats", "#Studying", "#SpringBreak"];

const GROUPS = [
  { id: "1", name: "CS Study Squad", members: 342, emoji: "💻", color: "#2563eb" },
  { id: "2", name: "Foodies on Campus", members: 218, emoji: "🍕", color: "#f59e0b" },
  { id: "3", name: "Gym & Fitness", members: 189, emoji: "🏋️", color: "#22c55e" },
  { id: "4", name: "Music Collective", members: 156, emoji: "🎵", color: "#ec4899" },
  { id: "5", name: "Pre-Med Support", members: 134, emoji: "🧬", color: "#ef4444" },
  { id: "6", name: "Startup Founders", members: 97, emoji: "🚀", color: "#7c3aed" },
];

export function CampusScreen() {
  const [activeTab, setActiveTab] = useState<"feed" | "events" | "groups">("feed");
  const [discussions, setDiscussions] = useState(DISCUSSIONS);
  const [events, setEvents] = useState(CAMPUS_EVENTS);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, liked: !d.liked, likes: d.liked ? d.likes - 1 : d.likes + 1 }
          : d
      )
    );
  };

  const toggleSave = (id: string) => {
    setSavedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleGoing = (id: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, going: !e.going, attendees: e.going ? e.attendees - 1 : e.attendees + 1 }
          : e
      )
    );
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#fafaf8" }}>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          paddingTop: "56px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div className="px-4 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1a1a2e" }}>Campus</h2>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: "#f0ebff" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span style={{ fontSize: "0.6rem", color: "#7c3aed", fontWeight: 600 }}>
                  Stanford
                </span>
              </div>
            </div>
            <p style={{ color: "#9ca3af", fontSize: "0.68rem" }}>
              247 students active now
            </p>
          </div>
          <motion.button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", fontSize: "0.75rem", fontWeight: 600 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={13} />
            Post
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1 pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-1 justify-center"
              style={{
                background: activeTab === tab.id ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "#f5f5f5",
                color: activeTab === tab.id ? "white" : "#9ca3af",
                fontWeight: activeTab === tab.id ? 700 : 400,
                fontSize: "0.78rem",
              }}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          {activeTab === "feed" && (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Trending tags */}
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={12} style={{ color: "#7c3aed" }} />
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7c3aed" }}>TRENDING NOW</span>
                </div>
                <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  {TRENDING_TAGS.map((tag) => (
                    <button
                      key={tag}
                      className="flex-shrink-0 px-2.5 py-1 rounded-full"
                      style={{
                        background: "#f0ebff",
                        border: "1px solid #e9d5ff",
                        color: "#7c3aed",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Posts */}
              <div className="px-4 space-y-3">
                {discussions.map((post, i) => (
                  <motion.div
                    key={post.id}
                    className="p-3.5 rounded-2xl"
                    style={{
                      background: "#fff",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {/* Post header */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <img
                        src={post.authorImg}
                        className="w-9 h-9 rounded-full object-cover"
                        alt={post.author}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#1a1a2e" }}>
                            {post.author}
                          </span>
                          {post.verified && (
                            <div
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                              style={{ background: "rgba(124,58,237,0.1)" }}
                            >
                              <span style={{ fontSize: "0.55rem", color: "#7c3aed", fontWeight: 700 }}>✓ VERIFIED</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{post.major}</span>
                          <span style={{ color: "#d1d5db" }}>·</span>
                          <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{post.time}</span>
                        </div>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: `${post.tagColor}15`,
                          color: post.tagColor,
                          fontSize: "0.6rem",
                          fontWeight: 700,
                        }}
                      >
                        {post.tag}
                      </span>
                    </div>

                    {/* Post text */}
                    <p style={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.6, marginBottom: "12px" }}>
                      {post.text}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        className="flex items-center gap-1.5"
                        onClick={() => toggleLike(post.id)}
                      >
                        <motion.div whileTap={{ scale: 1.3 }}>
                          <ThumbsUp
                            size={14}
                            style={{ color: post.liked ? "#7c3aed" : "#9ca3af" }}
                            fill={post.liked ? "#7c3aed" : "none"}
                          />
                        </motion.div>
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: post.liked ? "#7c3aed" : "#9ca3af",
                            fontWeight: post.liked ? 700 : 400,
                          }}
                        >
                          {post.likes}
                        </span>
                      </button>

                      <button className="flex items-center gap-1.5">
                        <MessageSquare size={14} style={{ color: "#9ca3af" }} />
                        <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{post.comments}</span>
                      </button>

                      <button className="flex items-center gap-1.5">
                        <Share2 size={14} style={{ color: "#9ca3af" }} />
                      </button>

                      <button
                        className="ml-auto"
                        onClick={() => toggleSave(post.id)}
                      >
                        <Bookmark
                          size={14}
                          style={{ color: savedPosts.includes(post.id) ? "#ec4899" : "#9ca3af" }}
                          fill={savedPosts.includes(post.id) ? "#ec4899" : "none"}
                        />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-3 space-y-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={13} style={{ color: "#7c3aed" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7c3aed" }}>
                  THIS WEEK ON CAMPUS
                </span>
              </div>

              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  className="rounded-2xl overflow-hidden"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Event image */}
                  <div className="relative h-32">
                    <img src={event.img} alt={event.title} className="w-full h-full object-cover" />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className="px-2 py-0.5 rounded-full text-white"
                        style={{ background: event.color, fontSize: "0.65rem", fontWeight: 700 }}
                      >
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-white"
                      style={{ background: "rgba(0,0,0,0.5)", fontSize: "0.65rem" }}>
                      {event.emoji} {event.attendees} going
                    </div>
                    <p className="absolute bottom-2.5 left-2.5 right-2.5 text-white" style={{ fontWeight: 700, fontSize: "0.92rem" }}>
                      {event.title}
                    </p>
                  </div>

                  {/* Event details */}
                  <div className="p-3 bg-white flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} style={{ color: "#9ca3af" }} />
                        <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                          {event.date} · {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={11} style={{ color: "#9ca3af" }} />
                        <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>{event.location}</span>
                      </div>
                    </div>
                    <motion.button
                      className="px-3.5 py-1.5 rounded-xl text-white"
                      style={{
                        background: event.going
                          ? "#f0fdf4"
                          : `linear-gradient(135deg, ${event.color}, #ec4899)`,
                        border: event.going ? "1.5px solid #bbf7d0" : "none",
                        color: event.going ? "#16a34a" : "white",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                      onClick={() => toggleGoing(event.id)}
                      whileTap={{ scale: 0.95 }}
                    >
                      {event.going ? "✓ Going!" : "I'm Going"}
                    </motion.button>
                  </div>
                </motion.div>
              ))}

              {/* Create event CTA */}
              <motion.button
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 border-2 border-dashed"
                style={{ borderColor: "#e9d5ff", color: "#7c3aed" }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} />
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>Create Campus Event</span>
              </motion.button>
            </motion.div>
          )}

          {activeTab === "groups" && (
            <motion.div
              key="groups"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <Users size={13} style={{ color: "#7c3aed" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7c3aed" }}>
                  CAMPUS GROUPS
                </span>
              </div>

              <div className="space-y-2.5">
                {GROUPS.map((group, i) => (
                  <motion.button
                    key={group.id}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-left"
                    style={{
                      background: "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${group.color}18` }}
                    >
                      <span style={{ fontSize: "20px" }}>{group.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1a1a2e" }}>
                        {group.name}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                        {group.members} campus members
                      </p>
                    </div>
                    <button
                      className="px-3 py-1.5 rounded-xl flex-shrink-0"
                      style={{
                        background: `${group.color}15`,
                        color: group.color,
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}
                    >
                      Join
                    </button>
                  </motion.button>
                ))}
              </div>

              {/* Create group */}
              <motion.button
                className="w-full mt-3 py-4 rounded-2xl flex items-center justify-center gap-2 border-2 border-dashed"
                style={{ borderColor: "#e9d5ff", color: "#7c3aed" }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={16} />
                <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>Create New Group</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
