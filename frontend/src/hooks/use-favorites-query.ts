import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../api/favorites/get-favorites";
import { useAuthStore } from "../stores/auth-store";

export const FAVORITES_QUERY_KEY = ["favorites"] as const;

// 영화 카드마다 GET /favorites/{movieId}를 부르지 않고, 목록을 한 번 받아 모든 버튼이 같이 써요.
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}
