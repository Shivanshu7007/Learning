import { ChatThread, Match, Profile } from "./types";

export const splashFeatures = [
  { emoji: "🛡️", label: "Verified", desc: "Edu email only" },
  { emoji: "🏫", label: "Campus", desc: "Same uni only" },
  { emoji: "💜", label: "Match", desc: "Real students" },
  { emoji: "🎉", label: "Vibe", desc: "Campus events" },
  { emoji: "🤝", label: "Networking", desc: "Campus circle" },
  { emoji: "✨", label: "Sparks", desc: "College romance" }
];

export const universities = [
  "Stanford University",
  "MIT",
  "Harvard University",
  "UC Berkeley",
  "UCLA",
  "NYU",
  "Columbia University"
];

export const majors = [
  "Computer Science",
  "Business Administration",
  "Psychology",
  "Biology",
  "Engineering",
  "Political Science",
  "Economics",
  "Art & Design",
  "Communications",
  "Pre-Med"
];

export const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

export const interests = [
  "📚 Studying",
  "🎵 Music",
  "🏃 Running",
  "🎮 Gaming",
  "🍕 Foodie",
  "✈️ Travel",
  "🎨 Art",
  "🏀 Sports",
  "🎭 Theater",
  "💻 Tech",
  "🌿 Nature",
  "📸 Photography",
  "🎸 Guitar",
  "🏋️ Fitness",
  "📖 Reading",
  "🎬 Movies",
  "🧪 Science",
  "🌍 Languages",
  "🤝 Volunteering"
];

export const discoverProfiles: Profile[] = [
  {
    id: "1",
    name: "Priya",
    age: 21,
    major: "Computer Science",
    year: "Junior",
    bio: "Building the next big thing between problem sets. Coffee lover, hackathon enthusiast and movie buff.",
    distance: "0.3 mi away",
    verified: true,
    superVerified: true,
    interests: ["💻 Tech", "☕ Coffee", "🎬 Movies", "🏃 Running"],
    img: "https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    match: 92,
    mutualFriends: 3
  },
  {
    id: "2",
    name: "Marcus",
    age: 22,
    major: "Business Admin",
    year: "Senior",
    bio: "Econ nerd by day, aspiring chef by night. Looking for someone to explore off-campus restaurants with.",
    distance: "0.7 mi away",
    verified: true,
    interests: ["🍕 Foodie", "📈 Finance", "🏀 Sports", "🎵 Music"],
    img: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    match: 87,
    mutualFriends: 1
  },
  {
    id: "3",
    name: "Yuki",
    age: 20,
    major: "Psychology",
    year: "Sophomore",
    bio: "Studying the mind, questioning everything. Lover of indie music, rainy days and good conversations.",
    distance: "On campus",
    verified: true,
    interests: ["🎵 Music", "📚 Studying", "🌿 Nature", "📸 Photography"],
    img: "https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    match: 84,
    mutualFriends: 5
  }
];

export const newMatches: Match[] = [
  {
    id: "1",
    name: "Priya",
    age: 21,
    major: "CS",
    img: "https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    isNew: true,
    online: true
  },
  {
    id: "3",
    name: "Yuki",
    age: 20,
    major: "Psych",
    img: "https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    isNew: true,
    online: false
  },
  {
    id: "5",
    name: "Sofia",
    age: 21,
    major: "Pol Sci",
    img: "https://images.unsplash.com/photo-1771051027651-707f9fbd44b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    isNew: true,
    online: true
  }
];

export const conversations: Match[] = [
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
    online: true
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
    online: false
  },
  {
    id: "3",
    name: "Yuki",
    age: 20,
    major: "Psych",
    img: "https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    verified: true,
    lastMessage: "Have you been to the music building? 🎵",
    lastTime: "1h",
    online: false
  }
];

export const chatThreads: Record<string, ChatThread> = {
  "1": {
    id: "1",
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
      { id: "2", text: "Hi Priya! I noticed you're in CS too.", sender: "me", time: "2:15 PM", read: true },
      { id: "3", text: "Junior! Taking 106B right now, it's wild 😅", sender: "them", time: "2:16 PM", read: true }
    ]
  },
  "2": {
    id: "2",
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
      { id: "2", text: "Always exploring new places around campus.", sender: "me", time: "12:05 PM", read: true }
    ]
  },
  "3": {
    id: "3",
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
      { id: "2", text: "Right? Most people don't appreciate the vibe.", sender: "them", time: "Yesterday", read: true }
    ]
  }
};

export const campusEvents = [
  {
    id: "1",
    title: "Spring Mixer @ Engineering Hall",
    date: "Fri Mar 13",
    time: "7:00 PM",
    location: "Engineering Hall",
    attendees: 84,
    img: "https://images.unsplash.com/photo-1701709304274-bd9e5402d979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    category: "Social",
    emoji: "🎉",
    going: true
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
    emoji: "💻",
    going: false
  }
];

export const discussions = [
  {
    id: "1",
    author: "Priya K.",
    authorImg: "https://images.unsplash.com/photo-1720659201153-e0c195776963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    major: "CS · Junior",
    time: "2m ago",
    text: "Anyone else low-key stressed about finals but also somehow watching Netflix?",
    likes: 47,
    comments: 12,
    tag: "Campus Life",
    liked: false
  },
  {
    id: "2",
    author: "Marcus T.",
    authorImg: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
    major: "Business · Senior",
    time: "15m ago",
    text: "The new coffee shop near the quad has the best matcha latte. Worth the walk.",
    likes: 89,
    comments: 23,
    tag: "Food & Drinks",
    liked: true
  }
];

export const groups = [
  { id: "1", name: "CS Study Squad", members: 342, emoji: "💻" },
  { id: "2", name: "Foodies on Campus", members: 218, emoji: "🍕" },
  { id: "3", name: "Music Collective", members: 156, emoji: "🎵" }
];

export const myProfile = {
  name: "Alex",
  age: 21,
  major: "Computer Science",
  year: "Junior",
  university: "Stanford University",
  bio: "CS Junior who loves building things. Hackathon addict, coffee dependent, always up for an adventure.",
  img: "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  verified: true,
  superVerified: true,
  interests: ["💻 Tech", "☕ Coffee", "🎬 Movies", "🏃 Running", "🎵 Music", "📸 Photography"],
  photos: [
    "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300",
    "https://images.unsplash.com/photo-1741699428220-65f37f3fbbcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300",
    "https://images.unsplash.com/photo-1558086478-d632ccc5a833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300"
  ],
  trustScore: 94,
  stats: {
    matches: 23,
    likes: 81,
    profileViews: 412,
    daysActive: 14
  }
};
