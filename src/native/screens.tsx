import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { campusEvents, chatThreads, conversations, discussions, discoverProfiles, groups, interests, majors, myProfile, newMatches, universities, years } from "./data";
import { Chip, GradientButton, HeroCard, Input, Screen, SectionTitle } from "./components";
import { AppTab, OnboardingStep } from "./types";
import { theme } from "./theme";

function isValidAcademicEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1];

  if (!domain) {
    return false;
  }

  return (
    domain.endsWith(".edu") ||
    domain.endsWith(".edu.in") ||
    domain.endsWith(".ac.in")
  );
}

function BrandIcon({ compact = false }: { compact?: boolean }) {
  const size = compact ? 42 : 64;
  const outerRadius = size / 2;
  const ring2Size = compact ? 32 : 52;
  const ring3Size = compact ? 26 : 40;
  const ring4Size = compact ? 16 : 28;

  return (
    <View style={[styles.brandIconWrap, { width: size, height: size }]}>
      <View style={[styles.brandShell, { width: size, height: size, borderRadius: outerRadius }]}>
        <View style={[styles.brandRingSecondary, { width: ring2Size, height: ring2Size, borderRadius: ring2Size / 2 }]}>
          <View style={[styles.brandRing, { width: ring3Size, height: ring3Size, borderRadius: ring3Size / 2 }]}>
            <View style={[styles.brandRingInner, { width: ring4Size, height: ring4Size, borderRadius: ring4Size / 2 }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

function BrandLockup() {
  return (
    <View style={styles.brandLockup}>
      <BrandIcon />
      <Text style={styles.brandWordmark}>
        <Text style={styles.brandWordmarkBlack}>Un</Text>
        <Text style={styles.brandWordmarkRed}>i</Text>
        <Text style={styles.brandWordmarkBlack}>V</Text>
        <Text style={styles.brandWordmarkRed}>i</Text>
        <Text style={styles.brandWordmarkBlack}>be</Text>
      </Text>
      <Text style={styles.brandSlogan}>
        <Text style={styles.brandSloganBlack}>CAMPUS </Text>
        <Text style={styles.brandSloganRed}>ONLY</Text>
        <Text style={styles.brandSloganBlack}> NETWORK</Text>
      </Text>
    </View>
  );
}

export function SplashScreen({
  onGetStarted
}: {
  onGetStarted: () => void;
}) {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1763890763377-abd05301034d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
      }}
      style={styles.splashBg}
    >
      <LinearGradient colors={["rgba(15,10,30,0.25)", "rgba(15,10,30,0.55)", "#0F0A1E"]} style={styles.splashOverlay}>
        <BrandLockup />

        <View style={styles.splashContent}>
          <Text style={styles.heroTitle}>Meet Your Campus{"\n"}People</Text>
          <Text style={styles.heroSubtitle}>
            The only dating and social app exclusively for verified college students.
          </Text>
          <GradientButton title="Get Started With College Email" onPress={onGetStarted} />
          <Text style={styles.splashFooter}>Private verification for real college students</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

export function OnboardingScreen({ onDone, onBackToSplash }: { onDone: () => void; onBackToSplash: () => void }) {
  const steps: OnboardingStep[] = ["welcome", "email", "otp", "verify", "profile", "interests", "done"];
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifyMethod, setVerifyMethod] = useState<"selfie" | "id" | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("20");
  const [bio, setBio] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(universities[0]);
  const [major, setMajor] = useState(majors[0]);
  const [year, setYear] = useState(years[1]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const canSendVerificationCode = isValidAcademicEmail(email);

  const stepIndex = steps.indexOf(step);
  const progress = `${((stepIndex / (steps.length - 1)) * 100).toFixed(0)}%`;

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : prev.length < 8 ? [...prev, value] : prev
    );
  };

  const next = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const back = () => {
    if (step === "welcome") {
      onBackToSplash();
      return;
    }
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.onboardingHeader}>
        <Pressable onPress={back} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>←</Text>
        </Pressable>
        {step !== "welcome" && step !== "done" ? (
          <View style={styles.progressTrack}>
            <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={[styles.progressFill, { width: progress }]} />
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        <BrandIcon compact />
      </View>

      {step === "welcome" ? (
        <View>
          <SectionTitle title="Campus-only connections" subtitle="Fast onboarding, stronger safety, real students." />
          <View style={styles.card}>
            {[
              "Edu email verification",
              "Photo + student ID checks",
              "Campus feed and events",
              "Only mutual matches can chat"
            ].map((item) => (
              <View key={item} style={styles.listRow}>
                <Text style={styles.rowEmoji}>✓</Text>
                <Text style={styles.rowLabel}>{item}</Text>
              </View>
            ))}
          </View>
          <GradientButton title="Create My Account" onPress={next} />
        </View>
      ) : null}

      {step === "email" ? (
        <View>
          <SectionTitle title="Your University Email" subtitle="Use your official academic email for verification." />
          <Text style={styles.fieldLabel}>UNIVERSITY</Text>
          <Selector value={selectedUniversity} options={universities} onChange={setSelectedUniversity} />
          <Text style={styles.fieldLabel}>EMAIL</Text>
          <Input value={email} onChangeText={setEmail} placeholder="yourname@college.edu or you@university.ac.in" />
          <View style={{ height: 16 }} />
          <GradientButton title="Send Verification Code" onPress={next} disabled={!canSendVerificationCode} />
        </View>
      ) : null}

      {step === "otp" ? (
        <View>
          <SectionTitle title="Check Your Email" subtitle={`We sent a code to ${email || "your inbox"}.`} />
          <Input value={otp} onChangeText={setOtp} placeholder="Enter 6-digit code" />
          <View style={{ height: 16 }} />
          <GradientButton title="Verify OTP" onPress={next} disabled={otp.length < 4} />
        </View>
      ) : null}

      {step === "verify" ? (
        <View>
          <SectionTitle title="Trust & Safety Check" subtitle="Choose a verification method to unlock the campus network." />
          <View style={styles.gridTwo}>
            <Pressable onPress={() => setVerifyMethod("selfie")} style={[styles.optionCard, verifyMethod === "selfie" && styles.optionCardActive]}>
              <Text style={styles.optionEmoji}>🤳</Text>
              <Text style={styles.optionTitle}>Selfie Liveness</Text>
              <Text style={styles.optionDesc}>Quick camera verification</Text>
            </Pressable>
            <Pressable onPress={() => setVerifyMethod("id")} style={[styles.optionCard, verifyMethod === "id" && styles.optionCardActive]}>
              <Text style={styles.optionEmoji}>🪪</Text>
              <Text style={styles.optionTitle}>Student ID Check</Text>
              <Text style={styles.optionDesc}>Manual proof review</Text>
            </Pressable>
          </View>
          <View style={{ height: 16 }} />
          <GradientButton title="Continue" onPress={next} disabled={!verifyMethod} />
        </View>
      ) : null}

      {step === "profile" ? (
        <View>
          <SectionTitle title="Build Your Profile" subtitle="Set the basics other students will see." />
          <Text style={styles.fieldLabel}>NAME</Text>
          <Input value={name} onChangeText={setName} placeholder="Alex Johnson" />
          <Text style={styles.fieldLabel}>AGE</Text>
          <Input value={age} onChangeText={setAge} placeholder="20" />
          <Text style={styles.fieldLabel}>MAJOR</Text>
          <Selector value={major} options={majors} onChange={setMajor} />
          <Text style={styles.fieldLabel}>YEAR</Text>
          <Selector value={year} options={years} onChange={setYear} />
          <Text style={styles.fieldLabel}>BIO</Text>
          <Input value={bio} onChangeText={setBio} placeholder="Share your vibe, clubs, or what you are looking for." multiline />
          <View style={{ height: 16 }} />
          <GradientButton title="Save Profile" onPress={next} disabled={!name.trim()} />
        </View>
      ) : null}

      {step === "interests" ? (
        <View>
          <SectionTitle title="Choose Your Interests" subtitle="Pick up to 8 so your matches feel relevant." />
          <View style={styles.wrap}>
            {interests.map((item) => (
              <Chip key={item} label={item} active={selectedInterests.includes(item)} onPress={() => toggleInterest(item)} />
            ))}
          </View>
          <View style={{ height: 16 }} />
          <GradientButton title="Finish Setup" onPress={next} disabled={selectedInterests.length === 0} />
        </View>
      ) : null}

      {step === "done" ? (
        <View>
          <SectionTitle title="You’re In" subtitle="Your profile is ready for the campus network." />
          <View style={styles.card}>
            <Text style={styles.doneTitle}>{name || "Alex"}, welcome to {selectedUniversity}.</Text>
            <Text style={styles.subtitle}>
              Verified with {verifyMethod === "id" ? "student ID" : "selfie liveness"} and ready to discover.
            </Text>
          </View>
          <GradientButton title="Open UniVibe" onPress={onDone} />
        </View>
      ) : null}
    </Screen>
  );
}

export function DiscoverScreen() {
  const [profiles, setProfiles] = useState(discoverProfiles);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const topProfile = profiles[0];
  const nextProfiles = profiles.slice(1, 3);

  const takeAction = (action: "nope" | "like" | "super") => {
    if (!topProfile) {
      return;
    }
    setLastAction(action);
    setProfiles((prev) => prev.slice(1));
  };

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Discover</Text>
          <Text style={styles.miniText}>{profiles.length > 0 ? `${profiles.length * 12 + 4} students nearby` : "No more profiles"}</Text>
        </View>
        <Chip label="Stanford" active />
      </View>

      {topProfile ? (
        <View>
          <HeroCard image={topProfile.img} height={520}>
            <View style={styles.discoverBadgeRow}>
              <Chip label={`${topProfile.match}% match`} active />
              {topProfile.superVerified ? <Chip label="Super Verified" active /> : null}
            </View>
            <Text style={styles.cardTitle}>{topProfile.name}, {topProfile.age}</Text>
            <Text style={styles.cardMeta}>{topProfile.major} · {topProfile.year} · {topProfile.distance}</Text>
            <Text style={styles.cardBody}>{topProfile.bio}</Text>
            <View style={styles.wrap}>
              {topProfile.interests.map((item) => (
                <View key={item} style={styles.overlayTag}>
                  <Text style={styles.overlayTagText}>{item}</Text>
                </View>
              ))}
            </View>
          </HeroCard>

          <View style={styles.actionRow}>
            <ActionCircle label="✖" onPress={() => takeAction("nope")} background="#FEE2E2" color={theme.colors.danger} />
            <ActionCircle label="★" onPress={() => takeAction("super")} background="#FEF3C7" color={theme.colors.warning} />
            <ActionCircle label="♥" onPress={() => takeAction("like")} background="#FCE7F3" color={theme.colors.secondary} />
          </View>

          {lastAction ? (
            <Text style={styles.feedbackText}>
              {lastAction === "nope" ? "Skipped profile" : lastAction === "super" ? "Super like sent" : "Like sent"}
            </Text>
          ) : null}

          <Text style={styles.sectionCaption}>Up next</Text>
          {nextProfiles.map((profile) => (
            <View key={profile.id} style={[styles.card, { marginBottom: 12 }]}>
              <Text style={styles.rowLabel}>{profile.name}, {profile.age} · {profile.major}</Text>
              <Text style={styles.subtitle}>{profile.bio}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.doneTitle}>You’ve reached the end of the deck.</Text>
          <Text style={styles.subtitle}>Reset the demo to see profiles again.</Text>
          <View style={{ height: 16 }} />
          <GradientButton title="Reset Profiles" onPress={() => setProfiles(discoverProfiles)} />
        </View>
      )}
    </Screen>
  );
}

export function MatchesScreen({
  onOpenChat
}: {
  onOpenChat: (chatId: string) => void;
}) {
  const [tab, setTab] = useState<"matches" | "chats">("matches");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => conversations.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Messages</Text>
          <Text style={styles.miniText}>Campus-only conversations</Text>
        </View>
        <Chip label="Premium" active />
      </View>

      <View style={styles.segmentRow}>
        <SegmentButton title={`Matches (${newMatches.length})`} active={tab === "matches"} onPress={() => setTab("matches")} />
        <SegmentButton title="Chats" active={tab === "chats"} onPress={() => setTab("chats")} />
      </View>

      {tab === "matches" ? (
        <View style={styles.gridTwo}>
          {newMatches.map((item) => (
            <Pressable key={item.id} onPress={() => onOpenChat(item.id)} style={styles.matchCard}>
              <Image source={{ uri: item.img }} style={styles.matchImage} />
              <LinearGradient colors={["transparent", "rgba(15,10,30,0.92)"]} style={styles.matchOverlay}>
                <Text style={styles.matchName}>{item.name}, {item.age}</Text>
                <Text style={styles.matchMajor}>{item.major}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      ) : (
        <View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search conversations..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
          {filtered.map((item) => (
            <Pressable key={item.id} onPress={() => onOpenChat(item.id)} style={styles.chatRow}>
              <Image source={{ uri: item.img }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.lastMessage}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.miniText}>{item.lastTime}</Text>
                {item.unread ? (
                  <View style={styles.unreadBubble}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}

export function ChatScreen({
  chatId,
  onBack
}: {
  chatId: string;
  onBack: () => void;
}) {
  const thread = chatThreads[chatId];
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(thread?.messages ?? []);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages(thread?.messages ?? []);
  }, [chatId, thread]);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (!thread) {
    return (
      <Screen>
        <View style={[styles.card, { margin: 20 }]}>
          <Text style={styles.doneTitle}>Chat not found</Text>
          <View style={{ height: 16 }} />
          <GradientButton title="Back to Matches" onPress={onBack} />
        </View>
      </Screen>
    );
  }

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) {
      return;
    }
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, text: value, sender: "me", time: "Now", read: false }
    ]);
    setInput("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.chatHeader}>
        <Pressable onPress={onBack} style={styles.iconButton}>
          <Text style={styles.iconButtonText}>←</Text>
        </Pressable>
        <Image source={{ uri: thread.img }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.rowLabel}>{thread.name}</Text>
          <Text style={styles.miniText}>{thread.online ? "Active now" : "Offline"} · {thread.matchPercent}% match</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.sender === "me" ? styles.myMessage : styles.theirMessage]}>
            <Text style={[styles.messageText, item.sender === "me" && { color: "#fff" }]}>{item.text}</Text>
            <Text style={[styles.messageTime, item.sender === "me" && { color: "rgba(255,255,255,0.72)" }]}>{item.time}</Text>
          </View>
        )}
      />

      <View style={styles.quickReplyRow}>
        {["Hey! 👋", "Coffee later?", "Same class!", "That’s cool"].map((item) => (
          <Chip key={item} label={item} onPress={() => send(item)} />
        ))}
      </View>

      <View style={styles.composerRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Send a message..."
          placeholderTextColor="#9CA3AF"
          style={styles.composerInput}
        />
        <Pressable onPress={() => send()} style={styles.sendButton}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function CampusScreen() {
  const [tab, setTab] = useState<"feed" | "events" | "groups">("feed");
  const [posts, setPosts] = useState(discussions);
  const [events, setEvents] = useState(campusEvents);

  const toggleLike = (id: string) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post)));
  };

  const toggleGoing = (id: string) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, going: !event.going, attendees: event.going ? event.attendees - 1 : event.attendees + 1 } : event)));
  };

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>Campus</Text>
          <Text style={styles.miniText}>247 students active now</Text>
        </View>
        <Chip label="Post" active />
      </View>

      <View style={styles.segmentRow}>
        <SegmentButton title="Feed" active={tab === "feed"} onPress={() => setTab("feed")} />
        <SegmentButton title="Events" active={tab === "events"} onPress={() => setTab("events")} />
        <SegmentButton title="Groups" active={tab === "groups"} onPress={() => setTab("groups")} />
      </View>

      {tab === "feed" ? (
        <View>
          {posts.map((post) => (
            <View key={post.id} style={[styles.card, { marginBottom: 12 }]}>
              <View style={styles.listRow}>
                <Image source={{ uri: post.authorImg }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{post.author}</Text>
                  <Text style={styles.miniText}>{post.major} · {post.time}</Text>
                </View>
                <Chip label={post.tag} />
              </View>
              <Text style={styles.cardBodyDark}>{post.text}</Text>
              <View style={styles.actionMetaRow}>
                <Pressable onPress={() => toggleLike(post.id)}>
                  <Text style={[styles.linkText, post.liked && { color: theme.colors.secondary }]}>♥ {post.likes}</Text>
                </Pressable>
                <Text style={styles.linkText}>💬 {post.comments}</Text>
                <Text style={styles.linkText}>↗ Share</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {tab === "events" ? (
        <View>
          {events.map((event) => (
            <HeroCard key={event.id} image={event.img} height={220}>
              <Chip label={event.category} active />
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardMeta}>{event.date} · {event.time} · {event.location}</Text>
              <Text style={styles.cardMeta}>{event.attendees} going</Text>
              <View style={{ height: 12 }} />
              <Pressable onPress={() => toggleGoing(event.id)} style={styles.smallActionButton}>
                <Text style={styles.smallActionText}>{event.going ? "Going" : "Join Event"}</Text>
              </Pressable>
            </HeroCard>
          ))}
        </View>
      ) : null}

      {tab === "groups" ? (
        <View>
          {groups.map((group) => (
            <View key={group.id} style={[styles.card, { marginBottom: 12 }]}>
              <View style={styles.listRow}>
                <Text style={styles.groupEmoji}>{group.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowLabel}>{group.name}</Text>
                  <Text style={styles.subtitle}>{group.members} members</Text>
                </View>
                <Chip label="Join" active />
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

export function ProfileScreen() {
  const [tab, setTab] = useState<"profile" | "stats" | "settings">("profile");
  const settings = [
    "Notifications",
    "Privacy & Safety",
    "Verification Status",
    "Discovery Settings",
    "Help & FAQ",
    "Sign Out"
  ];

  return (
    <Screen scroll>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>My Profile</Text>
          <Text style={styles.miniText}>Campus identity and account settings</Text>
        </View>
        <Chip label="UniVibe+" active />
      </View>

      <View style={styles.segmentRow}>
        <SegmentButton title="Profile" active={tab === "profile"} onPress={() => setTab("profile")} />
        <SegmentButton title="Stats" active={tab === "stats"} onPress={() => setTab("stats")} />
        <SegmentButton title="Settings" active={tab === "settings"} onPress={() => setTab("settings")} />
      </View>

      {tab === "profile" ? (
        <View>
          <HeroCard image={myProfile.img} height={320}>
            <Chip label="Super Verified" active />
            <Text style={styles.cardTitle}>{myProfile.name}, {myProfile.age}</Text>
            <Text style={styles.cardMeta}>{myProfile.major} · {myProfile.year}</Text>
            <Text style={styles.cardMeta}>{myProfile.university}</Text>
          </HeroCard>

          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.cardBodyDark}>{myProfile.bio}</Text>
            <View style={styles.wrap}>
              {myProfile.interests.map((item) => (
                <Chip key={item} label={item} />
              ))}
            </View>
          </View>

          <View style={styles.photoGrid}>
            {myProfile.photos.map((photo) => (
              <Image key={photo} source={{ uri: photo }} style={styles.photoTile} />
            ))}
          </View>
        </View>
      ) : null}

      {tab === "stats" ? (
        <View>
          <View style={[styles.card, { backgroundColor: theme.colors.dark }]}>
            <Text style={[styles.rowLabel, { color: "#fff" }]}>Trust Score</Text>
            <Text style={styles.scoreText}>{myProfile.trustScore}/100</Text>
          </View>
          {Object.entries(myProfile.stats).map(([key, value]) => (
            <View key={key} style={[styles.card, { marginTop: 12 }]}>
              <Text style={styles.rowLabel}>{labelize(key)}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {tab === "settings" ? (
        <View>
          {settings.map((item) => (
            <View key={item} style={[styles.card, { marginBottom: 12 }]}>
              <Text style={styles.rowLabel}>{item}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

export function BottomTabs({
  tab,
  onChange
}: {
  tab: AppTab;
  onChange: (tab: AppTab) => void;
}) {
  const items: Array<{ key: AppTab; icon: string; label: string }> = [
    { key: "discover", icon: "🧭", label: "Discover" },
    { key: "matches", icon: "💬", label: "Matches" },
    { key: "campus", icon: "🏫", label: "Campus" },
    { key: "profile", icon: "👤", label: "Profile" }
  ];

  return (
    <View style={styles.bottomTabs}>
      {items.map((item) => (
        <Pressable key={item.key} onPress={() => onChange(item.key)} style={styles.tabItem}>
          <Text style={[styles.tabIcon, tab === item.key && { opacity: 1 }]}>{item.icon}</Text>
          <Text style={[styles.tabLabel, tab === item.key && styles.tabLabelActive]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function SegmentButton({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segmentButton, active && styles.segmentButtonActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{title}</Text>
    </Pressable>
  );
}

function Selector({
  value,
  options,
  onChange
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      {options.map((item) => (
        <Chip key={item} label={item} active={item === value} onPress={() => onChange(item)} />
      ))}
    </ScrollView>
  );
}

function ActionCircle({
  label,
  onPress,
  background,
  color
}: {
  label: string;
  onPress: () => void;
  background: string;
  color: string;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.actionCircle, { backgroundColor: background }]}>
      <Text style={[styles.actionCircleText, { color }]}>{label}</Text>
    </Pressable>
  );
}

function labelize(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

const styles = StyleSheet.create({
  splashBg: {
    flex: 1,
    backgroundColor: theme.colors.dark
  },
  splashOverlay: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 36
  },
  brandLockup: {
    alignItems: "center",
    marginTop: -6
  },
  brandIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6
  },
  brandShell: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#7C3AED",
    backgroundColor: "transparent"
  },
  brandRingSecondary: {
    borderWidth: 4,
    borderColor: "#EC4899",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  brandRing: {
    borderWidth: 3,
    borderColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  brandRingInner: {
    borderWidth: 2,
    borderColor: "#E9D5FF",
    backgroundColor: "transparent"
  },
  brandWordmark: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 2
  },
  brandWordmarkBlack: {
    color: "#E9D5FF"
  },
  brandWordmarkRed: {
    color: "#EC4899"
  },
  brandSlogan: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4.2,
    marginTop: 6
  },
  brandSloganBlack: {
    color: "#E9D5FF"
  },
  brandSloganRed: {
    color: "#EC4899"
  },
  splashContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingTop: 24
  },
  heroTitle: {
    color: "#fff",
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center"
  },
  heroSubtitle: {
    color: "#DDD6FE",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center"
  },
  splashFooter: {
    color: "#A78BFA",
    fontSize: 12,
    textAlign: "center",
    marginTop: 16
  },
  onboardingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center"
  },
  iconButtonText: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700"
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F0EBFF",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999
  },
  fieldLabel: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.muted
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F3F0FF"
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  rowEmoji: {
    color: theme.colors.success,
    fontSize: 18
  },
  rowLabel: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700"
  },
  gridTwo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  optionCard: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F3F0FF"
  },
  optionCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "#F8F4FF"
  },
  optionEmoji: {
    fontSize: 28,
    marginBottom: 12
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text
  },
  optionDesc: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  doneTitle: {
    color: theme.colors.text,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "800",
    marginBottom: 6
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.text
  },
  miniText: {
    color: theme.colors.muted,
    fontSize: 12
  },
  discoverBadgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12
  },
  cardTitle: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "800"
  },
  cardMeta: {
    color: "#DDD6FE",
    fontSize: 13,
    marginTop: 6
  },
  cardBody: {
    color: "#F5F3FF",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 12
  },
  overlayTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)"
  },
  overlayTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 20
  },
  actionCircle: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center"
  },
  actionCircleText: {
    fontSize: 28,
    fontWeight: "800"
  },
  feedbackText: {
    textAlign: "center",
    color: theme.colors.primary,
    fontWeight: "700",
    marginBottom: 18
  },
  sectionCaption: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#F3F4F6"
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.primary
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280"
  },
  segmentTextActive: {
    color: "#fff"
  },
  matchCard: {
    width: "48%",
    height: 220,
    borderRadius: 24,
    overflow: "hidden"
  },
  matchImage: {
    width: "100%",
    height: "100%"
  },
  matchOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14
  },
  matchName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800"
  },
  matchMajor: {
    color: "#DDD6FE",
    fontSize: 13
  },
  searchInput: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    color: theme.colors.text
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6"
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26
  },
  unreadBubble: {
    marginTop: 6,
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary
  },
  unreadText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700"
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: theme.colors.surface
  },
  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff"
  },
  messageText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20
  },
  messageTime: {
    marginTop: 6,
    color: theme.colors.muted,
    fontSize: 11
  },
  quickReplyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12
  },
  composerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 10,
    backgroundColor: theme.colors.surface
  },
  composerInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    color: theme.colors.text
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: theme.colors.primary
  },
  cardBodyDark: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 14
  },
  actionMetaRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 14
  },
  linkText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "600"
  },
  smallActionButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999
  },
  smallActionText: {
    color: theme.colors.primary,
    fontWeight: "700"
  },
  groupEmoji: {
    fontSize: 26
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16
  },
  photoTile: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 18
  },
  scoreText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 8
  },
  statValue: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6
  },
  bottomTabs: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)"
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.55
  },
  tabLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600"
  },
  tabLabelActive: {
    color: theme.colors.primary
  }
});
