import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export type UnifiedUser = {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  role: "user" | "admin";
  authType: "oauth" | "local";
};

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !oauthUser,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const user: UnifiedUser | null = useMemo(() => {
    if (oauthUser) {
      return {
        id: oauthUser.id,
        name: oauthUser.name || "User",
        avatar: oauthUser.avatar || undefined,
        role: oauthUser.role as "user" | "admin",
        authType: "oauth" as const,
      };
    }
    if (localUser) {
      return {
        id: localUser.id,
        name: localUser.displayName || localUser.username,
        email: localUser.email || undefined,
        role: localUser.role as "user" | "admin",
        authType: "local" as const,
      };
    }
    return null;
  }, [oauthUser, localUser]);

  const isAdmin = user?.role === "admin";

  const logout = useCallback(() => {
    localStorage.removeItem("local_auth_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin,
      isLoading: oauthLoading || localLoading,
      logout,
    }),
    [user, isAdmin, oauthLoading, localLoading, logout],
  );
}
