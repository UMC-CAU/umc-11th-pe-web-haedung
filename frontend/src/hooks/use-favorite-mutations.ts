import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFavorite } from "../api/favorites/create-favorite";
import { deleteFavorite } from "../api/favorites/delete-favorite";
import type { Favorite } from "../api/favorites/models";
import { FAVORITES_QUERY_KEY } from "./use-favorites-query";

// 등록 응답에 새 즐겨찾기가 담겨 오므로 다시 조회하지 않고 캐시를 직접 바꿔요.
export function useAddFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavorite,
    onSuccess: (response) => {
      // 서버와 같은 최신순을 유지하려고 맨 앞에 넣어요
      queryClient.setQueryData<Favorite[]>(FAVORITES_QUERY_KEY, (prev = []) => [
        response.result,
        ...prev,
      ]);
    },
    onError: () => {
      alert("즐겨찾기에 실패했어요. 다시 시도해 주세요.");
      // 409처럼 화면과 서버 상태가 어긋났을 수 있으니 목록을 다시 받아요
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });
}

// 해제 응답의 result는 null이라, 요청에 보낸 movieId로 캐시에서 빼요.
export function useRemoveFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: (_response, movieId) => {
      queryClient.setQueryData<Favorite[]>(FAVORITES_QUERY_KEY, (prev = []) =>
        prev.filter((favorite) => favorite.movieId !== movieId),
      );
    },
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });
}
