export type RootRoute = "splash" | "onboarding" | "app";
export type AppTab = "discover" | "matches" | "campus" | "profile";
export type OnboardingStep = "welcome" | "email" | "otp" | "verify" | "profile" | "interests" | "done";

export interface Profile {
  id: string;
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

export interface Match {
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

export interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  read?: boolean;
}

export interface ChatThread {
  id: string;
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
