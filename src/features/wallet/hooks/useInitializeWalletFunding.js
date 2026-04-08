import { useMutation } from "@tanstack/react-query";
import { initializeWalletFunding } from "../../../api/walletApi";
import { useAuth } from "../../../pages/auth/AuthContext";

export function useInitializeWalletFunding(options = {}) {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (payload) => initializeWalletFunding(payload, token),
    ...options,
  });
}
