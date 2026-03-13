import React, { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { BottomTabs, CampusScreen, ChatScreen, DiscoverScreen, MatchesScreen, OnboardingScreen, ProfileScreen, SplashScreen } from "./screens";
import { AppTab, RootRoute } from "./types";
import { theme } from "./theme";

export function UniVibeApp() {
  const [route, setRoute] = useState<RootRoute>("splash");
  const [tab, setTab] = useState<AppTab>("discover");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const openApp = (nextTab: AppTab = "discover") => {
    setTab(nextTab);
    setRoute("app");
    setActiveChatId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {route === "splash" ? (
        <SplashScreen onGetStarted={() => setRoute("onboarding")} />
      ) : null}

      {route === "onboarding" ? (
        <OnboardingScreen onDone={() => openApp("discover")} onBackToSplash={() => setRoute("splash")} />
      ) : null}

      {route === "app" ? (
        <View style={styles.appShell}>
          {activeChatId ? (
            <ChatScreen chatId={activeChatId} onBack={() => setActiveChatId(null)} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.dark
  },
  appShell: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
});
