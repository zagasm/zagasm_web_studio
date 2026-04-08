import { useQuery } from "@tanstack/react-query";
import { getSharedEventByKey } from "../../../api/eventShareApi";
import { normalizeSharedEventResponse } from "../shareUtils";

export function useSharedEventPage(shareKey, options = {}) {
  return useQuery({
    queryKey: ["shared-event", shareKey],
    enabled: !!shareKey && (options.enabled ?? true),
    retry: 1,
    queryFn: async () => {
      const payload = await getSharedEventByKey(shareKey);
      return normalizeSharedEventResponse(payload);
    },
    ...options,
  });
}
