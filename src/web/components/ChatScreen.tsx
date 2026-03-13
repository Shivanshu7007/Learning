import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Shield,
  MoreVertical,
  Send,
  Smile,
  Image,
  MapPin,
  Info,
  Flag,
  Ban,
  Video,
  Phone,
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  read?: boolean;
}

const CHAT_DATA: Record<
  string,
  {
    name: string;
    age: number;
    major: string;
    year: string;
    img: string;
    verified: boolean;
    superVerified?: boolean;
    online: boolean;
    mutualFriends?: number;
    matchPercent: number;
    messages: Message[];
  }
> = {
  "1": {
    name: "Priya",
    age: 21,
    major: "Computer Science",
    year: "Junior",
    img: "https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    superVerified: true,
    online: true,
    mutualFriends: 3,
    matchPercent: 92,
    messages: [
      { id: "1", text: "Hey! We matched 🎉", sender: "them", time: "2:14 PM", read: true },
      { id: "2", text: "Hi Priya! I noticed you're in CS too — what year are you?", sender: "me", time: "2:15 PM", read: true },
      { id: "3", text: "Junior! Taking 106B right now, it's wild 😅 You?", sender: "them", time: "2:16 PM", read: true },
      { id: "4", text: "Same! Which lecture section are you in? Maybe we've crossed paths 😄", sender: "me", time: "2:17 PM", read: true },
      { id: "5", text: "Omg same! Which lecture section are you in? 😄", sender: "them", time: "2:18 PM", read: true },
    ],
  },
  "2": {
    name: "Marcus",
    age: 22,
    major: "Business Admin",
    year: "Senior",
    img: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    online: false,
    mutualFriends: 1,
    matchPercent: 87,
    messages: [
      { id: "1", text: "You seem like a foodie too 🍜", sender: "them", time: "12:01 PM", read: true },
      { id: "2", text: "Oh absolutely! I'm always exploring new places around campus", sender: "me", time: "12:05 PM", read: true },
      { id: "3", text: "That coffee shop on University Ave is actually amazing 🍵", sender: "them", time: "12:08 PM", read: true },
    ],
  },
  "3": {
    name: "Yuki",
    age: 20,
    major: "Psychology",
    year: "Sophomore",
    img: "https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    online: false,
    mutualFriends: 5,
    matchPercent: 84,
    messages: [
      { id: "1", text: "Your interest in indie music is so relatable 🎵", sender: "me", time: "Yesterday", read: true },
      { id: "2", text: "Right?! Most people don't appreciate the vibe", sender: "them", time: "Yesterday", read: true },
      { id: "3", text: "You: Have you been to the music building? 🎵", sender: "me", time: "Yesterday", read: true },
    ],
  },
  "4": {
    name: "Jordan",
    age: 23,
    major: "Engineering",
    year: "Graduate",
    img: "https://images.unsplash.com/photo-1686543972836-ad63f87f984b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    online: true,
    matchPercent: 79,
    messages: [
      { id: "1", text: "The robotics lab is pretty cool once you get past the smell 😂", sender: "them", time: "2h ago", read: true },
      { id: "2", text: "Haha I believe it! What are you working on?", sender: "me", time: "2h ago", read: true },
      { id: "3", text: "The hiking trail near campus is 🔥 Let me know if you want to go", sender: "them", time: "2h ago", read: true },
    ],
  },
  "5": {
    name: "Sofia",
    age: 21,
    major: "Political Science",
    year: "Junior",
    img: "https://images.unsplash.com/photo-1771051027651-707f9fbd44b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    online: false,
    mutualFriends: 2,
    matchPercent: 88,
    messages: [
      { id: "1", text: "Model UN prep is consuming my life rn 😭", sender: "them", time: "Yesterday", read: true },
      { id: "2", text: "Which country are you representing?", sender: "me", time: "Yesterday", read: true },
    ],
  },
};

const QUICK_REPLIES = [
  "Hey! 👋",
  "Want to grab coffee? ☕",
  "Same class!",
  "That's so cool!",
];

