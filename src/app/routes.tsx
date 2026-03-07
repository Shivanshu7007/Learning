import { createBrowserRouter } from "react-router";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { AppLayout } from "./components/AppLayout";
import { DiscoverScreen } from "./components/DiscoverScreen";
import { MatchesScreen } from "./components/MatchesScreen";
import { ChatScreen } from "./components/ChatScreen";
import { CampusScreen } from "./components/CampusScreen";
import { ProfileScreen } from "./components/ProfileScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/onboarding",
    Component: OnboardingScreen,
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: DiscoverScreen },
      { path: "matches", Component: MatchesScreen },
      { path: "chat/:id", Component: ChatScreen },
      { path: "campus", Component: CampusScreen },
      { path: "profile", Component: ProfileScreen },
    ],
  },
]);
