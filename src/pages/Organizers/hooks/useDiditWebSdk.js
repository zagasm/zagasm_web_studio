import { useCallback, useEffect } from "react";
import { DiditSdk } from "@didit-protocol/sdk-web";

export function useDiditWebSdk() {
  useEffect(() => {
    return () => {
      DiditSdk.shared.onComplete = undefined;
      DiditSdk.shared.onStateChange = undefined;
      DiditSdk.shared.onEvent = undefined;
      DiditSdk.shared.destroy();
    };
  }, []);

  const destroyVerification = useCallback(() => {
    DiditSdk.shared.onComplete = undefined;
    DiditSdk.shared.onStateChange = undefined;
    DiditSdk.shared.onEvent = undefined;
    DiditSdk.shared.destroy();
  }, []);

  const startVerification = useCallback(
    async ({ url, onComplete, onStateChange, onEvent, configuration }) => {
      DiditSdk.shared.onComplete = onComplete;
      DiditSdk.shared.onStateChange = onStateChange;
      DiditSdk.shared.onEvent = onEvent;

      return DiditSdk.shared.startVerification({
        url,
        configuration: {
          loggingEnabled: !import.meta.env.PROD,
          showCloseButton: true,
          showExitConfirmation: true,
          closeModalOnComplete: true,
          ...configuration,
        },
      });
    },
    []
  );

  return {
    startVerification,
    destroyVerification,
  };
}