export function ChatScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = id ? CHAT_DATA[id] : null;

  useEffect(() => {
    if (chat) setMessages(chat.messages);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || inputText.trim();
    if (!msg) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: msg,
      sender: "me",
      time: "now",
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulate reply
    if (chat) {
      setTimeout(() => {
        const replies = [
          "That's so interesting! 😊",
          "Haha totally agree 😂",
          "We should definitely meet up on campus!",
          "What are you up to this weekend?",
          "Oh cool! I love that too ✨",
        ];
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: "them",
          time: "now",
          read: false,
        };
        setMessages((prev) => [...prev, reply]);
      }, 1200 + Math.random() * 800);
    }
  };

  if (!chat) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "#fafaf8" }}>
        <div className="text-center">
          <p className="text-gray-400">Chat not found</p>
          <button
            onClick={() => navigate("/app/matches")}
            className="mt-4 px-4 py-2 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#fafaf8" }}>
      {/* Header */}
      <div
        className="flex-shrink-0"
        style={{
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          paddingTop: "56px",
        }}
      >
        <div className="flex items-center gap-3 px-3 pb-3">
          <button
            onClick={() => navigate("/app/matches")}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#f0ebff" }}
          >
            <ArrowLeft size={16} style={{ color: "#7c3aed" }} />
          </button>

          <button
            className="flex items-center gap-2.5 flex-1 text-left"
            onClick={() => setShowInfo(!showInfo)}
          >
            <div className="relative flex-shrink-0">
              <img
                src={chat.img}
                alt={chat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span style={{ fontWeight: 700, fontSize: "0.92rem", color: "#1a1a2e" }}>
                  {chat.name}
                </span>
                {chat.superVerified && (
                  <div
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                  >
                    <Shield size={8} style={{ color: "white" }} />
                    <span style={{ fontSize: "0.5rem", color: "white", fontWeight: 700 }}>SUPER</span>
                  </div>
                )}
                {chat.verified && !chat.superVerified && (
                  <Shield size={12} style={{ color: "#7c3aed" }} />
                )}
              </div>
              <p style={{ color: chat.online ? "#22c55e" : "#9ca3af", fontSize: "0.7rem" }}>
                {chat.online ? "Active now" : "Offline"}
                {chat.mutualFriends && (
                  <span style={{ color: "#9ca3af" }}> · {chat.mutualFriends} mutual friends</span>
                )}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#f5f5f5" }}
            >
              <Video size={15} style={{ color: "#7c3aed" }} />
            </button>
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center relative"
              style={{ background: "#f5f5f5" }}
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical size={15} style={{ color: "#6b7280" }} />
            </button>
          </div>
        </div>

        {/* Options dropdown */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              className="mx-3 mb-2 p-2 rounded-xl"
              style={{ background: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid #f0f0f0" }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {[
                { icon: Info, label: "View Profile", color: "#7c3aed" },
                { icon: Flag, label: "Report User", color: "#f59e0b" },
                { icon: Ban, label: "Block User", color: "#ef4444" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left"
                  onClick={() => setShowOptions(false)}
                  style={{ transition: "background 0.15s" }}
                >
                  <opt.icon size={14} style={{ color: opt.color }} />
                  <span style={{ fontSize: "0.82rem", color: "#374151" }}>{opt.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Match info banner */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="mx-3 mb-2 p-3 rounded-xl flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, #f0ebff, #fdf0ff)",
                border: "1px solid #e9d5ff",
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-2xl">💜</div>
              <div>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7c3aed" }}>
                  {chat.matchPercent}% Match · {chat.major} · {chat.year}
                </p>
                <p style={{ fontSize: "0.68rem", color: "#6b7280" }}>
                  You matched on campus — reach out and connect!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: "8px" }}>
        {/* Match notice */}
        <div className="text-center mb-6">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <img
                src={chat.img}
                className="w-8 h-8 rounded-full object-cover border-2"
                style={{ borderColor: "#7c3aed" }}
                alt=""
              />
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: "#ec4899", background: "#fdf0ff" }}
              >
                <span style={{ fontSize: "14px" }}>💜</span>
              </div>
            </div>
            <div
              className="px-4 py-1.5 rounded-full"
              style={{ background: "#f0ebff", border: "1px solid #e9d5ff" }}
            >
              <p style={{ fontSize: "0.72rem", color: "#7c3aed", fontWeight: 600 }}>
                🎉 You matched with {chat.name}!
              </p>
            </div>
            <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>
              You're both verified students · Same campus
            </p>
          </div>
        </div>

        {/* Messages list */}
        <div className="space-y-3">
          {messages.map((msg, i) => {
            const isMe = msg.sender === "me";
            const showAvatar = !isMe && (i === 0 || messages[i - 1]?.sender === "me");
            return (
              <motion.div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {!isMe && (
                  <div className="flex-shrink-0 w-7">
                    {showAvatar && (
                      <img
                        src={chat.img}
                        className="w-7 h-7 rounded-full object-cover"
                        alt=""
                      />
                    )}
                  </div>
                )}
                <div
                  className="px-3.5 py-2.5 rounded-2xl max-w-[75%]"
                  style={{
                    background: isMe
                      ? "linear-gradient(135deg, #7c3aed, #ec4899)"
                      : "#fff",
                    borderBottomRightRadius: isMe ? "6px" : "18px",
                    borderBottomLeftRadius: isMe ? "18px" : "6px",
                    boxShadow: isMe ? "0 4px 12px rgba(124,58,237,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <p style={{ color: isMe ? "white" : "#1a1a2e", fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {msg.text}
                  </p>
                </div>
                {isMe && (
                  <div className="flex-shrink-0 w-3">
                    <p style={{ fontSize: "0.55rem", color: "#9ca3af" }}>
                      {msg.read ? "✓✓" : "✓"}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Typing indicator sometimes */}
        <div className="mt-3 flex items-center gap-2">
          <img src={chat.img} className="w-6 h-6 rounded-full object-cover" alt="" />
          <div
            className="px-3 py-2 rounded-2xl flex items-center gap-1"
            style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#9ca3af" }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, delay, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            onClick={() => sendMessage(qr)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full"
            style={{
              background: "#f0ebff",
              border: "1px solid #e9d5ff",
              color: "#7c3aed",
              fontSize: "0.72rem",
              fontWeight: 500,
            }}
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 py-3"
        style={{
          background: "#fff",
          borderTop: "1px solid #f0f0f0",
          paddingBottom: "20px",
        }}
      >
        <button className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#f5f5f5" }}>
          <Image size={16} style={{ color: "#9ca3af" }} />
        </button>

        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-2xl"
          style={{ background: "#f5f5f5" }}
        >
          <input
            type="text"
            placeholder={`Message ${chat.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: "0.85rem", color: "#1a1a2e" }}
          />
          <button>
            <Smile size={16} style={{ color: "#9ca3af" }} />
          </button>
        </div>

        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: inputText.trim()
              ? "linear-gradient(135deg, #7c3aed, #ec4899)"
              : "#f0ebff",
          }}
          onClick={() => sendMessage()}
          whileTap={{ scale: 0.9 }}
          disabled={!inputText.trim()}
        >
          <Send size={15} style={{ color: inputText.trim() ? "white" : "#c4b5fd" }} />
        </motion.button>
      </div>
    </div>
  );
}
