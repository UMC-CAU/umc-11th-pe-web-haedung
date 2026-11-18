import { authApi } from "../auth-api";

interface DeleteFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}

// favoriteId가 아니라 movieId로 해제해요.
export function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<DeleteFavoriteResponse>();
}
