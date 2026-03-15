import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, Modal, Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { api } from "./api";
import { BottomTabs, CampusScreen, ChatScreen, DiscoverScreen, MatchesScreen, OnboardingScreen, ProfileScreen, SplashScreen } from "./screens";
import { AppStoreContext } from "./store";
import { CampusEvent, CampusPost, ConversationDetail, ConversationSummary, DiscoverProfile, Match, PendingLike, RootRoute, University, UserProfile, AppTab, OnboardingMode } from "./types";
import { theme } from "./theme";

type CableEnvelope =
  | { message?: undefined }
  | {
      message:
        | { type: "message_created"; conversation_id: string; last_message_at: string; message: ConversationDetail["messages"][number] }
        | { type: "message_read"; conversation_id: string; message_ids: string[]; read_at: string }
        | { type: "like_received"; pending_like: PendingLike }
        | { type: "match_created"; match: Match; conversation: ConversationSummary }
        | { type: "match_removed"; match_id: string; conversation_id: string | null };
    };

type NotificationPayloadData = {
  type?: "message" | "match";
  conversation_id?: string;
  match_id?: string;
};

type MatchCelebration = {
  match: Match;
  conversation: ConversationSummary | null;
};

function dedupeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

async function registerForPushNotificationsAsync() {
  const currentPermissions = await Notifications.getPermissionsAsync();
  let finalStatus = currentPermissions.status;

  if (finalStatus !== "granted") {
    const nextPermissions = await Notifications.requestPermissionsAsync();
    finalStatus = nextPermissions.status;
  }

  if (finalStatus !== "granted") {
    throw new Error("Notification permission not granted");
  }

  const projectId =
    (Constants as any).expoConfig?.extra?.eas?.projectId ||
    (Constants as any).easConfig?.projectId;

  const tokenResponse = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId })
    : await Notifications.getExpoPushTokenAsync();

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#ff6a95",
      sound: "default"
    });
  }

  return tokenResponse.data;
}

