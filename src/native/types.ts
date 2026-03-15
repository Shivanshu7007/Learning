export type RootRoute = "splash" | "onboarding" | "app";
export type AppTab = "discover" | "matches" | "campus" | "profile";
export type OnboardingStep = "email" | "otp" | "profile" | "interests" | "done";
export type OnboardingMode = "signup" | "login";

export interface University {
  id: string;
  name: string;
  slug: string;
  email_domain: string | null;
  country_code: string;
  institution_type?: string | null;
  state_name?: string | null;
  district_name?: string | null;
  aishe_code?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  age: number | null;
  date_of_birth?: string | null;
  major: string | null;
  degree_name?: string | null;
  academic_year: string | null;
  semester?: string | null;
  bio: string | null;
  avatar_url: string | null;
  photo_urls: string[];
  interests: string[];
  verification_status: string;
  account_status?: string;
  onboarding_completed: boolean;
  trust_score: number;
  prefer_same_degree?: boolean;
  prefer_same_year?: boolean;
  prefer_same_semester?: boolean;
  show_active_status?: boolean;
  show_me_on_campus?: boolean;
  university: University;
}

export interface DiscoverProfile {
  id: string;
  email: string;
  full_name: string | null;
  age: number | null;
  date_of_birth?: string | null;
  major: string | null;
  degree_name?: string | null;
  academic_year: string | null;
  semester?: string | null;
  bio: string | null;
  avatar_url: string | null;
  photo_urls: string[];
  interests: string[];
  verification_status: string;
  onboarding_completed: boolean;
  trust_score: number;
  prefer_same_degree?: boolean;
  prefer_same_year?: boolean;
  prefer_same_semester?: boolean;
  show_active_status?: boolean;
  show_me_on_campus?: boolean;
  university: University;
}

export interface Match {
  id: string;
  status: string;
  matched_at: string;
  conversation_id: string | null;
  user: UserProfile;
}

export interface PendingLike {
  id: string;
  liker_id: string;
  liked_at: string;
  preview_image_url: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface ConversationSummary {
  id: string;
  match_id: string;
  other_user: UserProfile;
  last_message_at: string | null;
  last_message: Message | null;
  unread_count: number;
}

export interface ConversationDetail extends ConversationSummary {
  messages: Message[];
}

export interface CampusPost {
  id: string;
  body: string;
  tag: string;
  likes_count: number;
  comments_count: number;
  published_at: string;
  liked_by_me?: boolean;
  image_url?: string | null;
  user: UserProfile;
}

export interface CampusPostLike {
  id: string;
  user: UserProfile;
  created_at: string;
}

export interface CampusPostComment {
  id: string;
  body: string;
  created_at: string;
  user: UserProfile;
  replies: CampusPostComment[];
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  sub_category: string;
  location: string;
  starts_at: string;
  ends_at: string | null;
  attendees_count: number;
  university: University;
  creator: UserProfile | null;
}

export interface AuthPayload {
  token: string;
  user: UserProfile;
}

export interface VerifyCodeResult {
  verified: boolean;
  existing_user?: boolean;
  deactivated_user?: boolean;
  reactivation_token?: string;
  signup_token?: string;
  token?: string;
  user?: UserProfile;
}
