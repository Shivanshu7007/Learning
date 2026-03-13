import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Edit3,
  Settings,
  Star,
  Zap,
  Eye,
  BarChart2,
  ChevronRight,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  Camera,
  BookOpen,
  MapPin,
  Heart,
  Trophy,
  Users,
  CheckCircle,
  X,
} from "lucide-react";

const MY_PROFILE = {
  name: "Alex",
  age: 21,
  major: "Computer Science",
  year: "Junior",
  university: "Stanford University",
  bio: "CS Junior who loves building things ✨ Hackathon addict, coffee dependent, always up for an adventure. Looking to meet cool people on campus!",
  img: "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  verified: true,
  superVerified: true,
  interests: ["💻 Tech", "☕ Coffee", "🎬 Movies", "🏃 Running", "🎵 Music", "📸 Photography"],
  photos: [
    "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300",
    "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300",
    "https://images.unsplash.com/photo-1558086478-d632ccc5a833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300",
  ],
  trustScore: 94,
  stats: {
    matches: 23,
    likes: 81,
    profileViews: 412,
    daysActive: 14,
  },
};

const SETTINGS_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: Bell, label: "Notifications", desc: "Manage alerts", color: "#f59e0b" },
      { icon: Lock, label: "Privacy & Safety", desc: "Control your visibility", color: "#7c3aed" },
      { icon: Shield, label: "Verification Status", desc: "Super Verified ✓", color: "#22c55e" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Users, label: "Discovery Settings", desc: "Who can see you", color: "#2563eb" },
      { icon: Heart, label: "Match Preferences", desc: "Year, major, distance", color: "#ec4899" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & FAQ", desc: "Get support", color: "#6b7280" },
      { icon: LogOut, label: "Sign Out", desc: "", color: "#ef4444" },
    ],
  },
];

const PREMIUM_FEATURES = [
  { icon: Eye, label: "See who liked you", desc: "Unlock 8+ profiles waiting", color: "#f59e0b" },
  { icon: Zap, label: "Profile Boost", desc: "3x more visibility for 1 hour", color: "#7c3aed" },
  { icon: Star, label: "5 Super Likes/day", desc: "Stand out from the crowd", color: "#ec4899" },
  { icon: BarChart2, label: "Advanced Filters", desc: "Major, GPA, clubs & more", color: "#2563eb" },
];

