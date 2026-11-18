import { authApi } from "../auth-api";
import type { FavoriteResponse } from "./models";

export function createFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<FavoriteResponse>();
}
