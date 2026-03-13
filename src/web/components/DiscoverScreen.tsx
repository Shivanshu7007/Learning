import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "motion/react";
import { Shield, X, Heart, Star, MapPin, BookOpen, Filter, ChevronDown } from "lucide-react";

interface Profile {
  id: number;
  name: string;
  age: number;
  major: string;
  year: string;
  bio: string;
  distance: string;
  verified: boolean;
  superVerified?: boolean;
  interests: string[];
  img: string;
  match: number;
  mutualFriends?: number;
}

const PROFILES: Profile[] = [
  {
    id: 1,
    name: "Priya",
    age: 21,
    major: "Computer Science",
    year: "Junior",
    bio: "Building the next big thing between problem sets ✨ Coffee lover, hackathon enthusiast & movie buff.",
    distance: "0.3 mi away",
    verified: true,
    superVerified: true,
    interests: ["💻 Tech", "☕ Coffee", "🎬 Movies", "🏃 Running"],
    img: "https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    match: 92,
    mutualFriends: 3,
  },
  {
    id: 2,
    name: "Marcus",
    age: 22,
    major: "Business Admin",
    year: "Senior",
    bio: "Econ nerd by day, aspiring chef by night 🍝 Looking for someone to explore off-campus restaurants with.",
    distance: "0.7 mi away",
    verified: true,
    interests: ["🍕 Foodie", "📈 Finance", "🏀 Sports", "🎵 Music"],
    img: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    match: 87,
    mutualFriends: 1,
  },
  {
    id: 3,
    name: "Yuki",
    age: 20,
    major: "Psychology",
    year: "Sophomore",
    bio: "Studying the mind, questioning everything 🧠 Lover of indie music, rainy days & good conversations.",
    distance: "On campus",
    verified: true,
    interests: ["🎵 Music", "📚 Studying", "🌿 Nature", "📸 Photography"],
    img: "https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    match: 84,
    mutualFriends: 5,
  },
  {
    id: 4,
    name: "Jordan",
    age: 23,
    major: "Engineering",
    year: "Graduate",
    bio: "Robotics PhD student. I design robots that help people 🤖 Weekend hiker and amateur photographer.",
    distance: "1.1 mi away",
    verified: true,
    interests: ["🤖 Tech", "🏔️ Hiking", "📸 Photography", "🌍 Languages"],
    img: "https://images.unsplash.com/photo-1686543972836-ad63f87f984b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    match: 79,
  },
  {
    id: 5,
    name: "Sofia",
    age: 21,
    major: "Political Science",
    year: "Junior",
    bio: "Future diplomat or forever student — still deciding 🌍 Model UN, debate club, and midnight study groups.",
    distance: "0.5 mi away",
    verified: true,
    interests: ["🌍 Languages", "📖 Reading", "🎭 Theater", "✈️ Travel"],
    img: "https://images.unsplash.com/photo-1771051027651-707f9fbd44b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    match: 88,
    mutualFriends: 2,
  },
];

function SwipeCard({
  profile,
  onSwipe,
  isTop,
  index,
}: {
  profile: Profile;
  onSwipe: (dir: "left" | "right" | "super") => void;
  isTop: boolean;
  index: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
  };

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0"
        style={{
          scale: 0.93 - index * 0.02,
          y: index * 10,
          zIndex: 10 - index,
        }}
      >
        <CardContent profile={profile} likeOpacity={null} nopeOpacity={null} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, y, rotate, zIndex: 20 }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
    >
      <CardContent profile={profile} likeOpacity={likeOpacity} nopeOpacity={nopeOpacity} />
    </motion.div>
  );
}