export function ProfileScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "stats" | "settings">("profile");
  const [showPremium, setShowPremium] = useState(false);
  const [boostActive, setBoostActive] = useState(false);

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
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1a1a2e" }}>My Profile</h2>
          <div className="flex items-center gap-2">
            <motion.button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPremium(true)}
            >
              <Star size={11} />
              UniVibe+
            </motion.button>
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#f0ebff" }}
            >
              <Settings size={15} style={{ color: "#7c3aed" }} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1 pb-1">
          {(["profile", "stats", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-1.5 rounded-xl capitalize"
              style={{
                background: activeTab === tab ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "#f5f5f5",
                color: activeTab === tab ? "white" : "#9ca3af",
                fontWeight: activeTab === tab ? 700 : 400,
                fontSize: "0.78rem",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Profile card */}
              <div className="px-4 pt-4">
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}
                >
                  {/* Main photo */}
                  <div className="relative h-64">
                    <img
                      src={MY_PROFILE.img}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)",
                      }}
                    />

                    {/* Edit button */}
                    <button
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
                    >
                      <Edit3 size={15} style={{ color: "white" }} />
                    </button>

                    {/* Verification badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {MY_PROFILE.superVerified && (
                        <div
                          className="flex items-center gap-1 px-2 py-1 rounded-full"
                          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                        >
                          <Shield size={9} style={{ color: "white" }} />
                          <span style={{ color: "white", fontSize: "0.58rem", fontWeight: 700 }}>
                            SUPER VERIFIED
                          </span>
                        </div>
                      )}
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
                      >
                        <Trophy size={9} style={{ color: "#f59e0b" }} />
                        <span style={{ color: "#fbbf24", fontSize: "0.58rem", fontWeight: 700 }}>
                          Trust Score: {MY_PROFILE.trustScore}%
                        </span>
                      </div>
                    </div>

                    {/* Name overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white" style={{ fontSize: "1.4rem", fontWeight: 800 }}>
                        {MY_PROFILE.name}, {MY_PROFILE.age}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={11} style={{ color: "#c4b5fd" }} />
                        <span style={{ color: "#c4b5fd", fontSize: "0.72rem" }}>
                          {MY_PROFILE.major} · {MY_PROFILE.year}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin size={11} style={{ color: "#a78bfa" }} />
                        <span style={{ color: "#a78bfa", fontSize: "0.7rem" }}>
                          {MY_PROFILE.university}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile details */}
                  <div className="p-4 bg-white">
                    <p style={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.6, marginBottom: "12px" }}>
                      {MY_PROFILE.bio}
                    </p>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {MY_PROFILE.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2.5 py-1 rounded-full"
                          style={{
                            background: "#f0ebff",
                            color: "#7c3aed",
                            fontSize: "0.72rem",
                            fontWeight: 500,
                          }}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>

                    {/* Edit profile button */}
                    <button
                      className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
                      style={{
                        background: "#f0ebff",
                        color: "#7c3aed",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                    >
                      <Edit3 size={13} />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo grid */}
              <div className="px-4 pt-4">
                <div className="flex items-center justify-between mb-2.5">
                  <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a1a2e" }}>My Photos</p>
                  <button style={{ fontSize: "0.75rem", color: "#7c3aed", fontWeight: 600 }}>Add Photo</button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MY_PROFILE.photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: "rgba(124,58,237,0.85)", fontSize: "0.5rem", fontWeight: 700 }}>
                          MAIN
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    className="aspect-square rounded-xl flex flex-col items-center justify-center border-2 border-dashed"
                    style={{ borderColor: "#e9d5ff" }}
                  >
                    <Camera size={18} style={{ color: "#c4b5fd" }} />
                    <span style={{ fontSize: "0.6rem", color: "#c4b5fd", marginTop: "4px" }}>Add</span>
                  </button>
                </div>
              </div>

              {/* Trust score */}
              <div className="px-4 pt-4 pb-2">
                <div
                  className="p-4 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, #0f0a1e, #1a0533)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white" style={{ fontWeight: 700, fontSize: "0.9rem" }}>Trust Score</p>
                      <p style={{ color: "#a78bfa", fontSize: "0.7rem" }}>Based on your verifications</p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: "#c084fc", fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>
                        {MY_PROFILE.trustScore}
                      </p>
                      <p style={{ color: "#6b7280", fontSize: "0.65rem" }}>/ 100</p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="h-2 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${MY_PROFILE.trustScore}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Edu Email", done: true },
                      { label: "Selfie Check", done: true },
                      { label: "Student ID", done: true },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-1">
                        <CheckCircle size={10} style={{ color: item.done ? "#22c55e" : "#4b5563" }} />
                        <span style={{ fontSize: "0.6rem", color: item.done ? "#86efac" : "#6b7280" }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-4"
            >
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Total Matches", value: MY_PROFILE.stats.matches, icon: Heart, color: "#ec4899", bg: "#fdf0ff" },
                  { label: "Profile Likes", value: MY_PROFILE.stats.likes, icon: Star, color: "#f59e0b", bg: "#fffbeb" },
                  { label: "Profile Views", value: MY_PROFILE.stats.profileViews, icon: Eye, color: "#7c3aed", bg: "#f0ebff" },
                  { label: "Days Active", value: MY_PROFILE.stats.daysActive, icon: Trophy, color: "#22c55e", bg: "#f0fdf4" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="p-4 rounded-2xl"
                    style={{ background: stat.bg, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                      style={{ background: `${stat.color}20` }}
                    >
                      <stat.icon size={15} style={{ color: stat.color }} />
                    </div>
                    <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a1a2e" }}>{stat.value}</p>
                    <p style={{ fontSize: "0.68rem", color: "#6b7280" }}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Premium upsell stats */}
              <div
                className="p-4 rounded-2xl mb-4"
                style={{ background: "linear-gradient(135deg, #0f0a1e, #1a0533)", border: "1px solid rgba(124,58,237,0.3)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={14} style={{ color: "#f59e0b" }} />
                  <p className="text-white" style={{ fontWeight: 700, fontSize: "0.88rem" }}>
                    Unlock Full Analytics
                  </p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Who viewed your profile", locked: true },
                    { label: "Who liked you (8 students)", locked: true },
                    { label: "Best time to be active", locked: true },
                    { label: "Match compatibility breakdown", locked: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-md flex items-center justify-center"
                        style={{ background: "rgba(124,58,237,0.3)" }}>
                        <Lock size={8} style={{ color: "#a78bfa" }} />
                      </div>
                      <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{item.label}</p>
                    </div>
                  ))}
                </div>
                <motion.button
                  className="w-full mt-4 py-2.5 rounded-xl text-white"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPremium(true)}
                >
                  ⚡ Upgrade to UniVibe+
                </motion.button>
              </div>

              {/* Boost button */}
              <motion.button
                className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white"
                style={{
                  background: boostActive
                    ? "linear-gradient(135deg, #16a34a, #22c55e)"
                    : "linear-gradient(135deg, #7c3aed, #ec4899)",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setBoostActive(!boostActive)}
              >
                <Zap size={16} />
                {boostActive ? "✓ Profile Boosted! 3x views for 1 hr" : "Boost My Profile"}
              </motion.button>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 pt-4 space-y-4"
            >
              {SETTINGS_SECTIONS.map((section) => (
                <div key={section.title}>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#9ca3af",
                      letterSpacing: "0.08em",
                      marginBottom: "8px",
                    }}
                  >
                    {section.title.toUpperCase()}
                  </p>
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                  >
                    {section.items.map((item, i) => (
                      <button
                        key={item.label}
                        className="w-full flex items-center gap-3 px-4 py-3.5 bg-white text-left"
                        style={{
                          borderBottom: i < section.items.length - 1 ? "1px solid #f5f5f5" : "none",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${item.color}15` }}
                        >
                          <item.icon size={14} style={{ color: item.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontWeight: 600, fontSize: "0.85rem", color: item.label === "Sign Out" ? "#ef4444" : "#1a1a2e" }}>
                            {item.label}
                          </p>
                          {item.desc && (
                            <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{item.desc}</p>
                          )}
                        </div>
                        {item.label !== "Sign Out" && (
                          <ChevronRight size={14} style={{ color: "#d1d5db" }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* App info */}
              <div className="text-center pb-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                >
                  <span style={{ fontSize: "18px" }}>💜</span>
                </div>
                <p style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "0.85rem" }}>UniVibe v1.0.0</p>
                <p style={{ color: "#9ca3af", fontSize: "0.7rem" }}>Campus-exclusive social network</p>
                <p style={{ color: "#d1d5db", fontSize: "0.65rem", marginTop: "4px" }}>
                  Terms · Privacy · Community Guidelines
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium modal */}
      <AnimatePresence>
        {showPremium && (
          <motion.div
            className="absolute inset-0 z-50 flex items-end"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPremium(false)}
          >
            <motion.div
              className="w-full rounded-t-3xl overflow-hidden"
              style={{ background: "#fff", maxHeight: "85%" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full mx-auto mt-3 mb-4" style={{ background: "#e5e7eb" }} />

              <div className="px-5 pb-8 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: "1.3rem", color: "#1a1a2e" }}>
                      UniVibe{" "}
                      <span
                        style={{
                          background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Plus
                      </span>{" "}
                      ⭐
                    </h3>
                    <p style={{ color: "#9ca3af", fontSize: "0.78rem" }}>
                      Take your campus connections to the next level
                    </p>
                  </div>
                  <button onClick={() => setShowPremium(false)}>
                    <X size={20} style={{ color: "#9ca3af" }} />
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-5">
                  {PREMIUM_FEATURES.map((feat) => (
                    <div key={feat.label} className="flex items-center gap-3 p-3.5 rounded-2xl"
                      style={{ background: "#f9f9f9" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${feat.color}18` }}>
                        <feat.icon size={18} style={{ color: feat.color }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a1a2e" }}>{feat.label}</p>
                        <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>{feat.desc}</p>
                      </div>
                      <CheckCircle size={16} style={{ color: "#22c55e", marginLeft: "auto" }} />
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Monthly", price: "$4.99", unit: "/mo", popular: false },
                    { label: "Semester", price: "$12.99", unit: "/sem", popular: true },
                  ].map((plan) => (
                    <button
                      key={plan.label}
                      className="p-4 rounded-2xl text-center relative"
                      style={{
                        border: plan.popular ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                        background: plan.popular ? "#f0ebff" : "#fff",
                      }}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-white"
                          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", fontSize: "0.6rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                          BEST VALUE
                        </div>
                      )}
                      <p style={{ fontWeight: 600, color: "#6b7280", fontSize: "0.8rem" }}>{plan.label}</p>
                      <p style={{ fontWeight: 800, color: "#1a1a2e", fontSize: "1.4rem" }}>{plan.price}</p>
                      <p style={{ color: "#9ca3af", fontSize: "0.68rem" }}>{plan.unit}</p>
                    </button>
                  ))}
                </div>

                <motion.button
                  className="w-full py-4 rounded-2xl text-white"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    boxShadow: "0 6px 24px rgba(245,158,11,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  ⭐ Upgrade Now — Student Price
                </motion.button>

                <p className="text-center text-gray-400 mt-3" style={{ fontSize: "0.68rem" }}>
                  Cancel anytime · No hidden fees · Student pricing only
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
