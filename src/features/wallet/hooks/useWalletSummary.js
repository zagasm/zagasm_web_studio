import { useQuery } from "@tanstack/react-query";
import { getWalletSummary } from "../../../api/walletApi";
import { useAuth } from "../../../pages/auth/AuthContext";
import { WALLET_SUMMARY_QUERY_KEY } from "../queryKeys";

export function useWalletSummary(options = {}) {
  const { token, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: WALLET_SUMMARY_QUERY_KEY,
    queryFn: () => getWalletSummary(token),
    enabled: options.enabled ?? isAuthenticated,
    retry: 1,
    ...options,
  });
}
