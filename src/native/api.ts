import Constants from "expo-constants";
import { NativeModules, Platform } from "react-native";
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
  UserProfile,
  VerifyCodeResult
} from "./types";

const MANUAL_API_HOST = "";

function extractHost(candidate?: string | null) {
  if (!candidate) {
    return null;
  }

  const normalized = candidate.replace(/^exp:\/\//, "").replace(/^https?:\/\//, "");
  return normalized.split(":")[0] || null;
}

function resolveApiBaseUrl() {
  if (MANUAL_API_HOST) {
    return `http://${MANUAL_API_HOST}:3000/api/v1`;
  }

  const expoHost = extractHost(
    (Constants as any).expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest?.hostUri
  );

  if (expoHost) {
    return `http://${expoHost}:3000/api/v1`;
  }

  const scriptUrl: string | undefined =
    NativeModules.SourceCode?.scriptURL ||
    NativeModules.SourceCode?.scriptURL?.url;

  const host = extractHost(scriptUrl);

  if (host) {
    return `http://${host}:3000/api/v1`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/api/v1";
  }

  return "http://127.0.0.1:3000/api/v1";
}

const API_BASE_URL = resolveApiBaseUrl();
const CABLE_BASE_URL = API_BASE_URL.replace(/\/api\/v1$/, "/cable").replace(/^http:/, "ws:").replace(/^https:/, "wss:");

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  token?: string | null;
  body?: FormData | Record<string, unknown>;
  headers?: Record<string, string>;
};

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const requestBody = options.body
    ? ((isFormData ? options.body : JSON.stringify(options.body as Record<string, unknown>)) as BodyInit)
    : undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers ?? {})
    },
    body: requestBody
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.error || `Request failed with status ${response.status}`);
  }

  return json as T;
}

