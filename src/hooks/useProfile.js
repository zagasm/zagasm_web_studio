// src/hooks/useProfile.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../pages/auth/AuthContext";
import { api, authHeaders } from "../lib/apiClient";

export default function useProfile() {
  const { token } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["profile", "me", token ?? "guest"],
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
    queryFn: async () => {
      const res = await api.get("/api/v1/profile", authHeaders(token));
      const payload = res?.data?.data ?? res?.data ?? {};

      return {
        user: payload?.user ?? null,
        organiser: payload?.organiser ?? payload?.organizer ?? null,
      };
    },
  });

  return {
    user: profileQuery.data?.user ?? null,
    organiser: profileQuery.data?.organiser ?? null,
    loading: !!token ? profileQuery.isLoading : false,
    error: profileQuery.error?.message || null,
    refetch: profileQuery.refetch,
  };
}
