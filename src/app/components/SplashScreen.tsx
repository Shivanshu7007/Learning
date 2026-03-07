import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Shield, Users, Heart, Zap } from "lucide-react";

const campusImg = "https://images.unsplash.com/photo-1763890763377-abd05301034d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwb3V0ZG9vciUyMHN0dWRlbnRzfGVufDF8fHx8MTc3Mjc0NzQ2MXww&ixlib=rb-4.1.0&q=80&w=1080";

const features = [
  { icon: Shield, label: "Verified", desc: "Edu email only", color: "#7c3aed" },
  { icon: Users, label: "Campus", desc: "Same uni only", color: "#2563eb" },
  { icon: Heart, label: "Match", desc: "Real students", color: "#ec4899" },
  { icon: Zap, label: "Vibe", desc: "Campus events", color: "#f59e0b" },
];

export function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: "#0f0a1e" }}>
      {/* Hero image with overlay */}
      <div className="absolute inset-0">
        <img
          src={campusImg}
          alt="campus"
          className="w-full h-full object-cover opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,10,30,0.3) 0%, rgba(15,10,30,0.5) 40%, rgba(15,10,30,0.95) 70%, #0f0a1e 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full pt-16 pb-8 px-6">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 mb-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
          >
            <span className="text-base">💜</span>
          </div>
          <span className="text-white" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
            Uni<span style={{ background: "linear-gradient(90deg, #c084fc, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Vibe</span>
          </span>
        </motion.div>

        {/* Middle section */}
        <motion.div
          className="flex-1 flex flex-col justify-end pb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Floating profile pics */}
          <div className="relative h-40 mb-8">
            {[
              { src: "https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", x: "15%", y: "10%", size: 56, delay: 0 },
              { src: "https://images.unsplash.com/photo-1648218943004-5ec604ef627a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", x: "55%", y: "0%", size: 64, delay: 0.1 },
              { src: "https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", x: "32%", y: "35%", size: 52, delay: 0.2 },
              { src: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400", x: "72%", y: "30%", size: 48, delay: 0.3 },
            ].map((p, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: p.x, top: p.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: p.delay + 0.3, type: "spring" }}
              >
                <div
                  className="rounded-full border-2 overflow-hidden"
                  style={{
                    width: p.size,
                    height: p.size,
                    borderColor: i % 2 === 0 ? "#7c3aed" : "#ec4899",
                    boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
                  }}
                >
                  <img src={p.src} alt="" className="w-full h-full object-cover" />
                </div>
                {i === 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border border-white flex items-center justify-center">
                    <span style={{ fontSize: "8px" }}>✓</span>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Floating hearts */}
            {[
              { x: "42%", y: "5%", delay: 0.5 },
              { x: "80%", y: "60%", delay: 0.7 },
            ].map((h, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-500"
                style={{ left: h.x, top: h.y, fontSize: "18px" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: [0, 1.2, 1] }}
                transition={{ delay: h.delay, duration: 0.5 }}
              >
                ❤️
              </motion.div>
            ))}
          </div>

          <h1
            className="text-white mb-3"
            style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.1 }}
          >
            Meet your{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #c084fc, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              campus
            </span>{" "}
            people
          </h1>
          <p className="text-purple-200 mb-6" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
            The only dating & social app exclusively for verified college students. No randos — just your campus community.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <f.icon size={12} style={{ color: f.color }} />
                <span className="text-white" style={{ fontSize: "0.75rem", fontWeight: 500 }}>{f.label}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.button
            className="w-full py-4 rounded-2xl text-white mb-3"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              fontSize: "1rem",
              fontWeight: 700,
              boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
            }}
            onClick={() => navigate("/onboarding")}
            whileTap={{ scale: 0.97 }}
          >
            Get Started with .edu Email
          </motion.button>

          <motion.button
            className="w-full py-3.5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.9rem",
            }}
            onClick={() => navigate("/app")}
            whileTap={{ scale: 0.97 }}
          >
            View App Demo →
          </motion.button>

          <p className="text-center text-purple-400 mt-4" style={{ fontSize: "0.7rem" }}>
            🔒 Your .edu email stays private · Campus-only network
          </p>
        </motion.div>
      </div>
    </div>
  );
}
