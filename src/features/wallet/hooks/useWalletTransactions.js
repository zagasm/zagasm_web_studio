import { useQuery } from "@tanstack/react-query";
import { getWalletTransactions } from "../../../api/walletApi";
import { useAuth } from "../../../pages/auth/AuthContext";
import { WALLET_TRANSACTIONS_QUERY_KEY } from "../queryKeys";
import { normalizeWalletTransactionsResponse } from "../walletUtils";

export function useWalletTransactions(filters = {}, options = {}) {
  const { token, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [...WALLET_TRANSACTIONS_QUERY_KEY, filters],
    queryFn: async () => {
      const payload = await getWalletTransactions(filters, token);
      return normalizeWalletTransactionsResponse(payload);
    },
    enabled: options.enabled ?? isAuthenticated,
    retry: 1,
    ...options,
  });
}
