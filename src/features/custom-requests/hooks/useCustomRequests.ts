import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customRequestsApi, type CreateCustomRequestInput } from "@/api/customRequestsApi";

export const CUSTOM_REQUESTS_QUERY_KEY = ["customRequests"];

export function useCustomRequests() {
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: CUSTOM_REQUESTS_QUERY_KEY,
    queryFn: () => customRequestsApi.getCustomRequests(),
  });

  const createRequestMutation = useMutation({
    mutationFn: (input: CreateCustomRequestInput) => customRequestsApi.createCustomRequest(input),
    onSuccess: (newRequest) => {
      queryClient.setQueryData(CUSTOM_REQUESTS_QUERY_KEY, (old: unknown) => {
        if (Array.isArray(old)) {
          return [newRequest, ...old];
        }
        return [newRequest];
      });
      queryClient.invalidateQueries({ queryKey: CUSTOM_REQUESTS_QUERY_KEY });
    },
  });

  return {
    requests: requestsQuery.data || [],
    isLoading: requestsQuery.isLoading,
    isError: requestsQuery.isError,
    createRequest: createRequestMutation.mutateAsync,
    isCreating: createRequestMutation.isPending,
  };
}
