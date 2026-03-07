import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Mail,
  Shield,
  Camera,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Hash,
  FileText,
  Sparkles,
  Check,
} from "lucide-react";

type Step = "welcome" | "email" | "otp" | "verify" | "profile" | "interests" | "done";

const STEPS: Step[] = ["welcome", "email", "otp", "verify", "profile", "interests", "done"];

const UNIVERSITIES = [
  "Stanford University",
  "MIT",
  "Harvard University",
  "UC Berkeley",
  "UCLA",
  "NYU",
  "Columbia University",
];

const MAJORS = [
  "Computer Science",
  "Business Administration",
  "Psychology",
  "Biology",
  "Engineering",
  "Political Science",
  "Economics",
  "Art & Design",
  "Communications",
  "Pre-Med",
];

const INTERESTS = [
  "📚 Studying", "🎵 Music", "🏃 Running", "🎮 Gaming", "🍕 Foodie",
  "✈️ Travel", "🎨 Art", "🏀 Sports", "🎭 Theater", "💻 Tech",
  "🌿 Nature", "📸 Photography", "🎸 Guitar", "🏋️ Fitness", "📖 Reading",
  "🎬 Movies", "🧪 Science", "🌍 Languages", "🎤 Music", "🤝 Volunteering",
];

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("welcome");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifyMethod, setVerifyMethod] = useState<"selfie" | "id" | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState(UNIVERSITIES[0]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("20");
  const [major, setMajor] = useState(MAJORS[0]);
  const [year, setYear] = useState(YEARS[1]);
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifyDone, setVerifyDone] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const goNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex]);
    }
  };

  const goBack = () => {
    if (step === "welcome") {
      navigate("/");
      return;
    }
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) setStep(STEPS[prevIndex]);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 8
        ? [...prev, interest]
        : prev
    );
  };

  const gradStyle = {
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const btnStyle = {
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
  };

  const inputStyle = {
    background: "#f3f0ff",
    border: "1.5px solid #e9d5ff",
    borderRadius: "14px",
    padding: "14px 16px",
    fontSize: "0.95rem",
    outline: "none",
    width: "100%",
    color: "#1a1a2e",
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#fafaf8" }}>
      {/* Status bar spacer */}
      <div style={{ height: "60px" }} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "#f0ebff" }}
        >
          <ArrowLeft size={18} style={{ color: "#7c3aed" }} />
        </button>

        {step !== "welcome" && step !== "done" && (
          <div className="flex-1 mx-4">
            <div className="h-1.5 rounded-full" style={{ background: "#f0ebff" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
          <span style={{ fontSize: "14px" }}>💜</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center pt-4"
            >
              <div className="w-20 h-20 rounded-3xl mb-6 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 8px 32px rgba(124,58,237,0.35)" }}>
                <span style={{ fontSize: "40px" }}>💜</span>
              </div>
              <h1 className="mb-2" style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1a1a2e" }}>
                Welcome to{" "}
                <span style={gradStyle}>UniVibe</span>
              </h1>
              <p className="text-gray-500 mb-8" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                The only verified dating & social app built exclusively for college students. No fake profiles — just your real campus community.
              </p>

              <div className="w-full space-y-3 mb-8">
                {[
                  { icon: Mail, title: "Verify with .edu email", desc: "Only real students get in", color: "#7c3aed" },
                  { icon: Shield, title: "Campus-only network", desc: "Connect within your university", color: "#2563eb" },
                  { icon: Camera, title: "Photo verification", desc: "Selfie liveness check prevents fakes", color: "#ec4899" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3 p-3.5 rounded-2xl text-left"
                    style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}18` }}>
                      <item.icon size={18} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1a1a2e" }}>{item.title}</p>
                      <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{item.desc}</p>
                    </div>
                    <Check size={14} className="ml-auto flex-shrink-0" style={{ color: "#22c55e" }} />
                  </div>
                ))}
              </div>

              <button
                className="w-full py-4 rounded-2xl text-white mb-3"
                style={{ ...btnStyle, fontSize: "1rem", fontWeight: 700 }}
                onClick={goNext}
              >
                Create My Account
              </button>
              <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </motion.div>
          )}

          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center"
                style={{ background: "#f0ebff" }}>
                <GraduationCap size={24} style={{ color: "#7c3aed" }} />
              </div>
              <h2 className="mb-1" style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1a1a2e" }}>
                Your University Email
              </h2>
              <p className="text-gray-500 mb-6" style={{ fontSize: "0.85rem" }}>
                Use your official .edu email address. We'll verify you're a real student.
              </p>

              <div className="mb-4">
                <label className="block mb-2 text-gray-600" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  SELECT UNIVERSITY
                </label>
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-gray-600" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                  EDU EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#7c3aed" }} />
                  <input
                    type="email"
                    placeholder="yourname@stanford.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: "40px" }}
                  />
                </div>
                {email && !email.includes(".edu") && (
                  <p className="text-red-400 mt-1.5" style={{ fontSize: "0.75rem" }}>
                    Please use your .edu university email
                  </p>
                )}
                {email && email.includes(".edu") && (
                  <p className="text-green-500 mt-1.5 flex items-center gap-1" style={{ fontSize: "0.75rem" }}>
                    <CheckCircle size={12} /> Valid university email detected
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl mb-6" style={{ background: "#f0f7ff", border: "1px solid #dbeafe" }}>
                <p className="text-blue-600" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                  🔒 <strong>Privacy first:</strong> Your .edu email is only used for verification and never shown to other users or used for marketing.
                </p>
              </div>

              <button
                className="w-full py-4 rounded-2xl text-white"
                style={{ ...btnStyle, fontSize: "0.95rem", fontWeight: 700, opacity: email.includes(".edu") ? 1 : 0.5 }}
                onClick={() => { setOtpSent(true); goNext(); }}
                disabled={!email.includes(".edu")}
              >
                Send Verification Code
              </button>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center"
                style={{ background: "#fdf0ff" }}>
                <Hash size={24} style={{ color: "#ec4899" }} />
              </div>
              <h2 className="mb-1" style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1a1a2e" }}>
                Check Your Email
              </h2>
              <p className="text-gray-500 mb-6" style={{ fontSize: "0.85rem" }}>
                We sent a 6-digit code to{" "}
                <span style={{ color: "#7c3aed", fontWeight: 600 }}>{email || "yourname@stanford.edu"}</span>
              </p>

              {/* OTP inputs */}
              <div className="flex gap-2 mb-6 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="text-center"
                    style={{
                      width: "46px",
                      height: "56px",
                      background: digit ? "#f0ebff" : "#f8f8f8",
                      border: digit ? "2px solid #7c3aed" : "1.5px solid #e5e7eb",
                      borderRadius: "14px",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#7c3aed",
                      outline: "none",
                    }}
                  />
                ))}
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-400 mb-2" style={{ fontSize: "0.8rem" }}>
                  Didn't receive the code?
                </p>
                <button className="text-purple-600" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Resend Code (0:45)
                </button>
              </div>

              <div className="p-3.5 rounded-2xl mb-6" style={{ background: "#f0fff4", border: "1px solid #bbf7d0" }}>
                <p className="text-green-700" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                  ✅ OTP codes expire in 10 minutes. Redis-backed rate limiting prevents abuse (max 3 attempts per hour).
                </p>
              </div>

              <button
                className="w-full py-4 rounded-2xl text-white"
                style={{ ...btnStyle, fontSize: "0.95rem", fontWeight: 700, opacity: otp.join("").length === 6 ? 1 : 0.5 }}
                onClick={goNext}
              >
                Verify Code
              </button>
            </motion.div>
          )}

          {step === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center"
                style={{ background: "#f0ebff" }}>
                <Shield size={24} style={{ color: "#7c3aed" }} />
              </div>
              <h2 className="mb-1" style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1a1a2e" }}>
                Get Verified ✨
              </h2>
              <p className="text-gray-500 mb-6" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
                Boost your trust score and get a verification badge. Choose your preferred method:
              </p>

              <div className="space-y-3 mb-6">
                {[
                  {
                    method: "selfie" as const,
                    icon: Camera,
                    title: "Selfie Verification",
                    desc: "Take a quick selfie with a gesture. AI liveness detection ensures you're real.",
                    badge: "RECOMMENDED",
                    color: "#7c3aed",
                  },
                  {
                    method: "id" as const,
                    icon: FileText,
                    title: "Student ID Verification",
                    desc: "Upload your university student ID. Securely processed and deleted after verification.",
                    badge: "MOST TRUSTED",
                    color: "#2563eb",
                  },
                ].map((opt) => (
                  <button
                    key={opt.method}
                    className="w-full text-left p-4 rounded-2xl border-2 transition-all"
                    style={{
                      borderColor: verifyMethod === opt.method ? opt.color : "#e5e7eb",
                      background: verifyMethod === opt.method ? `${opt.color}08` : "#fff",
                    }}
                    onClick={() => setVerifyMethod(opt.method)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${opt.color}18` }}>
                        <opt.icon size={18} style={{ color: opt.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a2e" }}>{opt.title}</span>
                          <span className="px-1.5 py-0.5 rounded-full text-white" style={{ fontSize: "0.6rem", background: opt.color }}>
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-gray-500" style={{ fontSize: "0.75rem", lineHeight: 1.5 }}>{opt.desc}</p>
                      </div>
                      {verifyMethod === opt.method && (
                        <CheckCircle size={18} style={{ color: opt.color }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {!verifyMethod && (
                <button
                  className="w-full py-3 rounded-2xl text-gray-400 mb-3"
                  style={{ border: "1.5px dashed #d1d5db", fontSize: "0.85rem" }}
                  onClick={goNext}
                >
                  Skip for now (limited features)
                </button>
              )}

              {verifyMethod && !verifyDone && (
                <button
                  className="w-full py-4 rounded-2xl text-white mb-3"
                  style={{ ...btnStyle, fontSize: "0.95rem", fontWeight: 700 }}
                  onClick={() => setVerifyDone(true)}
                >
                  {verifyMethod === "selfie" ? "📸 Start Selfie Check" : "📄 Upload Student ID"}
                </button>
              )}

              {verifyDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl mb-4 text-center"
                  style={{ background: "#f0fff4", border: "1px solid #bbf7d0" }}
                >
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-green-700" style={{ fontWeight: 700 }}>Verification Submitted!</p>
                  <p className="text-green-600" style={{ fontSize: "0.78rem" }}>Your profile will show a verified badge after review (usually instant)</p>
                </motion.div>
              )}

              {verifyDone && (
                <button
                  className="w-full py-4 rounded-2xl text-white"
                  style={{ ...btnStyle, fontSize: "0.95rem", fontWeight: 700 }}
                  onClick={goNext}
                >
                  Continue →
                </button>
              )}
            </motion.div>
          )}

          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center"
                style={{ background: "#fdf0ff" }}>
                <Sparkles size={24} style={{ color: "#ec4899" }} />
              </div>
              <h2 className="mb-1" style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1a1a2e" }}>
                Build Your Profile
              </h2>
              <p className="text-gray-500 mb-5" style={{ fontSize: "0.85rem" }}>
                Show your campus community who you are
              </p>

              {/* Photo upload */}
              <div className="flex gap-2 mb-5">
                <button className="flex-1 h-28 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed"
                  style={{ borderColor: "#7c3aed", background: "#f8f5ff" }}>
                  <Camera size={22} style={{ color: "#7c3aed" }} />
                  <span style={{ fontSize: "0.7rem", color: "#7c3aed", marginTop: "4px", fontWeight: 600 }}>Add Photo</span>
                </button>
                {["https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"].map((src, i) => (
                  <div key={i} className="flex-1 h-28 rounded-2xl overflow-hidden relative">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-10" />
                  </div>
                ))}
                <button className="flex-1 h-28 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed"
                  style={{ borderColor: "#e5e7eb", background: "#f9f9f9" }}>
                  <span className="text-gray-400" style={{ fontSize: "1.2rem" }}>+</span>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block mb-1.5 text-gray-600" style={{ fontSize: "0.78rem", fontWeight: 600 }}>YOUR NAME</label>
                  <input type="text" placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block mb-1.5 text-gray-600" style={{ fontSize: "0.78rem", fontWeight: 600 }}>AGE</label>
                    <input type="number" placeholder="20" value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1.5 text-gray-600" style={{ fontSize: "0.78rem", fontWeight: 600 }}>YEAR</label>
                    <select value={year} onChange={(e) => setYear(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                      {YEARS.map((y) => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5 text-gray-600" style={{ fontSize: "0.78rem", fontWeight: 600 }}>MAJOR</label>
                  <select value={major} onChange={(e) => setMajor(e.target.value)} style={{ ...inputStyle, appearance: "none" }}>
                    {MAJORS.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5 text-gray-600" style={{ fontSize: "0.78rem", fontWeight: 600 }}>BIO</label>
                  <textarea
                    placeholder="Tell your campus community about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                  <p className="text-right text-gray-400 mt-1" style={{ fontSize: "0.7rem" }}>{bio.length}/200</p>
                </div>
              </div>

              <button
                className="w-full py-4 rounded-2xl text-white mt-5"
                style={{ ...btnStyle, fontSize: "0.95rem", fontWeight: 700 }}
                onClick={goNext}
              >
                Continue →
              </button>
            </motion.div>
          )}

          {step === "interests" && (
            <motion.div
              key="interests"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center"
                style={{ background: "#f0ebff" }}>
                <BookOpen size={24} style={{ color: "#7c3aed" }} />
              </div>
              <h2 className="mb-1" style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1a1a2e" }}>
                Your Interests
              </h2>
              <p className="text-gray-500 mb-2" style={{ fontSize: "0.85rem" }}>
                Pick up to 8 interests. We'll find people who vibe with you.
              </p>
              <p className="mb-5" style={{ fontSize: "0.78rem", color: "#7c3aed", fontWeight: 600 }}>
                {selectedInterests.length}/8 selected
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className="px-3 py-2 rounded-full border-2 transition-all"
                    style={{
                      borderColor: selectedInterests.includes(interest) ? "#7c3aed" : "#e5e7eb",
                      background: selectedInterests.includes(interest) ? "#f0ebff" : "#fff",
                      fontSize: "0.8rem",
                      color: selectedInterests.includes(interest) ? "#7c3aed" : "#4b5563",
                      fontWeight: selectedInterests.includes(interest) ? 600 : 400,
                    }}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <button
                className="w-full py-4 rounded-2xl text-white"
                style={{ ...btnStyle, fontSize: "0.95rem", fontWeight: 700, opacity: selectedInterests.length > 0 ? 1 : 0.6 }}
                onClick={goNext}
                disabled={selectedInterests.length === 0}
              >
                Complete Profile 🎉
              </button>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center pt-8"
            >
              <motion.div
                className="text-7xl mb-6"
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                🎉
              </motion.div>
              <h2 className="mb-2" style={{ fontWeight: 800, fontSize: "1.6rem", color: "#1a1a2e" }}>
                You're verified!
              </h2>
              <p className="text-gray-500 mb-2" style={{ fontSize: "0.9rem" }}>
                Welcome to <span style={{ fontWeight: 700, color: "#7c3aed" }}>Stanford's UniVibe</span> community
              </p>

              <div className="w-full p-4 rounded-2xl mb-6" style={{ background: "linear-gradient(135deg, #f0ebff, #fdf0ff)", border: "1px solid #e9d5ff" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{name || "Alex"}, {age}</span>
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: "#7c3aed" }}>
                        <Shield size={9} style={{ color: "white" }} />
                        <span style={{ fontSize: "0.6rem", color: "white", fontWeight: 600 }}>VERIFIED</span>
                      </div>
                    </div>
                    <p className="text-gray-500" style={{ fontSize: "0.78rem" }}>{major} · {year} · Stanford</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {selectedInterests.slice(0, 4).map((i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full" style={{ background: "white", fontSize: "0.7rem", color: "#7c3aed" }}>{i}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 w-full mb-6">
                {[
                  { emoji: "💜", text: "Your profile is live on campus" },
                  { emoji: "🔒", text: "Only Stanford students can see you" },
                  { emoji: "✨", text: "You have a verified badge" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 p-2.5 rounded-xl"
                    style={{ background: "#f8f8f8" }}>
                    <span style={{ fontSize: "1rem" }}>{item.emoji}</span>
                    <span className="text-gray-600" style={{ fontSize: "0.82rem" }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <button
                className="w-full py-4 rounded-2xl text-white"
                style={{ ...btnStyle, fontSize: "1rem", fontWeight: 700 }}
                onClick={() => navigate("/app")}
              >
                Start Exploring Campus 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
