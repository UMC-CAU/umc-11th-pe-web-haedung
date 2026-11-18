import { authApi } from "../auth-api";
import type { Favorite, FavoriteListResponse } from "./models";

// 최신순으로 정렬된 내 즐겨찾기 목록을 받아요.
export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<FavoriteListResponse>();
  return response.result;
}