export const api = {
  baseUrl: API_BASE_URL,
  cableUrl(token?: string | null) {
    if (!token) {
      return CABLE_BASE_URL;
    }

    return `${CABLE_BASE_URL}?token=${encodeURIComponent(token)}`;
  },

  listUniversities() {
    return apiRequest<University[]>("/universities");
  },

  searchUniversities(query: string) {
    return apiRequest<University[]>(`/universities?q=${encodeURIComponent(query)}`);
  },

  sendVerificationCode(email: string) {
    return apiRequest<{ message: string; expires_at: string; preview_code?: string | null }>("/auth/send_verification_code", {
      method: "POST",
      body: { email }
    });
  },

  verifyCode(email: string, code: string) {
    return apiRequest<VerifyCodeResult>("/auth/verify_code", {
      method: "POST",
      body: { email, code }
    });
  },

  reactivateAccount(reactivationToken: string) {
    return apiRequest<AuthPayload>("/auth/reactivate", {
      method: "POST",
      body: { reactivation_token: reactivationToken }
    });
  },

  register(params: {
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
  }) {
    return apiRequest<AuthPayload>("/auth/register", {
      method: "POST",
      body: {
        signup_token: params.signupToken,
        university_slug: params.universitySlug,
        university_name: params.universityName,
        university_state: params.universityState,
        university_district: params.universityDistrict,
        institution_type: params.institutionType,
        full_name: params.fullName,
        major: params.major,
        bio: params.bio,
        interests: params.interests,
        onboarding_completed: params.onboardingCompleted
      }
    });
  },

  fetchMe(token: string) {
    return apiRequest<UserProfile>("/me", { token });
  },

  registerPushToken(token: string, expoPushToken: string) {
    return apiRequest<void>("/me/push_token", {
      method: "POST",
      token,
      body: { expo_push_token: expoPushToken }
    });
  },

  unregisterPushToken(token: string, expoPushToken: string) {
    return apiRequest<void>("/me/push_token", {
      method: "DELETE",
      token,
      body: { expo_push_token: expoPushToken }
    });
  },

  updateMe(
    token: string,
    payload: Partial<UserProfile> & {
      full_name?: string;
      academic_year?: string;
      prefer_same_degree?: boolean;
      prefer_same_year?: boolean;
      prefer_same_semester?: boolean;
      show_active_status?: boolean;
      show_me_on_campus?: boolean;
      profile_image?: {
        uri: string;
        name: string;
        type: string;
      };
    }
  ) {
    const isMultipart = (payload as any).profile_image;
    if (isMultipart) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value == null) {
          return;
        }
        if (key === "interests" && Array.isArray(value)) {
          value.forEach((item) => formData.append("interests[]", String(item)));
          return;
        }
        if (key === "profile_image" && typeof value === "object") {
          formData.append("profile_image", value as any);
          return;
        }
        formData.append(key, String(value));
      });

      return apiRequest<UserProfile>("/me", {
        method: "PATCH",
        token,
        body: formData
      });
    }

    return apiRequest<UserProfile>("/me", {
      method: "PATCH",
      token,
      body: payload
    });
  },

  deactivateMe(token: string) {
    return apiRequest<void>("/me/deactivate", {
      method: "PATCH",
      token
    });
  },

  deleteMe(token: string) {
    return apiRequest<void>("/me", {
      method: "DELETE",
      token
    });
  },

  fetchDiscover(token: string) {
    return apiRequest<DiscoverProfile[]>("/discover", { token });
  },

  createSwipe(token: string, targetId: string, direction: "pass" | "like" | "super_like") {
    return apiRequest<{ swipe: { id: string; target_id: string; direction: string }; match: Match | null }>("/discover/swipes", {
      method: "POST",
      token,
      body: { target_id: targetId, direction }
    });
  },

  fetchPendingLikes(token: string) {
    return apiRequest<PendingLike[]>("/likes", { token });
  },

  fetchMatches(token: string) {
    return apiRequest<Match[]>("/matches", { token });
  },

  fetchConversations(token: string) {
    return apiRequest<ConversationSummary[]>("/conversations", { token });
  },

  fetchConversation(token: string, conversationId: string) {
    return apiRequest<ConversationDetail>(`/conversations/${conversationId}`, { token });
  },

  markConversationRead(token: string, conversationId: string) {
    return apiRequest<{ success: boolean; conversation_id: string }>(`/conversations/${conversationId}/read`, {
      method: "PATCH",
      token
    });
  },

  fetchUserProfile(token: string, userId: string) {
    return apiRequest<UserProfile>(`/users/${userId}`, { token });
  },

  reportUser(token: string, userId: string, reason: string, notes?: string) {
    return apiRequest<{ success: boolean; report_id: string }>(`/users/${userId}/report`, {
      method: "POST",
      token,
      body: {
        reason,
        notes
      }
    });
  },

  unmatchMatch(token: string, matchId: string) {
    return apiRequest<{ success: boolean; match_id: string }>(`/matches/${matchId}/unmatch`, {
      method: "PATCH",
      token
    });
  },

  sendMessage(token: string, conversationId: string, body: string) {
    return apiRequest(`/conversations/${conversationId}/messages`, {
      method: "POST",
      token,
      body: { body }
    });
  },

  fetchCampusPosts(token: string) {
    return apiRequest<CampusPost[]>("/campus_posts", { token });
  },

  createCampusPost(
    token: string,
    body: string,
    tag = "Campus Life",
    image?: {
      uri: string;
      name: string;
      type: string;
    } | null
  ) {
    if (image) {
      const formData = new FormData();
      formData.append("body", body);
      formData.append("tag", tag);
      formData.append("image", image as any);

      return apiRequest<CampusPost>("/campus_posts", {
        method: "POST",
        token,
        body: formData
      });
    }

    return apiRequest<CampusPost>("/campus_posts", {
      method: "POST",
      token,
      body: { body, tag }
    });
  },

  toggleCampusPostLike(token: string, postId: string) {
    return apiRequest<CampusPost>(`/campus_posts/${postId}/likes`, {
      method: "POST",
      token
    });
  },

  fetchCampusPostLikes(token: string, postId: string) {
    return apiRequest<CampusPostLike[]>(`/campus_posts/${postId}/likes`, { token });
  },

  fetchCampusPostComments(token: string, postId: string) {
    return apiRequest<CampusPostComment[]>(`/campus_posts/${postId}/comments`, { token });
  },

  createCampusPostComment(token: string, postId: string, body: string, parentId?: string | null) {
    return apiRequest<CampusPostComment>(`/campus_posts/${postId}/comments`, {
      method: "POST",
      token,
      body: {
        body,
        parent_id: parentId
      }
    });
  },

  fetchCampusEvents(token: string) {
    return apiRequest<CampusEvent[]>("/campus_events", { token });
  },

  rsvpCampusEvent(token: string, eventId: string, status = "going") {
    return apiRequest<{ event: CampusEvent; attendance: { id: string; status: string } }>(`/campus_events/${eventId}/rsvp`, {
      method: "POST",
      token,
      body: { status }
    });
  }
};
