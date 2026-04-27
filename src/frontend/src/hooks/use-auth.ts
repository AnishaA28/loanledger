import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();

  const principalText = identity?.getPrincipal().toText() ?? null;

  return {
    identity,
    principalText,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    login,
    logout: clear,
  };
}
