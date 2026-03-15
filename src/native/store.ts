import { createContext, useContext } from "react";
import {
  AuthPayload,
  CampusEvent,
  CampusPostComment,
  CampusPostLike,
  CampusPost,
  ConversationDetail,
  ConversationSummary,
  DiscoverProfile,
  Match,
  PendingLike,
  University,
  UserProfile
} from "./types";

export interface AppStoreValue {
  token: string | null;
  me: UserProfile | null;
  universities: University[];
  discoverProfiles: DiscoverProfile[];
  matches: Match[];
  pendingLikes: PendingLike[];
  conversations: ConversationSummary[];
  conversationMap: Record<string, ConversationDetail>;
  unreadMessagesCount: number;
  unreadChatsCount: number;
  campusPosts: CampusPost[];
  campusEvents: CampusEvent[];
  loading: boolean;
  error: string | null;
  apiBaseUrl: string;
  refreshAuthedData: () => Promise<void>;
  searchUniversities: (query: string) => Promise<University[]>;
  fetchPendingLikes: () => Promise<void>;
  sendVerificationCode: (email: string) => Promise<{ previewCode?: string | null }>;
  verifyCode: (email: string, code: string) => Promise<AuthPayload | { signupToken: string } | { reactivationToken: string }>;
  reactivateAccount: (reactivationToken: string) => Promise<void>;
  register: (payload: {
    signupToken: string;
    universitySlug: string;
    universityName: string;
    universityState?: string | null;
    universityDistrict?: string | null;
    institutionType?: string | null;
    fullName: string;
    major: string;
    bio: string;
    interests: string[];
    onboardingCompleted: boolean;
  }) => Promise<void>;
  updateMe: (payload: {
    fullName?: string;
    dateOfBirth?: string;
    major?: string;
    degreeName?: string;
    academicYear?: string;
    semester?: string;
    bio?: string;
    interests?: string[];
    onboardingCompleted?: boolean;
    preferSameDegree?: boolean;
    preferSameYear?: boolean;
    preferSameSemester?: boolean;
    showActiveStatus?: boolean;
    showMeOnCampus?: boolean;
    profileImage?: {
      uri: string;
      name: string;
      type: string;
    } | null;
  }) => Promise<void>;
  swipe: (targetId: string, direction: "pass" | "like" | "super_like") => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  markConversationRead: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, body: string) => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<UserProfile>;
  reportUser: (userId: string, reason: string, notes?: string) => Promise<void>;
  unmatchMatch: (matchId: string) => Promise<void>;
  createCampusPost: (
    body: string,
    tag?: string,
    image?: {
      uri: string;
      name: string;
      type: string;
    } | null
  ) => Promise<void>;
  toggleCampusPostLike: (postId: string) => Promise<void>;
  loadCampusPostLikes: (postId: string) => Promise<CampusPostLike[]>;
  loadCampusPostComments: (postId: string) => Promise<CampusPostComment[]>;
  createCampusPostComment: (postId: string, body: string, parentId?: string | null) => Promise<void>;
  rsvpEvent: (eventId: string) => Promise<void>;
  deactivateAccount: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  signOut: () => void;
}

export const AppStoreContext = createContext<AppStoreValue | null>(null);

export function useAppStore() {
  const value = useContext(AppStoreContext);

  if (!value) {
    throw new Error("useAppStore must be used within AppStoreContext");
  }

  return value;
}
