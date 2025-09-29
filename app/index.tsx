import Login from "./login";
import Onboarding from "./onboarding";
import React from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { View, ActivityIndicator } from "react-native";

function AppContent() {
  const { hasSeenOnboarding, isLoading } = useOnboarding();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return hasSeenOnboarding ? <Login /> : <Onboarding />;
}

export default function Index() {
  return (
    <AppContent />
  );
}
