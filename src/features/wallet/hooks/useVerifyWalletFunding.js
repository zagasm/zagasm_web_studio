import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyWalletFunding } from "../../../api/walletApi";
import { useAuth } from "../../../pages/auth/AuthContext";
import {
  WALLET_PAYMENT_METHODS_QUERY_KEY,
  WALLET_SUMMARY_QUERY_KEY,
  WALLET_TRANSACTIONS_QUERY_KEY,
} from "../queryKeys";

export function useVerifyWalletFunding(options = {}) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationFn: (payload) => verifyWalletFunding(payload, token),
    onSuccess: async (...args) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: WALLET_SUMMARY_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: WALLET_TRANSACTIONS_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: WALLET_PAYMENT_METHODS_QUERY_KEY,
        }),
      ]);

      if (onSuccess) {
        await onSuccess(...args);
      }
    },
    ...restOptions,
  });
}
