import { useQuery } from "@tanstack/react-query";
import { getWalletPaymentMethods } from "../../../api/walletApi";
import { useAuth } from "../../../pages/auth/AuthContext";
import { WALLET_PAYMENT_METHODS_QUERY_KEY } from "../queryKeys";
import { normalizePaymentMethods } from "../walletUtils";

export function useWalletPaymentMethods(options = {}) {
  const { token, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: WALLET_PAYMENT_METHODS_QUERY_KEY,
    queryFn: async () => {
      const payload = await getWalletPaymentMethods(token);
      return normalizePaymentMethods(payload);
    },
    enabled: options.enabled ?? isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
