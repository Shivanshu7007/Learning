import { RouterProvider } from "react-router";
import { router } from "./routes";
import { MobileFrame } from "./components/MobileFrame";

export default function App() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a0533 40%, #0d1b3e 100%)" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            top: "-10%",
            left: "-5%",
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
            bottom: "-5%",
            right: "5%",
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #2563eb 0%, transparent 70%)",
            top: "50%",
            right: "-5%",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Desktop: Side info panels + phone */}
      <div className="relative z-10 flex items-center gap-12 px-8 py-8">

        {/* Left panel */}
        <div className="hidden xl:flex flex-col gap-6 max-w-xs">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
            >
              <span style={{ fontSize: "24px" }}>💜</span>
            </div>
            <div>
              <p
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  background: "linear-gradient(90deg, #c084fc, #f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                UniVibe
              </p>
              <p style={{ color: "#a78bfa", fontSize: "0.75rem" }}>Campus-Exclusive Social Network</p>
            </div>
          </div>

          <p style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: 1.7 }}>
            The first verified dating & social platform built exclusively for college students. No randos, no bots — just your real campus community.
          </p>

          <div className="space-y-3">
            {[
              { emoji: "🎓", title: "Edu Email Only", desc: "Strict .edu verification via OTP" },
              { emoji: "🛡️", title: "Photo Verification", desc: "AI liveness detection & ID checks" },
              { emoji: "🏫", title: "Campus-Locked", desc: "Only see students from your university" },
              { emoji: "💬", title: "Safe Messaging", desc: "Chat only after mutual match" },
              { emoji: "🎪", title: "Campus Events", desc: "Discover and join campus activities" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  <span style={{ fontSize: "14px" }}>{f.emoji}</span>
                </div>
                <div>
                  <p style={{ color: "#e2e8f0", fontSize: "0.82rem", fontWeight: 600 }}>{f.title}</p>
                  <p style={{ color: "#94a3b8", fontSize: "0.73rem" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ color: "#a78bfa", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "10px" }}>
              MVP ROADMAP
            </p>
            <div className="space-y-2">
              {[
                { label: "College Email Verification", done: true },
                { label: "Profile Creation + Photos", done: true },
                { label: "Swipe-Based Matching", done: true },
                { label: "Real-Time Messaging", done: true },
                { label: "Campus Feed & Events", done: true },
                { label: "AI Moderation Engine", done: false },
                { label: "iOS & Android App", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: item.done ? "#16a34a20" : "rgba(255,255,255,0.06)" }}
                  >
                    <span style={{ fontSize: "9px", color: item.done ? "#22c55e" : "#4b5563" }}>
                      {item.done ? "✓" : "○"}
                    </span>
                  </div>
                  <p style={{ color: item.done ? "#86efac" : "#6b7280", fontSize: "0.72rem" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Phone frame */}
        <div className="flex-shrink-0">
          <MobileFrame>
            <RouterProvider router={router} />
          </MobileFrame>
        </div>

        {/* Right panel */}
        <div className="hidden xl:flex flex-col gap-5 max-w-xs">
          <div
            className="p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ color: "#a78bfa", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "12px" }}>
              PLATFORM STATS (DEMO)
            </p>
            {[
              { label: "Campus Networks", value: "47", trend: "+12 this month" },
              { label: "Verified Students", value: "126K", trend: "98.2% verified" },
              { label: "Daily Matches", value: "8,400", trend: "⬆ 23% WoW" },
              { label: "Fake Profiles Blocked", value: "99.7%", trend: "AI moderated" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between py-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div>
                  <p style={{ color: "#94a3b8", fontSize: "0.73rem" }}>{s.label}</p>
                  <p style={{ color: "#64748b", fontSize: "0.65rem" }}>{s.trend}</p>
                </div>
                <p style={{ color: "#c084fc", fontSize: "1.1rem", fontWeight: 800 }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div
            className="p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ color: "#a78bfa", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "12px" }}>
              TRUST & SAFETY LAYERS
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Edu Email OTP (Redis TTL)", icon: "✉️", color: "#22c55e" },
                { label: "Selfie Liveness AI Check", icon: "🤳", color: "#7c3aed" },
                { label: "Student ID Verification", icon: "🪪", color: "#2563eb" },
                { label: "Duplicate Image Detection", icon: "🔍", color: "#f59e0b" },
                { label: "Rate Limiting (Redis)", icon: "⚡", color: "#ec4899" },
                { label: "AI Content Moderation", icon: "🤖", color: "#6366f1" },
                { label: "Report & Block Tools", icon: "🚨", color: "#ef4444" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `${t.color}20` }}
                  >
                    <span style={{ fontSize: "11px" }}>{t.icon}</span>
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "0.74rem" }}>{t.label}</p>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ color: "#a78bfa", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "10px" }}>
              REVENUE MODEL
            </p>
            <div className="space-y-2">
              {[
                { label: "UniVibe+ Subscription", tag: "SaaS", color: "#f59e0b" },
                { label: "Profile Boosts", tag: "IAP", color: "#7c3aed" },
                { label: "Campus Event Ads", tag: "Ad", color: "#2563eb" },
                { label: "Brand Partnerships", tag: "B2B", color: "#22c55e" },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <p style={{ color: "#94a3b8", fontSize: "0.73rem" }}>{r.label}</p>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: `${r.color}20`, color: r.color, fontSize: "0.6rem", fontWeight: 700 }}
                  >
                    {r.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ color: "#a78bfa", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "10px" }}>
              TECH STACK
            </p>
            <div className="flex flex-wrap gap-2">
              {["React Native", "Node.js", "PostgreSQL", "Redis", "AWS S3", "OpenAI", "WebSockets", "JWT Auth", "Stripe"].map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.25)",
                    color: "#c084fc",
                    fontSize: "0.68rem",
                    fontWeight: 500,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-4 text-center hidden xl:block">
        <p style={{ color: "#374151", fontSize: "0.72rem" }}>
          UniVibe Concept Demo · Not collecting real data · For educational & pitch purposes only
        </p>
      </div>
    </div>
  );
}
