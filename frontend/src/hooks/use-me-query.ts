import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    // 인증 실패로 토큰을 지운 뒤 같은 조회를 자동 재시도하지 않음
    retry: false,
  });
}