function CardContent({
  profile,
  likeOpacity,
  nopeOpacity,
}: {
  profile: Profile;
  likeOpacity: any;
  nopeOpacity: any;
}) {
  return (
    <div
      className="absolute inset-0 rounded-3xl overflow-hidden select-none"
      style={{
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        background: "#1a1a2e",
      }}
    >
      {/* Photo */}
      <img
        src={profile.img}
        alt={profile.name}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* LIKE stamp */}
      {likeOpacity && (
        <motion.div
          className="absolute top-16 left-6 px-4 py-2 rounded-xl border-4"
          style={{
            opacity: likeOpacity,
            borderColor: "#22c55e",
            transform: "rotate(-15deg)",
          }}
        >
          <span style={{ color: "#22c55e", fontSize: "1.4rem", fontWeight: 900 }}>LIKE</span>
        </motion.div>
      )}

      {/* NOPE stamp */}
      {nopeOpacity && (
        <motion.div
          className="absolute top-16 right-6 px-4 py-2 rounded-xl border-4"
          style={{
            opacity: nopeOpacity,
            borderColor: "#ef4444",
            transform: "rotate(15deg)",
          }}
        >
          <span style={{ color: "#ef4444", fontSize: "1.4rem", fontWeight: 900 }}>NOPE</span>
        </motion.div>
      )}

      {/* Badges */}
      <div className="absolute top-14 right-3 flex flex-col gap-1.5">
        {profile.superVerified && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
            <Shield size={10} style={{ color: "white" }} />
            <span style={{ color: "white", fontSize: "0.6rem", fontWeight: 700 }}>SUPER VERIFIED</span>
          </div>
        )}
        {profile.verified && !profile.superVerified && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: "rgba(124,58,237,0.9)" }}>
            <Shield size={10} style={{ color: "white" }} />
            <span style={{ color: "white", fontSize: "0.6rem", fontWeight: 700 }}>VERIFIED</span>
          </div>
        )}
        <div className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}>
          <span style={{ color: "#ec4899", fontSize: "0.6rem", fontWeight: 700 }}>💜 {profile.match}% match</span>
        </div>
      </div>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-end justify-between mb-1.5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-white" style={{ fontSize: "1.4rem", fontWeight: 800 }}>
                {profile.name}, {profile.age}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen size={11} style={{ color: "#c4b5fd" }} />
              <span style={{ color: "#c4b5fd", fontSize: "0.72rem" }}>
                {profile.major} · {profile.year}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={11} style={{ color: "#a78bfa" }} />
              <span style={{ color: "#a78bfa", fontSize: "0.7rem" }}>{profile.distance}</span>
              {profile.mutualFriends && (
                <>
                  <span style={{ color: "#6b7280", fontSize: "0.65rem" }}>·</span>
                  <span style={{ color: "#a78bfa", fontSize: "0.7rem" }}>{profile.mutualFriends} mutual campus friends</span>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-300 mb-2" style={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
          {profile.bio}
        </p>

        <div className="flex flex-wrap gap-1">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                color: "white",
                fontSize: "0.65rem",
              }}
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DiscoverScreen() {
  const [profiles, setProfiles] = useState(PROFILES);
  const [lastAction, setLastAction] = useState<"like" | "nope" | "super" | null>(null);
  const [matchPopup, setMatchPopup] = useState<Profile | null>(null);

  const handleSwipe = (dir: "left" | "right" | "super") => {
    if (dir === "right" || dir === "super") {
      setLastAction(dir === "super" ? "super" : "like");
      if (Math.random() > 0.4) {
        setMatchPopup(profiles[0]);
        setTimeout(() => setMatchPopup(null), 3000);
      }
    } else {
      setLastAction("nope");
    }
    setTimeout(() => setLastAction(null), 1000);
    setProfiles((prev) => prev.slice(1));
  };

  const resetProfiles = () => setProfiles(PROFILES);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#fafaf8" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-14 pb-3"
        style={{ background: "#fff", borderBottom: "1px solid #f0f0f0" }}
      >
        <div>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1a1a2e" }}>Discover</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "#f0ebff" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span style={{ fontSize: "0.62rem", color: "#7c3aed", fontWeight: 600 }}>Stanford</span>
            </div>
          </div>
          <p className="text-gray-400" style={{ fontSize: "0.7rem" }}>
            {profiles.length > 0 ? `${profiles.length * 12 + 4} students nearby` : "No more profiles"}
          </p>
        </div>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "#f0ebff" }}>
          <Filter size={16} style={{ color: "#7c3aed" }} />
        </button>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative px-4 py-4" style={{ paddingBottom: "90px" }}>
        <AnimatePresence>
          {matchPopup && (
            <motion.div
              className="absolute inset-x-4 top-4 z-50 p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                boxShadow: "0 8px 32px rgba(124,58,237,0.5)",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <span style={{ fontSize: "1.5rem" }}>🎉</span>
              <div className="text-white">
                <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>It's a Match!</p>
                <p style={{ fontSize: "0.75rem", opacity: 0.9 }}>
                  You and {matchPopup.name} liked each other
                </p>
              </div>
              <button
                className="ml-auto px-3 py-1.5 rounded-xl text-white border border-white border-opacity-30"
                style={{ fontSize: "0.75rem", fontWeight: 600, background: "rgba(255,255,255,0.2)" }}
              >
                Chat
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h3 style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1.1rem" }}>
              You've seen everyone!
            </h3>
            <p className="text-gray-400 mb-6" style={{ fontSize: "0.85rem" }}>
              Check back later for new students or expand your filters
            </p>
            <button
              onClick={resetProfiles}
              className="px-6 py-3 rounded-2xl text-white"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
            >
              See Profiles Again
            </button>
          </div>
        ) : (
          <div className="relative h-full">
            {profiles.slice(0, 3).map((profile, index) => (
              <SwipeCard
                key={profile.id}
                profile={profile}
                onSwipe={handleSwipe}
                isTop={index === 0}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {profiles.length > 0 && (
        <div
          className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-4 px-6 z-30"
          style={{ paddingBottom: "8px" }}
        >
          <motion.button
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: "#fff",
              border: "2px solid #fee2e2",
              boxShadow: "0 4px 16px rgba(239,68,68,0.2)",
            }}
            onClick={() => handleSwipe("left")}
            whileTap={{ scale: 0.9 }}
          >
            <X size={22} style={{ color: "#ef4444" }} />
          </motion.button>

          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: "#fff",
              border: "2px solid #fef3c7",
              boxShadow: "0 4px 16px rgba(245,158,11,0.2)",
            }}
            onClick={() => handleSwipe("super")}
            whileTap={{ scale: 0.9 }}
          >
            <Star size={18} style={{ color: "#f59e0b" }} />
          </motion.button>

          <motion.button
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            }}
            onClick={() => handleSwipe("right")}
            whileTap={{ scale: 0.9 }}
          >
            <Heart size={22} style={{ color: "white" }} />
          </motion.button>
        </div>
      )}
    </div>
  );
}