export function UniVibeApp() {
  const [route, setRoute] = useState<RootRoute>("splash");
  const [authMode, setAuthMode] = useState<OnboardingMode>("signup");
  const [tab, setTab] = useState<AppTab>("discover");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<UserProfile | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [discoverProfiles, setDiscoverProfiles] = useState<DiscoverProfile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [pendingLikes, setPendingLikes] = useState<PendingLike[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [conversationMap, setConversationMap] = useState<Record<string, ConversationDetail>>({});
  const [campusPosts, setCampusPosts] = useState<CampusPost[]>([]);
  const [campusEvents, setCampusEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatSocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscribedConversationIdsRef = useRef<Set<string>>(new Set());
  const socketOpenRef = useRef(false);
  const activeChatIdRef = useRef<string | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const authTokenRef = useRef<string | null>(null);
  const expoPushTokenRef = useRef<string | null>(null);
  const registeredPushTokenRef = useRef<string | null>(null);
  const celebratedMatchIdsRef = useRef<Set<string>>(new Set());
  const [matchCelebration, setMatchCelebration] = useState<MatchCelebration | null>(null);

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    currentUserIdRef.current = me?.id ?? null;
  }, [me?.id]);

  useEffect(() => {
    authTokenRef.current = token;
  }, [token]);

  useEffect(() => {
    api.listUniversities().then(setUniversities).catch((err: Error) => setError(err.message));
  }, []);

  const refreshAuthedData = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [meData, discoverData, pendingLikesData, matchData, conversationData, postData, eventData] = await Promise.all([
        api.fetchMe(token),
        api.fetchDiscover(token),
        api.fetchPendingLikes(token),
        api.fetchMatches(token),
        api.fetchConversations(token),
        api.fetchCampusPosts(token),
        api.fetchCampusEvents(token)
      ]);

      setMe(meData);
      setDiscoverProfiles(discoverData);
      setPendingLikes(dedupeById(pendingLikesData));
      setMatches(dedupeById(matchData));
      setConversations(dedupeById(conversationData));
      setCampusPosts(postData);
      setCampusEvents(eventData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshAuthedData().catch(() => undefined);
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    registerForPushNotificationsAsync()
      .then((pushToken) => {
        if (cancelled) {
          return;
        }

        expoPushTokenRef.current = pushToken;
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const maybeRegisterPushToken = async () => {
      if (!token || !expoPushTokenRef.current) {
        return;
      }

      if (registeredPushTokenRef.current === expoPushTokenRef.current) {
        return;
      }

      await api.registerPushToken(token, expoPushTokenRef.current);
      registeredPushTokenRef.current = expoPushTokenRef.current;
    };

    maybeRegisterPushToken().catch(() => undefined);
  }, [token, me?.id]);

  useEffect(() => {
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as NotificationPayloadData;
      if (!authTokenRef.current) {
        return;
      }

      openApp("matches");

      if (data.type === "message" && data.conversation_id) {
        setActiveChatId(data.conversation_id);
        void api.fetchConversation(authTokenRef.current, data.conversation_id)
          .then((detail) => {
            setConversationMap((prev) => ({ ...prev, [data.conversation_id as string]: detail }));
            setConversations((prev) => {
              const withoutCurrent = prev.filter((conversation) => conversation.id !== detail.id);
              return [{
                id: detail.id,
                match_id: detail.match_id,
                other_user: detail.other_user,
                last_message_at: detail.last_message_at,
                last_message: detail.last_message,
                unread_count: 0
              }, ...withoutCurrent];
            });
          })
          .catch(() => undefined);
        return;
      }

      if (data.type === "match") {
        void refreshAuthedData().catch(() => undefined);
      }
    });

    return () => {
      responseSubscription.remove();
    };
  }, []);

  const mergeIncomingMessage = (message: ConversationDetail["messages"][number]) => {
    setConversationMap((prev) => {
      const existing = prev[message.conversation_id];
      if (!existing) {
        return prev;
      }

      const hasMessage = existing.messages.some((item) => item.id === message.id);
      return {
        ...prev,
        [message.conversation_id]: {
          ...existing,
          last_message: message,
          last_message_at: message.created_at,
          unread_count: message.sender_id === currentUserIdRef.current ? existing.unread_count : existing.unread_count + 1,
          messages: hasMessage ? existing.messages : [...existing.messages, message]
        }
      };
    });

    setConversations((prev) => {
      const existingConversation = prev.find((conversation) => conversation.id === message.conversation_id);
      if (!existingConversation) {
        return prev;
      }

      const updatedConversation = {
        ...existingConversation,
        last_message: message,
        last_message_at: message.created_at,
        unread_count: message.sender_id === currentUserIdRef.current ? existingConversation.unread_count : existingConversation.unread_count + 1
      };

      return [updatedConversation, ...prev.filter((conversation) => conversation.id !== message.conversation_id)];
    });
  };

  const applyMessageRead = (conversationId: string, messageIds: string[], readAt: string) => {
    setConversationMap((prev) => {
      const existing = prev[conversationId];
      if (!existing) {
        return prev;
      }

      return {
        ...prev,
        [conversationId]: {
          ...existing,
          unread_count: 0,
          messages: existing.messages.map((message) =>
            messageIds.includes(message.id) ? { ...message, read_at: readAt } : message
          )
        }
      };
    });

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unread_count: 0,
              last_message:
                conversation.last_message && messageIds.includes(conversation.last_message.id)
                  ? { ...conversation.last_message, read_at: readAt }
                  : conversation.last_message
            }
          : conversation
      )
    );
  };

  const unreadMessagesCount = conversations.reduce((sum, conversation) => sum + conversation.unread_count, 0);
  const unreadChatsCount = conversations.filter((conversation) => conversation.unread_count > 0).length;

  const showMatchCelebration = (match: Match, conversation: ConversationSummary | null) => {
    if (celebratedMatchIdsRef.current.has(match.id)) {
      return;
    }

    celebratedMatchIdsRef.current.add(match.id);
    setMatchCelebration({ match, conversation });
  };

  useEffect(() => {
    if (!token || route !== "app") {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      socketOpenRef.current = false;
      subscribedConversationIdsRef.current.clear();
      chatSocketRef.current?.close();
      chatSocketRef.current = null;
      return;
    }

    let cancelled = false;

    const userIdentifier = JSON.stringify({ channel: "UserChannel" });
    const syncSubscriptions = (socket: WebSocket) => {
      if (socket.readyState !== WebSocket.OPEN) {
        return;
      }

      const desiredConversationIds = new Set(conversations.map((conversation) => conversation.id));
      if (activeChatId) {
        desiredConversationIds.add(activeChatId);
      }

      subscribedConversationIdsRef.current.forEach((conversationId) => {
        if (desiredConversationIds.has(conversationId)) {
          return;
        }

        socket.send(
          JSON.stringify({
            command: "unsubscribe",
            identifier: JSON.stringify({ channel: "ConversationChannel", conversation_id: conversationId })
          })
        );
        subscribedConversationIdsRef.current.delete(conversationId);
      });

      desiredConversationIds.forEach((conversationId) => {
        if (subscribedConversationIdsRef.current.has(conversationId)) {
          return;
        }

        socket.send(
          JSON.stringify({
            command: "subscribe",
            identifier: JSON.stringify({ channel: "ConversationChannel", conversation_id: conversationId })
          })
        );
        subscribedConversationIdsRef.current.add(conversationId);
      });
    };

    const connect = () => {
      const socket = new WebSocket(api.cableUrl(token));
      chatSocketRef.current = socket;

      socket.onopen = () => {
        if (cancelled) {
          socket.close();
          return;
        }

        socketOpenRef.current = true;
        subscribedConversationIdsRef.current.clear();
        socket.send(JSON.stringify({ command: "subscribe", identifier: userIdentifier }));
        syncSubscriptions(socket);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as CableEnvelope;

          if (!payload.message) {
            return;
          }

          if (payload.message.type === "message_created" && payload.message.message) {
            mergeIncomingMessage(payload.message.message);
            if (activeChatIdRef.current === payload.message.message.conversation_id && payload.message.message.sender_id !== currentUserIdRef.current) {
              void api.markConversationRead(token, payload.message.message.conversation_id).catch(() => undefined);
            }
            return;
          }

          if (payload.message.type === "message_read" && payload.message.message_ids && payload.message.read_at) {
            applyMessageRead(payload.message.conversation_id, payload.message.message_ids, payload.message.read_at);
            return;
          }

          if (payload.message.type === "like_received" && payload.message.pending_like) {
            setPendingLikes((prev) => dedupeById([payload.message.pending_like, ...prev]));
            return;
          }

          if (payload.message.type === "match_created" && payload.message.match && payload.message.conversation) {
            setPendingLikes((prev) => prev.filter((item) => item.liker_id !== payload.message.match.user.id));
            setMatches((prev) => dedupeById([payload.message.match, ...prev]));
            setConversations((prev) => dedupeById([payload.message.conversation, ...prev]));
            showMatchCelebration(payload.message.match, payload.message.conversation);
            return;
          }

          if (payload.message.type === "match_removed") {
            setMatches((prev) => prev.filter((match) => match.id !== payload.message.match_id));
            setConversations((prev) => prev.filter((conversation) => conversation.id !== payload.message.conversation_id));
            setConversationMap((prev) => {
              const next = { ...prev };
              if (payload.message.conversation_id) {
                delete next[payload.message.conversation_id];
              }
              return next;
            });
          }
        } catch {
          // Ignore malformed frames.
        }
      };

      socket.onclose = () => {
        socketOpenRef.current = false;
        subscribedConversationIdsRef.current.clear();

        if (cancelled) {
          return;
        }

        reconnectTimeoutRef.current = setTimeout(connect, 1500);
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connect();

    return () => {
      cancelled = true;
      socketOpenRef.current = false;
      subscribedConversationIdsRef.current.clear();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      chatSocketRef.current?.close();
      chatSocketRef.current = null;
    };
  }, [token, route]);

  useEffect(() => {
    if (!socketOpenRef.current || !chatSocketRef.current) {
      return;
    }

    const socket = chatSocketRef.current;
    const desiredConversationIds = new Set(conversations.map((conversation) => conversation.id));
    if (activeChatId) {
      desiredConversationIds.add(activeChatId);
    }

    subscribedConversationIdsRef.current.forEach((conversationId) => {
      if (desiredConversationIds.has(conversationId)) {
        return;
      }

      socket.send(
        JSON.stringify({
          command: "unsubscribe",
          identifier: JSON.stringify({ channel: "ConversationChannel", conversation_id: conversationId })
        })
      );
      subscribedConversationIdsRef.current.delete(conversationId);
    });

    desiredConversationIds.forEach((conversationId) => {
      if (subscribedConversationIdsRef.current.has(conversationId)) {
        return;
      }

      socket.send(
        JSON.stringify({
          command: "subscribe",
          identifier: JSON.stringify({ channel: "ConversationChannel", conversation_id: conversationId })
        })
      );
      subscribedConversationIdsRef.current.add(conversationId);
    });
  }, [conversations, activeChatId]);

  const openApp = (nextTab: AppTab = "discover") => {
    setTab(nextTab);
    setRoute("app");
    setActiveChatId(null);
  };

  const signOut = () => {
    const currentToken = authTokenRef.current;
    const currentPushToken = registeredPushTokenRef.current;
    if (currentToken && currentPushToken) {
      void api.unregisterPushToken(currentToken, currentPushToken).catch(() => undefined);
    }

    registeredPushTokenRef.current = null;
    setToken(null);
    setMe(null);
    setDiscoverProfiles([]);
    setMatches([]);
    setPendingLikes([]);
    setConversations([]);
    setConversationMap({});
    setCampusPosts([]);
    setCampusEvents([]);
    setError(null);
    setActiveChatId(null);
    setTab("discover");
    setAuthMode("signup");
    setRoute("splash");
  };

  const storeValue = useMemo(
    () => ({
      token,
      me,
      universities,
      discoverProfiles,
      matches,
      pendingLikes,
      conversations,
      conversationMap,
      unreadMessagesCount,
      unreadChatsCount,
      campusPosts,
      campusEvents,
      loading,
      error,
      apiBaseUrl: api.baseUrl,
      refreshAuthedData,
      searchUniversities: (query: string) => api.searchUniversities(query),
      fetchPendingLikes: async () => {
        if (!token) return;
        const likes = await api.fetchPendingLikes(token);
        setPendingLikes(dedupeById(likes));
      },
      sendVerificationCode: async (email: string) => {
        const result = await api.sendVerificationCode(email);
        return { previewCode: result.preview_code };
      },
      verifyCode: async (email: string, code: string) => {
        const result = await api.verifyCode(email, code);
        if (result.token && result.user) {
          setToken(result.token);
          setMe(result.user);
          return { token: result.token, user: result.user };
        }

        if (result.reactivation_token) {
          return { reactivationToken: result.reactivation_token };
        }

        if (result.signup_token) {
          return { signupToken: result.signup_token };
        }

        throw new Error("Could not verify your email.");
      },
      register: async (payload: {
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
      }) => {
        const auth = await api.register(payload);
        setToken(auth.token);
        setMe(auth.user);
      },
      reactivateAccount: async (reactivationToken: string) => {
        const auth = await api.reactivateAccount(reactivationToken);
        setToken(auth.token);
        setMe(auth.user);
      },
      updateMe: async (payload: {
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
      }) => {
        if (!token) {
          throw new Error("Please verify your account first.");
        }

        const updated = await api.updateMe(token, {
          full_name: payload.fullName,
          date_of_birth: payload.dateOfBirth,
          major: payload.major,
          degree_name: payload.degreeName,
          academic_year: payload.academicYear,
          semester: payload.semester,
          bio: payload.bio,
          interests: payload.interests,
          onboarding_completed: payload.onboardingCompleted,
          prefer_same_degree: payload.preferSameDegree,
          prefer_same_year: payload.preferSameYear,
          prefer_same_semester: payload.preferSameSemester,
          show_active_status: payload.showActiveStatus,
          show_me_on_campus: payload.showMeOnCampus,
          profile_image: payload.profileImage ?? undefined
        });

        setMe(updated);
        const nextDiscover = await api.fetchDiscover(token);
        setDiscoverProfiles(nextDiscover);
      },
      swipe: async (targetId: string, direction: "pass" | "like" | "super_like") => {
        if (!token) return;
        const result = await api.createSwipe(token, targetId, direction);
        setDiscoverProfiles((prev) => prev.filter((profile) => profile.id !== targetId));
        setPendingLikes((prev) => prev.filter((item) => item.liker_id !== targetId));
        if (result.match) {
          setMatches((prev) => dedupeById([result.match as Match, ...prev]));
          showMatchCelebration(result.match as Match, null);
        }
      },
      loadConversation: async (conversationId: string) => {
        if (!token) return;
        const detail = await api.fetchConversation(token, conversationId);
        setConversationMap((prev) => ({ ...prev, [conversationId]: detail }));
        setConversations((prev) =>
          prev.map((conversation) => (conversation.id === conversationId ? { ...conversation, unread_count: 0, last_message: detail.last_message, last_message_at: detail.last_message_at } : conversation))
        );
      },
      markConversationRead: async (conversationId: string) => {
        if (!token) return;
        await api.markConversationRead(token, conversationId);
        const unreadIds = conversationMap[conversationId]?.messages.filter((message) => message.sender_id !== me?.id && !message.read_at).map((message) => message.id) || [];
        if (unreadIds.length > 0) {
          applyMessageRead(conversationId, unreadIds, new Date().toISOString());
        }
      },
      fetchUserProfile: async (userId: string) => {
        if (!token) {
          throw new Error("Please log in first.");
        }

        return api.fetchUserProfile(token, userId);
      },
      reportUser: async (userId: string, reason: string, notes?: string) => {
        if (!token) {
          throw new Error("Please log in first.");
        }

        await api.reportUser(token, userId, reason, notes);
      },
      unmatchMatch: async (matchId: string) => {
        if (!token) {
          throw new Error("Please log in first.");
        }

        await api.unmatchMatch(token, matchId);
        setMatches((prev) => prev.filter((match) => match.id !== matchId));
        setConversations((prev) => prev.filter((conversation) => conversation.match_id !== matchId));
        setConversationMap((prev) => {
          const next = { ...prev };
          Object.entries(next).forEach(([conversationId, conversation]) => {
            if (conversation.match_id === matchId) {
              delete next[conversationId];
            }
          });
          return next;
        });
      },
      sendMessage: async (conversationId: string, body: string) => {
        if (!token) return;
        const created = await api.sendMessage(token, conversationId, body) as { id: string; conversation_id: string; sender_id: string; body: string; read_at: string | null; created_at: string };
        mergeIncomingMessage(created);
      },
      createCampusPost: async (
        body: string,
        tag = "Campus Life",
        image: {
          uri: string;
          name: string;
          type: string;
        } | null = null
      ) => {
        if (!token) return;
        const created = await api.createCampusPost(token, body, tag, image);
        setCampusPosts((prev) => [created, ...prev]);
      },
      toggleCampusPostLike: async (postId: string) => {
        if (!token) return;
        const updated = await api.toggleCampusPostLike(token, postId);
        setCampusPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      },
      loadCampusPostLikes: async (postId: string) => {
        if (!token) return [];
        return api.fetchCampusPostLikes(token, postId);
      },
      loadCampusPostComments: async (postId: string) => {
        if (!token) return [];
        return api.fetchCampusPostComments(token, postId);
      },
      createCampusPostComment: async (postId: string, body: string, parentId?: string | null) => {
        if (!token) return;
        await api.createCampusPostComment(token, postId, body, parentId);
        const postComments = await api.fetchCampusPostComments(token, postId);
        setCampusPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, comments_count: postComments.length + postComments.reduce((sum, item) => sum + item.replies.length, 0) } : post
          )
        );
      },
      rsvpEvent: async (eventId: string) => {
        if (!token) return;
        const result = await api.rsvpCampusEvent(token, eventId);
        setCampusEvents((prev) => prev.map((event) => (event.id === eventId ? result.event : event)));
      },
      deactivateAccount: async () => {
        if (!token) return;
        await api.deactivateMe(token);
        signOut();
      },
      deleteAccount: async () => {
        if (!token) return;
        await api.deleteMe(token);
        signOut();
      },
      signOut
    }),
    [
      token,
      me,
      universities,
      discoverProfiles,
      matches,
      pendingLikes,
      conversations,
      conversationMap,
      campusPosts,
      campusEvents,
      loading,
      error
    ]
  );

  const rootBackground = route === "splash" ? theme.colors.dark : theme.colors.background;
  const statusBarStyle = route === "splash" ? "light-content" : "dark-content";

  return (
    <AppStoreContext.Provider value={storeValue}>
      <View style={[styles.root, { backgroundColor: rootBackground }]}>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={Platform.OS === "android" ? "transparent" : rootBackground}
          translucent={Platform.OS === "android"}
        />

        {route === "splash" ? (
          <SplashScreen
            onGetStarted={() => {
              setAuthMode("signup");
              setRoute("onboarding");
            }}
            onLogin={() => {
              setAuthMode("login");
              setRoute("onboarding");
            }}
          />
        ) : null}

        {route === "onboarding" ? (
          <OnboardingScreen
            mode={authMode}
            initialStep="email"
            onDone={() => openApp("discover")}
            onBackToSplash={() => setRoute("splash")}
          />
        ) : null}

        {route === "app" ? (
          <View style={styles.appShell}>
            {activeChatId ? (
              <ChatScreen
                chatId={activeChatId}
                onBack={() => setActiveChatId(null)}
                onUnmatched={() => setActiveChatId(null)}
              />
            ) : (
              <>
                {tab === "discover" ? <DiscoverScreen /> : null}
                {tab === "matches" ? <MatchesScreen onOpenChat={setActiveChatId} /> : null}
                {tab === "campus" ? <CampusScreen /> : null}
                {tab === "profile" ? <ProfileScreen /> : null}
                <BottomTabs tab={tab} onChange={setTab} />
              </>
            )}
          </View>
        ) : null}

        <Modal transparent visible={!!matchCelebration} animationType="fade" onRequestClose={() => setMatchCelebration(null)}>
          <View style={styles.matchCelebrationOverlay}>
            <View style={styles.matchCelebrationCard}>
              <Text style={styles.matchCelebrationTitle}>It's a Match!</Text>
              <Text style={styles.matchCelebrationSubtitle}>You both liked each other. Start the conversation.</Text>
              <View style={styles.matchCelebrationAvatars}>
                <Image
                  source={{ uri: me?.avatar_url || me?.photo_urls?.[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }}
                  style={[styles.matchCelebrationAvatar, styles.matchCelebrationAvatarLeft]}
                />
                <View style={styles.matchCelebrationHeartWrap}>
                  <Text style={styles.matchCelebrationHeart}>♥</Text>
                </View>
                <Image
                  source={{ uri: matchCelebration?.match.user.avatar_url || matchCelebration?.match.user.photo_urls?.[0] || "https://images.unsplash.com/photo-1660982741734-5a7d2730ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" }}
                  style={[styles.matchCelebrationAvatar, styles.matchCelebrationAvatarRight]}
                />
              </View>
              <View style={styles.matchCelebrationActions}>
                <Pressable onPress={() => setMatchCelebration(null)} style={styles.secondaryActionButton}>
                  <Text style={styles.secondaryActionText}>Keep Swiping</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    const nextConversationId = matchCelebration?.conversation?.id || matchCelebration?.match.conversation_id;
                    if (nextConversationId) {
                      setTab("matches");
                      setActiveChatId(nextConversationId);
                    }
                    setMatchCelebration(null);
                  }}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.smallActionText}>Send a Message</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </AppStoreContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0
  },
  appShell: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  matchCelebrationOverlay: {
    flex: 1,
    backgroundColor: "rgba(35, 15, 50, 0.42)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  matchCelebrationCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 32,
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.92)",
    shadowColor: "#f05d9c",
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 6
  },
  matchCelebrationTitle: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center"
  },
  matchCelebrationSubtitle: {
    marginTop: 8,
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center"
  },
  matchCelebrationAvatars: {
    marginTop: 28,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  matchCelebrationAvatar: {
    width: 108,
    height: 108,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.96)"
  },
  matchCelebrationAvatarLeft: {
    marginRight: -12
  },
  matchCelebrationAvatarRight: {
    marginLeft: -12
  },
  matchCelebrationHeartWrap: {
    width: 54,
    height: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(240,93,156,0.12)",
    borderWidth: 1,
    borderColor: "rgba(240,93,156,0.24)",
    zIndex: 2
  },
  matchCelebrationHeart: {
    color: "#F05D9C",
    fontSize: 28,
    fontWeight: "900"
  },
  matchCelebrationActions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center"
  }
});
